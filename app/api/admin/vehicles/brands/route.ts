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

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function GET() {
  const auth = await verifyAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const brands = await db.vehicleBrand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { models: true } } },
  });
  return NextResponse.json(brands);
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });

  const slug = slugify(name);
  const exists = await db.vehicleBrand.findFirst({ where: { OR: [{ name: name.trim() }, { slug }] } });
  if (exists) return NextResponse.json({ error: "Ya existe una marca con ese nombre" }, { status: 409 });

  const brand = await db.vehicleBrand.create({
    data: { name: name.trim(), slug },
    include: { _count: { select: { models: true } } },
  });
  return NextResponse.json(brand, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const auth = await verifyAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  const modelCount = await db.vehicleModel.count({ where: { brandId: id } });
  if (modelCount > 0) return NextResponse.json({ error: "Elimina los modelos primero" }, { status: 409 });

  await db.vehicleBrand.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
