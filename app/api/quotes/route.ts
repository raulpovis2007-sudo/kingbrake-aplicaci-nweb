import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { productId, productName, productSku } = body;

  if (!productId || !productName || !productSku) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const quote = await db.quote.create({
    data: {
      userId: session.user.id,
      productId,
      productName,
      productSku,
    },
  });

  return NextResponse.json(quote, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const quotes = await db.quote.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(quotes);
}
