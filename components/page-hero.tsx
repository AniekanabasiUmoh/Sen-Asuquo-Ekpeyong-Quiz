import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

/**
 * Masthead for interior pages.
 *
 * The homepage keeps its full-bleed photographic hero; every other page gets
 * this instead — a shallower band that states where you are and gets out of
 * the way. Interior pages are read for their content, so the masthead should
 * not cost half a screen before the reader reaches any.
 *
 * With `image` it is a photographic band with a scrim; without, it is type on
 * the cream ground with a rule beneath.
 */
export function PageHero({
  eyebrow,
  title,
  titleTrail,
  intro,
  image,
  imageAlt = "",
  imagePosition = "center 35%",
  breadcrumb,
}: {
  eyebrow?: string;
  title: string;
  /** Second half, set in the muted tone of the two-tone treatment. */
  titleTrail?: string;
  intro?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  /** Parent page, shown above the title. */
  breadcrumb?: { label: string; href: string };
}) {
  if (image) {
    return (
      <section className="px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative isolate overflow-hidden rounded-[28px]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover"
            style={{ objectPosition: imagePosition }}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#06122f] via-[#06122f]/55 to-[#06122f]/25" />

          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-28">
            {breadcrumb && (
              <Link
                href={breadcrumb.href}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/55 transition hover:text-white"
              >
                <span aria-hidden="true">←</span> {breadcrumb.label}
              </Link>
            )}
            {eyebrow && !breadcrumb && (
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.25rem,5.6vw,4.25rem)] font-extrabold leading-[1] tracking-[-0.03em] text-white">
              {title} {titleTrail && <span className="text-white/45">{titleTrail}</span>}
            </h1>
            {intro && (
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-base">
                {intro}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 pb-2 pt-14 sm:pt-20">
      <Reveal>
        {breadcrumb && (
          <Link
            href={breadcrumb.href}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#003090]/40 transition hover:text-[#f03018]"
          >
            <span aria-hidden="true">←</span> {breadcrumb.label}
          </Link>
        )}
        {eyebrow && !breadcrumb && (
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#003090]/35">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.25rem,5.6vw,4.25rem)] font-extrabold leading-[1] tracking-[-0.03em]">
          {title} {titleTrail && <span className="text-[#003090]/35">{titleTrail}</span>}
        </h1>
        {intro && (
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[#003090]/55 sm:text-base">
            {intro}
          </p>
        )}
      </Reveal>
      <div className="mt-10 border-b border-black/10" />
    </section>
  );
}
