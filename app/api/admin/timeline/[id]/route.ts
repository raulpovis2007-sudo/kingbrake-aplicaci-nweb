import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Debe iniciar sesión", status: 401 };
  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (user?.role !== "ADMIN") return { error: "Acceso denegado", status: 403 };
  return { success: true };
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = params;
  const body = await req.json();
  const { year, month, title, description, image, order, isActive } = body;

  const existing = await db.timelineMilestone.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Hito no encontrado" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title.trim();
  if (year !== undefined) data.year = Number(year);
  if (month !== undefined) data.month = month ? Number(month) : null;
  if (description !== undefined) data.description = description?.trim() || null;
  if (image !== undefined) data.image = image?.trim() || null;
  if (order !== undefined) data.order = Number(order);
  if (isActive !== undefined) data.isActive = Boolean(isActive);

  const updated = await db.timelineMilestone.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await verifyAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const existing = await db.timelineMilestone.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Hito no encontrado" }, { status: 404 });

  await db.timelineMilestone.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
