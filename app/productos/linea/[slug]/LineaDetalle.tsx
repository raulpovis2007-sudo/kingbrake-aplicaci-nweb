"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search } from "lucide-react";
import type { LineaProducto, ProductoItem } from "@/lib/lineas-producto";
import styles from "./LineaDetalle.module.css";

interface Props {
  linea: LineaProducto;
  relacionadas: readonly LineaProducto[];
}

function renderDescripcion(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

const WHATSAPP_NUMERO = "51999999999";

function ProductoBlock({ item, categoriaLabel, lineaSlug }: { item: ProductoItem; categoriaLabel: string; lineaSlug: string }) {
  const [presentacion, setPresentacion] = useState<string>(item.presentaciones[0]);
  const [zooming, setZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imagenBoxRef = useRef<HTMLDivElement>(null);

  const imagenActual =
    item.imagenesPorPresentacion?.[presentacion] ?? item.imagen;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, []);

  const handleCotizar = () => {
    const mensaje = encodeURIComponent(
      `Hola King Brake! Quiero cotizar:\n• ${item.nombre} — ${presentacion}\n\nPor favor envíenme más información.`
    );
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMERO}&text=${mensaje}`, "_blank");
  };

  return (
    <div className={styles.detalleGrid}>
      <div className={styles.galeriaCol}>
        <div
          ref={imagenBoxRef}
          className={`${styles.imagenBox} ${zooming ? styles.imagenBoxZooming : ""}`}
          onMouseEnter={() => setZooming(true)}
          onMouseLeave={() => setZooming(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            key={imagenActual}
            src={imagenActual}
            alt={`${item.nombre} — ${presentacion}`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className={styles.imagenProducto}
          />
          {zooming && (
            <div
              className={styles.zoomOverlay}
              style={{
                backgroundImage: `url(${imagenActual})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              }}
            />
          )}
          {!zooming && (
            <span className={styles.zoomHint}>
              <Search size={14} />
            </span>
          )}
        </div>
        {item.tip && <p className={styles.tip}>{item.tip}</p>}
      </div>

      <div className={styles.infoCol}>
        <span className={styles.categoriaLabel}>{categoriaLabel}</span>
        <h2 className={styles.titulo}>{item.nombre}</h2>
        <p className={styles.descripcion}>{renderDescripcion(item.descripcion)}</p>

        <h3 className={styles.subtitulo}>{item.subtitulo}</h3>
        <div className={styles.badge}>{item.badge}</div>

        {item.presentaciones.length > 1 && (
          <div className={styles.presentacionGroup}>
            <label className={styles.presentacionLabel}>PRESENTACIONES</label>
            <div className={styles.pillGroup}>
              {item.presentaciones.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`${styles.pill} ${p === presentacion ? styles.pillActive : ""}`}
                  onClick={() => setPresentacion(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.acciones}>
          <button onClick={handleCotizar} className={styles.cotizarBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Cotizar
          </button>
          <Link href={`/catalogo?linea=${lineaSlug}`} className={styles.verCatalogoBtn}>
            Ver catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LineaDetalle({ linea, relacionadas }: Props) {
  const items: ProductoItem[] = linea.items && linea.items.length > 0
    ? linea.items
    : [linea];

  return (
    <main className={styles.page}>
      <section className={styles.detalle}>
        <div className={styles.detalleContainer}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={18} />
            Regresar
          </Link>

          {items.length > 1 && (
            <h1 className={styles.pageTitle}>{linea.nombre}</h1>
          )}

          {items.map((item, i) => (
            <ProductoBlock
              key={item.nombre}
              item={item}
              categoriaLabel={linea.categoriaLabel}
              lineaSlug={linea.slug}
            />
          ))}
        </div>
      </section>

      <section className={styles.relacionados}>
        <div className={styles.relacionadosContainer}>
          <h2 className={styles.relacionadosTitulo}>PRODUCTOS RELACIONADOS</h2>
          <div className={styles.relacionadosGrid}>
            {relacionadas.map((r) => (
              <Link key={r.slug} href={`/productos/linea/${r.slug}`} className={styles.relCard}>
                <div className={styles.relImageBox}>
                  <Image
                    src={r.imagen}
                    alt={r.nombre}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className={styles.relImage}
                  />
                </div>
                <span className={styles.relNombre}>{r.nombre.toUpperCase()}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
