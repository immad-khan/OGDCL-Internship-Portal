import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "OGDCL Intern Portal",
    template: "%s · OGDCL Intern",
  },
  description: "Your internship workspace — tasks, learning, calendar, messages, and files.",
};

export default function InternLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
