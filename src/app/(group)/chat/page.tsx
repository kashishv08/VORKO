// app/chat/page.tsx (server component)
import ChatComponent from "@/src/components/chat/ChatComponent";
import { getCurrentUserFromDB } from "@/src/lib/helper";
import { User } from "@prisma/client";
import { getUserChats } from "../../api/graphql/resolvers/chat";

type chatType = {
  contractId: string;
  projectName: string;
  otherUser: User;
  lastMessage: string;
};

export default async function ChatPage() {
  const user = await getCurrentUserFromDB();
  if (!user) throw new Error("Not authenticated");

  const chats = await getUserChats(); // call resolver directly
  const selectedChat = chats.length > 0 ? chats[0] : null;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 font-bold text-lg border-b border-gray-700 text-green-400">
          Chats
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.contractId}
              className={`cursor-pointer p-3 flex items-center gap-3 hover:bg-gray-700 ${
                selectedChat?.contractId === chat.contractId
                  ? "bg-gray-700"
                  : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center font-bold">
                {chat.otherUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{chat.otherUser.name}</div>
                <div className="text-gray-400 text-sm">{chat.projectName}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right chat panel */}
      <div className="flex-1 bg-gray-900">
        {selectedChat ? (
          <ChatComponent
            user={user}
            otherUser={selectedChat.otherUser}
            contractId={selectedChat.contractId}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
