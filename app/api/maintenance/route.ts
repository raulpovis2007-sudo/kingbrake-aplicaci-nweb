import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const DEFAULT_MESSAGE = "Estamos realizando mejoras en nuestro sitio. Volveremos pronto.";

export async function GET() {
  try {
    const record = await db.pageContent.findUnique({ where: { key: "maintenance" } });
    const data = (record?.data as { enabled?: boolean; message?: string }) || {};
    return NextResponse.json({
      enabled: data.enabled === true,
      message: data.message || DEFAULT_MESSAGE,
    });
  } catch {
    return NextResponse.json({ enabled: false, message: DEFAULT_MESSAGE });
  }
}
