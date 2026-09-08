import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const searchSchema = z.object({
  linea: z.string().min(1),
  brandId: z.string().min(1),
  modelId: z.string().optional(),
  year: z.number().int().min(1970).max(2030).optional(),
});

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const parsed = searchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Filtros inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { brandId, modelId, year } = parsed.data;

  const vehicleFilter: Record<string, unknown> = { brandId };
  if (modelId) vehicleFilter.id = modelId;
  if (year) {
    vehicleFilter.yearFrom = { lte: year };
    vehicleFilter.yearTo = { gte: year };
  }

  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
        compatibility: {
          some: { vehicleModel: vehicleFilter },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        sku: true,
        images: true,
        category: { select: { name: true, slug: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Error al buscar productos" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}
