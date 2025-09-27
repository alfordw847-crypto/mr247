"use client";

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
import { OrderFormData, OrderSchema } from "@/zod-validation/orderSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import RefCodeBox from "../../profile/components/ref-code";

type MobileNumber = {
  id: string;
  number: string;
  type: "personal" | "agent";
  bankName: "bKash" | "Nagad" | "Rocket";
};

const PaymentDialog = ({ pck }: { pck: Package }) => {
  const [isProcessing, startTransition] = useTransition();
  const { data: session } = useSession();
  const router = useRouter();
  const [numbers, setNumbers] = useState<MobileNumber[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<MobileNumber | null>(
    null
  );

  const form = useForm<OrderFormData>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      userId: "",
      packageId: pck.id,
      number: "",
      tranId: "",
      type: "bKash",
      purl: "",
      amount: pck.price,
      status: "pending",
    },
  });

  // ✅ update userId after session loads
  useEffect(() => {
    if (session?.user?.id) {
      form.setValue("userId", session.user.id);
    }
  }, [session?.user?.id, form]);

  // ✅ fetch mobile numbers
  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        const res = await fetch("/api/mobile-numbers");
        const data = await res.json();
        if (data?.data) {
          setNumbers(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch numbers:", err);
      }
    };
    fetchNumbers();
  }, []);

  const onSubmit = (data: OrderFormData) => {
    startTransition(async () => {
      try {
        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const res = await orderResponse.json();
        if (res.success) {
          toast.success("Your order is pending. Please wait for confirmation.");
          router.refresh();
        } else {
          toast.error(res?.errors?.[0]?.message || "Something went wrong");
        }
      } catch (error: any) {
        toast.error(error?.message || "Unexpected error");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex-1 font-semibold py-2 rounded-md text-center cursor-pointer bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 text-white shadow-md">
          Buy Now
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-2xl border-0 shadow-2xl bg-white h-[90vh]">
        <DialogHeader
          className={cn(
            "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-4 md:px-6 md:py-5",
            "sticky top-0 z-10"
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
                ✕
              </button>
            </DialogClose>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="max-w-lg mx-auto px-6 py-10 h-[80vh] overflow-y-auto">
              <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">
                {selectedNumber?.bankName || "Select Bank"}
              </h1>

              {/* ✅ Number selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Account
                </label>

                <select
                  className="w-full border rounded-lg p-2"
                  onChange={(e) => {
                    const num = numbers.find((n) => n.id === e.target.value);
                    setSelectedNumber(num || null);
                  }}
                >
                  <option value="">Select Number </option>
                  {numbers.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.bankName} ({n.type}) - {n.number}
                    </option>
                  ))}
                </select>
              </div>

              {/* ✅ Instructions */}
              {selectedNumber && (
                <div className="bg-pink-50 border border-pink-200 rounded-xl p-5 mb-8">
                  <h2 className="text-lg font-semibold text-pink-700 mb-2">
                    Instructions:
                  </h2>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
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
                      <strong>
                        {" "}
                        <RefCodeBox refCode={selectedNumber.number} />
                      </strong>
                    </li>
                    <li>
                      Enter <strong>{pck?.price}</strong> amount
                    </li>
                    <li>Enter your PIN & confirm</li>
                    <li>
                      Copy the <strong>Transaction ID</strong> and paste below
                    </li>
                  </ol>
                </div>
              )}

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                label="Your Account Number"
                name="number"
                placeholder="Enter your account number"
                control={form.control}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                label="Transaction Id"
                name="tranId"
                placeholder="Enter payment transaction ID"
                control={form.control}
              />
              <CustomFormField
                fieldType={FormFieldType.FILE_UPLOAD}
                label="Upload Screenshot"
                name="purl"
                placeholder="Enter payment transaction ID"
                control={form.control}
              />

              <DialogFooter className="p-4 md:px-6 bg-gray-50 border-t flex flex-col sticky bottom-0 z-10">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={cn(
                    "w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold",
                    "hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500",
                    "transition-all active:scale-95 min-h-[50px]",
                    "text-base md:text-lg"
                  )}
                >
                  {isProcessing ? "Processing..." : "Confirm Payment"}
                </button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
