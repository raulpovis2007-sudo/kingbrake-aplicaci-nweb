import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const DEFAULT_MESSAGE = "Estamos realizando mejoras en nuestro sitio. Volveremos pronto.";

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Debe iniciar sesión", status: 401 };
  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (user?.role !== "ADMIN") return { error: "Acceso denegado", status: 403 };
  return { success: true };
}

export async function GET() {
  const auth = await verifyAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const record = await db.pageContent.findUnique({ where: { key: "maintenance" } });
  const data = (record?.data as { enabled?: boolean; message?: string }) || {};
  return NextResponse.json({
    enabled: data.enabled === true,
    message: data.message || DEFAULT_MESSAGE,
  });
}

export async function PUT(req: NextRequest) {
  const auth = await verifyAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { enabled, message } = await req.json();

  const data = {
    enabled: Boolean(enabled),
    message: (message && message.trim()) || DEFAULT_MESSAGE,
  };

  await db.pageContent.upsert({
    where: { key: "maintenance" },
    update: { data },
    create: { key: "maintenance", data },
  });

  return NextResponse.json(data);
}
