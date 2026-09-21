"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../ProductoDetalle.module.css";

interface Props {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: Props) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return <div className={styles.noImage}>Sin imagen</div>;
  }

  const hasMultiple = images.length > 1;

  return (
    <div className={styles.galeriaCol}>
      <div className={styles.galeriaWrapper}>
        <div className={styles.imagenBox}>
          <Image
            src={images[current]}
            alt={`${name} - imagen ${current + 1}`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className={styles.imagenProducto}
            priority
          />
        </div>

        {hasMultiple && (
          <>
            <button
              className={`${styles.galeriaArrow} ${styles.galeriaArrowLeft}`}
              onClick={() => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1))}
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className={`${styles.galeriaArrow} ${styles.galeriaArrowRight}`}
              onClick={() => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1))}
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Indicadores (dots) */}
      {hasMultiple && (
        <div className={styles.galeriaDots}>
          {images.map((_, i) => (
            <button
              key={i}
              className={`${styles.galeriaDot} ${i === current ? styles.galeriaDotActive : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Ir a imagen ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
