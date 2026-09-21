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
  link: string | null;
}

export default function Hero() {
  const splideRef = useRef<HTMLDivElement>(null);
  const splideInstance = useRef<Splide | null>(null);
  const [images, setImages] = useState<HeroBanner[]>([]);

  useEffect(() => {
    fetch("/api/banners?type=HERO")
      .then((r) => r.json())
      .then((data: HeroBanner[]) => {
        if (Array.isArray(data) && data.length > 0) setImages(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = splideRef.current;
    if (!el || images.length === 0) return;

    splideInstance.current = new Splide(el, {
      type: "loop",
      drag: true,
      arrows: false,
      pagination: false,
      speed: 600,
      autoplay: true,
      interval: 5000,
      pauseOnHover: false,
      pauseOnFocus: false,
    });
    splideInstance.current.mount();

    return () => { splideInstance.current?.destroy(); };
  }, [images]);

  if (images.length === 0) return null;

  return (
    <header className={styles.heroSection} id="hero">
      <div className={styles.carouselContainer}>
        <div ref={splideRef} className="splide">
          <div className="splide__track">
            <ul className="splide__list">
              {images.map((b, i) => (
                <li className="splide__slide" key={b.id}>
                  <Image
                    src={b.image}
                    alt={b.title}
                    fill
                    sizes="100vw"
                    priority={i === 0}
                    className={styles.slideImage}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
