import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const brands = await db.vehicleBrand.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });
    return NextResponse.json(brands);
  } catch {
    return NextResponse.json({ error: "Error al obtener marcas" }, { status: 500 });
  }
}
