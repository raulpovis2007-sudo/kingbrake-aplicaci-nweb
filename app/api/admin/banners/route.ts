import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { BannerType } from "@prisma/client";

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Debe iniciar sesión", status: 401 };
  }
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") {
    return { error: "Acceso denegado. Solo para administradores.", status: 403 };
  }
  return { success: true };
}

export async function GET(req: NextRequest) {
  const authCheck = await verifyAdmin();
  if ("error" in authCheck) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const type = req.nextUrl.searchParams.get("type") as BannerType | null;

    const banners = await db.banner.findMany({
      where: type ? { type } : undefined,
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Error obteniendo banners:", error);
    return NextResponse.json({ error: "Error al obtener los banners" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authCheck = await verifyAdmin();
  if ("error" in authCheck) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const body = await req.json();
    const { title, image, link, startDate, endDate, type } = body;

    if (!title?.trim() || !image?.trim()) {
      return NextResponse.json(
        { error: "Título e imagen son obligatorios" },
        { status: 400 }
      );
    }

    const validTypes: BannerType[] = ["BANNER", "EVENT"];
    const bannerType = validTypes.includes(type) ? type : "BANNER";

    const maxOrder = await db.banner.aggregate({
      where: { type: bannerType },
      _max: { sortOrder: true },
    });

    const banner = await db.banner.create({
      data: {
        title,
        image,
        link: link || null,
        type: bannerType,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("Error creando banner:", error);
    return NextResponse.json({ error: "Error al crear el banner" }, { status: 500 });
  }
}
