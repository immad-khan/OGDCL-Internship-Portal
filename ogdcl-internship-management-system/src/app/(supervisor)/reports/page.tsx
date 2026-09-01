import { getReports, getInterns } from "@/lib/data";
import { ReportsManager } from "@/components/reports/reports-manager";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const [reports, interns] = await Promise.all([getReports(), getInterns()]);
  return (
    <div className="space-y-6">
      <ReportsManager reports={reports} interns={interns} />
    </div>
  );
}
