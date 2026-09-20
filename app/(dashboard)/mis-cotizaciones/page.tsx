import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import CotizacionesClient from "./CotizacionesClient";

export const metadata = { title: "Mis Cotizaciones | King Brake Peru" };

export default async function MisCotizacionesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const quotes = await db.quote.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return <CotizacionesClient quotes={JSON.parse(JSON.stringify(quotes))} />;
}
