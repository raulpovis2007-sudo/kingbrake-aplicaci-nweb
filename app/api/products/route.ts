import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const lineaSlug = req.nextUrl.searchParams.get("linea");
  if (!lineaSlug) {
    return NextResponse.json({ error: "Parámetro linea requerido" }, { status: 400 });
  }

  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
        OR: [
          { category: { slug: lineaSlug } },
          { category: { parent: { slug: lineaSlug } } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        images: true,
        featured: true,
        category: { select: { name: true, slug: true } },
      },
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    });

    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}
