import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { LINEAS_PRODUCTO } from "@/lib/lineas-producto";

const searchSchema = z.object({
  linea: z.string().min(1),
  brandId: z.string().min(1),
  modelId: z.string().min(1),
  year: z.number().int().min(1970).max(2030),
  categorySlug: z.string().min(1),
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
      { error: "Todos los filtros son obligatorios", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { linea, brandId, modelId, year, categorySlug } = parsed.data;

  const lineaData = LINEAS_PRODUCTO.find((l) => l.slug === linea);
  if (!lineaData) {
    return NextResponse.json({ error: "Línea de producto inválida" }, { status: 400 });
  }

  if (!lineaData.categorias.some((c) => c.slug === categorySlug)) {
    return NextResponse.json(
      { error: "Tipo de repuesto no corresponde a la línea seleccionada" },
      { status: 400 },
    );
  }

  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
        category: { slug: categorySlug },
        compatibility: {
          some: {
            vehicleModel: {
              id: modelId,
              brandId,
              yearFrom: { lte: year },
              yearTo: { gte: year },
            },
          },
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
