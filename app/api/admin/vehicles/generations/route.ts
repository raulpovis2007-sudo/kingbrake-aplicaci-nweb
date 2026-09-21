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

  const modelId = req.nextUrl.searchParams.get("modelId");
  const where = modelId ? { modelId } : {};

  const generations = await db.vehicleGeneration.findMany({
    where,
    orderBy: { name: "asc" },
    include: {
      model: { select: { id: true, name: true, brand: { select: { id: true, name: true } } } },
      _count: { select: { compatibility: true } },
    },
  });
  return NextResponse.json(generations);
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { name, modelId } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  if (!modelId) return NextResponse.json({ error: "Modelo requerido" }, { status: 400 });

  const gen = await db.vehicleGeneration.create({
    data: { name: name.trim(), modelId },
    include: {
      model: { select: { id: true, name: true, brand: { select: { id: true, name: true } } } },
      _count: { select: { compatibility: true } },
    },
  });
  return NextResponse.json(gen, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const auth = await verifyAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id, name } = await req.json();
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  if (!name?.trim()) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });

  const gen = await db.vehicleGeneration.update({
    where: { id },
    data: { name: name.trim() },
    include: {
      model: { select: { id: true, name: true, brand: { select: { id: true, name: true } } } },
      _count: { select: { compatibility: true } },
    },
  });
  return NextResponse.json(gen);
}

export async function DELETE(req: NextRequest) {
  const auth = await verifyAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  const compatCount = await db.productCompatibility.count({ where: { vehicleGenerationId: id } });
  if (compatCount > 0) return NextResponse.json({ error: `Esta generación está vinculada a ${compatCount} producto(s). Desvincula primero.` }, { status: 409 });

  await db.vehicleGeneration.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
