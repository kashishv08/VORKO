"use client";

import ChatComponent from "@/src/components/chat/ChatComponent";
import { useTheme } from "@/src/components/context/ThemeContext";
import { Button } from "@/src/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { CONTRACT_BY_ID } from "@/src/lib/gql/queries";
import { gqlClient } from "@/src/lib/service/gql";
import { User } from "@prisma/client";
import { Spinner } from "@radix-ui/themes";
import { CreditCard, MessageSquare, Star } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import { contract } from "../../../client/contract/page";

function UserAvatar({
  name,
  color = "bg-primary",
}: {
  name: string;
  color?: string;
}) {
  return (
    <div
      className={`w-14 h-14 rounded-full ${color} flex items-center justify-center text-white font-bold text-xl shadow-glow transition-transform duration-300 hover:scale-110`}
    >
      {name?.charAt(0)?.toUpperCase() || "U"}
    </div>
  );
}

export default function ContractDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [contract, setContract] = useState<contract>();
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (showChat) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showChat]);

  useEffect(() => {
    fetch("/api/currentUser")
      .then((res) => res.json())
      .then((data) => setCurrentUser(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchContract = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res: { contractById: contract } = await gqlClient.request(
          CONTRACT_BY_ID,
          { contractId: id }
        );
        setContract(res?.contractById);
      } catch {
        router.push("/contract");
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [id, router]);

  const formatDate = (date: number) =>
    new Date(Number(date)).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner size="3" />
      </div>
    );

  if (!contract)
    return (
      <div className="text-center mt-24 text-lg text-muted">
        Contract not found.
      </div>
    );

  const isActive = contract?.status === "ACTIVE";

  // console.log(contract);

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 transition-all duration-500">
      {/* Back Link */}
      <div className="mb-8 animate-fadeIn">
        <Link
          href="/client/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-highlight transition-colors duration-300"
        >
          <span className="text-xl leading-none">&larr;</span> Back to Dashboard
        </Link>
      </div>

      {/* Contract Card */}
      <div
        className="max-w-3xl mx-auto card p-8 shadow-xl transition-all duration-500 animate-fadeInUp"
        style={{ willChange: "transform" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <h1 className="text-3xl font-extrabold hero-gradient tracking-tight">
            {contract.project.title}
          </h1>
          <span
            className={`px-5 py-1.5 rounded-full text-sm font-semibold select-none ${
              isActive
                ? "bg-primary text-white shadow-glow"
                : "bg-surfaceGlass text-muted"
            }`}
          >
            {contract.status}
          </span>
        </div>

        {/* Users */}
        <div className="flex justify-between items-center flex-wrap gap-8 mb-10">
          <div className="flex items-center gap-4">
            <UserAvatar name={contract.client?.name || "C"} />
            <div>
              <div className="text-xs text-muted">Client</div>
              <div className="font-semibold text-lg">
                {contract.client?.name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <UserAvatar
              name={contract.freelancer?.name || "F"}
              color="bg-secondary"
            />
            <div>
              <div className="text-xs text-muted">Freelancer</div>
              <div className="font-semibold text-lg">
                {contract.freelancer?.name}
              </div>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="flex flex-wrap gap-12 items-center border-b border-border pb-6 mb-8">
          <div className="flex items-center gap-3 text-highlight">
            <FaDollarSign className="text-2xl" />
            <span className="text-xl font-bold text-foreground">
              ${contract.project.budget?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-3 text-highlight">
            <FaCalendarAlt className="text-2xl" />
            <span className="text-sm font-semibold text-foreground">
              {formatDate(Number(contract.createdAt))}
            </span>
          </div>
        </div>

        {/* Project Description */}
        <div>
          <h2 className="text-xl font-bold mb-3 text-primary">
            Project Description
          </h2>
          <p className="text-lg leading-relaxed text-muted">
            {contract.project.description}
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-3xl mx-auto mt-12 animate-fadeInUp delay-200">
        <Tabs defaultValue="messages" className="mb-6">
          <TabsList className="tabs-list p-2 flex rounded-xl shadow mb-10">
            {[
              { tab: "messages", label: "Messages", Icon: MessageSquare },
              { tab: "payments", label: "Payments", Icon: CreditCard },
              { tab: "review", label: "Review", Icon: Star },
            ].map(({ tab, label, Icon }) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="cursor-pointer tabs-trigger flex-1 py-3 font-semibold text-sm sm:text-base rounded-lg transition-transform duration-300 hover:scale-104"
              >
                <Icon className="inline-block mr-2 mb-1" size={18} />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <div className="rounded-2xl p-8 text-center bg-surface shadow transition-transform duration-300 hover:scale-[1.01]">
              <MessageSquare className="h-14 w-14 text-primary mb-5 mx-auto animate-bounce" />
              <p className="mb-5 text-muted text-lg">
                Communicate with your collaborator.
              </p>
              <Button
                className="button-gradient cursor-pointer"
                onClick={() => setShowChat(true)}
              >
                Open Messages
              </Button>
            </div>
          </TabsContent>

          {/* Chat Drawer */}
          {showChat && currentUser && (
            <div className="fixed inset-0 z-50 flex animate-fadeIn">
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40"
                onClick={() => setShowChat(false)}
              ></div>
              <div className="relative w-96 h-full z-50 bg-surface shadow-xl transition-transform transform translate-x-0 ml-auto rounded-l-3xl">
                <div className="p-3 flex justify-between items-center border-b border-border">
                  <h3 className="font-semibold text-lg text-foreground">
                    Chat
                  </h3>
                  <button
                    className="cursor-pointer text-muted hover:text-highlight text-3xl leading-none"
                    onClick={() => setShowChat(false)}
                  >
                    &times;
                  </button>
                </div>
                <div className="h-screen p-0 m-0">
                  <ChatComponent
                    user={currentUser}
                    otherUser={
                      currentUser.id === contract.clientId
                        ? contract.freelancer
                        : contract.client
                    }
                    contractId={contract.id}
                    projectName={contract.project.title}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          <TabsContent value="payments">
            <div className="rounded-2xl p-8 text-center bg-surface shadow transition-transform duration-300 hover:scale-[1.01]">
              <CreditCard className="h-14 w-14 text-primary mb-5 mx-auto animate-pulse" />
              <p className="mb-5 text-muted text-lg">
                Manage payment transactions securely.
              </p>
              <Button
                className="button-gradient"
                onClick={() =>
                  router.push(`/payments?contractId=${contract.id}`)
                }
              >
                View Payments
              </Button>
            </div>
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review">
            <div className="rounded-2xl p-8 text-center bg-surface shadow transition-transform duration-300 hover:scale-[1.01]">
              <Star className="h-14 w-14 text-primary mb-5 mx-auto animate-pulse" />
              <p className="mb-5 text-muted text-lg">
                Leave a review after project completion.
              </p>
              <Button
                className="button-gradient"
                onClick={() => router.push(`/review?contractId=${contract.id}`)}
              >
                Leave a Review
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
