import type { Metadata } from "next";
import Link from "next/link";

import { findAcceptedVolunteerDesign } from "@/lib/volunteer-design";

import { VolunteerDesignCard } from "./volunteer-design-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Change Maker Design",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function VolunteerDesignPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const volunteer = await findAcceptedVolunteerDesign(token);

  if (!volunteer) {
    return (
      <main className="min-h-[65vh] bg-cream px-5 py-16 sm:py-24">
        <section className="mx-auto max-w-xl rounded-[28px] bg-white p-7 text-center shadow-sm sm:p-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary/50">
            Change Maker Design
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-primary">
            This link is no longer available
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-primary/65">
            The link may have expired or been replaced. Ask the Organising
            Committee to email you a fresh design link. You do not need to
            create an account.
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex rounded-full bg-gold px-6 py-3 text-[13px] font-bold text-primary transition hover:bg-primary hover:text-white"
          >
            Return to SAEAC
          </Link>
        </section>
      </main>
    );
  }

  const photoUrl = "/api/volunteer/design/" + encodeURIComponent(token) + "/photo";

  return (
    <main className="min-h-[65vh] bg-cream px-5 py-10 sm:py-16">
      <div className="mx-auto grid max-w-5xl items-center gap-9 lg:grid-cols-[1fr_360px] lg:gap-16">
        <section>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/50">
            Senator Asuquo Ekpenyong Academic Championship
          </p>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.04] tracking-[-0.025em] text-primary">
            Your Change Maker design is ready
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-primary/65">
            Hello {volunteer.fullName}. Preview your personal graphic, then
            download it and share the saved image on your WhatsApp Status.
          </p>
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-primary/50">
            This private link expires 30 days after it was sent. Keep the link
            private. Sharing the downloaded image will not share your private
            download link.
          </p>
        </section>

        <VolunteerDesignCard fullName={volunteer.fullName} photoUrl={photoUrl} />
      </div>
    </main>
  );
}
