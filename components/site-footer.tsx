import Link from "next/link";
import { Logo, Ribbon } from "@/components/brand";
import { SocialIcon } from "@/components/social-icons";
import { brand, contact, footerLinks, portalLinks } from "@/content/homepage";

/**
 * Site footer, per Content Guide §3.2.
 *
 * Lifted out of the homepage when the site was split into pages, so every
 * page carries the same one. Portal links point at the unified login gateway
 * recommended in §2.2 and are marked pending until Phase 2 builds it.
 */
export function SiteFooter() {
  return (
    <footer id="contact" className="px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="relative overflow-hidden rounded-[28px] bg-ink pt-14 text-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <Logo variant="white" width={150} />
              <p className="mt-6 max-w-xs font-display text-xl font-bold leading-snug">
                {brand.tagline}
              </p>
              <p className="mt-6 text-sm leading-relaxed text-white/45">
                {contact.email}
                <br />
                {contact.phone}
              </p>
              <div className="mt-6 flex gap-2.5">
                {contact.socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-gold hover:text-gold"
                  >
                    <SocialIcon name={s.name} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                Explore
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                {footerLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-white/60 transition hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                Portals
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                {portalLinks.map((l) => (
                  <li key={l.label}>
                    {/* Pending until the Phase 2 login gateway exists. Rendered
                        as plain text rather than a dead link, so nobody clicks
                        through to a 404. */}
                    <span className="inline-flex items-center gap-2 text-white/35">
                      {l.label}
                      <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/45">
                        Soon
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-[12px] text-white/35">
            <span>
              © 2026 {brand.short}. {brand.edition}.
            </span>
            <span>{brand.domain}</span>
          </div>
        </div>

        {/* Oversized wordmark, bleeding off the bottom edge */}
        <div
          className="select-none px-4 text-center font-display text-[clamp(4rem,17vw,15rem)] font-extrabold leading-[0.78] tracking-[-0.045em] text-white/[0.07]"
          aria-hidden="true"
        >
          SAEAC
        </div>
        <Ribbon />
      </div>
    </footer>
  );
}
