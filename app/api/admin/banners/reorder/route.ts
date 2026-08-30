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

export async function PATCH(req: NextRequest) {
  const authCheck = await verifyAdmin();
  if ("error" in authCheck) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const { orderedIds } = await req.json();

    if (!orderedIds || !Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: "Se requiere un array 'orderedIds'" },
        { status: 400 }
      );
    }

    await Promise.all(
      orderedIds.map((id: string, index: number) =>
        db.banner.update({ where: { id }, data: { sortOrder: index } })
      )
    );

    const banners = await db.banner.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json({ success: true, banners });
  } catch (error) {
    console.error("Error reordenando banners:", error);
    return NextResponse.json({ error: "Error al reordenar los banners" }, { status: 500 });
  }
}
