"""
End-to-end RLS and registration-flow test against the live Supabase database.

    python supabase/test_rls.py

Creates two throwaway users (@test.invalid), walks a school registration from
draft to approval, checks what each role can and cannot see or do, then deletes
everything it made. It purges leftovers at the start too, so an aborted run
never blocks the next one.

This exists because RLS bugs are quiet: the policy looks right, the app looks
right, and the leak only shows up when someone tries it. Three real bugs were
caught here that reading the SQL had missed:

  * INSERT ... RETURNING failed because the SELECT policy could not see the
    row being inserted
  * a school could approve its own registration, because the status guard was
    in USING but not in WITH CHECK
  * the registration counter misparsed its own numbers and jumped to 1000

Run it after any change to a policy or to the registration flow.
"""

import json
import os
import sys
import uuid

try:
    import psycopg2
except ImportError:
    sys.exit("pip install psycopg2-binary")

HERE = os.path.dirname(os.path.abspath(__file__))
ENV = os.path.join(HERE, "..", ".env.local")


def db_url() -> str:
    for line in open(ENV, encoding="utf-8"):
        if line.startswith("SUPABASE_DB_URL="):
            return line.split("=", 1)[1].strip()
    sys.exit("SUPABASE_DB_URL not found in .env.local")


class Harness:
    def __init__(self, conn):
        self.c = conn
        self.cur = conn.cursor()
        self.failures: list[str] = []

    # Order matters: the JWT claim must be set before the role switch, or
    # auth.uid() is null while the policies are evaluated.
    def as_user(self, uid: str) -> None:
        self.cur.execute(
            "select set_config('request.jwt.claims',%s,true)",
            (json.dumps({"sub": uid, "role": "authenticated"}),),
        )
        self.cur.execute("set local role authenticated")

    def as_anon(self) -> None:
        self.reset()
        self.cur.execute("set local role anon")

    def reset(self) -> None:
        self.cur.execute("reset role")
        self.cur.execute("select set_config('request.jwt.claims','',true)")

    def check(self, label: str, got, want) -> None:
        ok = got == want
        print(f"  {'PASS' if ok else 'FAIL'}  {label}: got {got!r}, want {want!r}")
        if not ok:
            self.failures.append(label)

    def purge(self) -> None:
        self.reset()
        self.cur.execute("delete from audit_log")
        self.cur.execute(
            "delete from schools where slug like 'test-model-sec%' or slug like 'probe-slug%'"
        )
        self.cur.execute("delete from auth.users where email like '%@test.invalid'")
        self.c.commit()

    def make_user(self, uid: str, email: str, name: str) -> None:
        self.cur.execute(
            """insert into auth.users (id,instance_id,aud,role,email,encrypted_password,
                 email_confirmed_at,created_at,updated_at,raw_app_meta_data,raw_user_meta_data)
               values (%s,'00000000-0000-0000-0000-000000000000','authenticated','authenticated',
                 %s,'x',now(),now(),now(),'{}',%s)""",
            (uid, email, json.dumps({"full_name": name})),
        )


def main() -> int:
    conn = psycopg2.connect(db_url(), connect_timeout=30, sslmode="require")
    h = Harness(conn)
    cur = h.cur
    h.purge()

    school_uid, admin_uid = str(uuid.uuid4()), str(uuid.uuid4())

    try:
        print("\nsignup")
        h.make_user(school_uid, "principal@test.invalid", "Test Principal")
        h.make_user(admin_uid, "committee@test.invalid", "Test Committee")
        cur.execute("insert into user_roles (user_id,role) values (%s,'committee')", (admin_uid,))
        conn.commit()

        cur.execute("select full_name from profiles where id=%s", (school_uid,))
        h.check("trigger creates the profile", cur.fetchone()[0], "Test Principal")
        cur.execute("select role from user_roles where user_id=%s", (school_uid,))
        h.check("trigger grants school_admin", cur.fetchone()[0], "school_admin")

        cur.execute("select id from lgas where slug='biase'")
        lga = cur.fetchone()[0]

        print("\nas the school")
        h.as_user(school_uid)
        cur.execute(
            """insert into schools (lga_id,name,slug,owner_id,status,
                 contact_name,contact_email,contact_phone)
               values (%s,'Test Model Secondary','test-model-sec-e2e',%s,'draft',
                 'Mrs Coordinator','coord@test.invalid','08000000000')
               returning id""",
            (lga, school_uid),
        )
        school_id = cur.fetchone()[0]
        h.check("insert ... returning works", bool(school_id), True)

        cur.execute(
            "update schools set status='submitted',submitted_at=now() where id=%s returning status",
            (school_id,),
        )
        h.check("school can submit", cur.fetchone()[0], "submitted")
        # Commit before the next probe: it is expected to raise, and a rollback
        # would otherwise discard the school created above and make every later
        # check fail against an empty table.
        conn.commit()
        h.as_user(school_uid)

        # A WITH CHECK violation raises; a USING mismatch silently matches no
        # rows. Both mean "refused", so accept either.
        try:
            cur.execute(
                "update schools set status='approved',registration_no='SAEAC-2026-9999' where id=%s",
                (school_id,),
            )
            h.check("school cannot self-approve", cur.rowcount, 0)
        except psycopg2.Error:
            print("  PASS  school cannot self-approve: refused by WITH CHECK")
            conn.rollback()
            h.as_user(school_uid)

        cur.execute("select count(*) from schools")
        h.check("school sees only its own row", cur.fetchone()[0], 1)
        conn.commit()

        print("\nas the committee")
        h.reset()
        h.as_user(admin_uid)
        cur.execute("select count(*) from schools")
        h.check("committee sees the submission", cur.fetchone()[0], 1)

        cur.execute("select issue_registration_number(%s)", (school_id,))
        reg = cur.fetchone()[0]
        h.check("first number is 0001", reg.endswith("-0001"), True)

        cur.execute(
            "update schools set status='approved',approved_at=now(),approved_by=%s where id=%s",
            (admin_uid, school_id),
        )
        h.check("committee can approve", cur.rowcount, 1)

        cur.execute(
            "insert into audit_log (actor_id,action,entity,entity_id) values (%s,'school.approved','schools',%s)",
            (admin_uid, school_id),
        )
        h.check("committee can append to the audit trail", cur.rowcount, 1)
        conn.commit()

        print("\nas an anonymous visitor")
        h.as_anon()
        cur.execute("select count(*) from schools")
        h.check("approved school is public", cur.fetchone()[0], 1)
        cur.execute("select count(*) from students")
        h.check("students are never public", cur.fetchone()[0], 0)
        cur.execute("select count(*) from audit_log")
        h.check("audit trail is not public", cur.fetchone()[0], 0)
        cur.execute("select count(*) from lgas")
        h.check("reference data is public", cur.fetchone()[0], 7)
        conn.commit()

        print("\nanonymous writes")
        for label, sql in [
            ("cannot insert news", "insert into news (title,slug) values ('x','x-anon')"),
            ("cannot edit an LGA", "update lgas set school_count=999"),
            ("cannot append to the audit trail",
             "insert into audit_log (actor_id,action,entity) values (null,'x','y')"),
        ]:
            # Re-assert the role inside the loop: the previous iteration's
            # rollback drops the SET LOCAL, and the probe would otherwise run as
            # the table owner and appear to "leak".
            h.as_anon()
            try:
                cur.execute(sql)
                # 0 rows means the USING clause matched nothing, which is a
                # refusal too; only an actual write is a failure.
                if cur.rowcount > 0:
                    h.check(label, f"allowed {cur.rowcount} rows", "blocked")
                else:
                    print(f"  PASS  {label}: blocked (no rows matched)")
                conn.rollback()
                h.as_anon()
            except psycopg2.Error:
                print(f"  PASS  {label}: blocked")
                conn.rollback()
                h.as_anon()
        conn.commit()

    except Exception as exc:  # noqa: BLE001
        conn.rollback()
        h.failures.append(f"{type(exc).__name__}: {exc}")
        print(f"\n  ERROR  {type(exc).__name__}: {str(exc)[:300]}")
    finally:
        h.purge()

    print()
    if h.failures:
        print(f"{len(h.failures)} FAILED:")
        for f in h.failures:
            print("  -", f)
        return 1
    print("all checks passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
