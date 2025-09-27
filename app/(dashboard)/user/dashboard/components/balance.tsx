"use client";

import bio from "@/public/icons/biao.png";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Balance() {
  const [data, setData] = useState<{
    totalEarnings: number;
    totalWithdrawals: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/balance/earning`,
          { cache: "no-store" }
        );
        const res = await response.json();
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl text-white">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-white/20 p-2 rounded-xl">
          <Image
            src={bio}
            alt="Balance Icon"
            width={28}
            height={28}
            className="w-7 h-7"
          />
        </div>
        <h1 className="text-lg font-semibold tracking-wide">Total Invest</h1>
      </div>

      {/* Balance Section */}
      {loading ? (
        <p className="text-center text-yellow-100">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/10 p-4 rounded-xl hover:bg-white/20 transition">
            <span className="block text-sm opacity-100 text-yellow-400">
              Total Earned
            </span>
            <span className="text-2xl font-bold text-yellow-100">
              {data?.totalEarnings ?? 0} ৳
            </span>
          </div>
          <div className="bg-white/10 p-4 rounded-xl hover:bg-white/20 transition">
            <span className="block text-sm opacity-80 text-yellow-400">
              Total Withdraw
            </span>
            <span className="text-2xl font-bold text-yellow-100">
              {data?.totalWithdrawals ?? 0} ৳
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
