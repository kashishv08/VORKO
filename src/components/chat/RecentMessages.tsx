"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gqlClient } from "@/src/lib/service/gql";
import { RECENT_CHAT } from "@/src/lib/gql/queries";

type ChatMessage = {
  id: string;
  text: string;
  userName: string;
  createdAt: string;
};

type RecentMessagesProps = {
  onData?: (hasData: boolean) => void;
};

export default function RecentMessages({ onData }: RecentMessagesProps) {
  const [recentChats, setRecentChats] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Get current logged-in user
        const res = await fetch("/api/currentUser");
        const user = await res.json();

        if (!user?.id) {
          console.warn("No authenticated user found");
          setLoading(false);
          return;
        }

        // Step 2: Call your GraphQL query
        const data: {
          getRecentMessages: {
            contractId: string;
            projectName: string;
            otherUser: { name: string };
            lastMessageId?: string;
            lastMessageText?: string;
            lastMessageSender?: string;
            lastMessageCreatedAt?: string;
          }[];
        } = await gqlClient.request(RECENT_CHAT, { userId: user.id });

        const chats = data?.getRecentMessages || [];

        // Step 3: Map messages to display format
        const formatted = chats
          .filter((chat) => chat.lastMessageText)
          .map((chat) => ({
            id: chat.lastMessageId || chat.contractId,
            text: chat.lastMessageText || "",
            userName:
              chat.lastMessageSender || chat.otherUser?.name || "Unknown",
            createdAt: chat.lastMessageCreatedAt || new Date().toISOString(),
          }))
          .sort(
            (a: ChatMessage, b: ChatMessage) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5); // only show top 5

        setRecentChats(formatted);
        if (onData) onData(formatted.length > 0);
      } catch (error) {
        console.error("Error loading recent messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onData]);

  if (loading)
    return <p className="text-sm text-gray-500">Loading recent chats...</p>;

  return (
    <div className="flex flex-col gap-4">
      {recentChats.length > 0 ? (
        recentChats.map((msg) => (
          <motion.div
            key={msg.id}
            whileHover={{ x: 4 }}
            className="flex items-center gap-3"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-medium"
              style={{
                background: "rgba(31,125,83,0.15)",
                color: "var(--primary)",
              }}
            >
              {msg.userName[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-medium text-sm">{msg.userName}</p>
              <p className="text-xs text-muted truncate w-48">{msg.text}</p>
            </div>
          </motion.div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No recent messages</p>
      )}
    </div>
  );
}
