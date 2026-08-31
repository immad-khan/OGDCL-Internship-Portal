import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "spline-viewer": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        url?: string;
        loading?: "auto" | "lazy" | "eager";
        "loading-anim-type"?: "spinner-small-dark" | "spinner-small-light" | "spinner-big-dark" | "spinner-big-light";
        background?: string;
        hint?: boolean;
      };
    }
  }
}

export {};
