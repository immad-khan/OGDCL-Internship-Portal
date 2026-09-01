import { cn } from "@/lib/utils";

/**
 * Recreation of the OGDCL wordmark: "OGDC" built from teal rings/arcs
 * plus the blue "the energy" tagline. Hand-drawn SVG so it stays crisp
 * and can be tinted with the theme colors.
 */
export function OgdcLogo({ className }: { className?: string }) {
  const r = 16;
  const stroke = 10;
  const circ = 2 * Math.PI * r; // ~100.53
  const gapDeg = 42;
  const gapLen = (circ * gapDeg) / 360; // ~11.7
  const visible = circ - gapLen;
  const dash = `${visible.toFixed(2)} ${gapLen.toFixed(2)}`;

  // letter centers
  const centers = [
    { x: 22, name: "O" },
    { x: 68, name: "G" },
    { x: 114, name: "D" },
    { x: 160, name: "C" },
  ] as const;

  return (
    <svg
      viewBox="0 0 252 66"
      className={cn("h-9 w-auto select-none text-brand-600", className)}
      role="img"
      aria-label="OGDCL — the energy"
    >
      {/* O — full ring */}
      <circle cx={22} cy={33} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} />

      {/* G — ring cut at upper-right + crossbar */}
      <g style={{ color: "currentColor" }}>
        <circle
          cx={68}
          cy={33}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={dash}
          transform="rotate(-50 68 33)"
          strokeLinecap="butt"
        />
        <line
          x1={69}
          x2={82}
          y1={23}
          y2={23}
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
        />
      </g>

      {/* D — ring cut on the left */}
      <circle
        cx={114}
        cy={33}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeDasharray={dash}
        transform="rotate(180 114 33)"
        strokeLinecap="butt"
      />

      {/* C — ring cut on the right */}
      <circle
        cx={160}
        cy={33}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeDasharray={dash}
        strokeLinecap="butt"
      />

      {/* Tagline */}
      <text
        x={188}
        y={40}
        fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
        fontSize="15.5"
        fontWeight={700}
        letterSpacing="0.2"
        fill="#2b7cb8"
      >
        the energy
      </text>
    </svg>
  );
}

/** Small circular mark for favicons / compact headers. */
export function OgdcMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-8 w-8", className)}
      role="img"
      aria-label="OGDCL"
    >
      <circle cx={20} cy={20} r={15} fill="none" stroke="currentColor" strokeWidth={9.5} />
      <circle cx={20} cy={20} r={5.5} fill="currentColor" />
    </svg>
  );
}
