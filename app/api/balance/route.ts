// app/api/balance/route.ts
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("user-id");
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalEarnings: true, totalDeposits: true },
  });

  return NextResponse.json({ balance: user?.totalEarnings || 0 });
}
