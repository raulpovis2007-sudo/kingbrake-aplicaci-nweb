import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const now = new Date();

  const [expiredTokens, expiredSessions] = await Promise.all([
    db.verificationToken.deleteMany({ where: { expires: { lt: now } } }),
    db.session.deleteMany({ where: { expires: { lt: now } } }),
  ]);

  return NextResponse.json({
    cleaned: {
      expiredTokens: expiredTokens.count,
      expiredSessions: expiredSessions.count,
    },
  });
}
