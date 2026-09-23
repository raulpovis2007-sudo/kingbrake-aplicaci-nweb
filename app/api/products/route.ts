import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const categoriaSlug = req.nextUrl.searchParams.get("categoria");
  if (!categoriaSlug) {
    return NextResponse.json({ error: "Parámetro categoria requerido" }, { status: 400 });
  }

  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
        OR: [
          { category: { slug: categoriaSlug } },
          { category: { parent: { slug: categoriaSlug } } },
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
