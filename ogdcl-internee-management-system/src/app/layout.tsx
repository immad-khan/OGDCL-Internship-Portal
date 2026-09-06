import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OGDCL Internship Management System",
    template: "%s · OGDCL Internship Management System",
  },
  description:
    "Oil & Gas Development Company Limited — a single, secure platform for managing internship placements, supervisors and interns.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-navy-900 antialiased">{children}</body>
    </html>
  );
}
