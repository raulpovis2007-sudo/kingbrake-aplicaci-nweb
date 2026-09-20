import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const vehicle = await db.userVehicle.findUnique({
    where: { userId: session.user.id },
    include: {
      vehicleModel: {
        include: { brand: { select: { id: true, name: true } } },
      },
    },
  });

  return NextResponse.json(vehicle);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { vehicleModelId, year } = body;

  if (!vehicleModelId || !year) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const vehicle = await db.userVehicle.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, vehicleModelId, year },
    update: { vehicleModelId, year },
    include: {
      vehicleModel: {
        include: { brand: { select: { id: true, name: true } } },
      },
    },
  });

  return NextResponse.json(vehicle);
}
