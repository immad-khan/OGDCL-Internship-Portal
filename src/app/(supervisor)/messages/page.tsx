import { getConversations, getSupervisor } from "@/lib/data";
import { MessagesConsole } from "@/components/messages/messages-console";

export const dynamic = "force-dynamic";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const initialId = params.id ? Number(params.id) : null;
  const [conversations, sup] = await Promise.all([getConversations(), getSupervisor()]);

  return (
    <MessagesConsole
      conversations={conversations}
      initialId={initialId}
      supervisorName={sup?.name ?? "OGDCL Supervisor"}
    />
  );
}
