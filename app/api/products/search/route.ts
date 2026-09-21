import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const searchSchema = z.object({
  linea: z.string().min(1),
  brandId: z.string().min(1),
  modelId: z.string().min(1).optional(),
  generationId: z.string().min(1).optional(),
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

  const { linea, brandId, modelId, generationId } = parsed.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const genFilter: Record<string, any> = {
    model: { brand: { id: brandId } },
  };
  if (modelId) genFilter.model.id = modelId;
  if (generationId) genFilter.id = generationId;

  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
        category: { slug: linea },
        compatibility: {
          some: { vehicleGeneration: genFilter },
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
        featured: true,
        category: { select: { name: true, slug: true } },
        compatibility: {
          where: { vehicleGeneration: genFilter },
          select: {
            vehicleGeneration: {
              select: {
                name: true,
                model: {
                  select: {
                    name: true,
                    brand: { select: { name: true } },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    });

    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Error al buscar productos" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}
