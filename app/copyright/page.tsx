import type { Metadata } from "next";

import { PageHero } from "@/components/page-hero";
import { contact } from "@/content/homepage";

export const metadata: Metadata = {
  title: "Copyright and Terms",
  description:
    "Copyright, trademark and terms of use for the Senator Asuquo Ekpenyong Academic Championship website.",
};

/**
 * Copyright and terms of use, Phase 5 sprint 5.3.
 *
 * Standard boilerplate rather than a legal document specific to minors' data
 * (that is /privacy's job, and it already exists and is thorough). This is
 * safe to publish as written: it states facts about the site (who owns what,
 * what visitors may and may not do with it) rather than commitments about how
 * personal data is handled, which is the category that needed sign-off.
 *
 * The bracketed line is the one detail only the Committee can settle: the
 * exact legal entity name for copyright ownership, which may not be "the SAEAC
 * Organising Committee" in a filing sense. Marked rather than guessed.
 */
const sections = [
  {
    title: "Ownership",
    body: [
      "This website, its design, and the SÆAC name, logo and wordmark are the property of [the SAEAC Organising Committee's registered legal entity, to be confirmed].",
      "Text, photography and video published on this site that credits another source, such as a sponsor's logo or a supplied press photograph, remains the property of that source and is used with permission.",
    ],
  },
  {
    title: "What you may do",
    body: [
      "You may view, print and share pages from this site for personal, non-commercial use, and journalists and partner organisations may quote from published pages with attribution to the Senator Asuquo Ekpenyong Academic Championship.",
      "Schools, students, Change Makers and officials may share their own registration confirmation, accreditation or results with others.",
    ],
  },
  {
    title: "What you may not do",
    body: [
      "You may not reproduce the SÆAC name, logo or wordmark to suggest an official endorsement, partnership or affiliation that does not exist.",
      "You may not scrape, systematically copy, or republish the contents of this site's database (school records, results, or any other data) for a separate product or service without written permission.",
      "You may not use a photograph of a student published on this site outside the context in which it was published, or for any commercial purpose.",
    ],
  },
  {
    title: "Photography and video",
    body: [
      "Photographs and video of students appear on this site only where the school has recorded consent, as described in the Privacy and Data Protection notice.",
      "If you believe a photograph of yourself or your child has been published without consent, contact the Organising Committee using the details below and it will be reviewed and, where appropriate, removed.",
    ],
  },
  {
    title: "Third-party content",
    body: [
      "Live broadcasts embedded on this site are hosted by YouTube (and any other platform listed alongside a broadcast) and are subject to that platform's own terms.",
      "Sponsor and partner logos are used with permission and remain the property of their respective owners.",
    ],
  },
  {
    title: "No warranty",
    body: [
      "Information on this site, including schedules, fixtures and provisional figures, is provided in good faith but may change. Where a page states a figure is provisional or subject to confirmation, treat it as such.",
      "The Organising Committee is not liable for decisions made in reliance on unconfirmed or provisional information published here.",
    ],
  },
] as const;

export default function CopyrightPage() {
  return (
    <>
      <PageHero
        eyebrow="Governance"
        title="Copyright"
        titleTrail="and Terms"
        intro="Ownership of this site's content, and what you may and may not do with it."
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
          <h2 className="font-display text-lg font-bold">Questions</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-primary/70">
            For permission requests, or to report a concern about content
            published on this site, contact the Organising Committee.
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
