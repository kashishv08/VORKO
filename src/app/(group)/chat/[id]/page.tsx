// app/chat/[contractId]/page.tsx (server component)
import { getCurrentUserFromDB } from "@/src/lib/helper";
import ChatComponent from "@/src/components/chat/ChatComponent";
import { gqlClient } from "@/src/lib/service/gql";
import { CONTRACT_BY_ID } from "@/src/lib/gql/queries";
import { contract } from "../../client/contract/page";
import { Suspense } from "react";
import { Spinner } from "@radix-ui/themes";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUserFromDB();
  if (!user) throw new Error("Not authenticated");

  const res: { contractById: contract } = await gqlClient.request(
    CONTRACT_BY_ID,
    {
      contractId: params.id,
    }
  );
  const contract = res.contractById;

  const isClient = user.id === contract.clientId;

  const otherUser = {
    id: isClient ? contract.freelancerId : contract.clientId,
    name: isClient ? contract.freelancer.name : contract.client.name,
    avatar: isClient ? contract.freelancer.avatar : contract.client.avatar,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[var(--background)] via-[var(--surface)]/80 to-[var(--background)] text-[var(--text-primary)] transition-colors duration-500">
      {/* Page Header */}
      <header className="px-6 md:px-10 py-4 border-b border-[var(--border)] backdrop-blur-xl bg-[var(--surface)]/60 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] bg-clip-text text-transparent">
          Chat Room
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Project:{" "}
          <span className="font-semibold text-[var(--text-primary)]">
            {contract.project?.title ?? "Untitled Project"}
          </span>
        </p>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden p-0">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">
              <Spinner size="3" />
            </div>
          }
        >
          <ChatComponent
            user={user}
            otherUser={otherUser}
            contractId={contract.id}
          />
        </Suspense>
      </main>
    </div>
  );
}
