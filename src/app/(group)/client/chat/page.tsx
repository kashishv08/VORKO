"use client";

import { useState, useEffect } from "react";
import ChatComponent from "@/src/components/chat/ChatComponent";
import { MessageSquare, Search, ArrowLeft } from "lucide-react";
import { gqlClient } from "@/src/lib/service/gql";
import { GET_ALL_CHATS } from "@/src/lib/gql/queries";
import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Spinner } from "@radix-ui/themes";

type chatType = {
  contractId: string;
  projectName: string;
  otherUser: User;
  lastMessage: string | null;
};

export default function ChatPage() {
  const [user, setUser] = useState<User>();
  const [chats, setChats] = useState<chatType[]>([]);
  const [selectedChat, setSelectedChat] = useState<chatType>();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uRes = await fetch("/api/currentUser");
        if (!uRes.ok) return;
        const u = await uRes.json();
        setUser(u);

        const res: { getUserChats: chatType[] } = await gqlClient.request(GET_ALL_CHATS);
        const c = res.getUserChats;
        setChats(c);

        if (c.length > 0) {
          setSelectedChat(c[0]);
          // On desktop we select first chat by default, but on mobile we stay in list view
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelectChat = (chat: chatType) => {
    setSelectedChat(chat);
    setMobileView("chat");
  };

  const filteredChats = chats.filter(chat =>
    chat.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-[500px]">
      <Spinner size="3" />
    </div>
  );

  if (!user) return null;

  return (
    <div className="bg-white border border-border md:rounded-xl overflow-hidden shadow-sm h-[calc(100vh-140px)] md:h-[calc(100vh-160px)]">
      <div className="flex h-full">
        {/* Sidebar - Visible on Desktop or when mobileView is 'list' */}
        <div className={`w-full md:w-72 border-r border-border flex flex-col flex-shrink-0 bg-white ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-border">
            <h2 className="text-base font-semibold text-slate-900 mb-3 tracking-tight">Messages</h2>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="search"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="text-center py-10 px-4">
                <p className="text-slate-400 text-xs font-medium italic">No conversations found.</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <button
                  key={chat.contractId}
                  onClick={() => handleSelectChat(chat)}
                  className={`w-full text-left p-4 border-b border-border/50 hover:bg-slate-50 transition-colors flex items-center gap-3 ${selectedChat?.contractId === chat.contractId ? "bg-primary/[0.03]" : ""
                    }`}
                >
                  <Avatar className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border-none">
                    <AvatarImage src={chat.otherUser.avatar || ""} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                      {chat.otherUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-sm font-semibold truncate ${selectedChat?.contractId === chat.contractId ? "text-primary" : "text-slate-900"}`}>
                        {chat.otherUser.name}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium">Just now</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate font-medium">{chat.projectName}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area - Visible on Desktop or when mobileView is 'chat' */}
        <div className={`flex-1 flex flex-col bg-white ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
          {selectedChat ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-3 md:p-4 border-b border-border flex items-center gap-3 bg-white">
                {/* Back Button for Mobile */}
                <button 
                  onClick={() => setMobileView("list")}
                  className="md:hidden p-1.5 hover:bg-slate-100 rounded-full transition-colors mr-1"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>

                <Avatar className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary/10 flex items-center justify-center border-none">
                  <AvatarImage src={selectedChat.otherUser.avatar || ""} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                    {selectedChat.otherUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-slate-900 leading-none mb-1">{selectedChat.otherUser.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none truncate max-w-[150px] md:max-w-none">
                    {selectedChat.projectName}
                  </p>
                </div>
              </div>

              <div className="flex-1 relative">
                <div className="absolute inset-0">
                  <ChatComponent
                    user={user}
                    otherUser={selectedChat.otherUser}
                    contractId={selectedChat.contractId}
                    projectName={selectedChat.projectName}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mb-4">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Select a Message</h3>
              <p className="text-slate-400 text-sm max-w-[240px] font-medium leading-relaxed">Choose a conversation from the left to view your workspace chat.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
