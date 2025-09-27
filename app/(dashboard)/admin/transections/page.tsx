"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

export default function PendingOrdersList() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [status, setStatus] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchPendingOrder = async () => {
      try {
        const res = await fetch("/api/transections");
        const data = await res.json();
        setPendingOrders(data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPendingOrder();
  }, []);

  const handleStatusUpdate = async (order: any) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: selectedOrder?.user?.id,
            packageId: selectedOrder?.package?.id,
          }),
        });
        const data = await res.json();
        router.refresh();
        if (data.success) {
          toast.success("Status updated successfully");
        } else {
          toast.error(data.message || "Failed to update status");
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {pendingOrders.length === 0 && (
        <div className="col-span-full text-center text-gray-500 py-10">
          No pending orders
        </div>
      )}

      {pendingOrders.map((order) => {
        const transaction = order.transaction?.[0]; // take first transaction
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

              <div>
                <h3 className="font-semibold">
                  Package name: {order?.package?.name}
                </h3>

                <p className="text-gray-500">
                  Pending Orders:{" "}
                  <span className="font-bold">{order?.pendingOrder}</span>
                </p>
              </div>

              <div className="space-y-1 text-gray-700">
                <p>Transaction ID: {transaction?.trnId}</p>
                <p>Type: {transaction?.type}</p>
                <p>Amount: {transaction?.amount} ৳</p>
                <p>Account Number: {transaction?.number}</p>
              </div>

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
                  onClick={() => {
                    setSelectedOrder(order);
                    setStatus(order?.status);
                    handleStatusUpdate(order);
                  }}
                >
                  Update Status
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
