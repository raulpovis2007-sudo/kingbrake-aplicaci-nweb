import { db } from "@/lib/db";

export async function obtenerPorId(id: string) {
  return db.user.findUnique({ where: { id } });
}

export async function obtenerRolPorCorreo(correo: string) {
  return db.user.findUnique({ where: { email: correo } });
}

export async function obtenerTodosLosClientes() {
  return db.user.findMany({ where: { role: "CLIENT" } });
}

export async function obtenerTodosLosAdministradores() {
  return db.user.findMany({ where: { role: "ADMIN" } });
}
