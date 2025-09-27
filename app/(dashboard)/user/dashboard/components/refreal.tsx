// app/team/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import refral from "@/public/icons/refral.png";
import { Copy, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function TeamPage() {
  const [open, setOpen] = useState(false);

  const referralCode = "OKU1MT";
  const referralLink = "https://ggee.pro/DnxeBq";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex group flex-col items-center text-center space-y-1 transition-all duration-300 hover:scale-105 active:scale-95  ">
          <div className="relative">
            <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-2xl shadow-inner">
              <Image
                src={refral}
                alt="Withdraw"
                width={48}
                height={48}
                className="transition-transform group-hover:scale-110"
              />
            </div>
          </div>
          <span className="text-gray-600 text-lg tracking-tight">Referral</span>
        </div>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="max-w-md w-full bg-white p-0 overflow-hidden rounded-2xl border-0 shadow-2xl h-[90vh] flex flex-col">
        {/* Header */}
        <DialogHeader
          className={cn(
            "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-5",
            "sticky top-0 z-10" // Sticky header for mobile scrolling
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">💳</span>
              <div>
                <DialogTitle className="text-white text-lg md:text-xl font-bold">
                  Referral Program
                </DialogTitle>
                <DialogDescription className="text-white/80 text-sm">
                  Invite your friends and earn rewards!
                </DialogDescription>
              </div>
            </div>
            <DialogClose asChild>
              <button className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </DialogClose>
          </div>
        </DialogHeader>

        {/* Scrollable Section */}
        <div className="flex-1 overflow-y-auto px-2 pb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-50 rounded-xl">
                <Users className="w-6 h-6 text-red-500" />
              </div>
              <span className="text-sm font-medium text-gray-500">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              10 Members
            </h3>
            <p className="text-gray-600 text-sm">Team Members</p>
            <div className="mt-3 flex items-center gap-1 text-red-500 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>0% this month</span>
            </div>
          </div>

          {/* Total Earnings Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border mt-2 border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 flex items-center justify-center text-green-500  bg-green-50 rounded-xl">
                ৳
              </div>
              <span className="text-sm font-medium text-gray-500">
                Earnings
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              BDT 4000.00
            </h3>
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <div className="mt-3 flex items-center gap-1 text-green-500 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>BDT 0.00 today</span>
            </div>
          </div>
          {/* Team Levels */}
          {/* <div className="mt-6 space-y-4">
            {[
              { title: "Team 1", bonus: "5%" },
              { title: "Team 2", bonus: "3%" },
              { title: "Team 3", bonus: "2%" },
            ].map((team, i) => (
              <Card key={i} className="bg-white/90 text-black rounded-xl">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold">{team.title}</p>
                    <p className="text-sm">0 Members</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">BDT0.00</p>
                    <p className="text-xs text-gray-500">
                      Bonus ({team.bonus})
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div> */}

          {/* Referral Section */}
          <Card className="mt-6 bg-white/90 text-black">
            <CardHeader>
              <CardTitle className="text-lg">Referral Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="font-bold">{referralCode}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(referralCode)}
                >
                  <Copy className="w-4 h-4 mr-1" /> Copy
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-600">{referralLink}</p>
            </CardContent>
          </Card>

          {/* Commission Rules */}
          <Card className="mt-8 bg-white/90 text-black">
            <CardHeader>
              <CardTitle className="text-lg">Team Commission Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                Level A referrals earn you 5% commission.
              </p>
              <p className="text-sm">
                Level B referrals earn you 3% commission.
              </p>
              <p className="text-sm">
                Level C referrals earn you 2% commission.
              </p>

              {/* Example image/diagram */}
            </CardContent>
          </Card>

          {/* Bonus Breakdown */}
          <Card className="mt-6 bg-white/90 text-black">
            <CardHeader>
              <CardTitle className="text-lg">Bonus Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                This is your invitation reward, and bonuses are provided based
                on the activity of your downline members. The more people you
                invite, the higher your earning potential.
              </p>

              <p className="text-xs text-gray-600 mt-2">
                Example: For BDT 20,000 sales you earn 1% bonus, for BDT 60,000
                you earn 2%, and so on.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
