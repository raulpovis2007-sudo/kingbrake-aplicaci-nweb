"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LINEAS_PRODUCTO } from "@/lib/lineas-producto";
import styles from "./LineaProductos.module.css";

const WHATSAPP_NUMERO = "51999999999";

export default function LineaProductos() {
  const [activeIndex, setActiveIndex] = useState(0);
  const linea = LINEAS_PRODUCTO[activeIndex];
  const items = linea.categorias.length > 0
    ? linea.categorias.map((sub) => ({ nombre: sub.nombre, href: `/productos/linea/${linea.slug}/${sub.slug}`, imagen: sub.imagen }))
    : [{ nombre: linea.nombre, href: `/productos/linea/${linea.slug}`, imagen: linea.imagen }];

  const handleCotizar = () => {
    const mensaje = `¡Hola King Brake! Quiero más información sobre la categoría *${linea.nombre}* y sus productos.`;
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMERO}&text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  return (
    <section className={styles.wrapper} id="linea-productos">
      <div className={styles.container}>
        <p className={styles.subtitle}>Explora nuestros</p>
        <h2 className={styles.title}>Productos</h2>

        <div className={styles.tabs}>
          {LINEAS_PRODUCTO.map((cat, i) => (
            <button
              key={cat.slug}
              className={`${styles.tab} ${i === activeIndex ? styles.tabActive : ""}`}
              onClick={() => setActiveIndex(i)}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        <div className={`${styles.collage} ${items.length === 1 ? styles.collageSingle : items.length === 2 ? styles.collageTwo : items.length === 3 ? styles.collageThree : styles.collageGrid}`}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.card}
            >
              <div className={styles.cardImageBox}>
                <Image
                  src={item.imagen}
                  alt={item.nombre}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardOverlay} />
              <div className={styles.cardContent}>
                <span className={styles.cardName}>{item.nombre}</span>
                <span className={styles.cardCta}>Ver más →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          <Link href={`/catalogo?linea=${linea.slug}`} className={styles.btnCatalogo}>
            Ir a catálogo
          </Link>
          <button className={styles.btnCotizar} onClick={handleCotizar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.12 1.522 5.857L.055 23.495l5.793-1.516A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.947 0-3.8-.525-5.425-1.518l-.389-.231-4.032 1.056 1.075-3.926-.253-.403A9.786 9.786 0 012.18 12c0-5.422 4.398-9.82 9.82-9.82 5.422 0 9.82 4.398 9.82 9.82 0 5.422-4.398 9.82-9.82 9.82z" />
            </svg>
            Cotizar
          </button>
        </div>
      </div>
    </section>
  );
}
