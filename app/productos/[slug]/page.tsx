import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import CotizarButton from "./components/CotizarButton";
import ProductGallery from "./components/ProductGallery";
import styles from "./ProductoDetalle.module.css";

interface Props {
  params: { slug: string };
  searchParams: { categoria?: string; brandId?: string; modelId?: string; generationId?: string };
}

async function getProduct(slug: string) {
  return db.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: {
        select: { name: true, slug: true, parent: { select: { name: true, slug: true } } },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};
  const plainText = product.description.replace(/<[^>]*>/g, "").slice(0, 160);
  return {
    title: `${product.name} | King Brake Peru`,
    description: plainText,
  };
}

export default async function ProductoPage({ params, searchParams }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const backParams = new URLSearchParams();
  backParams.set("categoria", searchParams.categoria || product.category.parent?.slug || product.category.slug);
  if (searchParams.brandId) backParams.set("brandId", searchParams.brandId);
  if (searchParams.modelId) backParams.set("modelId", searchParams.modelId);
  if (searchParams.generationId) backParams.set("generationId", searchParams.generationId);

  const relacionados = await db.product.findMany({
    where: { isActive: true, categoryId: product.categoryId, id: { not: product.id } },
    select: { name: true, slug: true, images: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className={styles.page}>
      <section className={styles.detalle}>
        <div className={styles.container}>
          <Link href={`/catalogo?${backParams.toString()}`} className={styles.backLink}>
            <ArrowLeft size={18} />
            Regresar al catálogo
          </Link>

          <div className={styles.grid}>
            {/* Galería de imágenes con flechas */}
            <ProductGallery images={product.images} name={product.name} />

            <div className={styles.infoCol}>
              <span className={styles.categoriaLabel}>
                {product.category.parent
                  ? `${product.category.parent.name} › ${product.category.name}`
                  : product.category.name}
              </span>
              <h1 className={styles.titulo}>{product.name}</h1>
              <p className={styles.sku}>SKU: {product.sku}</p>

              {product.description && (
                <div
                  className={styles.detalleBody}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}

              <div className={styles.acciones}>
                <CotizarButton
                  productId={product.id}
                  productName={product.name}
                  productSku={product.sku}
                />
              </div>
            </div>
          </div>
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
                      <img src={r.images[0]} alt={r.name} className={styles.relImage} />
                    ) : (
                      <span className={styles.relNoImage}>Sin imagen</span>
                    )}
                  </div>
                  <span className={styles.relNombre}>{r.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
