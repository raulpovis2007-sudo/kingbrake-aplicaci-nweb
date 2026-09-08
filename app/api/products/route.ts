import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const LINEA_TO_CATEGORIES: Record<string, string[]> = {
  "pastillas-de-freno": ["pastillas-ceramicadas", "pastillas-semimetalicas"],
  "zapatas": ["zapatas"],
  "discos-y-tambores": ["discos-de-freno", "tambores"],
  "sistema-hidraulico": ["componentes-hidraulicos"],
  "liquido-para-freno": ["liquido-de-frenos"],
};

export async function GET(req: NextRequest) {
  const lineaSlug = req.nextUrl.searchParams.get("linea");
  if (!lineaSlug) {
    return NextResponse.json({ error: "Parámetro linea requerido" }, { status: 400 });
  }

  const categorySlugs = LINEA_TO_CATEGORIES[lineaSlug];
  if (!categorySlugs) {
    return NextResponse.json({ error: "Línea inválida" }, { status: 400 });
  }

  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
        category: { slug: { in: categorySlugs } },
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
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}
