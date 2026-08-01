import Image from "next/image";

/**
 * Shared brand furniture used by all five Phase 0 variants.
 * These enforce the fixed identity — logo, ribbon motif, colour system —
 * so the variants differ only in layout, never in brand.
 */

export function Logo({
  variant = "white",
  className = "",
  width = 190,
}: {
  variant?: "white" | "blue";
  className?: string;
  width?: number;
}) {
  const src =
    variant === "white"
      ? "/brand/saeac-logo-white-560.png"
      : "/brand/saeac-logo-blue-560.png";
  return (
    <Image
      src={src}
      alt="SÆAC — Senator Asuquo Ekpenyong Academic Championship"
      width={width}
      height={Math.round((width * 398) / 560)}
      className={className}
      priority
    />
  );
}

/**
 * The four-colour ribbon — the brand's signature device, lifted from the
 * corner motif that runs through every page of the brand guide.
 */
export function Ribbon({
  className = "",
  vertical = false,
}: {
  className?: string;
  vertical?: boolean;
}) {
  const colors = ["#f44423", "#fe6c03", "#0006eb", "#ffe169"];
  return (
    <div
      className={`flex ${vertical ? "flex-col w-1.5" : "h-1.5 w-full"} ${className}`}
      aria-hidden="true"
    >
      {colors.map((c) => (
        <div key={c} className="flex-1" style={{ background: c }} />
      ))}
    </div>
  );
}

/** Angled corner ribbon, echoing the deck's diagonal treatment. */
export function CornerRibbon({
  className = "",
  position = "tr",
}: {
  className?: string;
  position?: "tr" | "bl" | "br";
}) {
  const rot = position === "tr" ? "rotate-45" : position === "bl" ? "rotate-45" : "-rotate-45";
  const pos =
    position === "tr"
      ? "-top-10 -right-24"
      : position === "bl"
        ? "-bottom-10 -left-24"
        : "-bottom-10 -right-24";
  return (
    <div
      className={`pointer-events-none absolute ${pos} ${rot} w-72 ${className}`}
      aria-hidden="true"
    >
      <Ribbon className="mb-1 opacity-90" />
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-[#f44423]" />
        <div className="flex-1 bg-[#ffe169]" />
      </div>
    </div>
  );
}

/** Small pill used for eyebrow labels across variants. */
export function Pill({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest ${className}`}
    >
      {children}
    </span>
  );
}
