import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { rateLimitResponse } from "@/lib/rate-limit";
import { validatePasswordStrength } from "@/lib/password";

/**
 * Hashea el token recibido por URL con SHA-256 para compararlo
 * contra el hash almacenado en BD (nunca se guarda el token en texto plano).
 */
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(req: Request) {
  // Rate limit: 5 intentos por IP cada 15 minutos
  const blocked = await rateLimitResponse(req, "reset-password", 5, 15 * 60 * 1000);
  if (blocked) return blocked;

  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ error: "Datos incompletos." }, { status: 400 });
  }

  const pwCheck = validatePasswordStrength(password);
  if (!pwCheck.isValid) {
    return NextResponse.json({ error: pwCheck.errors[0] }, { status: 400 });
  }

  // Hashear el token recibido para buscarlo en BD (donde solo existe el hash)
  const hashedToken = hashToken(token);

  // Buscar por el hash del token, no por el token en texto plano
  const record = await db.verificationToken.findUnique({
    where: { token: hashedToken },
  });

  if (!record || !record.identifier.startsWith("reset:")) {
    return NextResponse.json({ error: "El enlace no es válido." }, { status: 400 });
  }

  if (record.expires < new Date()) {
    await db.verificationToken.delete({ where: { token: hashedToken } });
    return NextResponse.json({ error: "El enlace ha expirado. Solicita uno nuevo." }, { status: 400 });
  }

  const email = record.identifier.replace("reset:", "");

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.$transaction([
    db.user.update({
      where: { email },
      data: { password: hashedPassword },
    }),
    db.verificationToken.delete({ where: { token: hashedToken } }),
  ]);

  return NextResponse.json({ message: "Contraseña actualizada correctamente." });
}
