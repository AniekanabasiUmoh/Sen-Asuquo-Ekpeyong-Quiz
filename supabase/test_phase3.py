"""
Phase 3 verification: scoring engine, judge access, results publication.

    python supabase/test_phase3.py

Proves the competition rules hold in the database rather than only in the UI:

  * a Striker scores 1, an Assist 0.5, a VAR answer 0
  * standings are the sum of the event log, so a total is reproducible
  * a judge sees only the matches they are assigned to
  * an unpublished match leaks nothing to the public
  * publishing snapshots the standings into results, ordered by score

Creates its own throwaway data (@test.invalid users, 'probe-*' slugs) and
removes it afterwards, purging leftovers first so an aborted run never blocks
the next one.
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


failures: list[str] = []


def check(label: str, got, want) -> None:
    ok = got == want
    print(f"  {'PASS' if ok else 'FAIL'}  {label}: got {got!r}, want {want!r}")
    if not ok:
        failures.append(label)


def main() -> int:
    conn = psycopg2.connect(db_url(), connect_timeout=30, sslmode="require")
    cur = conn.cursor()

    def reset():
        cur.execute("reset role")
        cur.execute("select set_config('request.jwt.claims','',true)")

    def as_user(uid):
        cur.execute(
            "select set_config('request.jwt.claims',%s,true)",
            (json.dumps({"sub": uid, "role": "authenticated"}),),
        )
        cur.execute("set local role authenticated")

    def purge():
        reset()
        cur.execute("delete from match_events where match_id in (select id from matches where name like 'Probe%')")
        cur.execute("delete from results where fixture_id in (select id from fixtures where name like 'Probe%')")
        cur.execute("delete from matches where name like 'Probe%'")
        cur.execute("delete from fixtures where name like 'Probe%'")
        cur.execute("delete from students where full_name like 'Probe %'")
        cur.execute("delete from schools where slug like 'probe-%'")
        cur.execute("delete from judges where email like '%@test.invalid'")
        cur.execute("delete from volunteers where email like '%@test.invalid'")
        cur.execute("delete from auth.users where email like '%@test.invalid'")
        conn.commit()

    purge()
    judge_uid = str(uuid.uuid4())

    try:
        print("\nsetup")
        cur.execute(
            """insert into auth.users (id,instance_id,aud,role,email,encrypted_password,
                 email_confirmed_at,created_at,updated_at,raw_app_meta_data,raw_user_meta_data)
               values (%s,'00000000-0000-0000-0000-000000000000','authenticated','authenticated',
                 'judge@test.invalid','x',now(),now(),now(),'{}',%s)""",
            (judge_uid, json.dumps({"full_name": "Probe Judge"})),
        )
        cur.execute("insert into user_roles (user_id,role) values (%s,'judge')", (judge_uid,))
        cur.execute(
            "insert into judges (user_id,full_name,email) values (%s,'Probe Judge','judge@test.invalid') returning id",
            (judge_uid,),
        )
        judge_id = cur.fetchone()[0]

        cur.execute("select id from lgas where slug='biase'")
        lga = cur.fetchone()[0]
        cur.execute("select id from stages where ordinal=7")
        stage = cur.fetchone()[0]

        schools = []
        for i in (1, 2):
            cur.execute(
                """insert into schools (lga_id,name,slug,status,registration_no)
                   values (%s,%s,%s,'approved',%s) returning id""",
                (lga, f"Probe School {i}", f"probe-school-{i}", f"SAEAC-2026-08{i}0"),
            )
            schools.append(cur.fetchone()[0])

        # A full five-student roster for the first school.
        for i in range(5):
            cur.execute(
                "insert into students (school_id,full_name,stream,is_striker) values (%s,%s,'science',%s)",
                (schools[0], f"Probe Student {i + 1}", i < 3),
            )

        cur.execute(
            "insert into fixtures (stage_id,name,publish) values (%s,'Probe Fixture','published') returning id",
            (stage,),
        )
        fixture = cur.fetchone()[0]
        for s in schools:
            cur.execute(
                "insert into fixture_participants (fixture_id,school_id) values (%s,%s)",
                (fixture, s),
            )
        cur.execute(
            "insert into matches (fixture_id,name) values (%s,'Probe Match') returning id",
            (fixture,),
        )
        match = cur.fetchone()[0]
        cur.execute(
            "insert into judge_assignments (judge_id,fixture_id) values (%s,%s)",
            (judge_id, fixture),
        )
        conn.commit()
        print("  set up 2 schools, 5 students, 1 fixture, 1 match, 1 assigned judge")

        print("\nscoring rules")
        as_user(judge_uid)
        events = [
            ("striker_correct", 1),
            ("striker_correct", 1),
            ("striker_correct", 1),
            ("striker_correct", 1),
            ("assist_correct", 0.5),
            ("assist_correct", 0.5),
            ("var_referral", 0),
            ("striker_wrong", 0),
        ]
        for t, p in events:
            cur.execute(
                """insert into match_events (match_id,school_id,event_type,points,recorded_by)
                   values (%s,%s,%s,%s,%s)""",
                (match, schools[0], t, p, judge_uid),
            )
        for t, p in [("striker_correct", 1)] * 3 + [("assist_correct", 0.5)]:
            cur.execute(
                """insert into match_events (match_id,school_id,event_type,points,recorded_by)
                   values (%s,%s,%s,%s,%s)""",
                (match, schools[1], t, p, judge_uid),
            )
        conn.commit()

        cur.execute(
            "select score from match_standings where match_id=%s and school_id=%s",
            (match, schools[0]),
        )
        check("4 strikers + 2 assists + VAR = 5.0", float(cur.fetchone()[0]), 5.0)
        cur.execute(
            "select score from match_standings where match_id=%s and school_id=%s",
            (match, schools[1]),
        )
        check("3 strikers + 1 assist = 3.5", float(cur.fetchone()[0]), 3.5)

        # An event cannot be rewritten. Re-assert the role first: a rollback
        # drops SET LOCAL, and the probe would otherwise run as the table owner,
        # who is not subject to the grant.
        conn.commit()
        as_user(judge_uid)
        try:
            cur.execute("update match_events set points=99 where match_id=%s", (match,))
            check("events cannot be edited", f"allowed {cur.rowcount}", "blocked")
        except psycopg2.Error:
            print("  PASS  events cannot be edited: blocked")
        conn.rollback()
        as_user(judge_uid)
        try:
            cur.execute("delete from match_events where match_id=%s", (match,))
            check("events cannot be deleted", f"allowed {cur.rowcount}", "blocked")
        except psycopg2.Error:
            print("  PASS  events cannot be deleted: blocked")
        conn.rollback()
        as_user(judge_uid)

        print("\njudge scope")
        reset()
        as_user(judge_uid)
        cur.execute("select count(*) from matches")
        check("assigned judge sees the match", cur.fetchone()[0], 1)

        # A second, unassigned fixture must stay invisible.
        reset()
        cur.execute(
            "insert into fixtures (stage_id,name) values (%s,'Probe Fixture Two') returning id",
            (stage,),
        )
        other_fixture = cur.fetchone()[0]
        cur.execute(
            "insert into matches (fixture_id,name) values (%s,'Probe Match Two') returning id",
            (other_fixture,),
        )
        conn.commit()
        as_user(judge_uid)
        cur.execute("select count(*) from matches")
        check("judge does not see unassigned matches", cur.fetchone()[0], 1)
        conn.commit()

        print("\npublic visibility, before publication")
        reset()
        cur.execute("set local role anon")
        cur.execute("select count(*) from matches")
        check("unpublished match is hidden", cur.fetchone()[0], 0)
        cur.execute("select count(*) from match_events")
        check("its events are hidden", cur.fetchone()[0], 0)
        cur.execute("select count(*) from students")
        check("students stay hidden", cur.fetchone()[0], 0)
        conn.commit()

        print("\npublication")
        reset()
        cur.execute("select id from auth.users where email='saeacadmin2026@saeac.org'")
        admin_row = cur.fetchone()
        if not admin_row:
            failures.append("admin account missing")
        else:
            as_user(admin_row[0])
            cur.execute("select publish_match_results(%s)", (match,))
            check("publishes both schools", cur.fetchone()[0], 2)
            conn.commit()

            reset()
            cur.execute(
                "select score, position from results where fixture_id=%s order by position",
                (fixture,),
            )
            rows = cur.fetchall()
            check("winner is first on 5.0", (float(rows[0][0]), rows[0][1]), (5.0, 1))
            check("runner up is second on 3.5", (float(rows[1][0]), rows[1][1]), (3.5, 2))

            cur.execute("set local role anon")
            cur.execute("select count(*) from results where fixture_id=%s", (fixture,))
            check("published results are public", cur.fetchone()[0], 2)
            cur.execute("select count(*) from matches")
            check("published match is now public", cur.fetchone()[0], 1)
            conn.commit()

        print("\nchange makers")
        reset()
        cur.execute("set local role anon")
        cur.execute(
            "insert into volunteers (full_name,email) values ('Probe Volunteer','vol@test.invalid')"
        )
        check("anyone may apply", cur.rowcount, 1)
        cur.execute("select count(*) from volunteers")
        check("but cannot read applications back", cur.fetchone()[0], 0)
        conn.commit()

    except Exception as exc:  # noqa: BLE001
        conn.rollback()
        failures.append(f"{type(exc).__name__}: {exc}")
        print(f"\n  ERROR  {type(exc).__name__}: {str(exc)[:300]}")
    finally:
        purge()

    print()
    if failures:
        print(f"{len(failures)} FAILED:")
        for f in failures:
            print("  -", f)
        return 1
    print("all checks passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
