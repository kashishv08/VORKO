"use client";

import { GENERATE_TOKEN } from "@/src/lib/gql/mutation";
import { gqlClient } from "@/src/lib/service/gql";
import { User } from "@prisma/client";
import { Spinner } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { useTheme } from "../context/ThemeContext";

interface ChatComponentProps {
  user: User;
  otherUser: User;
  contractId: string;
  projectName: string;
}

const STREAM_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const client = StreamChat.getInstance(STREAM_KEY);

export default function ChatComponent({
  user,
  otherUser,
  contractId,
  projectName,
}: ChatComponentProps) {
  const [channel, setChannel] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const { theme } = useTheme();
  const mountedRef = useRef(true);

  // console.log(projectName);

  useEffect(() => {
    mountedRef.current = true;

    const initChat = async () => {
      try {
        // Connect user only if not already connected
        if (!client.user) {
          const data: { generateChatToken: { token: string } } =
            await gqlClient.request(GENERATE_TOKEN, { contractId });

          await client.connectUser(
            { id: user.id, name: user.name, image: user.avatar ?? undefined },
            data.generateChatToken.token
          );
        }

        const ch = client.channel("messaging", contractId, {
          name: `Contract Chat`,
          members: [user.id, otherUser.id],
        });

        await ch.watch();

        if (!mountedRef.current) return;

        setChannel(ch);
        setReady(true);
      } catch (err) {
        console.error("Error initializing chat:", err);
      }
    };

    initChat();

    return () => {
      mountedRef.current = false;
      if (channel) {
        channel.stopWatching().catch(console.error);
      }
      // Do NOT disconnect client immediately if other instances are using it
    };
  }, [user, otherUser, contractId]);

  if (!ready || !channel)
    return (
      <div className="flex justify-center items-center h-full text-[var(--text-secondary)]">
        <Spinner size="3" />
      </div>
    );

  return (
    // bg-[var(--surface)]/40
    <div className="flex flex-col h-full backdrop-blur-lg border-l border-[var(--border)] rounded-2xl shadow-glow overflow-hidden transition-all duration-300">
      <Chat client={client} theme={`messaging ${theme}`}>
        <Channel channel={channel}>
          <Window>
            {/* Custom Header */}

            <div className="h-[10%] w-full self-start px-4 py-3 border-b border-[var(--border)] bg-gradient-to-r from-[var(--accent)]/30 to-[var(--surface)]/60 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-[var(--on-accent)] flex items-center justify-center font-bold">
                  {otherUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {otherUser.name}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Chat for Project: {projectName}
                  </p>
                </div>
              </div>
            </div>

            {/* Message List */}
            <div className="h-[71%] p-0 overflow-auto">
              <div className="shadow-inner bg-[var(--surface)]/50 backdrop-blur-sm border border-[var(--border)] p-0 h-full">
                <MessageList />
              </div>
            </div>

            {/* Input Box */}
            <div className="self-end h-[9%] w-full border-t bg-[var(--surface)]/70  border border-[var(--accent)]/40 hover:border-[var(--accent)] transition-all duration-300">
              <MessageInput focus />
            </div>
          </Window>
        </Channel>
      </Chat>
    </div>
  );
}
