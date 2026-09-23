"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Crown } from "lucide-react";
import styles from "./Categorias.module.css";

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

interface ParentCategory {
  id: string;
  name: string;
  slug: string;
  children: SubCategory[];
}

export default function Categorias() {
  const [categories, setCategories] = useState<ParentCategory[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data: ParentCategory[]) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  if (categories.length === 0) return null;

  const cat = categories[activeIndex];
  const subs = cat.children;

  return (
    <section className={styles.wrapper} id="categorias">
      <div className={styles.container}>
        <div className={styles.titleBlock}>
          <Crown size={28} className={styles.accentIcon} />
          <h2 className={styles.title}>
            Productos de <span className={styles.titleBold}>King Brake</span>
          </h2>
        </div>

        <div className={styles.tabs}>
          {categories.map((c, i) => (
            <button
              key={c.slug}
              className={`${styles.tab} ${i === activeIndex ? styles.tabActive : ""}`}
              onClick={() => setActiveIndex(i)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {subs.length > 0 && (
          <div className={styles.collage}>
            {subs.map((sub) => (
              <Link key={sub.slug} href={`/subcategoria/${sub.slug}`} className={styles.card}>
                {sub.icon?.startsWith("http") && (
                  <div className={styles.cardImageBox}>
                    <Image
                      src={sub.icon}
                      alt={sub.name}
                      fill
                      sizes="(max-width: 600px) 50vw, 350px"
                      className={styles.cardImage}
                    />
                    <div className={styles.cardOverlay} />
                  </div>
                )}
                <div className={styles.cardContent}>
                  <span className={styles.cardName}>{sub.name}</span>
                  <span className={styles.cardCta}>Ver más →</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className={styles.actions}>
          <Link href={`/catalogo?categoria=${cat.slug}`} className={styles.btnCatalogo}>
            Ir a catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}
