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
    return { error: "Acceso denegado. Solo para administradores.", status: 403 };
  }
  return { success: true };
}

export async function GET() {
  const authCheck = await verifyAdmin();
  if ("error" in authCheck) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const distributors = await db.distributor.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(distributors);
  } catch (error) {
    console.error("Error obteniendo distribuidores:", error);
    return NextResponse.json({ error: "Error al obtener distribuidores" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authCheck = await verifyAdmin();
  if ("error" in authCheck) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const body = await req.json();
    const { name, address, region, lat, lng, phone, image } = body;

    if (!name?.trim() || !address?.trim()) {
      return NextResponse.json({ error: "Nombre y dirección son obligatorios" }, { status: 400 });
    }

    if (typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json({ error: "Coordenadas inválidas" }, { status: 400 });
    }

    const distributor = await db.distributor.create({
      data: {
        name,
        address,
        region: region || "Lima",
        lat,
        lng,
        phone: phone || null,
        image: image || null,
      },
    });

    return NextResponse.json(distributor, { status: 201 });
  } catch (error) {
    console.error("Error creando distribuidor:", error);
    return NextResponse.json({ error: "Error al crear el distribuidor" }, { status: 500 });
  }
}
