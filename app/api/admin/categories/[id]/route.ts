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
  const { name, description, icon, order, parentId } = body;

  const existing = await db.category.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (name !== undefined) {
    data.name = name.trim();
    data.slug = slugify(name);
    const slugConflict = await db.category.findFirst({
      where: { slug: data.slug as string, id: { not: id } },
    });
    if (slugConflict) {
      return NextResponse.json({ error: "Ya existe otra categoría con ese nombre" }, { status: 409 });
    }
  }
  if (description !== undefined) data.description = description?.trim() || null;
  if (icon !== undefined) data.icon = icon?.trim() || null;
  if (order !== undefined) data.order = order;
  if (parentId !== undefined) data.parentId = parentId || null;

  const updated = await db.category.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await verifyAdmin();
  if ("error" in authCheck) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { id } = params;
  const existing = await db.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true, children: true } } },
  });

  if (!existing) {
    return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
  }

  if (existing._count.children > 0) {
    return NextResponse.json(
      { error: `No se puede eliminar: tiene ${existing._count.children} subcategoría(s)` },
      { status: 400 }
    );
  }

  if (existing._count.products > 0) {
    return NextResponse.json(
      { error: `No se puede eliminar: tiene ${existing._count.products} producto(s) asociado(s)` },
      { status: 400 }
    );
  }

  await db.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
