import { AppError } from "@/lib/actions/actions-error-response";
import { createSuccessResponse, errorResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";
import { OrderSchema } from "@/zod-validation/orderSchema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validateData = OrderSchema.parse(body);

    // check if order exists for user + package
    let order = await prisma.order.findFirst({
      where: {
        userId: validateData.userId,
        packageId: validateData.packageId,
      },
    });

    if (order) {
      if (order?.pendingOrder > 0) {
        throw new AppError(
          "Your order is pending wait 6 hours form confirmation!",
          401
        );
      }
      // update existing order
      order = await prisma.order.update({
        where: { id: order.id },
        data: {
          pendingOrder: 1,
        },
      });
    } else {
      // create new order
      order = await prisma.order.create({
        data: {
          userId: validateData.userId,
          packageId: validateData.packageId,
          status: "pending",
          pendingOrder: 1,
        },
      });
    }
    await prisma.transaction.create({
      data: {
        orderId: order?.id,
        amount: validateData.amount,
        status: "pending",
        number: validateData?.number,
        trnId: validateData?.tranId,
        type: validateData?.type,
      },
    });

    return createSuccessResponse({ order });
  } catch (error) {
    console.error("Package creation error:", error);
    return errorResponse(error);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const userId = searchParams.get("userId") || "";

    if (!userId) {
      throw new AppError("Unauthorized user");
    }

    const pageNumber = Math.max(page, 1);
    const pageSize = Math.max(limit, 1);

    const skip = (pageNumber - 1) * pageSize;

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: { status: "paid", userId },
        include: { package: true },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({
        where: { status: "paid" },
      }),
    ]);

    return createSuccessResponse({
      data: orders,
      pagination: {
        total: totalCount,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error("Package retrieval error:", error);
    return errorResponse(error);
  }
}

//*****************************************Automatic payment *************************** */
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const validateData = OrderSchema.parse(body);

//     // check if order exists for user + package
//     let order = await prisma.order.findFirst({
//       where: {
//         userId: validateData.userId,
//         packageId: validateData.packageId,
//       },
//     });

//     if (order) {
//       // update existing order
//       order = await prisma.order.update({
//         where: { id: order.id },
//         data: {
//           numOfPur: (order.numOfPur ?? 0) + 1,
//         },
//       });
//     } else {
//       // create new order
//       order = await prisma.order.create({
//         data: {
//           userId: validateData.userId,
//           packageId: validateData.packageId,
//           status: "paid",
//           numOfPur: 1,
//         },
//       });
//     }
//     const user = await prisma.user.findUnique({
//       where: { id: validateData?.userId },
//     });

//     if (user?.referredBy) {
//       // Find the referrer by refCode
//       const referrer = await prisma.user.findUnique({
//         where: { refCode: user.referredBy },
//       });

//       if (referrer) {
//         // Check if bonus already rewarded for this referred user
//         const existingReferral = await prisma.referral.findFirst({
//           where: { referrerId: referrer.id, referredId: user.id },
//         });

//         if (!existingReferral) {
//           const bonusAmount = 100; // define your bonus

//           // Create referral record and reward
//           await prisma.referral.create({
//             data: {
//               referrerId: referrer.id,
//               referredId: user.id,
//               bonus: bonusAmount,
//               rewarded: true,
//             },
//           });

//           // Increment referrer's earnings
//           await prisma.user.update({
//             where: { id: referrer.id },
//             data: {
//               totalEarnings: { increment: bonusAmount },
//               refBonusEarned: { increment: bonusAmount },
//             },
//           });
//         }
//       }
//     }
//     const maxAdLimit = order?.numOfPur * 5;
//     // ✅ ensure adView exists or reset
//     let adView = await prisma.adView.findFirst({
//       where: {
//         userId: validateData.userId,
//         packageId: validateData.packageId,
//       },
//     });

//     if (!adView) {
//       adView = await prisma.adView.create({
//         data: {
//           userId: validateData.userId,
//           packageId: validateData.packageId,
//           viewAd: 0,
//           maxViewAdd: maxAdLimit,
//         },
//       });
//     } else {
//       adView = await prisma.adView.update({
//         where: { id: adView.id },
//         data: {
//           viewAd: 0,
//           maxViewAdd: maxAdLimit,
//           createdAt: new Date(),
//         },
//       });
//     }

//     return createSuccessResponse({ order });
//   } catch (error) {
//     console.error("Package creation error:", error);
//     return errorResponse(error);
//   }
// }
