"use client";

import { useEffect, useRef, useState } from "react";
import Splide from "@splidejs/splide";
import Image from "next/image";
import Link from "next/link";
import styles from "./EventosCarrusel.module.css";

interface Evento {
  id: string;
  title: string;
  image: string;
  link: string | null;
}

export default function EventosCarrusel() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const splideRef = useRef<HTMLDivElement>(null);
  const splideInstance = useRef<Splide | null>(null);

  useEffect(() => {
    fetch("/api/banners?type=EVENT")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setEventos(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = splideRef.current;
    if (!el || eventos.length === 0) return;

    splideInstance.current = new Splide(el, {
      type: eventos.length > 2 ? "loop" : "slide",
      perPage: 3,
      gap: "1rem",
      drag: eventos.length > 1,
      arrows: false,
      pagination: eventos.length > 3,
      speed: 500,
      autoplay: eventos.length > 2,
      interval: 4000,
      pauseOnHover: true,
      breakpoints: {
        1024: { perPage: 2 },
        640: { perPage: 1 },
      },
    });
    splideInstance.current.mount();

    return () => splideInstance.current?.destroy();
  }, [eventos]);

  if (eventos.length === 0) return (
    <section className={styles.wrapper} id="eventos">
      <div className={styles.container}>
        <h2 className={styles.title}>Eventos y Exhibiciones</h2>
        <p className={styles.emptyText}>Próximamente publicaremos nuestros eventos</p>
      </div>
    </section>
  );

  return (
    <section className={styles.wrapper} id="eventos">
      <div className={styles.container}>
        <h2 className={styles.title}>Eventos y Exhibiciones</h2>
        <div ref={splideRef} className="splide">
          <div className="splide__track">
            <ul className="splide__list">
              {eventos.map((evento) => (
                <li className="splide__slide" key={evento.id}>
                  {evento.link ? (
                    <Link href={evento.link} className={styles.slide}>
                      <Image
                        src={evento.image}
                        alt={evento.title}
                        fill
                        sizes="(min-width: 1024px) 350px, (min-width: 640px) 50vw, 100vw"
                        className={styles.slideImage}
                      />
                      <span className={styles.slideTitle}>{evento.title}</span>
                    </Link>
                  ) : (
                    <div className={styles.slide}>
                      <Image
                        src={evento.image}
                        alt={evento.title}
                        fill
                        sizes="(min-width: 1024px) 350px, (min-width: 640px) 50vw, 100vw"
                        className={styles.slideImage}
                      />
                      <span className={styles.slideTitle}>{evento.title}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
