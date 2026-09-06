import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ClipboardCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4.5V3h6v1.5M9 13l2 2 4-4" />
    </svg>
  );
}

export function Users(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0M15.5 5.5a3 3 0 0 1 0 5.5M17 14.5a5 5 0 0 1 3.5 4.5" />
    </svg>
  );
}

export function FileText(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5M10 13h6M10 17h6" />
    </svg>
  );
}

export function Calendar(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

export function MessageSquare(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-5 4z" />
    </svg>
  );
}

export function ShieldCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l7 3v5.5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function BarChart(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20h16M7 16v-5M12 16V6M17 16v-8" />
    </svg>
  );
}

export function BookOpen(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 6.5c-1.6-1.3-4-2-8-2v14c4 0 6.4.7 8 2 1.6-1.3 4-2 8-2v-14c-4 0-6.4.7-8 2z" />
      <path d="M12 6.5v14" />
    </svg>
  );
}

export function Building(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 21V5.5L12 3l8 2.5V21M4 21h16M9 21v-4h6v4" />
      <path d="M9 9h1M14 9h1M9 13h1M14 13h1" />
    </svg>
  );
}

export function Lock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

export function Mail(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function LogOut(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M15 8l4 4-4 4M19 12H9" />
    </svg>
  );
}

export function Grid(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
    </svg>
  );
}

export function AlertCircle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v4.5M12 15.5h.01" />
    </svg>
  );
}

export function Eye(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.75" />
    </svg>
  );
}

export function UserPlus(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="8" r="3.25" />
      <path d="M4 19.5a6 6 0 0 1 12 0M18 8v6M15 11h6" />
    </svg>
  );
}

export function Award(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5" />
    </svg>
  );
}

export function Search(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4-4" />
    </svg>
  );
}

export function Bell(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function TrendUp(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 17l6-6 4 4 6-7M15 8h5v5" />
    </svg>
  );
}

export function Activity(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12h4l3-7 4 14 3-7h4" />
    </svg>
  );
}

export function EyeOff(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 3l18 18M10.6 6c.5-.1.9-.1 1.4-.1 6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.2 3.9M6.4 6.9A17.7 17.7 0 0 0 2.5 12s3.5 6.5 9.5 6.5c1.7 0 3.1-.5 4.4-1.2" />
      <path d="M9.9 9.9a2.75 2.75 0 0 0 4 3.9" />
    </svg>
  );
}
