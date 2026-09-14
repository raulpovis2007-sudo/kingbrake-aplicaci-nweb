"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./EventosCarrusel.module.css";

interface Evento {
  id: string;
  title: string;
  image: string;
  link: string | null;
  startDate: string | null;
}

function formatDate(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
}

export default function EventosCarrusel() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/banners?type=EVENT")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setEventos(data); })
      .catch(() => {});
  }, []);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [eventos]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  return (
    <section className={styles.wrapper} id="eventos">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Nuevas aplicaciones</h2>
          {eventos.length > 3 && (
            <div className={styles.navControls}>
              <button
                className={`${styles.navBtn} ${!canScrollLeft ? styles.navDisabled : ""}`}
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className={`${styles.navBtn} ${!canScrollRight ? styles.navDisabled : ""}`}
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {eventos.length === 0 ? (
          <p className={styles.emptyText}>Próximamente publicaremos nuevas aplicaciones</p>
        ) : (
          <div className={styles.scrollArea}>
            <div ref={scrollRef} className={styles.grid} onScroll={checkScroll}>
              {eventos.map((evento) => {
                const inner = (
                  <>
                    <Image
                      src={evento.image}
                      alt={evento.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 80vw"
                      className={styles.slideImage}
                    />
                    <div className={styles.slideOverlay}>
                      {evento.startDate && (
                        <span className={styles.slideDate}>{formatDate(evento.startDate)}</span>
                      )}
                      <span className={styles.slideTitle}>{evento.title}</span>
                    </div>
                  </>
                );

                return evento.link ? (
                  <Link key={evento.id} href={evento.link} className={styles.slide}>
                    {inner}
                  </Link>
                ) : (
                  <div key={evento.id} className={styles.slide}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
