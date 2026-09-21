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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await verifyAdmin();
  if ("error" in authCheck) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const { id } = await params;

    const existing = await db.distributor.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Distribuidor no encontrado" }, { status: 404 });
    }

    const body = await req.json();
    const { name, address, region, lat, lng, phone, image, isActive } = body;

    const updated = await db.distributor.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(address !== undefined && { address }),
        ...(region !== undefined && { region }),
        ...(lat !== undefined && { lat }),
        ...(lng !== undefined && { lng }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(image !== undefined && { image: image || null }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error actualizando distribuidor:", error);
    return NextResponse.json({ error: "Error al actualizar el distribuidor" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await verifyAdmin();
  if ("error" in authCheck) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const { id } = await params;

    const existing = await db.distributor.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Distribuidor no encontrado" }, { status: 404 });
    }

    await db.distributor.delete({ where: { id } });

    return NextResponse.json({ success: true, message: `Distribuidor "${existing.name}" eliminado` });
  } catch (error) {
    console.error("Error eliminando distribuidor:", error);
    return NextResponse.json({ error: "Error al eliminar el distribuidor" }, { status: 500 });
  }
}
