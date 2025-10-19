import { getUserChats } from "@/src/app/api/graphql/resolvers/chat";

export async function GET() {
  const chats = await getUserChats(); // server-side safe
  console.log("allchat", chats);
  return new Response(JSON.stringify(chats));
}
