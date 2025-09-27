// app/api/payment-requests/route.ts
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Create payment request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, amount, number, type } = body;

    if (!userId || !amount) {
      return NextResponse.json(
        { error: "userId and amount are required" },
        { status: 400 }
      );
    }

    const fee = amount * 0.1; // 10% fee
    const netAmount = amount - fee; // amount user will actually withdraw

    // Check balance before withdrawal
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalEarnings: true },
    });

    if (!user || user.totalEarnings < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Create payment request (net amount)
    const request = await prisma.paymentRequest.create({
      data: {
        userId,
        amount: netAmount,
        number,
        type,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        totalEarnings: {
          decrement: amount,
        },
        totalWithdrawals: {
          increment: amount,
        },
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: request,
      fee,
      netAmount,
    });
  } catch (error) {
    console.error("Error creating payment request:", error);
    return NextResponse.json(
      { error: "Failed to create payment request" },
      { status: 500 }
    );
  }
}

// Get all payment requests
export async function GET() {
  try {
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

    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error fetching payment requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment requests" },
      { status: 500 }
    );
  }
}
