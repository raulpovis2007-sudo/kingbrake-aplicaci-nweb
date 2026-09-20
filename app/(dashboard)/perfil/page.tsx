import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import PerfilClient from "./PerfilClient";

export const metadata = { title: "Mi Perfil | King Brake Peru" };

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      preferredDistributorId: true,
      vehicle: {
        include: {
          vehicleModel: {
            include: { brand: { select: { id: true, name: true } } },
          },
        },
      },
    },
  });

  if (!user) redirect("/login");

  const [brands, distributors] = await Promise.all([
    db.vehicleBrand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.distributor.findMany({
      where: { isActive: true },
      select: { id: true, name: true, address: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <PerfilClient
      user={user}
      brands={brands}
      distributors={distributors}
    />
  );
}
