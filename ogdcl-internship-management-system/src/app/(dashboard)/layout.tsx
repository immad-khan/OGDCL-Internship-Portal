import type { ReactNode } from "react";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { count, eq, and } from "drizzle-orm";
import { getSupervisor } from "@/lib/data";
import { AppShell } from "@/components/app-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supervisor = (await getSupervisor()) ?? {
    name: "OGDCL Supervisor",
    email: "supervisor@ogdcl.com",
    designation: "Internship Supervisor",
    department: "HR & Administration",
    phone: "",
    region: "Islamabad HQ",
    id: 0,
  };

  const [unreadRows] = await db
    .select({ n: count() })
    .from(messages)
    .where(and(eq(messages.role, "intern"), eq(messages.read, false)));
  const unread = unreadRows?.n ?? 0;

  return (
    <AppShell
      supervisor={{
        name: supervisor.name,
        designation: supervisor.designation,
        region: supervisor.region ?? "Islamabad HQ",
      }}
      unread={unread}
    >
      {children}
    </AppShell>
  );
}
