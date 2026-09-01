import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OGDCL Internship Management",
    template: "%s · OGDCL",
  },
  description:
    "Supervisor workspace for managing OGDCL interns, tasks, reports and communication.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-slate-800 antialiased">{children}</body>
    </html>
  );
}
