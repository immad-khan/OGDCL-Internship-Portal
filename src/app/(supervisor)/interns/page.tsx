import { getInterns } from "@/lib/data";
import { InternsManager } from "@/components/interns/interns-manager";

export const dynamic = "force-dynamic";

export default async function InternsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const interns = await getInterns();
  const params = await searchParams;
  const initialNew = params.new === "1";

  return (
    <div className="space-y-6">
      <InternsManager interns={interns} initialNew={initialNew} />
    </div>
  );
}
