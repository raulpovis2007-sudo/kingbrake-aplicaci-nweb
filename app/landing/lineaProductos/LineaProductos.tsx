import Link from "next/link";
import Image from "next/image";
import { LINEAS_PRODUCTO } from "@/lib/lineas-producto";
import styles from "./LineaProductos.module.css";

export default function LineaProductos() {
  return (
    <section className={styles.wrapper} id="linea-productos">
      <div className={styles.container}>
        <p className={styles.subtitle}>Explora nuestra</p>
        <h2 className={styles.title}>Línea de productos</h2>
        <div className={styles.bento}>
          {LINEAS_PRODUCTO.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/productos?linea=${cat.slug}`}
              className={`${styles.card} ${i === 0 ? styles.cardHero : ""}`}
            >
              <Image
                src={cat.imagen}
                alt={cat.nombre}
                fill
                sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                className={styles.cardImage}
              />
              <div className={styles.cardOverlay} />
              <div className={styles.cardContent}>
                <span className={styles.cardName}>{cat.nombre}</span>
                <span className={styles.cardCta}>Ver productos &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
