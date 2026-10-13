import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const milestones = await db.timelineMilestone.findMany({
      where: { isActive: true },
      orderBy: [{ year: "asc" }, { month: "asc" }, { order: "asc" }],
    });
    return NextResponse.json(milestones);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
