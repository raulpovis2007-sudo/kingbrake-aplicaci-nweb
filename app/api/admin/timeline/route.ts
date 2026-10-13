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

export async function GET() {
  const auth = await verifyAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const milestones = await db.timelineMilestone.findMany({
    orderBy: [{ year: "asc" }, { month: "asc" }, { order: "asc" }],
  });
  return NextResponse.json(milestones);
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json();
  const { year, month, title, description, image } = body;

  if (!title?.trim() || !year) {
    return NextResponse.json({ error: "Título y año son obligatorios" }, { status: 400 });
  }

  if (month !== undefined && month !== null && (month < 1 || month > 12)) {
    return NextResponse.json({ error: "Mes debe ser entre 1 y 12" }, { status: 400 });
  }

  const maxOrder = await db.timelineMilestone.aggregate({ _max: { order: true } });

  const milestone = await db.timelineMilestone.create({
    data: {
      year: Number(year),
      month: month ? Number(month) : null,
      title: title.trim(),
      description: description?.trim() || null,
      image: image?.trim() || null,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  return NextResponse.json(milestone, { status: 201 });
}
