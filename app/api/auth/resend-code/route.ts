import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateAndSendOTP } from "@/services/auth/auth.server";
import { rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Rate limit: 3 reenvíos por IP cada 15 minutos
  const blocked = await rateLimitResponse(req, "resend-code", 3, 15 * 60 * 1000);
  if (blocked) return blocked;

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email requerido." }, { status: 400 });
  }

  const GENERIC_MSG = "Si el correo está registrado, se ha enviado un nuevo código.";

  const user = await db.user.findUnique({ where: { email } });
  if (!user || user.emailVerified) {
    return NextResponse.json({ message: GENERIC_MSG });
  }

  await generateAndSendOTP(email, user.name);

  return NextResponse.json({ message: GENERIC_MSG });
}
