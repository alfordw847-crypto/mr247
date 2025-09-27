import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Find the payment request
    const paymentRequest = await prisma.paymentRequest.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!paymentRequest) {
      return NextResponse.json(
        { error: "Payment request not found" },
        { status: 404 }
      );
    }

    // Update user balance if approved
    if (status === "approved") {
      await prisma.user.update({
        where: { id: paymentRequest.userId },
        data: {
          totalWithdrawals: { increment: paymentRequest.amount },
          totalEarnings: { decrement: paymentRequest.amount },
          updatedAt: new Date(),
        },
      });
    }

    // Update payment request status
    const updatedRequest = await prisma.paymentRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updatedRequest });
  } catch (error) {
    console.error("Error updating payment request:", error);
    return NextResponse.json(
      { error: "Failed to update payment request" },
      { status: 500 }
    );
  }
}
