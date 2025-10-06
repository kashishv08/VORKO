"use client";

import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";
import { gqlClient } from "@/src/lib/service/gql";
import { GENERATE_TOKEN } from "@/src/lib/gql/mutation";
import { User } from "@prisma/client";
import { useTheme } from "../context/ThemeContext";

interface ChatComponentProps {
  user: User;
  otherUser: User;
  contractId: string;
}

export default function ChatComponent({
  user,
  otherUser,
  contractId,
}: ChatComponentProps) {
  const [channel, setChannel] = useState<any>(null);
  const { theme } = useTheme();

  const client = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!
  );

  useEffect(() => {
    const initChat = async () => {
      const data: { generateChatToken: { token: string } } =
        await gqlClient.request(GENERATE_TOKEN, { contractId });

      await client.connectUser(
        { id: user.id, name: user.name, image: user.avatar ?? undefined },
        data.generateChatToken.token
      );

      const ch = client.channel("messaging", contractId, {
        name: `Contract Chat`,
        members: [user.id, otherUser.id],
      });

      await ch.watch();
      setChannel(ch);
    };

    initChat();

    // Cleanup
    return () => {
      // call async disconnect but ignore the promise
      client.disconnectUser().catch((err) => console.error(err));
    };
  }, [user.id, contractId]);

  if (!channel) return <div>Loading chat...</div>;

  return (
    <Chat
      client={StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY!)}
      theme={`messaging ${theme}`}
    >
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
}
