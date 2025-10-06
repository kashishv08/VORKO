"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { gqlClient } from "@/src/lib/service/gql";
import { Spinner } from "@radix-ui/themes";
import { FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import { CONTRACT_BY_ID } from "@/src/lib/gql/queries";
import { contract } from "../page";
import { MessageSquare, Star, CreditCard } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import ChatComponent from "../../../chat/page";

function UserAvatar({
  name,
  color = "bg-green-600",
}: {
  name: string;
  color?: string;
}) {
  return (
    <div
      className={`w-10 h-10 rounded-full ${color} flex items-center justify-center font-bold text-white text-lg`}
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

  const formatDate = (deadline: number) => {
    if (!deadline) return "-";
    return new Date(Number(deadline)).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="3" />
      </div>
    );

  if (!contract)
    return (
      <div className="text-center mt-24 text-lg text-gray-500">
        Contract not found.
      </div>
    );

  const isActive = contract?.status === "ACTIVE";
  console.log(contract);

  return (
    <div className="min-h-screen py-8 px-3 bg-background text-foreground">
      <div className="mb-4">
        <Link
          href="/client/dashboard"
          className="text-gray-400 hover:text-green-500 font-medium flex items-center text-sm"
        >
          <span className="mr-1">&larr;</span> Back to Dashboard
        </Link>
      </div>

      <div className="w-full max-w-2xl mx-auto rounded-2xl p-8 mb-8 shadow-lg bg-card/90 border border-transparent dark:border-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-white">
            {contract.project.title}
          </span>
          <span className="bg-green-700/80 text-white text-xs font-semibold px-4 py-1 rounded ml-3">
            {contract.status}
          </span>
        </div>

        <div className="flex justify-between items-center flex-wrap mt-5 mb-6 gap-6">
          <div className="flex items-center gap-3">
            <UserAvatar name={contract.client?.name || "C"} />
            <div>
              <div className="text-xs text-gray-400">Client</div>
              <div className="text-white font-semibold text-base">
                {contract.client?.name}
              </div>
            </div>
          </div>
          {/* Freelancer */}
          <div className="flex items-center gap-3">
            <UserAvatar name={contract.freelancer?.name || "F"} />
            <div>
              <div className="text-xs text-gray-400">Freelancer</div>
              <div className="text-white font-semibold text-base">
                {contract.freelancer?.name}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-10 items-center text-white border-b border-gray-700 pb-5 mb-4">
          <div className="flex items-center gap-2">
            <FaDollarSign className="text-green-400" />
            <span className="text-lg font-extrabold">
              {contract.project.budget?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-green-400" />
            <span className="text-xs font-semibold">
              {formatDate(Number(contract.createdAt))}
            </span>
          </div>
        </div>

        <div className="mb-2">
          <div className="font-bold text-white mb-1">Project Description</div>
          <div className="text-gray-300 text-base">
            {contract.project.description}
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto">
        <Tabs defaultValue="messages" className="mb-4">
          <TabsList className="flex bg-[#1e242f] rounded-md overflow-hidden mb-4 shadow-inner border border-gray-700">
            <TabsTrigger
              value="messages"
              className="flex-1 py-3 font-semibold text-sm sm:text-base text-white data-[state=active]:bg-[#263a27] data-[state=active]:text-green-400"
            >
              <MessageSquare className="inline-block mr-2 mb-1" size={18} />
              Messages
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="flex-1 py-3 font-semibold text-sm sm:text-base text-white data-[state=active]:bg-[#263a27] data-[state=active]:text-green-400"
            >
              <CreditCard className="inline-block mr-2 mb-1" size={18} />
              Payments
            </TabsTrigger>
            <TabsTrigger
              value="review"
              className="flex-1 py-3 font-semibold text-sm sm:text-base text-white data-[state=active]:bg-[#263a27] data-[state=active]:text-green-400"
            >
              <Star className="inline-block mr-2 mb-1" size={18} />
              Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages">
            <div className="rounded-2xl bg-card/90 p-8 shadow-md text-center">
              <MessageSquare className="h-12 w-12 text-green-400 mb-4 mx-auto" />
              <div className="mb-3 text-gray-400 text-lg">
                Go to messages to communicate
              </div>
              <Link
                href={`/chat/${contract.id}`}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold w-48 mx-auto"
              >
                Open Messages
              </Link>

              {isActive && (
                <Button
                  variant="outline"
                  className="mt-4 border border-red-500 text-red-600 hover:bg-red-50 w-48 mx-auto font-semibold"
                  onClick={() => {
                    // Cancel contract logic here
                  }}
                >
                  Cancel Contract
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="rounded-2xl bg-card/90 p-8 shadow-md text-center">
              <CreditCard className="h-12 w-12 text-green-400 mb-4 mx-auto" />
              <div className="mb-3 text-gray-400 text-lg">
                Manage all payment transactions here
              </div>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold w-48 mx-auto"
                onClick={() =>
                  router.push(`/payments?contractId=${contract.id}`)
                }
              >
                View Payments
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="review">
            <div className="rounded-2xl bg-card/90 p-8 shadow-md text-center">
              <Star className="h-12 w-12 text-green-400 mb-4 mx-auto" />
              <div className="mb-3 text-gray-400 text-lg">
                Complete the project to leave a review
              </div>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold w-48 mx-auto"
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
