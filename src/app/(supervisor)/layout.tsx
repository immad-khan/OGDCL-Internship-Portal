import type { ReactNode } from "react";
import { getDashboardData, getSupervisor } from "@/lib/data";
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

  const { unreadMessages: unread } = await getDashboardData();

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
