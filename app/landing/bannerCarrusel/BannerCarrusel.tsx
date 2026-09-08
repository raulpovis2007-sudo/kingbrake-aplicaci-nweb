"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./BannerCarrusel.module.css";

interface Banner {
  id: string;
  title: string;
  image: string;
  link: string | null;
}

export default function BannerCarrusel() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    fetch("/api/banners?type=BANNER")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setBanners(data); })
      .catch(() => {});
  }, []);

  return (
    <section className={styles.wrapper} id="banners">
      <div className={styles.container}>
        <h2 className={styles.title}>Campañas y lanzamientos</h2>
        {banners.length === 0 ? (
          <p className={styles.emptyText}>Pronto nuevas campañas y lanzamientos</p>
        ) : (
          <div className={styles.grid}>
            {banners.map((banner) => (
              banner.link ? (
                <Link key={banner.id} href={banner.link} className={styles.slide}>
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    sizes="(min-width: 768px) 1100px, 100vw"
                    className={styles.slideImage}
                  />
                </Link>
              ) : (
                <div key={banner.id} className={styles.slide}>
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    sizes="(min-width: 768px) 1100px, 100vw"
                    className={styles.slideImage}
                  />
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
