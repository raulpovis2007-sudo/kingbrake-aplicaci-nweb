"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Crown } from "lucide-react";
import styles from "./LineaProductos.module.css";

interface ParentCategory {
  id: string;
  name: string;
  slug: string;
  children: { id: string; name: string; slug: string }[];
}

export default function LineaProductos() {
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
  const items = cat.children.length > 0
    ? cat.children.map((sub) => ({ nombre: sub.name, href: `/catalogo?linea=${cat.slug}` }))
    : [{ nombre: cat.name, href: `/catalogo?linea=${cat.slug}` }];

  return (
    <section className={styles.wrapper} id="linea-productos">
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

        <div className={styles.collage}>
          {items.map((item) => (
            <Link key={item.nombre} href={item.href} className={styles.card}>
              <div className={styles.cardContent}>
                <span className={styles.cardName}>{item.nombre}</span>
                <span className={styles.cardCta}>Ver más →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          <Link href={`/catalogo?linea=${cat.slug}`} className={styles.btnCatalogo}>
            Ir a catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}
