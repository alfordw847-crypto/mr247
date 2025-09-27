import { createSuccessResponse, errorResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";
import { BannerSchema } from "@/zod-validation/banner-zod";
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validateData = BannerSchema.parse(body);

    const pkg = await prisma.banner.create({
      data: {
        name: validateData.name,
        url: validateData?.url,
      },
    });

    return createSuccessResponse(pkg);
  } catch (error) {
    console.error("Package creation error:", error);
    return errorResponse(error);
  }
}

export async function GET(req: Request) {
  try {
    const banners = await prisma.banner.findMany({});

    // If you want to check if banners exist
    if (!banners || banners.length === 0) {
      return createSuccessResponse({
        data: [],
        message: "No banners found",
      });
    }

    return createSuccessResponse(banners);
  } catch (error) {
    console.error("Banner retrieval error:", error);
    return errorResponse(error);
  }
}
