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
import { useUser } from "@clerk/nextjs";
import { Spinner } from "@radix-ui/themes";
import { ArrowLeft, Video, Shield, Info, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MeetingPage() {
  const { id: contractId } = useParams();
  const u = useUser();
  const router = useRouter();

  const [tokenData, setTokenData] = useState<{
    token: string;
    apiKey: string;
    userId: string;
    streamMeetingId: string;
  } | null>(null);

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
        toast.error("Failed to establish secure meeting connection.");
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
        await call.join();
      } catch (err: unknown) {
        console.error("Failed to join call:", err);
        const error = err as Error;
        if (error.name === "NotReadableError") {
          toast.error("Camera or microphone is already in use by another app.");
        } else if (error.name === "NotAllowedError") {
          toast.error("Lancify needs camera/mic access to proceed with the meeting.");
        } else {
          toast.error("Connection failed. Please refresh and try again.");
        }
      }
    };
    joinCall();
    return () => {
      call.leave().catch(() => { });
    };
  }, [call]);

  const handleLeaveCall = async () => {
    if (!call) return;
    try {
      await call.leave();
    } catch (err) {
      console.error(err);
    }
    const role = String(u.user?.publicMetadata?.role || "").toLowerCase();
    router.push(`/${role}/contract/${contractId}`);
  };

  if (!tokenData || !client || !call)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6 animate-pulse">
          <Video size={40} />
        </div>
        <p className="text-xl font-bold tracking-tight mb-2">Establishing Secure Connection</p>
        <div className="flex items-center gap-3 text-slate-400 font-medium">
          <Spinner size="2" />
          <span>Verifying workspace credentials...</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-10">
      <div className="px-6 md:px-12 flex items-center justify-between mb-8 z-10">
        <div className="flex items-center gap-4">
          <button onClick={handleLeaveCall} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white leading-none mb-1">Collaboration Room</h1>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Shield size={12} className="text-emerald-500" />
              End-to-End Encrypted Workspace
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-sm font-bold text-slate-300">
            <Activity size={14} className="text-primary" />
            HD Streaming Enabled
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 italic">
            <Info size={14} />
            Auto-recording is disabled per privacy settings
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 md:px-8 pb-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full h-full max-w-7xl mx-auto bg-slate-900 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col relative"
        >
          <StreamVideo client={client}>
            <StreamTheme as="main" className="h-full flex flex-col">
              <StreamCall call={call}>
                <MeetingUI handleLeaveCall={handleLeaveCall} />
              </StreamCall>
            </StreamTheme>
          </StreamVideo>

          {/* Visual Watermark */}
          <div className="absolute bottom-10 left-10 pointer-events-none opacity-20">
            <h2 className="text-2xl font-black text-white italic tracking-tighter">Lancify</h2>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const MeetingUI = ({ handleLeaveCall }: { handleLeaveCall: () => void }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
        <Spinner size={"3"} />
        <span className="font-bold tracking-widest text-xs uppercase">Joining Workspace...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative">
      <div className="flex-1 p-4 md:p-8">
        <SpeakerLayout participantsBarPosition="bottom" />
      </div>
      <div className="p-8 flex justify-center items-center bg-gradient-to-t from-slate-950/80 to-transparent">
        <div className="bg-slate-800/80 backdrop-blur-xl p-4 rounded-[2rem] border border-white/10 shadow-2xl">
          <CallControls onLeave={handleLeaveCall} />
        </div>
      </div>
    </div>
  );
};
