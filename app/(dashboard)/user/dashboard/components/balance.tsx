"use client";

import bio from "@/public/icons/biao.png";
import Image from "next/image";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch balance");
    return res.json();
  });

export default function Balance() {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/balance/earning`,
    fetcher,
    {
      refreshInterval: 3000,
      revalidateOnFocus: true,
    }
  );

  const balance = data?.data;

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
      {isLoading ? (
        <p className="text-center text-yellow-100">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-300">Failed to load balance</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/10 p-4 rounded-xl hover:bg-white/20 transition">
            <span className="block text-sm opacity-100 text-yellow-400">
              Total Earned
            </span>
            <span className="text-2xl font-bold text-yellow-100">
              {250120 + balance?.totalEarnings} ৳
            </span>
          </div>
          <div className="bg-white/10 p-4 rounded-xl hover:bg-white/20 transition">
            <span className="block text-sm opacity-80 text-yellow-400">
              Total Withdraw
            </span>
            <span className="text-2xl font-bold text-yellow-100">
              {350300 + balance?.totalWithdrawals} ৳
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
