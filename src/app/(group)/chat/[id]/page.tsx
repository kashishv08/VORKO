// app/chat/[contractId]/page.tsx (server component)
import { getCurrentUserFromDB } from "@/src/lib/helper";
import ChatComponent from "@/src/components/chat/ChatComponent";
import { gqlClient } from "@/src/lib/service/gql";
import { CONTRACT_BY_ID } from "@/src/lib/gql/queries";
import { contract } from "../../client/contract/page";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUserFromDB();
  if (!user) throw new Error("Not authenticated");

  console.log("chat curr user", user);

  const res: { contractById: contract } = await gqlClient.request(
    CONTRACT_BY_ID,
    {
      contractId: params.id,
    }
  );
  const contract = res.contractById;
  console.log("contract", contract);

  return (
    <ChatComponent
      user={user}
      otherUser={{
        id:
          user.id === contract.clientId
            ? contract.freelancerId
            : contract.clientId,
        name:
          user.id === contract.clientId
            ? contract.freelancer.name
            : contract.client.name,
        avatar:
          user.id === contract.clientId
            ? contract.freelancer.avatar
            : contract.client.avatar,
      }}
      contractId={contract.id}
    />
  );
}
