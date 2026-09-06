"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay in ms before the element animates in. */
  delay?: number;
  /** Direction the element travels from. */
  from?: "up" | "left" | "right" | "none";
  as?: "div" | "section" | "li" | "article";
};

/**
 * Reveals children once they enter the viewport. Purely CSS-driven —
 * the observer only toggles a data attribute.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  from = "up",
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.visible = "true";
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as;
  const style = { "--reveal-delay": `${delay}ms` } as CSSProperties;

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-reveal={from}
      className={className}
      style={style}
    >
      {children}
    </Tag>
  );
}
