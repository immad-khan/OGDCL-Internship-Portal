import Link from "next/link";

type BrandProps = {
  href?: string;
  variant?: "light" | "dark";
  compact?: boolean;
};

/**
 * OGDCL logo lockup. The source artwork is on a white background, so the
 * image is always placed on a white plate to keep the mark clean on any surface.
 */
export function Brand({ href = "/", variant = "light", compact = false }: BrandProps) {
  const text = variant === "light" ? "text-navy-900" : "text-white";
  const sub = variant === "light" ? "text-navy-500" : "text-ink-300";
  const ring = variant === "light" ? "ring-navy-200/70" : "ring-white/10";

  return (
    <Link href={href} className="inline-flex items-center gap-3" aria-label="OGDCL home">
      <span className={`inline-flex h-10 items-center rounded-md bg-white px-2 ring-1 ${ring}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/ogdcl-logo.jpg"
          alt="OGDCL — Oil & Gas Development Company Limited"
          className="h-7 w-auto"
          width={768}
          height={382}
        />
      </span>
      {!compact && (
        <span className="hidden sm:block">
          <span className={`block text-[13px] font-semibold leading-none tracking-wide ${text}`}>
            Internship Management System
          </span>
          <span className={`mt-1 block text-[11px] leading-none ${sub}`}>
            Oil &amp; Gas Development Company Limited
          </span>
        </span>
      )}
    </Link>
  );
}
