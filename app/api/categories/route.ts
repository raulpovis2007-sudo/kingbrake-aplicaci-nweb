import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: { parentId: null },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        order: true,
        children: {
          select: { id: true, name: true, slug: true },
          orderBy: { order: "asc" },
        },
        _count: { select: { products: true } },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 });
  }
}
