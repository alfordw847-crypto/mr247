"use client";

import Pagination from "@/components/PaginationComponents";
import SearchInput from "@/components/SearchInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PaginationMeta } from "@/lib/types/common";
import { fetcher } from "@/lib/utils";
import { TransactionWithUser } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function PendingOrdersList() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<"pending" | "approved">(
    "approved"
  );
  const searchParams = useSearchParams();
  const trnId = searchParams.get("trnId") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const router = useRouter();
  // You can now use these values in your SWR fetch:
  const { data, error, isLoading } = useSWR(
    `/api/transections?trnId=${trnId}&page=${page}&limit=${limit}`,
    fetcher
  );
  const transactions: TransactionWithUser[] = data?.data ?? [];
  const pagination: PaginationMeta = data?.pagination ?? [];

  const handleStatusUpdate = async (
    trn: TransactionWithUser,
    status: "pending" | "approved"
  ) => {
    setLoadingId(trn.id);
    try {
      const res = await fetch(`/api/transections/${trn.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await res.json();

      if (result.success) {
        toast.success(`Transaction ${status} successfully`);
        router.refresh();

        // mutate(
        //   "/api/transections",
        //   transactions.map((t) => (t.id === trn.id ? { ...t, status } : t)),
        //   false
        // );

        setOpenModalId(null);
      } else {
        toast.error(result.error || `Failed to ${status} transaction`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Unexpected error");
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) return <div>Loading transactions...</div>;
  if (error) return <div>Failed to load transactions</div>;

  return (
    <div className="space-y-8">
      <SearchInput searchParamKey="trnId" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {transactions.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-10">
            No transactions
          </div>
        )}
        {transactions.map((trn) => (
          <div
            key={trn.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            {trn?.purl && (
              <Dialog>
                <DialogTrigger asChild>
                  <img
                    src={trn.purl}
                    alt="Transaction Proof"
                    className="w-full h-60 object-cover cursor-pointer hover:opacity-90"
                  />
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 bg-transparent shadow-none border-0">
                  <img
                    src={trn.purl}
                    alt="Transaction Full"
                    className="w-full h-auto rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            )}

            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={trn?.user?.image || ""} />
                  <AvatarFallback>
                    {trn?.user?.name?.slice(0, 2)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{trn?.user?.name}</h2>
                  <p className="text-sm text-gray-500">{trn?.user?.email}</p>
                </div>
              </div>

              <div className="space-y-1 text-gray-700">
                {trn?.type === "deposit" && (
                  <p>Transaction ID: {trn?.trnId || "N/A"}</p>
                )}
                <p>
                  Type:{" "}
                  <span className="font-bold text-primary">
                    {trn?.type || "N/A"}
                  </span>{" "}
                </p>
                <p>Amount: {trn?.amount || 0} ৳</p>
                <p>Account Number: {trn?.number || "N/A"}</p>
                <p>Bank: {trn?.bankName || "N/A"}</p>
              </div>

              <div className="flex justify-between items-center mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm ${
                    trn.status === "pending"
                      ? "bg-yellow-500"
                      : trn.status === "approved"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {trn.status.charAt(0).toUpperCase() + trn.status.slice(1)}
                </span>

                <Dialog
                  open={openModalId === trn.id}
                  onOpenChange={(isOpen) => !isOpen && setOpenModalId(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      disabled={loadingId === trn.id}
                      onClick={() => setOpenModalId(trn.id)}
                    >
                      {loadingId === trn.id ? "Loading..." : "Update Status"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Update Transaction Status</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600 mb-4">
                      Select status for this transaction:
                    </p>
                    <div className="flex gap-2 mb-4">
                      {["approved", "pending"].map((status) => (
                        <Button
                          key={status}
                          variant={
                            selectedStatus === status ? "outline" : "soft"
                          }
                          onClick={() =>
                            setSelectedStatus(status as "pending" | "approved")
                          }
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Button>
                      ))}
                    </div>
                    <DialogFooter className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setOpenModalId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate(trn, selectedStatus)}
                        disabled={loadingId === trn.id}
                      >
                        {loadingId === trn.id ? "Updating..." : "Confirm"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ))}
      </div>
      {pagination && pagination?.total > pagination?.limit && (
        <nav className="mt-24" aria-label="Pagination navigation">
          <Pagination
            currentPage={pagination?.page}
            totalPages={pagination?.totalPages}
          />
        </nav>
      )}
    </div>
  );
}
