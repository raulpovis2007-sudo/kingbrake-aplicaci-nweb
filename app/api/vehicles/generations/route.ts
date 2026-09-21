import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const modelId = req.nextUrl.searchParams.get("modelId");
  if (!modelId) {
    return NextResponse.json({ error: "modelId requerido" }, { status: 400 });
  }

  try {
    const generations = await db.vehicleGeneration.findMany({
      where: { modelId },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
    return NextResponse.json(generations);
  } catch {
    return NextResponse.json({ error: "Error al obtener generaciones" }, { status: 500 });
  }
}
