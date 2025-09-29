// components/CompactProductCard.tsx
"use client";

import { TabsContent } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetcher } from "@/lib/utils";
import { OrderWithPackage } from "@/types";
import { Package } from "@prisma/client";
import { BarChart, TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { default as AdDialog } from "../add-watch-modal";

export default function CompactPackage() {
  const session = useSession();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const userId = session?.data?.user?.id;
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const {
    data: pcks,
    error,
    isLoading,
  } = useSWR(
    userId
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/orders?userId=${userId}`
      : null,
    fetcher,
    {
      refreshInterval: 100000,
    }
  );

  if (!userId) {
    return <div>Please login to view your contributed packages.</div>;
  }

  if (isLoading) {
    return <div></div>;
  }

  if (error) {
    return <div>Failed to load packages. Try again later.</div>;
  }
  const handleConfirmBuy = async () => {
    if (!selectedPackage) return;
    setLoadingId(selectedPackage.id);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.data?.user?.id,
          packageId: selectedPackage.id,
        }),
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Your package is now active!");
        router.refresh();
      } else {
        toast.error(result?.errors?.[0]?.message || "Something went wrong");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Unexpected error occurred");
    } finally {
      setLoadingId(null);
      setSelectedPackage(null); // close modal
    }
  };
  return (
    <TabsContent value="contributed">
      {pcks?.data?.data && (
        <div className="space-y-4">
          {pcks?.data?.data?.map((pck: OrderWithPackage) => (
            <div
              key={pck.id}
              className="
                rounded-3xl shadow-2xl border overflow-hidden transition-all duration-300
                bg-gradient-to-br from-gray-100 via-white to-gray-50 
                dark:from-gray-900 dark:via-slate-800 dark:to-gray-900
                border-gray-200 dark:border-gray-700
                hover:shadow-indigo-300/40 dark:hover:shadow-indigo-500/20
              "
            >
              {/* Product Image */}
              <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-800 dark:to-gray-900 p-5 flex flex-col md:flex-row gap-8 items-start">
                <div className="relative h-64 w-64 border rounded-md">
                  <Image
                    src={pck?.package?.image || ""}
                    alt={pck?.package?.name || "Package Image"}
                    fill
                    className="object-cover rounded-md p-2"
                  />
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 px-2 py-1 rounded-full text-xs font-bold shadow">
                    HOT
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {pck?.package?.name}
                  </h3>

                  <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Price : {pck?.package?.price} ৳
                  </p>

                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {pck?.package?.description}
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    {/* Buy Now Dialog */}
                    <Dialog
                      open={selectedPackage?.id === pck.package?.id}
                      onOpenChange={(isOpen) => {
                        if (!isOpen) setSelectedPackage(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <button
                          onClick={() => setSelectedPackage(pck.package)}
                          disabled={loadingId === pck.package?.id}
                          className="
        text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
        px-6 py-2 text-white w-full rounded-md transition-all duration-300 
        hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
      "
                        >
                          {loadingId === pck.package?.id
                            ? "Processing..."
                            : "Buy Now"}
                        </button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Purchase</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to buy{" "}
                            <strong>{pck.package?.name}</strong> for{" "}
                            {pck.package?.price} ৳?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedPackage(null)}
                            disabled={loadingId === pck.package?.id}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleConfirmBuy}
                            disabled={loadingId === pck.package?.id}
                          >
                            {loadingId === pck.package?.id
                              ? "Processing..."
                              : "Confirm"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AdDialog userId={userId} packageId={pck?.package?.id} />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="p-5">
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="rounded-xl p-3 text-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-700/50 dark:to-slate-800">
                    <BarChart className="w-4 h-4 mx-auto text-green-600 dark:text-green-400 mb-1" />
                    <p className="text-xs text-gray-700 dark:text-gray-400">
                      Daily Earned
                    </p>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      {pck?.package?.rewardPerAd * pck?.package.adLimit} ৳
                    </p>
                  </div>
                  <div className="rounded-xl p-3 text-center bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-slate-700/50 dark:to-slate-800">
                    <TrendingUp className="w-4 h-4 mx-auto text-indigo-600 dark:text-indigo-400 mb-1" />
                    <p className="text-xs text-gray-700 dark:text-gray-400">
                      Total Earned
                    </p>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      {pck?.package?.initialEarn + pck?.package?.totalEarnings}{" "}
                      ৳
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </TabsContent>
  );
}
