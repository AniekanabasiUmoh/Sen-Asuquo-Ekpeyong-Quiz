/**
 * Glyphs for the eight Grand Finale mechanics.
 *
 * The SAEAC RD deck illustrates each mechanic with a football-flavoured
 * figure — a striker mid-kick, overlapping substitutes, a referee signalling
 * VAR, a ball, a handshake, a scoreboard, a crowd. These are stand-ins drawn
 * as flat brand-coloured silhouettes so the section is not blocked.
 *
 * TODO: replace with the deck's own artwork once the designer exports it —
 * see complaint.md item 10 / blocker B8. These approximate the intent; they
 * are not the real illustrations.
 */

// Resolved from the theme tokens in globals.css so the glyphs cannot drift
// from the rest of the system. SVG fill/stroke accept var() directly.
const NAVY = "var(--color-primary)";
const RED = "var(--color-red)";
const GOLD = "var(--color-gold)";

/** A single striker silhouette, mid-strike. Shared by several glyphs. */
function StrikerFigure({
  fill = NAVY,
  opacity = 1,
}: {
  fill?: string;
  opacity?: number;
}) {
  return (
    <g fill={fill} opacity={opacity}>
      <circle cx="46" cy="14" r="8" />
      <path d="M44 23c-7 1-11 6-12 12l-3 17c-.4 2.6 1.4 4.6 4 4.6 2.2 0 4-1.6 4.3-3.8l2.2-13.4 3.5 9.8c.5 1.4 1.7 2.3 3.2 2.3h9.6c2.3 0 4-1.9 4-4.1 0-2.3-1.8-4-4-4h-6.8l-3.4-9.6C43.4 28.4 44 25 44 23Z" />
      <path d="M35 51 24 66c-1.4 1.9-1 4.5.9 5.9 1.9 1.4 4.5 1 5.9-.9l11-15-6.8-5Z" />
      <path d="M50 48l12 9c1.9 1.4 4.5 1 5.9-.9 1.4-1.9 1-4.5-.9-5.9l-11-8.2L50 48Z" />
    </g>
  );
}

export function MechanicGlyph({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const common = {
    viewBox: "0 0 110 86",
    fill: "none",
    className,
    role: "img" as const,
    "aria-label": `${name} illustration`,
  };

  switch (name) {
    /* One striker, plus the ball and motion arc. */
    case "Strikers":
      return (
        <svg {...common}>
          <StrikerFigure />
          <circle cx="24" cy="76" r="7" fill="none" stroke={NAVY} strokeWidth="2.5" />
          <path
            d="M74 34c8 6 10 20 2 30"
            stroke={NAVY}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="3 4"
          />
        </svg>
      );

    /* Three overlapping figures — the bench stepping forward. */
    case "Assist Option":
      return (
        <svg {...common}>
          <g transform="translate(-22 0) scale(0.92)">
            <StrikerFigure fill={NAVY} opacity={0.18} />
          </g>
          <g transform="translate(-11 0) scale(0.96)">
            <StrikerFigure fill={NAVY} opacity={0.38} />
          </g>
          <StrikerFigure />
        </svg>
      );

    /* Two figures, one green one red — the substitution swap. */
    case "Substitution":
      return (
        <svg {...common}>
          <g transform="translate(-14 4) scale(0.9)">
            <StrikerFigure fill="#2dc653" />
          </g>
          <g transform="translate(14 4) scale(0.9) scale(-1 1) translate(-92 0)">
            <StrikerFigure fill={RED} />
          </g>
          <path
            d="M40 78h30"
            stroke={NAVY}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="3 4"
          />
        </svg>
      );

    /* Referee framing the VAR rectangle with both hands. */
    case "VAR":
      return (
        <svg {...common}>
          <rect
            x="30"
            y="16"
            width="50"
            height="34"
            rx="3"
            fill="none"
            stroke={NAVY}
            strokeWidth="2.5"
          />
          <circle cx="55" cy="60" r="8" fill={GOLD} />
          <path
            d="M43 84c0-8 5-14 12-14s12 6 12 14"
            fill={GOLD}
          />
          <path
            d="M43 72 30 52M67 72l13-20"
            stroke={NAVY}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );

    /* Ball striking, with a burst. */
    case "Scoring":
      return (
        <svg {...common}>
          <path
            d="M55 8l6 13 14-5-5 14 13 6-13 6 5 14-14-5-6 13-6-13-14 5 5-14-13-6 13-6-5-14 14 5 6-13Z"
            fill={GOLD}
            opacity="0.85"
          />
          <circle cx="55" cy="43" r="17" fill="white" stroke={NAVY} strokeWidth="2.5" />
          <path
            d="M55 30l5 4-2 6h-6l-2-6 5-4Zm-13 10 5-4 4 3-2 6-5 1-2-6Zm26 0-2 6-5-1-2-6 4-3 5 4ZM47 55l4-4h8l4 4-3 5h-10l-3-5Z"
            fill={NAVY}
          />
        </svg>
      );

    /* Two hands meeting. */
    case "Draw or Tie":
      return (
        <svg {...common}>
          <path
            d="M14 46c0-3 2-5 5-5h16l10-8c2-1.6 5-1.2 6.6.8 1.5 2 1.2 4.8-.8 6.4L44 46h20c3 0 5 2.2 5 5s-2 5-5 5H30c-3 0-5-2-5-5H19c-3 0-5-2-5-5Z"
            fill={NAVY}
          />
          <path
            d="M96 46c0-3-2-5-5-5H75l-10-8c-2-1.6-5-1.2-6.6.8-1.5 2-1.2 4.8.8 6.4L66 46H46c-3 0-5 2.2-5 5s2 5 5 5h34c3 0 5-2 5-5h6c3 0 5-2 5-5Z"
            fill={NAVY}
            opacity="0.5"
          />
        </svg>
      );

    /* Scoreboard. */
    case "Scoring Panel":
      return (
        <svg {...common}>
          <rect x="14" y="16" width="82" height="44" rx="4" fill={NAVY} />
          <rect x="20" y="22" width="34" height="12" rx="2" fill="white" opacity="0.85" />
          <rect x="58" y="22" width="34" height="12" rx="2" fill="white" opacity="0.85" />
          <text
            x="37"
            y="52"
            textAnchor="middle"
            fontSize="15"
            fontWeight="700"
            fill={RED}
            fontFamily="monospace"
          >
            03
          </text>
          <text
            x="75"
            y="52"
            textAnchor="middle"
            fontSize="15"
            fontWeight="700"
            fill={RED}
            fontFamily="monospace"
          >
            01
          </text>
          <path d="M50 60h10v18H50z" fill={NAVY} opacity="0.55" />
          <path d="M36 78h38" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    /* A crowd with raised arms. */
    case "Side Attraction Game":
      return (
        <svg {...common}>
          <g fill={NAVY}>
            {[
              [18, 52],
              [34, 46],
              [50, 50],
              [66, 44],
              [82, 50],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="6" />
                <path d={`M${x - 7} ${y + 30}c0-9 3-16 7-16s7 7 7 16z`} />
                <path
                  d={`M${x - 7} ${y + 6} ${x - 14} ${y - 8}M${x + 7} ${y + 6} ${x + 14} ${y - 8}`}
                  stroke={NAVY}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </g>
          <path d="M8 82h94" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <StrikerFigure />
        </svg>
      );
  }
}

/** Kept for the standalone hero-style striker, if needed elsewhere. */
export function StrikerIllustration({ className = "" }: { className?: string }) {
  return <MechanicGlyph name="Strikers" className={className} />;
}
