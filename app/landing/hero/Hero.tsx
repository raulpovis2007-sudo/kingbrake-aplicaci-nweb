"use client";

import { useEffect, useRef, useState } from "react";
import Splide from "@splidejs/splide";
import "@splidejs/splide/css";
import Image from "next/image";
import styles from "./Hero.module.css";

interface HeroBanner {
  id: string;
  title: string;
  image: string;
  imageMobile: string | null;
  link: string | null;
}

const SPLIDE_OPTS = {
  type: "loop" as const,
  drag: true,
  arrows: false,
  pagination: false,
  speed: 600,
  autoplay: true,
  interval: 5000,
  pauseOnHover: false,
  pauseOnFocus: false,
};

function SplideCarousel({ banners, variant }: { banners: HeroBanner[]; variant: "desktop" | "mobile" }) {
  const ref = useRef<HTMLDivElement>(null);
  const instance = useRef<Splide | null>(null);

  useEffect(() => {
    if (!ref.current || banners.length === 0) return;
    instance.current = new Splide(ref.current, SPLIDE_OPTS);
    instance.current.mount();
    return () => { instance.current?.destroy(); };
  }, [banners]);

  if (banners.length === 0) return null;

  return (
    <div ref={ref} className="splide">
      <div className="splide__track">
        <ul className="splide__list">
          {banners.map((b, i) => (
            <li className="splide__slide" key={b.id}>
              {variant === "mobile" ? (
                <Image
                  src={b.imageMobile!}
                  alt={b.title}
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  className={styles.slideImage}
                />
              ) : (
                <Image
                  src={b.image}
                  alt={b.title}
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  className={styles.slideImage}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Hero() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);

  useEffect(() => {
    fetch("/api/banners?type=HERO")
      .then((r) => r.json())
      .then((data: HeroBanner[]) => {
        if (Array.isArray(data) && data.length > 0) setBanners(data);
      })
      .catch(() => {});
  }, []);

  const desktopBanners = banners.filter((b) => b.image && b.image !== b.imageMobile);
  const mobileBanners = banners.filter((b) => b.imageMobile);

  if (banners.length === 0) return null;

  return (
    <header className={styles.heroSection} id="hero">
      {desktopBanners.length > 0 && (
        <div className={`${styles.carouselContainer} ${styles.desktopOnly}`}>
          <SplideCarousel banners={desktopBanners} variant="desktop" />
        </div>
      )}
      {mobileBanners.length > 0 && (
        <div className={`${styles.carouselContainer} ${styles.mobileOnly}`}>
          <SplideCarousel banners={mobileBanners} variant="mobile" />
        </div>
      )}
    </header>
  );
}
