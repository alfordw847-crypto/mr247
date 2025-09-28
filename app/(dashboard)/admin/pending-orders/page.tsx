"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

export default function PendingOrdersList() {
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // ✅ Fetch pending orders
  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders");
        if (!res.ok) throw new Error("Failed to fetch pending orders");
        const data = await res.json();
        setPendingOrders(data?.data?.data || []);
      } catch (err: any) {
        console.error(err);
        toast.error(
          err.message || "Something went wrong while fetching orders"
        );
      }
    };

    fetchPendingOrders();
  }, []);

  // ✅ Handle update status
  const handleStatusUpdate = async (order: any) => {
    if (!order?.user?.id || !order?.package?.id) {
      toast.error("User or package information is missing.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: order.user.id,
            packageId: order.package.id,
          }),
        });

        const data = await res.json();

        if (data.success) {
          toast.success("Status updated successfully");

          // ✅ Optimistic UI update
          setPendingOrders((prev) =>
            prev.map((o) =>
              o.id === order.id
                ? { ...o, status: "active", pendingOrder: 0 }
                : o
            )
          );

          router.refresh();
        } else {
          toast.error(data.errors[0].message || "Failed to update status");
        }
      } catch (error: any) {
        console.log({ error });
        toast.error(error.message || "Something went wrong");
      }
    });
  };
  console.log(pendingOrders);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {pendingOrders?.length === 0 && (
        <div className="col-span-full text-center text-gray-500 py-10">
          No pending orders
        </div>
      )}

      {pendingOrders.map((order) => {
        console.log(order);
        const transaction = order?.user?.transaction?.[0];
        return (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            {transaction?.purl && (
              <img
                src={transaction.purl}
                alt="Transaction Image"
                className="w-full h-60 object-cover"
              />
            )}

            <div className="p-4 space-y-3">
              {/* User info */}
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={order?.user?.image || ""} />
                  <AvatarFallback>
                    {order?.user?.name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{order?.user?.name}</h2>
                  <p className="text-sm text-gray-500">{order?.user?.email}</p>
                </div>
              </div>

              {/* Package info */}
              <div>
                <h3 className="font-semibold">
                  Package name: {order?.package?.name}
                </h3>
                <p className="text-gray-500">
                  Pending Orders:{" "}
                  <span className="font-bold">{order?.pendingOrder}</span>
                </p>
              </div>

              {/* Transaction info */}
              <div className="space-y-1 text-gray-700">
                <p>Transaction ID: {transaction?.trnId || "N/A"}</p>
                <p>Type: {transaction?.type || "N/A"}</p>
                <p>Amount: {transaction?.amount || 0} ৳</p>
                <p>Account Number: {transaction?.number || "N/A"}</p>
              </div>

              {/* Status + Action */}
              <div className="flex justify-between items-center mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm ${
                    order?.pendingOrder > 0 ? "bg-yellow-500" : "bg-green-500"
                  }`}
                >
                  {order?.pendingOrder > 0 ? "InActive" : "Active"}
                </span>

                <Button
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleStatusUpdate(order)}
                >
                  {isPending ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
