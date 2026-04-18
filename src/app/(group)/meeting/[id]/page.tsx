"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  CallingState,
  useCallStateHooks,
  User,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import { toast } from "sonner";
import { useTheme } from "@/src/components/context/ThemeContext";
import { useUser } from "@clerk/nextjs";
import { Spinner } from "@radix-ui/themes";

export default function MeetingPage() {
  const { id: contractId } = useParams();
  const { theme } = useTheme();
  const u = useUser();
  const router = useRouter();

  const [tokenData, setTokenData] = useState<{
    token: string;
    apiKey: string;
    userId: string;
    streamMeetingId: string;
  } | null>(null);

  // const [client, setClient] = useState<StreamVideoClient | null>(null);
  // const [call, setCall] = useState<ReturnType<
  //   StreamVideoClient["call"]
  // > | null>(null);

  // Fetch token
  useEffect(() => {
    if (!contractId) return;

    const fetchToken = async () => {
      try {
        const res = await fetch("/api/stream/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contractId }),
        });

        if (!res.ok) throw new Error("Failed to fetch Stream token");

        const data = await res.json();
        setTokenData({
          ...data,
          streamMeetingId: contractId,
        });
      } catch (err) {
        console.error(err);
        toast("Failed to fetch Stream token");
      }
    };

    fetchToken();
  }, [contractId]);

  const client = useMemo(() => {
    if (!tokenData) return null;
    return new StreamVideoClient({
      apiKey: tokenData.apiKey,
      user: { id: tokenData.userId } as User,
      token: tokenData.token,
    });
  }, [tokenData]);

  const call = useMemo(() => {
    if (!client || !tokenData) return null;
    return client.call("default", tokenData.streamMeetingId);
  }, [client, tokenData]);

  useEffect(() => {
    if (!call) return;

    const joinCall = async () => {
      try {
        await call.join(); // ❌ no { create: true } unless call doesn’t exist
      } catch (err: any) {
        console.error("Failed to join call:", err);
        if (err.name === "NotReadableError") {
          toast("Camera/microphone already in use");
        } else if (err.name === "NotAllowedError") {
          toast("Please allow camera/microphone access");
        } else {
          toast("Failed to join call");
        }
      }
    };

    joinCall();

    // Cleanup: leave the call when component unmounts
    return () => {
      call.leave().catch(() => {});
    };
  }, [call]);

  const handleLeaveCall = async () => {
    if (!call) return;

    try {
      await call.leave();
    } catch (err) {
      console.error(err);
    }

    const role = String(u.user?.unsafeMetadata?.role).toLowerCase();
    router.push(`/${role}/contract/${contractId}`);
  };

  if (!tokenData || !client || !call)
    return (
      <div className="flex items-center justify-center h-full text-muted gap-3">
        <Spinner size={"3"} />
        Loading meeting...
      </div>
    );

  return (
    <div className="mt-[20px] w-full bg-background">
      <StreamVideo client={client}>
        <StreamTheme as="main" className={theme}>
          <StreamCall call={call}>
            <MeetingUI handleLeaveCall={handleLeaveCall} />
          </StreamCall>
        </StreamTheme>
      </StreamVideo>
    </div>
  );
}

const MeetingUI = ({ handleLeaveCall }: { handleLeaveCall: () => void }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex items-center justify-center h-full text-muted gap-3">
        <Spinner size={"3"} />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-surface p-2">
      <div className="flex-1">
        <SpeakerLayout participantsBarPosition="bottom" />
      </div>
      <div className="mt-2 flex justify-center items-center space-x-2">
        <CallControls onLeave={handleLeaveCall} />
      </div>
    </div>
  );
};
