"use client";

import { useState, useEffect } from "react";
import ChatComponent from "@/src/components/chat/ChatComponent";
import { motion, AnimatePresence } from "framer-motion";
import { FaComments, FaBars } from "react-icons/fa";
import { gqlClient } from "@/src/lib/service/gql";
import { GET_ALL_CHATS } from "@/src/lib/gql/queries";
import { User } from "@prisma/client";

type chatType = {
  contractId: string;
  projectName: string;
  otherUser: User;
  lastMessage: null;
};

export default function ChatPage() {
  const [user, setUser] = useState<User>();
  const [chats, setChats] = useState<chatType[]>([]);
  const [selectedChat, setSelectedChat] = useState<chatType>();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uRes = await fetch("/api/currentUser");
        if (!uRes.ok) return;
        const u = await uRes.json();
        setUser(u);

        // const cRes = await fetch("/api/chats");
        // const c = await cRes.json();
        const res: { getUserChats: chatType[] } = await gqlClient.request(
          GET_ALL_CHATS
        );
        // console.log(res);
        const c = res.getUserChats;
        setChats(c);

        if (c.length > 0) setSelectedChat(c[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-[var(--text-secondary)] bg-[var(--background)]">
        Loading chats...
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-[var(--text-secondary)] bg-[var(--background)]">
        Not logged in
      </div>
    );

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      {/* Sidebar (Desktop) */}
      <div className="hidden md:flex w-80 flex-col backdrop-blur-lg bg-[var(--surface)]/70 border-r border-[var(--border)]">
        <div className="p-5 border-b border-[var(--border)] flex items-center gap-2 text-[var(--accent)] font-semibold text-lg">
          <FaComments className="text-[var(--accent)]" />
          Chats
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-transparent">
          {chats?.length === 0 && (
            <p className="text-sm text-center mt-10 text-[var(--text-secondary)]">
              No chats yet.
            </p>
          )}
          {chats.map((chat) => (
            <div
              key={chat.contractId}
              className={`cursor-pointer px-4 py-3 flex items-center gap-3 rounded-lg mx-2 my-1 transition-all duration-300
                ${
                  selectedChat?.contractId === chat.contractId
                    ? "bg-[var(--accent)]/20 shadow-inner"
                    : "hover:bg-[var(--surface-hover)]"
                }`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-[var(--on-accent)] flex items-center justify-center font-bold">
                {chat.otherUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{chat.otherUser.name}</p>
                <p className="text-sm text-[var(--text-secondary)] truncate">
                  {chat.projectName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar (Mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex md:hidden"
          >
            <div className="w-72 bg-[var(--surface)]/90 backdrop-blur-xl border-r border-[var(--border)] flex flex-col">
              <div className="p-5 border-b border-[var(--border)] flex justify-between items-center">
                <span className="text-[var(--accent)] font-semibold text-lg">
                  Chats
                </span>
                <button
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  onClick={() => setSidebarOpen(false)}
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => (
                  <div
                    key={chat.contractId}
                    className={`cursor-pointer px-4 py-3 flex items-center gap-3 rounded-lg mx-2 my-1 transition-all duration-300
                      ${
                        selectedChat?.contractId === chat.contractId
                          ? "bg-[var(--accent)]/20 shadow-inner"
                          : "hover:bg-[var(--surface-hover)]"
                      }`}
                    onClick={() => {
                      setSelectedChat(chat);
                      setSidebarOpen(false);
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-[var(--on-accent)] flex items-center justify-center font-bold">
                      {chat.otherUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {chat.otherUser.name}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)] truncate">
                        {chat.projectName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="flex-1 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div className="flex-1 relative bg-[var(--surface)]/40 backdrop-blur-md">
        {/* Fixed chat container */}
        <div className="fixed h-screen right-0 left-0 flex flex-col bg-[var(--surface)]/40 backdrop-blur-md">
          {/* Top bar (mobile) */}
          <div className="md:hidden absolute top-4 right-3 z-30">
            <button
              className="p-2 rounded-full bg-[var(--surface)]/60 text-[var(--text-primary)] shadow hover:bg-[var(--surface-hover)] transition"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars />
            </button>
          </div>

          {/* Chat body */}
          <div className="flex-1 overflow-y-auto ">
            {selectedChat ? (
              <ChatComponent
                user={user}
                otherUser={selectedChat.otherUser}
                contractId={selectedChat.contractId}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">
                Select a chat to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
