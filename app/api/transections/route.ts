import { errorResponse, successResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const pageNumber = Math.max(page, 1);
    const pageSize = Math.max(limit, 1);

    const skip = (pageNumber - 1) * pageSize;

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: {
          OR: [{ status: "pending" }, { pendingOrder: { gt: 0 } }],
        },
        include: {
          package: {
            select: {
              name: true,
              id: true,
              price: true,
              image: true,
            },
          },
          transaction: {
            select: {
              trnId: true,
              number: true,
              amount: true,
              type: true,
              purl: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              totalEarnings: true,
              totalWithdrawals: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({
        where: {
          OR: [{ status: "pending" }, { status: "paid" }],
        },
      }),
    ]);

    return successResponse(orders);
  } catch (error) {
    console.error("Package retrieval error:", error);
    return errorResponse(error);
  }
}
