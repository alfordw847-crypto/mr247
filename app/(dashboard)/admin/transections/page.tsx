"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

export default function PendingOrdersList() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [status, setStatus] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [pendingOrder, setPendingOrder] = useState([]);
  useEffect(() => {
    const fetchPendingOrder = async () => {
      const res = await fetch("/api/transections");
      const data = await res.json();
      setPendingOrder(data?.data);
    };
    fetchPendingOrder();
  }, []);
  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;

    startTransition(async () => {
      try {
        const res = await fetch(`/api/orders/${selectedOrder.id}`, {
          method: "PUT", // or PATCH
          headers: {
            "Content-Type": "application/json",
          },
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
    <div>
      <Table className="min-w-full whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Pending Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>TranId</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Account Number</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {pendingOrder && pendingOrder.length > 0 ? (
            pendingOrder.map((order: any) => (
              <TableRow key={order.id} className="hover:bg-muted">
                <TableCell>
                  <div className="flex gap-3 items-center">
                    <Avatar>
                      <AvatarImage src={order?.user?.image || ""} />
                      <AvatarFallback>
                        {order?.user?.name?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{order?.user?.name}</span>
                  </div>
                </TableCell>

                <TableCell>{order?.package?.name}</TableCell>
                <TableCell>{order?.package?.price}</TableCell>
                <TableCell>{order?.pendingOrder}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      order?.pendingOrder > 0 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                  >
                    {order?.pendingOrder > 0 ? "InActive" : "Active"}
                  </span>
                </TableCell>
                <TableCell>{order?.Transaction[0]?.amount}</TableCell>
                <TableCell>{order?.Transaction[0]?.trnId}</TableCell>
                <TableCell>{order?.Transaction[0]?.type}</TableCell>
                <TableCell>{order?.Transaction[0]?.number}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setStatus(order.status);
                        }}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Status</DialogTitle>
                        <DialogDescription>
                          Update order status for <b>{order?.user?.name}</b>.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="py-4">
                        <Select
                          value={status}
                          onValueChange={(val) => setStatus(val)}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder="Select status"
                              defaultValue="InActive"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inactive">InActive</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <DialogFooter>
                        <Button
                          disabled={isPending}
                          onClick={handleStatusUpdate}
                          className="w-full"
                        >
                          {isPending ? "Updating..." : "Update Status"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center py-6 text-gray-500"
              >
                No pending orders
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
