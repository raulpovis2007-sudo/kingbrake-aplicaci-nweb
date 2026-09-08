"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetch("/api/banners?type=EVENT")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setEventos(data); })
      .catch(() => {});
  }, []);

  return (
    <section className={styles.wrapper} id="eventos">
      <div className={styles.container}>
        <h2 className={styles.title}>Nuevas aplicaciones</h2>
        {eventos.length === 0 ? (
          <p className={styles.emptyText}>Próximamente publicaremos nuevas aplicaciones</p>
        ) : (
          <div className={styles.grid}>
            {eventos.map((evento) => (
              evento.link ? (
                <Link key={evento.id} href={evento.link} className={styles.slide}>
                  <Image
                    src={evento.image}
                    alt={evento.title}
                    fill
                    sizes="(min-width: 768px) 1100px, 100vw"
                    className={styles.slideImage}
                  />
                  <span className={styles.slideTitle}>{evento.title}</span>
                </Link>
              ) : (
                <div key={evento.id} className={styles.slide}>
                  <Image
                    src={evento.image}
                    alt={evento.title}
                    fill
                    sizes="(min-width: 768px) 1100px, 100vw"
                    className={styles.slideImage}
                  />
                  <span className={styles.slideTitle}>{evento.title}</span>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
