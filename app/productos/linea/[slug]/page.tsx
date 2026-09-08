import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LINEAS_PRODUCTO } from "@/lib/lineas-producto";
import LineaDetalle from "./LineaDetalle";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return LINEAS_PRODUCTO.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const linea = LINEAS_PRODUCTO.find((l) => l.slug === params.slug);
  if (!linea) return {};
  return {
    title: `${linea.nombre} | King Brake Peru`,
    description: linea.descripcion.replace(/\*\*/g, "").slice(0, 160),
  };
}

export default function LineaProductoPage({ params }: Props) {
  const linea = LINEAS_PRODUCTO.find((l) => l.slug === params.slug);
  if (!linea) notFound();

  const relacionadas = LINEAS_PRODUCTO.filter((l) => l.slug !== params.slug).slice(0, 3);

  return <LineaDetalle linea={linea} relacionadas={relacionadas} />;
}
