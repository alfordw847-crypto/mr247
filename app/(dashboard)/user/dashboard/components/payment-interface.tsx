// components/PaymentDialog.tsx
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
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const PaymentDialog = ({ pck }: { pck: Package }) => {
  const [isProcessing, startTransition] = useTransition();
  const { data: session } = useSession();
  const router = useRouter();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      userId: "", // initially empty
      packageId: pck.id,
      number: "",
      tranId: "",
      type: "bKash",
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

  const onSubmit = (data: OrderFormData) => {
    startTransition(async () => {
      try {
        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data), // send full form data
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
                bKash Send Money
              </h1>

              <div className="bg-pink-50 border border-pink-200 rounded-xl p-5 mb-8">
                <h2 className="text-lg font-semibold text-pink-700 mb-2">
                  Instructions:
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Open your bKash app or dial *247#</li>
                  <li>
                    Select <strong>Send Money</strong>
                  </li>
                  <li>
                    Enter our number: <strong>0137813575</strong>
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

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                label="Account Number"
                name="number"
                placeholder="Your bKash account number"
                control={form.control}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                label="Transaction Id"
                name="tranId"
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
