import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const distributors = await db.distributor.findMany({
      where: { isActive: true },
      select: { id: true, name: true, address: true, region: true, lat: true, lng: true, phone: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(distributors, {
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" },
    });
  } catch {
    return NextResponse.json({ error: "Error al obtener distribuidores" }, { status: 500 });
  }
}
