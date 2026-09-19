"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Crown } from "lucide-react";
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
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const hasDragged = useRef(false);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);
  const momentumId = useRef<number>(0);

  useEffect(() => {
    fetch("/api/banners?type=EVENT")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setEventos(data); })
      .catch(() => {});
  }, []);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [eventos, checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  // Mouse drag with momentum
  const onMouseDown = (e: React.MouseEvent) => {
    cancelAnimationFrame(momentumId.current);
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX;
    lastX.current = e.pageX;
    lastTime.current = Date.now();
    velocity.current = 0;
    startScroll.current = scrollRef.current!.scrollLeft;
    scrollRef.current!.style.cursor = "grabbing";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.pageX - startX.current;
    if (Math.abs(dx) > 5) hasDragged.current = true;
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) velocity.current = (lastX.current - e.pageX) / dt;
    lastX.current = e.pageX;
    lastTime.current = now;
    scrollRef.current!.scrollLeft = startScroll.current - dx;
  };

  const onMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";

    let v = velocity.current * 15;
    const decel = 0.95;
    const step = () => {
      if (Math.abs(v) < 0.5 || !scrollRef.current) return;
      scrollRef.current.scrollLeft += v;
      v *= decel;
      momentumId.current = requestAnimationFrame(step);
    };
    step();
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (hasDragged.current) e.preventDefault();
  };

  return (
    <section className={styles.wrapper} id="eventos">
      <div className={styles.container}>
        <div className={styles.titleBlock}>
          <Crown size={28} className={styles.accentIcon} />
          <h2 className={styles.title}>Nuevas <span className={styles.titleBold}>Aplicaciones</span></h2>
        </div>

        {eventos.length === 0 ? (
          <p className={styles.emptyText}>Próximamente publicaremos nuevas aplicaciones</p>
        ) : (
          <div className={styles.carouselRow}>
            <button
              className={`${styles.navBtn} ${!canScrollLeft ? styles.navDisabled : ""}`}
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Anterior"
            >
              <ChevronLeft size={22} />
            </button>

            <div className={styles.viewport}>
              <div
                ref={scrollRef}
                className={styles.grid}
                onScroll={checkScroll}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onClickCapture={onClickCapture}
              >
                {eventos.map((evento) => {
                  const inner = (
                    <>
                      <Image
                        src={evento.image}
                        alt={evento.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 80vw"
                        className={styles.slideImage}
                        draggable={false}
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
                    <Link key={evento.id} href={evento.link} className={styles.slide} draggable={false}>
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

            <button
              className={`${styles.navBtn} ${!canScrollRight ? styles.navDisabled : ""}`}
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Siguiente"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
