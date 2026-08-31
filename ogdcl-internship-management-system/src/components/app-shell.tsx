"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export function AppShell({
  supervisor,
  unread,
  children,
}: {
  supervisor: { name: string; designation: string; region: string };
  unread: number;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <Sidebar
        supervisor={supervisor}
        unread={unread}
        open={open}
        onClose={() => setOpen(false)}
      />
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="lg:pl-[var(--sidebar-w)]">
        <Header supervisor={supervisor} unread={unread} onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
