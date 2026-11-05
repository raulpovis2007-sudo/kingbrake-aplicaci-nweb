"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import styles from "../ProductoDetalle.module.css";

interface Props {
  images: string[];
  name: string;
  sku?: string;
  category?: string;
}

export default function ProductGallery({ images, name, sku, category }: Props) {
  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [lightbox, setLightbox] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));
      if (e.key === "ArrowLeft") setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, images.length]);

  if (images.length === 0) {
    return <div className={styles.noImage}>Sin imagen</div>;
  }

  const hasMultiple = images.length > 1;

  return (
    <>
    <div className={styles.galeriaCol}>
      <div className={styles.galeriaWrapper}>
        <div
          ref={boxRef}
          className={styles.imagenBox}
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={handleMouseMove}
          onClick={() => { setZoom(false); setLightbox(true); }}
        >
          <Image
            src={images[current]}
            alt={`${name} - imagen ${current + 1}`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className={styles.imagenProducto}
            priority
          />
          {zoom && <div className={styles.zoomOverlay} />}
          {zoom && (
            <div
              className={styles.zoomLens}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            />
          )}
        </div>
      </div>

      {hasMultiple && (
        <div className={styles.thumbRow}>
          {images.map((src, i) => (
            <button
              key={i}
              className={`${styles.thumbBox} ${i === current ? styles.thumbBoxActive : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${name} - miniatura ${i + 1}`}
                fill
                sizes="72px"
                className={styles.thumbImg}
              />
            </button>
          ))}
        </div>
      )}
    </div>

    {zoom && createPortal(
      <div className={styles.zoomPanel}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[current]}
          alt=""
          className={styles.zoomImage}
          style={{
            transformOrigin: `${pos.x}% ${pos.y}%`,
          }}
        />
      </div>,
      document.body
    )}

    {lightbox && createPortal(
      <div className={styles.lightbox} onClick={() => setLightbox(false)}>
        <button className={styles.lightboxClose} aria-label="Cerrar">
          <X size={24} />
        </button>
        <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.lightboxImageBox}>
            <Image
              src={images[current]}
              alt={name}
              fill
              sizes="90vw"
              className={styles.lightboxImage}
            />
          </div>
          <div className={styles.lightboxInfo}>
            {category && <span className={styles.lightboxCategory}>{category}</span>}
            <h2 className={styles.lightboxTitle}>{name}</h2>
            {sku && <span className={styles.lightboxSku}>SKU: {sku}</span>}
          </div>
          {hasMultiple && (
            <div className={styles.lightboxThumbs}>
              {images.map((src, i) => (
                <button
                  key={i}
                  className={`${styles.lightboxThumb} ${i === current ? styles.lightboxThumbActive : ""}`}
                  onClick={() => setCurrent(i)}
                >
                  <Image src={src} alt={`${name} ${i + 1}`} fill sizes="56px" style={{ objectFit: "contain", padding: 3 }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>,
      document.body
    )}
    </>
  );
}
