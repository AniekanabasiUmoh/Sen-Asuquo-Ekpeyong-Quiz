import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { contact } from "@/content/homepage";

export const metadata: Metadata = {
  title: "Privacy and Data Protection",
  description:
    "How the Senator Asuquo Ekpenyong Academic Championship collects, uses and protects personal data, including the data of students under 18.",
};

/**
 * Privacy and data protection, Phase 5 sprint 5.3.
 *
 * Most entrants are minors, which makes this a legal document rather than a
 * formality. It describes what the platform actually does: student rows are
 * never publicly readable, photographs sit in a private bucket and are served
 * through short-lived signed links, and consent is recorded with a timestamp.
 *
 * The bracketed items are the ones only the Organising Committee can settle.
 * They are marked rather than invented, because a privacy notice that states
 * something untrue is worse than one that admits a gap.
 */
const sections = [
  {
    title: "Who we are",
    body: [
      "The Senator Asuquo Ekpenyong Academic Championship (SAEAC) is organised by the SAEAC Organising Committee for secondary schools across the seven Local Government Areas of the Cross River South Senatorial District.",
      "The Committee is the data controller for information collected through this website and the schools portal.",
    ],
  },
  {
    title: "What we collect",
    body: [
      "From schools: the school name, address, Local Government Area, type, and the name, email address and phone number of the coordinating member of staff.",
      "From students entered into the championship: full name, stream, class, date of birth where given, and a photograph where the school uploads one.",
      "From Change Makers and officials: name, email address, phone number and the Local Government Area they wish to serve.",
      "From everyone who signs in: an email address and an encrypted password, held by our authentication provider.",
    ],
  },
  {
    title: "Students under 18",
    body: [
      "Almost every student entered into the championship is a minor. Their records are treated accordingly.",
      "Student records are never publicly readable. They are visible only to the school that entered them and to the Organising Committee, and this is enforced by the database itself rather than by the design of any page.",
      "Student photographs are stored privately. They are never served from a public address, and are shown only through short-lived links generated for someone who is already permitted to see them.",
      "A school records guardian or school consent before a student's name or photograph may be used publicly. The consent is stored with the date it was given, and it can be withdrawn at any time from the school's portal.",
      "Published results identify schools. They do not publish a student's photograph or personal details without recorded consent.",
    ],
  },
  {
    title: "Why we hold it",
    body: [
      "To run the championship: registering schools, verifying eligibility, arranging screening and fixtures, recording scores and publishing results.",
      "To communicate with schools about schedules, changes and outcomes.",
      "To keep an accurate record of the competition, including an audit trail of decisions such as approvals and score changes, so that a result can be explained and, if necessary, corrected.",
    ],
  },
  {
    title: "Who can see it",
    body: [
      "A school sees its own registration and its own students, and nobody else's.",
      "The Organising Committee sees the registrations and records it needs in order to run the championship.",
      "Quiz masters and judges see only the matches they are assigned to.",
      "The public sees approved schools, published fixtures and published results. Nothing else.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "Competition records, including results and the audit trail, are kept as a permanent record of each edition.",
      "[The retention period for registration documents and student photographs is to be confirmed by the Organising Committee.]",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You may ask what personal data we hold about you or your child, ask for it to be corrected, or ask for it to be deleted where we are not required to keep it as part of the competition record.",
      "A school may withdraw consent for a student's name or photograph to be used publicly at any time, from its own portal, without giving a reason.",
      "Requests should go to the Organising Committee using the contact details below.",
    ],
  },
  {
    title: "Security",
    body: [
      "Access is restricted by role and enforced in the database, so a page cannot show something the underlying rules forbid.",
      "Uploaded documents and photographs are held in private storage.",
      "Actions that change an official record are written to an append-only audit trail that cannot be edited or deleted through the portal.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Governance"
        title="Privacy and"
        titleTrail="Data Protection"
        intro="How we collect, use and protect personal data, including the data of students under 18."
        image="/img/meeting-group-wide.jpg"
        imageAlt="The SAEAC Organising Committee in session"
      />

      <section className="mx-auto max-w-3xl px-5 py-14 sm:py-16">
        {sections.map((s) => (
          <div key={s.title} className="mb-10 last:mb-0">
            <h2 className="font-display text-xl font-bold">{s.title}</h2>
            {s.body.map((p) => (
              <p key={p} className="mt-3 text-[15px] leading-relaxed text-primary/70">
                {p}
              </p>
            ))}
          </div>
        ))}

        <div className="mt-12 rounded-[28px] bg-white p-8">
          <h2 className="font-display text-lg font-bold">Contact</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-primary/70">
            Questions about this notice, or a request about your data, should go
            to the Organising Committee.
          </p>
          <p className="mt-4 text-[15px]">
            <a
              href={`mailto:${contact.email}`}
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              {contact.email}
            </a>
            <br />
            <a
              href={`tel:${contact.phone}`}
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              {contact.phone}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
