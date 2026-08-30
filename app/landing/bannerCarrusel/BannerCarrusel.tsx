"use client";

import { useEffect, useRef, useState } from "react";
import Splide from "@splidejs/splide";
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
  const splideRef = useRef<HTMLDivElement>(null);
  const splideInstance = useRef<Splide | null>(null);

  useEffect(() => {
    fetch("/api/banners?type=BANNER")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setBanners(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = splideRef.current;
    if (!el || banners.length === 0) return;

    splideInstance.current = new Splide(el, {
      type: banners.length > 1 ? "loop" : "slide",
      drag: banners.length > 1,
      arrows: false,
      pagination: banners.length > 1,
      speed: 500,
      autoplay: banners.length > 1,
      interval: 5000,
      pauseOnHover: true,
    });
    splideInstance.current.mount();

    return () => splideInstance.current?.destroy();
  }, [banners]);

  if (banners.length === 0) return (
    <section className={styles.wrapper} id="banners">
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>Pronto nuevas campañas y lanzamientos</p>
      </div>
    </section>
  );

  return (
    <section className={styles.wrapper} id="banners">
      <div className={styles.container}>
        <div ref={splideRef} className="splide">
          <div className="splide__track">
            <ul className="splide__list">
              {banners.map((banner) => (
                <li className="splide__slide" key={banner.id}>
                  {banner.link ? (
                    <Link href={banner.link} className={styles.slide}>
                      <Image
                        src={banner.image}
                        alt={banner.title}
                        fill
                        sizes="(min-width: 768px) 1100px, 100vw"
                        className={styles.slideImage}
                      />
                    </Link>
                  ) : (
                    <div className={styles.slide}>
                      <Image
                        src={banner.image}
                        alt={banner.title}
                        fill
                        sizes="(min-width: 768px) 1100px, 100vw"
                        className={styles.slideImage}
                      />
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
