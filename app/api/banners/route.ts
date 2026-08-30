import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { BannerType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    const type = req.nextUrl.searchParams.get("type") as BannerType | null;

    const banners = await db.banner.findMany({
      where: {
        isActive: true,
        ...(type && { type }),
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: { gte: now } },
        ],
      },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        title: true,
        image: true,
        link: true,
      },
    });

    return NextResponse.json(banners, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error obteniendo banners:", error);
    return NextResponse.json(
      { error: "Error al obtener los banners" },
      { status: 500 }
    );
  }
}
