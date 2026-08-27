import type { Metadata } from "next";

import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { RegistrationWizard } from "./wizard";

export const metadata: Metadata = {
  title: "Register your school",
  robots: { index: false },
};

export default async function SchoolRegisterPage() {
  const user = await requireUser("/portal/school/register");
  const supabase = await createClient();

  const [{ data: ownedSchool }, { data: lgas }] = await Promise.all([
    supabase.from("schools").select("*").eq("owner_id", user.id).maybeSingle(),
    supabase.from("lgas").select("*").order("sort_order"),
  ]);
  let school = ownedSchool;

  if (!school && user.roles.includes("coach")) {
    const { data: assignment } = await supabase
      .from("coaches")
      .select("school_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (assignment) {
      const result = await supabase
        .from("schools")
        .select("*")
        .eq("id", assignment.school_id)
        .maybeSingle();
      school = result.data;
    }
  }

  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/50">
        School Registration
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        Register your school
      </h1>

      <div className="mt-9">
        <RegistrationWizard
          school={school ?? null}
          lgas={lgas ?? []}
          readOnly={user.roles.includes("coach")}
        />
      </div>
    </div>
  );
}
