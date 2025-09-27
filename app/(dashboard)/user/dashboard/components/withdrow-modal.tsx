// components/WithdrawalDialog.tsx
"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import withdraw from "@/public/icons/withdraw.png";
import { User } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

interface WithdrawalDialogProps {
  trigger?: React.ReactNode;
  user: User;
}
const now = new Date();
const hours = now.getHours();
const isWithinTime = hours >= 8 && hours < 22;
export default function WithdrawalDialog({ user }: WithdrawalDialogProps) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [number, setNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !type) return;

    // Withdrawal only allowed 8AM - 10PM
    const now = new Date();
    const hour = now.getHours();
    if (hour < 8 || hour >= 22) {
      alert("Withdrawals are only allowed between 8:00 AM - 10:00 PM.");
      return;
    }

    setIsProcessing(true);

    try {
      const withdrawalAmount = Number(amount);
      const fee = withdrawalAmount * 0.1;
      const finalAmount = withdrawalAmount - fee;

      const res = await fetch("/api/payment-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          amount: finalAmount,
          number,
          type,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create withdrawal request");
      }

      const data = await res.json();

      console.log("Withdrawal successful", data);

      alert(
        `Withdrawal Request Created!\nAmount: ${withdrawalAmount} ৳\nFee: ${fee.toFixed(
          2
        )} ৳\nYou’ll receive: ${finalAmount.toFixed(2)} ৳`
      );

      // Reset form
      setAmount("");
      setType("");
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while processing your withdrawal.");
    } finally {
      setIsProcessing(false);
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex group flex-col items-center text-center space-y-1  transition-all duration-300 hover:scale-105 active:scale-95 ">
          <div className="relative">
            <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-2xl shadow-inner">
              <Image
                src={withdraw}
                alt="Secure Deposit"
                width={48}
                height={48}
                className="transition-transform group-hover:scale-110"
              />
            </div>
          </div>
          <span className="text-gray-600    text-lg tracking-tight">
            Withdraw
          </span>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-2xl border-0 shadow-2xl bg-white h-[90vh]  ">
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
                  Secure Payment
                </DialogTitle>
                <DialogDescription className="text-white/80 text-sm">
                  Complete your transaction
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

        <div className="max-h-[90vh] overflow-y-auto">
          {/* Main Content */}
          <form onSubmit={handleWithdrawal} className="p-6 space-y-6">
            {/* Balance */}
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="text-sm text-blue-600 font-medium mb-1">
                Available Balance
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {user?.totalEarnings} ৳
              </div>
            </div>
            {/* Amount */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Withdrawal Amount
              </label>

              {/* Quick Amounts */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    type="button"
                    disabled={quickAmount > (user?.totalEarnings || 0)} // ✅ Disable only if button > balance
                    onClick={() => setAmount(quickAmount.toString())}
                    className={`p-2 text-sm font-medium rounded-lg border transition-all ${
                      amount === quickAmount.toString()
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                    } ${
                      quickAmount > (user?.totalEarnings || 0)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    ৳ {quickAmount.toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  disabled={(user?.totalEarnings || 0) < 400}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter withdrawal amount"
                  className="w-full px-4 py-3 text-lg rounded-xl border-2 border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  min="400"
                  max={user?.totalEarnings || 40000}
                  required
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                  BDT
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>Min: ৳400</span>
                <span>Max: ৳40,000</span>
              </div>
            </div>
            {/* Password */}
            {/* Payment Type */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Payment Method
              </label>
              <select
                value={type}
                disabled={(user?.totalEarnings || 0) < 400}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              >
                <option value="">Select a method</option>
                <option value="bkash">Bkash</option>
                <option value="nagad">Nagad</option>
                <option value="rocket">Rocket</option>
              </select>
              <input
                type="number"
                disabled={(user?.totalEarnings || 0) < 400}
                onChange={(e) => setNumber(e.target.value)}
                placeholder={`Enter ${type} number`}
                className="w-full px-4 py-3 text-lg rounded-xl border-2 border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
            {/* Fee Calculation */}
            {amount && (
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Withdrawal Amount:</span>
                    <span className="font-semibold">
                      ৳ {parseFloat(amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fee (10%):</span>
                    <span className="font-semibold text-red-600">
                      - ৳ {(parseFloat(amount) * 0.1).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Net Received:</span>
                    <span className="text-green-600">
                      ৳ {(parseFloat(amount) * 0.9).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {/* Promo */}

            {/* Submit */}
            {/* Submit */}
            <button
              type="submit"
              disabled={
                !amount ||
                !type ||
                isProcessing ||
                !isWithinTime ||
                (user?.totalEarnings || 0) < 400
              }
              className={`w-full py-4 font-semibold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
    ${
      !isWithinTime
        ? "bg-gray-400 cursor-not-allowed text-white"
        : "bg-gradient-to-r from-red-500 to-orange-600 text-white hover:from-red-600 hover:to-orange-700"
    }`}
            >
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : !isWithinTime ? (
                <>⏰ Withdrawals allowed 8:00 AM – 10:00 PM</>
              ) : (
                <>💰 Withdraw</>
              )}
            </button>
          </form>

          {/* Rules */}
          <div className="bg-gray-50 px-6 py-5 border-t border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              📋 Withdrawal Rules
            </h3>
            <ul className="space-y-2 text-xs text-gray-700">
              <li>• Withdrawal time: Mon–Fri, 10:00 AM – 5:00 PM</li>
              <li>• Minimum per transaction: ৳400</li>
              <li>• Maximum per transaction: ৳40,000</li>
              <li>• Fee: 10% will be deducted</li>
              <li>• Invalid info will cancel your request</li>
              <li>• Processing time: up to 24 hours</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center w-full">
            🔒 Secure SSL Encryption • Your information is protected
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
