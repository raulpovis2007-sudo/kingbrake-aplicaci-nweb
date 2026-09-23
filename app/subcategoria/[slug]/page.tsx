import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import styles from "./SubcategoriaDetalle.module.css";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const cat = await db.category.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true },
  });
  if (!cat) return {};
  return {
    title: `${cat.name} | King Brake Peru`,
    description: cat.description || `Productos ${cat.name} de King Brake`,
  };
}

export default async function SubcategoriaDetallePage({ params }: Props) {
  const category = await db.category.findUnique({
    where: { slug: params.slug },
    include: {
      parent: { select: { name: true, slug: true } },
      products: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          sku: true,
          images: true,
        },
        orderBy: [{ featured: "desc" }, { name: "asc" }],
      },
    },
  });

  if (!category || !category.parentId) notFound();

  return (
    <main className={styles.wrapper}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/">Inicio</Link>
          <span>/</span>
          {category.parent && (
            <>
              <Link href={`/catalogo?categoria=${category.parent.slug}`}>
                {category.parent.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span>{category.name}</span>
        </nav>

        <header className={styles.header}>
          {category.icon?.startsWith("http") && (
            <div className={styles.headerImage}>
              <Image
                src={category.icon}
                alt={category.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 600px) 100vw, 400px"
              />
            </div>
          )}
          <div>
            <h1 className={styles.title}>{category.name}</h1>
            {category.description && (
              <p className={styles.description}>{category.description}</p>
            )}
          </div>
        </header>

        {category.products.length === 0 ? (
          <div className={styles.empty}>
            <p>Aún no hay productos en esta subcategoría.</p>
            <Link href={`/catalogo?categoria=${category.parent?.slug}`} className={styles.backLink}>
              Ver catálogo completo
            </Link>
          </div>
        ) : (
          <>
            <p className={styles.count}>
              {category.products.length} producto{category.products.length !== 1 ? "s" : ""}
            </p>
            <div className={styles.grid}>
              {category.products.map((p) => (
                <Link key={p.id} href={`/productos/${p.slug}`} className={styles.card}>
                  <div className={styles.cardImage}>
                    {p.images[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="(max-width: 600px) 50vw, 250px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className={styles.cardPlaceholder}>
                        <svg viewBox="0 0 40 40" fill="none" stroke="#d1d5db" strokeWidth="1.5" width="40" height="40">
                          <circle cx="20" cy="20" r="12" />
                          <circle cx="20" cy="20" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className={styles.cardInfo}>
                    <span className={styles.cardSku}>{p.sku}</span>
                    <h3 className={styles.cardName}>{p.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
