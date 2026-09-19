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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await verifyAdmin();
  if ("error" in authCheck) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { id } = params;
  const body = await req.json();
  const { name, description, detalle, price, sku, images, stock, featured, isActive, categoryId } = body;

  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};

  if (name !== undefined) {
    data.name = name.trim();
    data.slug = slugify(name);
    const slugConflict = await db.product.findFirst({
      where: { slug: data.slug as string, id: { not: id } },
    });
    if (slugConflict) {
      return NextResponse.json({ error: "Ya existe otro producto con ese nombre" }, { status: 409 });
    }
  }
  if (sku !== undefined) {
    const skuConflict = await db.product.findFirst({
      where: { sku: sku.trim(), id: { not: id } },
    });
    if (skuConflict) {
      return NextResponse.json({ error: "Ya existe otro producto con ese SKU" }, { status: 409 });
    }
    data.sku = sku.trim();
  }
  if (description !== undefined) data.description = description?.trim() || "";
  if (detalle !== undefined) data.detalle = detalle?.trim() || null;
  if (price !== undefined) data.price = parseFloat(price);
  if (images !== undefined) data.images = images;
  if (stock !== undefined) data.stock = parseInt(String(stock)) || 0;
  if (featured !== undefined) data.featured = featured;
  if (isActive !== undefined) data.isActive = isActive;
  if (categoryId !== undefined) data.categoryId = categoryId;

  const updated = await db.product.update({
    where: { id },
    data,
    include: { category: { select: { id: true, name: true } } },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await verifyAdmin();
  if ("error" in authCheck) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { id } = params;
  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  await db.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
