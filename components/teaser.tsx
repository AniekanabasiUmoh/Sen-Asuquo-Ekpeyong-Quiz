import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

/**
 * Homepage teaser for a section that now lives on its own page.
 *
 * When the site was split up, the temptation was to move each section out
 * wholesale, which would have left the homepage as a hero and a register
 * button. Instead each moved section leaves one of these behind: enough to
 * say what is there and why to click, and no more. The homepage gets shorter
 * without going hollow.
 */
export function Teaser({
  eyebrow,
  title,
  titleTrail,
  body,
  href,
  cta,
  image,
  imageAlt = "",
  reverse = false,
  facts,
}: {
  eyebrow: string;
  title: string;
  titleTrail?: string;
  body: string;
  href: string;
  cta: string;
  image: string;
  imageAlt?: string;
  /** Photograph on the left instead of the right. */
  reverse?: boolean;
  /** Optional figures, shown as a rule-separated row beneath the copy. */
  facts?: ReadonlyArray<{ value: string; label: string }>;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
      <div
        className={`grid items-center gap-8 lg:gap-14 ${
          reverse ? "lg:grid-cols-[1fr_1.05fr]" : "lg:grid-cols-[1.05fr_1fr]"
        }`}
      >
        <Reveal className={reverse ? "lg:order-2" : ""}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/35">
            {eyebrow}
          </p>
          <h2 className="mt-4 font-display text-[clamp(1.85rem,3.8vw,2.85rem)] font-extrabold leading-[1.04] tracking-[-0.025em]">
            {title} {titleTrail && <span className="text-primary/35">{titleTrail}</span>}
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-primary/55">
            {body}
          </p>

          {facts && (
            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-4 border-t border-black/10 pt-6">
              {facts.map((f) => (
                <div key={f.label}>
                  <div className="font-display text-2xl font-extrabold tracking-[-0.02em]">
                    {f.value}
                  </div>
                  <div className="mt-0.5 text-[12px] text-primary/45">{f.label}</div>
                </div>
              ))}
            </div>
          )}

          <Link
            href={href}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-[13px] font-semibold transition hover:border-red hover:text-red"
          >
            {cta}
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>

        <Reveal
          delay={120}
          className={`relative aspect-[4/3] overflow-hidden rounded-[24px] ${
            reverse ? "lg:order-1" : ""
          }`}
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover transition duration-700 hover:scale-[1.04]"
          />
        </Reveal>
      </div>
    </section>
  );
}
