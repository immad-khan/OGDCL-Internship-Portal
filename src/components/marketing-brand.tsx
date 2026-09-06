import Link from "next/link";
import { OgdcLogo } from "@/components/logo";

/**
 * OGDCL brand lockup for the dark marketing surfaces (landing + sign-in).
 * Uses the inline SVG wordmark so it needs no external image asset and
 * is tintable for dark backgrounds.
 */
export function MarketingBrand({
  compact = false,
  variant = "dark",
}: {
  compact?: boolean;
  variant?: "light" | "dark";
}) {
  return (
    <Link href="/" className="inline-flex items-center gap-3" aria-label="OGDCL home">
      <OgdcLogo className="h-8 w-auto text-white" />
      {!compact && (
        <span className="hidden sm:block">
          <span className="block text-[13px] font-semibold leading-none tracking-wide text-white">
            Internship Management System
          </span>
          <span className="mt-1 block text-[11px] leading-none text-ink-300">
            Oil &amp; Gas Development Company Limited
          </span>
        </span>
      )}
    </Link>
  );
}