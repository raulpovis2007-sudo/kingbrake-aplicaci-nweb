import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const brandId = req.nextUrl.searchParams.get("brandId");
  if (!brandId) {
    return NextResponse.json({ error: "brandId requerido" }, { status: 400 });
  }

  try {
    const models = await db.vehicleModel.findMany({
      where: { brandId },
      orderBy: { name: "asc" },
      select: { id: true, name: true, yearFrom: true, yearTo: true },
    });
    return NextResponse.json(models);
  } catch {
    return NextResponse.json({ error: "Error al obtener modelos" }, { status: 500 });
  }
}
