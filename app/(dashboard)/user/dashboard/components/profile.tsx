// components/UserProfile.tsx
"use client";

import LogoutButton from "@/components/logout";
import { UserWithEverything } from "@/types";
import {
  Award,
  CreditCard,
  Settings,
  Shield,
  Star,
  User as UserIcon,
  Users,
} from "lucide-react";
import ProfileUpdateDialog from "../../profile/components/profile-update";
import RefCodeBox from "../../profile/components/ref-code";
import PaymentDialog from "./payment-interface";
import WithdrawalDialog from "./withdrow-modal";
type UserWithCount = UserWithEverything & {
  count: number;
};
interface UserProfileProps {
  user: UserWithCount;
  userStart: any;
}

export default function UserProfile({ user, userStart }: UserProfileProps) {
  const handleUpdate = async (data: any) => {
    // 🔹 Call your API route to update user
    const res = await fetch(`/api/users/${user?.email}`, {
      method: "POST",
      body: JSON.stringify({ ...data, id: user.id }),
    });
    if (!res.ok) throw new Error("Failed to update profile");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 p-4">
      <div className="max-w-4xl mx-auto mb-28">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6 border border-gray-100">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center">
                  <UserIcon className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  Online
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 px-6 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {user?.name}
                </h1>
                {/* <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {profileData.supportText}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {profileData.level}
                  </span>
                </div> */}
                <p className="text-gray-600">
                  Member since{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>

              <LogoutButton className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="w-8 h-8 opacity-80" />
              <Shield className="w-5 h-5 opacity-70" />
            </div>
            <p className="text-green-100 text-sm mb-1">Total Earning</p>
            <h3 className="text-2xl font-bold mb-2">{user?.totalEarnings} ৳</h3>
            <p className="text-blue-100 text-lg font-bold mb-2">
              Total deposit : {user?.totalDeposits} ৳
            </p>
          </div>

          {/* Members Card */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5 opacity-70" />
            </div>
            <p className="text-blue-100 text-sm mb-1">Team Members</p>
            <h3 className="text-2xl font-bold mb-2">{user?.count}</h3>
            <p className="text-blue-100 text-lg font-bold mb-2">
              Referral Earn : {user?.refBonusEarned} ৳
            </p>
          </div>

          {/* Earnings Card */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 opacity-80" />
              <Star className="w-5 h-5 opacity-70" />
            </div>
            <p className="text-purple-100 text-sm mb-1">Total Withdraw</p>
            <h3 className="text-2xl font-bold mb-2">
              {user?.totalWithdrawals} ৳
            </h3>
            <p className="text-blue-100 text-lg font-bold mb-2">
              {" "}
              Pending Amount : {user?.pendingAmount || 0} ৳
            </p>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Card */}

          {/* Performance Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Performance Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-bold text-green-500">
                  {userStart?.successRate}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed Tasks</span>
                <span className="font-bold text-blue-500">
                  {userStart?.completedTasks} Tasks
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Level</span>
                <span className="font-bold text-amber-500">
                  {userStart?.level}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-500" />
              Quick Actions
            </h3>
            <div className="flex flex-col justify-start items-start gap-3">
              <div className="flex items-center gap-4">
                {" "}
                <PaymentDialog />
                <WithdrawalDialog user={user} />
              </div>
              {/* <TeamPage /> */}
              <div>
                <p>Referral and earn 100 ৳</p>
                <RefCodeBox refCode={user?.refCode!} />
              </div>
              <div className="p-3 bg-orange-50 hover:bg-orange-100 rounded-xl text-orange-700 font-medium transition-colors">
                <ProfileUpdateDialog user={user} onUpdate={handleUpdate} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mt-6 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Transaction History
          </h3>

          {user?.transaction && user.transaction.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {user.transaction.map((tx) => (
                <li
                  key={tx.id}
                  className="flex flex-wrap items-center justify-between py-3 px-4 gap-2"
                >
                  <>
                    <p className="text-sm font-medium text-gray-900">
                      {tx.type === "deposit" ? "Deposit" : "Withdrawal"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString("en-US")} •{" "}
                      {new Date(tx.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </>
                  <p
                    className={`text-sm font-semibold ${
                      tx.type === "deposit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "deposit" ? "+" : "-"}${tx.amount}
                  </p>

                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      tx.status === "pending"
                        ? "bg-yellow-500"
                        : tx.status === "approved"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <UserIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for trending up icon
function TrendingUp({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  );
}
