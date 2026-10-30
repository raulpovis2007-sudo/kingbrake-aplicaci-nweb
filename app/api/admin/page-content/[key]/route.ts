import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { key: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { key } = params;
  const data = await req.json();

  const content = await db.pageContent.upsert({
    where: { key },
    update: { data },
    create: { key, data },
  });

  return NextResponse.json(content.data);
}
