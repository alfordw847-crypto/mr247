// app/(admin)/payment-requests/page.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/db";
import UpdatePaymentStatusDialog from "./update-status";
export const dynamic = "force-dynamic";
export default async function PaymentRequestPage() {
  const requests = await prisma.paymentRequest.findMany({
    orderBy: { createdAt: "desc" },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          totalEarnings: true,
          totalDeposits: true,
          totalWithdrawals: true,
        },
      },
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payment Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">No payment requests found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>

                <TableHead>Withdraw Amount</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Balance</TableHead>
                <TableHead>Requested At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500">
                    No payment requests found.
                  </TableCell>
                </TableRow>
              )}

              {requests?.map((req) => (
                <TableRow key={req.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {req.user?.name}
                  </TableCell>
                  {/* <TableCell>{req.user?.email}</TableCell> */}
                  <TableCell className="font-semibold">
                    ${req.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100">
                      {req?.number || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100">
                      {req?.type || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        req.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : req.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : req.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {req.status}
                    </span>
                  </TableCell>
                  <TableCell>${req?.user?.totalEarnings.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(req.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <UpdatePaymentStatusDialog
                      requestId={req.id}
                      currentStatus={req.status}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
