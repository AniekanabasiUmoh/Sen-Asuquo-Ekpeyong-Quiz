/**
 * The Striker — the championship's football metaphor made visual.
 *
 * A student figure in a stance borrowed from the brand's own icon (arms
 * raised, celebrating) rendered as flat brand-coloured shapes rather than a
 * photograph, so it reads as an illustration alongside the Round 3 mechanics.
 * Drawn inline to avoid an asset dependency and to scale cleanly.
 */
export function StrikerIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 260"
      fill="none"
      className={className}
      role="img"
      aria-label="Illustration of a Striker celebrating"
    >
      {/* Podium / stage disc */}
      <ellipse cx="120" cy="238" rx="74" ry="13" fill="#0d2270" opacity="0.12" />

      {/* Radiating burst behind the figure */}
      <g opacity="0.5">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <rect
            key={deg}
            x="118"
            y="30"
            width="4"
            height="22"
            rx="2"
            fill={deg % 90 === 0 ? "#ffe169" : "#f44423"}
            transform={`rotate(${deg} 120 108)`}
          />
        ))}
      </g>

      {/* Raised arms */}
      <path
        d="M84 118 60 78"
        stroke="#0d2270"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M156 118 180 78"
        stroke="#0d2270"
        strokeWidth="13"
        strokeLinecap="round"
      />

      {/* Head */}
      <circle cx="120" cy="86" r="24" fill="#0d2270" />

      {/* Torso — the jersey */}
      <path
        d="M120 112c-22 0-38 10-42 24l-4 46c0 6 5 10 11 10h70c6 0 11-4 11-10l-4-46c-4-14-20-24-42-24Z"
        fill="#0006eb"
      />

      {/* Jersey number band */}
      <rect x="104" y="150" width="32" height="26" rx="5" fill="#ffe169" />
      <path
        d="M116 156v14M116 156h6a4 4 0 0 1 0 8h-6"
        stroke="#0d2270"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Legs */}
      <path d="M104 192v34" stroke="#0d2270" strokeWidth="14" strokeLinecap="round" />
      <path d="M136 192v34" stroke="#0d2270" strokeWidth="14" strokeLinecap="round" />

      {/* Four-colour ribbon underfoot — the brand device */}
      <g>
        <rect x="62" y="228" width="29" height="5" rx="2.5" fill="#f44423" />
        <rect x="91" y="228" width="29" height="5" rx="2.5" fill="#fe6c03" />
        <rect x="120" y="228" width="29" height="5" rx="2.5" fill="#0006eb" />
        <rect x="149" y="228" width="29" height="5" rx="2.5" fill="#ffe169" />
      </g>
    </svg>
  );
}
