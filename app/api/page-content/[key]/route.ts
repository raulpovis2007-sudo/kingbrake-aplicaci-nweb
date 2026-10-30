import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { key: string } }
) {
  const { key } = params;

  const content = await db.pageContent.findUnique({ where: { key } });
  if (!content) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json(content.data);
}
