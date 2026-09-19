import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
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

const WHATSAPP_NUMERO = "51999999999";

export default async function ProductoPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const relacionados = await db.product.findMany({
    where: { isActive: true, categoryId: product.categoryId, id: { not: product.id } },
    select: { name: true, slug: true, images: true, price: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const mensaje = encodeURIComponent(
    `Hola King Brake! Quiero cotizar:\n• ${product.name} (${product.sku}) — S/${product.price.toFixed(2)}\n\nPor favor envíenme más información.`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMERO}&text=${mensaje}`;

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
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.cotizarBtn}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Cotizar por WhatsApp
                </a>
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
