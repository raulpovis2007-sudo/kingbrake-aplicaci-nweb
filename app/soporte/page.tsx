"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Crown, X } from "lucide-react";
import ReelCard, { ReelData } from "@/app/components/Reels/ReelCard/ReelCard";
import ReelViewer from "@/app/components/Reels/ReelViewer/ReelViewer";
import styles from "./soporte.module.css";

interface Banner {
  id: string;
  title: string;
  image: string;
}

export default function SoportePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [reels, setReels] = useState<ReelData[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectedReelIndex, setSelectedReelIndex] = useState<number | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollReelLeft, setCanScrollReelLeft] = useState(false);
  const [canScrollReelRight, setCanScrollReelRight] = useState(false);
  const reelScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/banners?type=SOPORTE")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setBanners(data); })
      .catch(() => {});

    fetch("/api/reels?category=SOPORTE")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setReels(data); })
      .catch(() => {});
  }, []);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const checkReelScroll = useCallback(() => {
    const el = reelScrollRef.current;
    if (!el) return;
    setCanScrollReelLeft(el.scrollLeft > 0);
    setCanScrollReelRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    checkReelScroll();
    window.addEventListener("resize", checkScroll);
    window.addEventListener("resize", checkReelScroll);
    return () => {
      window.removeEventListener("resize", checkScroll);
      window.removeEventListener("resize", checkReelScroll);
    };
  }, [banners, reels, checkScroll, checkReelScroll]);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <Crown size={32} className={styles.accentIcon} />
          <h1 className={styles.heroTitle}>Soporte <span className={styles.bold}>Técnico</span></h1>
          <p className={styles.heroSub}>Información técnica, guías de instalación y recursos para profesionales del frenado.</p>
        </div>
      </section>

      {/* Banners de soporte */}
      {banners.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Recursos de <span className={styles.bold}>Soporte</span></h2>

            <div className={styles.carouselRow}>
              <button
                className={`${styles.navBtn} ${!canScrollLeft ? styles.navDisabled : ""}`}
                onClick={() => scroll(scrollRef, "left")}
                disabled={!canScrollLeft}
                aria-label="Anterior"
              >
                <ChevronLeft size={22} />
              </button>

              <div className={styles.viewport}>
                <div ref={scrollRef} className={styles.grid} onScroll={checkScroll}>
                  {banners.map((b, i) => (
                    <div key={b.id} className={styles.slide} onClick={() => setLightboxIndex(i)}>
                      <Image src={b.image} alt={b.title} fill sizes="(min-width: 768px) 33vw, 80vw" className={styles.slideImage} />
                      <div className={styles.slideOverlay}>
                        <span className={styles.slideTitle}>{b.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={`${styles.navBtn} ${!canScrollRight ? styles.navDisabled : ""}`}
                onClick={() => scroll(scrollRef, "right")}
                disabled={!canScrollRight}
                aria-label="Siguiente"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Reels de soporte */}
      {reels.length > 0 && (
        <section className={styles.section} style={{ background: "#f5f5f5" }}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Videos de <span className={styles.bold}>Soporte</span></h2>

            <div className={styles.carouselRow}>
              <button
                className={`${styles.navBtn} ${styles.navBtnDark} ${!canScrollReelLeft ? styles.navDisabled : ""}`}
                onClick={() => scroll(reelScrollRef, "left")}
                disabled={!canScrollReelLeft}
                aria-label="Anterior"
              >
                <ChevronLeft size={22} />
              </button>

              <div className={styles.viewport}>
                <div ref={reelScrollRef} className={styles.reelGrid} onScroll={checkReelScroll}>
                  {reels.map((reel, index) => (
                    <ReelCard key={reel.id} reel={reel} index={index} onClick={() => setSelectedReelIndex(index)} />
                  ))}
                </div>
              </div>

              <button
                className={`${styles.navBtn} ${styles.navBtnDark} ${!canScrollReelRight ? styles.navDisabled : ""}`}
                onClick={() => scroll(reelScrollRef, "right")}
                disabled={!canScrollReelRight}
                aria-label="Siguiente"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CTA WhatsApp */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>¿Necesitas ayuda adicional?</h2>
          <p className={styles.ctaText}>Nuestro equipo técnico está disponible para resolver tus dudas.</p>
          <a
            href="https://wa.me/51908920221?text=%C2%A1Hola!%20Necesito%20soporte%20t%C3%A9cnico"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            Contactar soporte
          </a>
        </div>
      </section>

      {/* Lightbox banners */}
      {lightboxIndex !== null && (
        <div className={styles.lightbox} onClick={() => setLightboxIndex(null)}>
          <button className={styles.lbClose} onClick={() => setLightboxIndex(null)} aria-label="Cerrar">
            <X size={28} />
          </button>
          {banners.length > 1 && (
            <>
              <button
                className={`${styles.lbNav} ${styles.lbPrev}`}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + banners.length) % banners.length); }}
                aria-label="Anterior"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className={`${styles.lbNav} ${styles.lbNext}`}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % banners.length); }}
                aria-label="Siguiente"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
          <div className={styles.lbContent} onClick={(e) => e.stopPropagation()}>
            <Image src={banners[lightboxIndex].image} alt={banners[lightboxIndex].title} width={560} height={710} className={styles.lbImage} />
            <p className={styles.lbTitle}>{banners[lightboxIndex].title}</p>
          </div>
        </div>
      )}

      {/* Reel viewer */}
      {selectedReelIndex !== null && (
        <ReelViewer reels={reels} initialIndex={selectedReelIndex} onClose={() => setSelectedReelIndex(null)} />
      )}
    </main>
  );
}
