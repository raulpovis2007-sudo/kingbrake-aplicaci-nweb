import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LINEAS_PRODUCTO } from "@/lib/lineas-producto";
import LineaDetalle from "../LineaDetalle";

interface Props {
  params: { slug: string; sub: string };
}

export function generateStaticParams() {
  return LINEAS_PRODUCTO.flatMap((l) =>
    l.categorias.map((s) => ({ slug: l.slug, sub: s.slug }))
  );
}

export function generateMetadata({ params }: Props): Metadata {
  const linea = LINEAS_PRODUCTO.find((l) => l.slug === params.slug);
  const sub = linea?.categorias.find((s) => s.slug === params.sub);
  if (!sub) return {};
  return {
    title: `${sub.nombre} — ${linea!.nombre} | King Brake Peru`,
    description: sub.descripcion.replace(/\*\*/g, "").slice(0, 160),
  };
}

export default function SubCategoriaPage({ params }: Props) {
  const linea = LINEAS_PRODUCTO.find((l) => l.slug === params.slug);
  const sub = linea?.categorias.find((s) => s.slug === params.sub);
  if (!linea || !sub) notFound();

  const detalle = {
    ...linea,
    nombre: sub.nombre,
    imagen: sub.imagen,
    descripcion: sub.descripcion,
    subtitulo: sub.subtitulo,
    badge: sub.badge,
    tip: sub.tip,
    presentaciones: sub.presentaciones,
  };

  const relacionadas = linea.categorias
    .filter((s) => s.slug !== params.sub)
    .slice(0, 3)
    .map((s) => ({
      nombre: s.nombre,
      slug: `${linea.slug}/${s.slug}`,
      imagen: s.imagen,
      categoriaLabel: linea.categoriaLabel,
      descripcion: s.descripcion,
      subtitulo: s.subtitulo,
      badge: s.badge,
      tip: s.tip,
      presentaciones: s.presentaciones,
      categorias: [],
    }));

  return <LineaDetalle linea={detalle} relacionadas={relacionadas} />;
}
