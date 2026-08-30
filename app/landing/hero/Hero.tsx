"use client";

import { useEffect, useRef } from "react";
import Splide from "@splidejs/splide";
import "@splidejs/splide/css";
import Image from "next/image";
import styles from "./Hero.module.css";

const HERO_IMAGES = [
  "/assets/images/1PORTA-1.jpeg",
  "/assets/images/1PORTA-2.PNG",
  "/assets/images/1PORTA-3.PNG",
];

export default function Hero() {
  const splideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = splideRef.current;
    if (!el) return;

    const splide = new Splide(el, {
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
    splide.mount();

    return () => splide.destroy();
  }, []);

  return (
    <header className={styles.heroSection} id="hero">
      <div className={styles.carouselContainer}>
        <div ref={splideRef} className="splide">
          <div className="splide__track">
            <ul className="splide__list">
              {HERO_IMAGES.map((src, i) => (
                <li className="splide__slide" key={src}>
                  <Image
                    src={src}
                    alt={`King Brake portada ${i + 1}`}
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
