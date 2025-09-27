// components/CompactProductCard.tsx
"use client";

import { TabsContent } from "@/components/ui/tabs";
import productImage from "@/public/icons/product-price.png";
import { OrderWithPackage } from "@/types";
import { BarChart, TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { default as AdDialog } from "../add-watch-modal";
import PaymentDialog from "./payment-interface";

export default function CompactPackage({ pcks }: { pcks: OrderWithPackage[] }) {
  const [remaining, setRemaining] = useState(0);
  const session = useSession();
  if (!session?.data?.user?.id) {
    return <div>Please login to view your contributed packages.</div>;
  }

  return (
    <TabsContent value="contributed">
      <div className="space-y-4 ">
        {pcks && (
          <div>
            {pcks?.map((pck) => (
              <div
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
                  {/* Product Image */}
                  <div className="relative h-64 w-64">
                    <Image
                      src={productImage}
                      alt={pck?.package.name}
                      fill
                      className="object-cover rounded-md"
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

                    {/* Price */}

                    <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                      Price : {pck?.package?.price} ৳
                    </p>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {pck?.package?.description}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                      {/* Primary Button */}
                      <PaymentDialog pck={pck?.package} />
                      {/* Secondary Button */}
                      <AdDialog
                        userId={session.data?.user.id}
                        packageId={pck?.package?.id}
                        remaining={remaining}
                        setRemaining={setRemaining}
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Brand */}

                  {/* Extra Stats */}
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
                        {pck.package?.totalEarnings} ৳
                      </p>
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  {/* <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${remaining * 10}%` }}
                    />
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </TabsContent>
  );
}
