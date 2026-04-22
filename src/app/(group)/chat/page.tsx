import ChatComponent from "@/src/components/chat/ChatComponent";
import { getCurrentUserFromDB } from "@/src/lib/helper";
import { User } from "@prisma/client";
import { getUserChats } from "../../api/graphql/resolvers/chat";
import { Search } from "lucide-react";

export default async function ChatPage() {
  const user = await getCurrentUserFromDB();
  if (!user) throw new Error("Not authenticated");

  const chats = await getUserChats(); 
  const selectedChat = chats.length > 0 ? chats[0] : null;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm" style={{ height: "calc(100vh - 120px)" }}>
      <div className="flex h-full">
        {/* Contacts Sidebar */}
        <div className="w-80 border-r border-border flex flex-col flex-shrink-0 bg-white">
          <div className="p-4 border-b border-border">
            <h2 className="text-base font-bold text-foreground mb-3 tracking-tight">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {chats.map((chat) => (
              <button
                key={chat.contractId}
                className={`w-full text-left p-4 border-b border-border/50 hover:bg-slate-50 transition-colors flex items-center gap-3 ${
                  selectedChat?.contractId === chat.contractId ? "bg-primary/5" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/5">
                  <span className="text-sm font-bold text-primary">
                    {chat.otherUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-bold text-foreground truncate">{chat.otherUser.name}</p>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Today</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate font-medium">{chat.projectName}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50/30">
          {selectedChat ? (
            <div className="flex flex-col h-full">
                <div className="p-4 border-b border-border bg-white flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/5">
                            <span className="text-xs font-bold text-primary">{selectedChat.otherUser.name.charAt(0)}</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground leading-tight">{selectedChat.otherUser.name}</p>
                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Online Now</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <ChatComponent
                        user={user}
                        otherUser={selectedChat.otherUser}
                        contractId={selectedChat.contractId}
                        projectName={selectedChat.projectName}
                    />
                </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white m-4 rounded-2xl border border-dashed border-border/50">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No chat selected</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">Choose a conversation from the sidebar to view messages and details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
