"use client";

import deposti from "@/public/icons/deposti.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
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
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  TransactionFormData,
  transactionSchema,
} from "@/zod-validation/transections";
import Image from "next/image";
import RefCodeBox from "../../profile/components/ref-code";

type MobileNumber = {
  id: string;
  number: string;
  type: "personal" | "agent";
  bankName: "bKash" | "Nagad" | "Rocket";
};

const PaymentDialog = () => {
  const [isProcessing, startTransition] = useTransition();
  const { data: session } = useSession();
  const router = useRouter();
  const [numbers, setNumbers] = useState<MobileNumber[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<MobileNumber | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      userId: "",
      type: "deposit",
      bankName: "",
      number: "",
      trnId: "",
      purl: "",
      amount: undefined,
      status: "pending",
    },
  });

  // Update userId after session loads
  useEffect(() => {
    if (session?.user?.id) {
      form.setValue("userId", session.user.id);
    }
  }, [session?.user?.id, form]);

  // Fetch mobile numbers
  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        const res = await fetch("/api/mobile-numbers");
        const data = await res.json();
        if (data?.data) setNumbers(data.data);
      } catch (err) {
        console.error("Failed to fetch numbers:", err);
      }
    };
    fetchNumbers();
  }, []);

  const onSubmit = (data: TransactionFormData) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/transections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();

        if (result.success) {
          form.reset();
          setSelectedNumber(null);
          toast.success("Transaction submitted successfully!");
          setOpen(false);
          router.refresh();
        } else {
          toast.error(result?.errors?.[0]?.message || "Something went wrong");
        }
      } catch (err: any) {
        console.log(err);
        toast.error(err?.message || "Unexpected error occurred");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex group flex-col items-center text-center space-y-1 transition-all duration-300 hover:scale-105 active:scale-95">
          <div className="relative">
            <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-2xl shadow-inner">
              <Image
                src={deposti}
                alt="Secure Deposit"
                width={48}
                height={48}
                className="transition-transform group-hover:scale-110"
              />
            </div>
          </div>
          <span className="text-gray-600 text-sm sm:text-base md:text-lg tracking-tight">
            Deposit
          </span>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-lg w-full h-[90vh] sm:h-auto sm:max-h-[90vh] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl bg-white">
        {/* Header */}
        <DialogHeader
          className={cn(
            "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 sm:px-6 py-4 sticky top-0 z-10"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl">💳</span>
              <div>
                <DialogTitle className="text-white text-base sm:text-lg md:text-xl font-bold">
                  Secure Payment
                </DialogTitle>
                <DialogDescription className="text-white/80 text-xs sm:text-sm">
                  Complete your transaction
                </DialogDescription>
              </div>
            </div>
            <DialogClose asChild>
              <button className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors">
                ✕
              </button>
            </DialogClose>
          </div>
        </DialogHeader>

        {/* Body */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-10 h-[80vh] sm:h-auto overflow-y-auto"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-pink-600 mb-4 sm:mb-6">
              {selectedNumber?.bankName || "Select Bank"}
            </h1>

            {/* Bank selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Account
              </label>
              <select
                className="w-full border rounded-lg p-2 text-sm sm:text-base"
                onChange={(e) => {
                  const num =
                    numbers.find((n) => n.id === e.target.value) || null;
                  setSelectedNumber(num);
                  if (num) {
                    form.setValue("bankName", num.bankName);
                  }
                }}
              >
                <option value="">Select Number</option>
                {numbers.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.bankName} ({n.type}) - {n.number}
                  </option>
                ))}
              </select>
            </div>

            {/* Instructions */}
            {selectedNumber && (
              <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 sm:p-5 mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-pink-700 mb-2">
                  Instructions:
                </h2>
                <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-700">
                  <li>
                    Open your {selectedNumber.bankName} app
                    {selectedNumber.bankName === "bKash" && " (*247#)"}
                  </li>
                  <li>
                    Select{" "}
                    <strong>
                      {selectedNumber.type === "agent"
                        ? "Cash Out"
                        : "Send Money"}
                    </strong>
                  </li>
                  <li>
                    Enter our number:{" "}
                    <RefCodeBox refCode={selectedNumber.number} />
                  </li>
                  <li>Enter your amount</li>
                  <li>Enter your PIN & confirm</li>
                  <li>
                    Copy the <strong>Transaction ID</strong> and paste below
                  </li>
                </ol>
              </div>
            )}

            {/* Fields */}
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              label="Your Account Number"
              name="number"
              placeholder="Enter your account number"
              control={form.control}
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              label="Amount"
              name="amount"
              type="number"
              placeholder="Enter your payment amount"
              control={form.control}
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              label="Transaction Id"
              name="trnId"
              placeholder="Enter payment transaction ID"
              control={form.control}
            />
            <CustomFormField
              fieldType={FormFieldType.FILE_UPLOAD}
              label="Upload Screenshot"
              file
              name="purl"
              placeholder="Upload transaction screenshot"
              control={form.control}
            />

            {/* Footer */}
            <DialogFooter className="p-3 sm:p-4 md:px-6 bg-gray-50 border-t sticky bottom-0 z-10 gap-2">
              <button
                type="submit"
                disabled={isProcessing}
                className={cn(
                  "w-full bg-gradient-to-r p-3 sm:p-4 from-indigo-600 to-purple-600 text-white rounded-xl font-semibold",
                  "hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500",
                  "transition-all active:scale-95 min-h-[45px] sm:min-h-[50px]",
                  "text-sm sm:text-base md:text-lg"
                )}
              >
                {isProcessing ? "Processing..." : "Confirm Payment"}
              </button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
