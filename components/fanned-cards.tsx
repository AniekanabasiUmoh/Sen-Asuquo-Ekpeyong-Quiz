import Image from "next/image";

/**
 * Tilted photographs fanned out from both edges, from the chosen reference
 * (Caladan), where they frame the closing call to action.
 *
 * Purely decorative: the cards carry no information the page needs, so they
 * are hidden from assistive technology and dropped entirely below `lg`, where
 * there is no room either side of the type for them to sit without crowding
 * it.
 */
export function FannedCards({
  left,
  right,
}: {
  left: ReadonlyArray<string>;
  right: ReadonlyArray<string>;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden select-none lg:block"
    >
      {/* Left fan, tilting away from the centre. */}
      <div className="absolute -left-16 top-1/2 -translate-y-1/2">
        {left.map((src, i) => (
          <div
            key={src}
            className="absolute overflow-hidden rounded-2xl border-4 border-[#faf6ee] shadow-[0_18px_40px_rgba(6,18,47,0.16)]"
            style={{
              width: 210,
              height: 150,
              transform: `translate(${i * 34}px, ${i * 92 - 130}px) rotate(${
                -14 + i * 7
              }deg)`,
            }}
          >
            <Image src={src} alt="" fill sizes="210px" className="object-cover" />
          </div>
        ))}
      </div>

      {/* Right fan, mirrored. */}
      <div className="absolute -right-16 top-1/2 -translate-y-1/2">
        {right.map((src, i) => (
          <div
            key={src}
            className="absolute overflow-hidden rounded-2xl border-4 border-[#faf6ee] shadow-[0_18px_40px_rgba(6,18,47,0.16)]"
            style={{
              width: 210,
              height: 150,
              right: 0,
              transform: `translate(${-i * 34}px, ${i * 92 - 130}px) rotate(${
                14 - i * 7
              }deg)`,
            }}
          >
            <Image src={src} alt="" fill sizes="210px" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
