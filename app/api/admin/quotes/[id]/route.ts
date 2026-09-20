import { NextResponse } from "next/server";
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json();
  const { status, adminNote } = body;

  const data: Record<string, unknown> = {};
  if (status) data.status = status;
  if (adminNote !== undefined) data.adminNote = adminNote;

  const quote = await db.quote.update({
    where: { id: params.id },
    data,
    include: {
      user: { select: { name: true, email: true, phone: true } },
    },
  });

  return NextResponse.json(quote);
}
