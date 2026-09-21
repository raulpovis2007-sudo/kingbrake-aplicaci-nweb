import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Debe iniciar sesión", status: 401 };
  }
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") {
    return { error: "Acceso denegado", status: 403 };
  }
  return { success: true };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const compatibilityInclude = {
  select: {
    vehicleGenerationId: true,
    vehicleGeneration: {
      select: {
        id: true,
        name: true,
        model: {
          select: {
            id: true,
            name: true,
            brand: { select: { id: true, name: true } },
          },
        },
      },
    },
    vehicleModelId: true,
    vehicleModel: {
      select: {
        id: true,
        name: true,
        brand: { select: { id: true, name: true } },
      },
    },
  },
} as const;

export async function GET() {
  const authCheck = await verifyAdmin();
  if ("error" in authCheck) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { id: true, name: true } },
      compatibility: compatibilityInclude,
    },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const authCheck = await verifyAdmin();
  if ("error" in authCheck) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const body = await req.json();
  const { name, description, sku, images, stock, featured, isActive, categoryId, compatibility } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }
  if (!sku?.trim()) {
    return NextResponse.json({ error: "El SKU es obligatorio" }, { status: 400 });
  }
  if (!categoryId) {
    return NextResponse.json({ error: "Debe seleccionar una categoría" }, { status: 400 });
  }

  const slug = slugify(name);

  const [slugExists, skuExists] = await Promise.all([
    db.product.findUnique({ where: { slug } }),
    db.product.findUnique({ where: { sku: sku.trim() } }),
  ]);

  if (slugExists) {
    return NextResponse.json({ error: "Ya existe un producto con ese nombre" }, { status: 409 });
  }
  if (skuExists) {
    return NextResponse.json({ error: "Ya existe un producto con ese SKU" }, { status: 409 });
  }

  // compatibility: array de { type: "generation", id } o { type: "model", id }
  const compatData = Array.isArray(compatibility)
    ? compatibility.map((c: { type: string; id: string }) =>
        c.type === "model"
          ? { vehicleModelId: c.id }
          : { vehicleGenerationId: c.id }
      )
    : [];

  const product = await db.product.create({
    data: {
      name: name.trim(),
      slug,
      description: description?.trim() || "",
      sku: sku.trim(),
      images: images || [],
      stock: parseInt(stock) || 0,
      featured: featured ?? false,
      isActive: isActive ?? true,
      categoryId,
      ...(compatData.length > 0
        ? { compatibility: { create: compatData } }
        : {}),
    },
    include: {
      category: { select: { id: true, name: true } },
      compatibility: compatibilityInclude,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
