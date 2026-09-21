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

export async function GET(req: NextRequest) {
  const auth = await verifyAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const brandId = req.nextUrl.searchParams.get("brandId");
  const where = brandId ? { brandId } : {};

  const models = await db.vehicleModel.findMany({
    where,
    orderBy: { name: "asc" },
    include: {
      brand: { select: { id: true, name: true } },
      _count: { select: { generations: true } },
    },
  });
  return NextResponse.json(models);
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { name, brandId } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  if (!brandId) return NextResponse.json({ error: "Marca requerida" }, { status: 400 });

  const exists = await db.vehicleModel.findFirst({ where: { brandId, name: name.trim() } });
  if (exists) return NextResponse.json({ error: "Ya existe ese modelo para esta marca" }, { status: 409 });

  const model = await db.vehicleModel.create({
    data: { name: name.trim(), brandId },
    include: {
      brand: { select: { id: true, name: true } },
      _count: { select: { generations: true } },
    },
  });
  return NextResponse.json(model, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const auth = await verifyAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id, name } = await req.json();
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  if (!name?.trim()) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });

  const model = await db.vehicleModel.update({
    where: { id },
    data: { name: name.trim() },
    include: {
      brand: { select: { id: true, name: true } },
      _count: { select: { generations: true } },
    },
  });
  return NextResponse.json(model);
}

export async function DELETE(req: NextRequest) {
  const auth = await verifyAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  const genCount = await db.vehicleGeneration.count({ where: { modelId: id } });
  if (genCount > 0) return NextResponse.json({ error: "Elimina las generaciones primero" }, { status: 409 });

  await db.vehicleModel.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
