import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import CotizarButton from "./components/CotizarButton";
import styles from "./ProductoDetalle.module.css";

interface Props {
  params: { slug: string };
}

async function getProduct(slug: string) {
  return db.product.findUnique({
    where: { slug, isActive: true },
    include: { category: { select: { name: true, slug: true } } },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} | King Brake Peru`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductoPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const relacionados = await db.product.findMany({
    where: { isActive: true, categoryId: product.categoryId, id: { not: product.id } },
    select: { name: true, slug: true, images: true, price: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className={styles.page}>
      <section className={styles.detalle}>
        <div className={styles.container}>
          <Link href="/catalogo" className={styles.backLink}>
            <ArrowLeft size={18} />
            Regresar al catálogo
          </Link>

          <div className={styles.grid}>
            <div className={styles.galeriaCol}>
              {product.images[0] ? (
                <div className={styles.imagenBox}>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className={styles.imagenProducto}
                    priority
                  />
                </div>
              ) : (
                <div className={styles.noImage}>Sin imagen</div>
              )}

              {product.images.length > 1 && (
                <div className={styles.thumbRow}>
                  {product.images.slice(1, 5).map((img, i) => (
                    <div key={i} className={styles.thumbBox}>
                      <Image src={img} alt="" fill sizes="80px" className={styles.thumbImg} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.infoCol}>
              <span className={styles.categoriaLabel}>{product.category.name}</span>
              <h1 className={styles.titulo}>{product.name}</h1>
              <p className={styles.sku}>SKU: {product.sku}</p>
              <p className={styles.precio}>S/ {product.price.toFixed(2)}</p>
              <p className={styles.descripcion}>{product.description}</p>

              <div className={styles.acciones}>
                <CotizarButton
                  productId={product.id}
                  productName={product.name}
                  productSku={product.sku}
                  productPrice={product.price}
                  className={styles.cotizarBtn}
                />
              </div>
            </div>
          </div>

          {product.detalle && (
            <div className={styles.detalleContent}>
              <h2 className={styles.detalleTitle}>Detalle del producto</h2>
              <div
                className={styles.detalleBody}
                dangerouslySetInnerHTML={{ __html: product.detalle }}
              />
            </div>
          )}
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className={styles.relacionados}>
          <div className={styles.container}>
            <h2 className={styles.relacionadosTitulo}>PRODUCTOS RELACIONADOS</h2>
            <div className={styles.relacionadosGrid}>
              {relacionados.map((r) => (
                <Link key={r.slug} href={`/productos/${r.slug}`} className={styles.relCard}>
                  <div className={styles.relImageBox}>
                    {r.images[0] ? (
                      <Image src={r.images[0]} alt={r.name} fill sizes="(min-width: 768px) 25vw, 50vw" className={styles.relImage} />
                    ) : (
                      <span className={styles.relNoImage}>Sin imagen</span>
                    )}
                  </div>
                  <span className={styles.relNombre}>{r.name}</span>
                  <span className={styles.relPrecio}>S/ {r.price.toFixed(2)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
