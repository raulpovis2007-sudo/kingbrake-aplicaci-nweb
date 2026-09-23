import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "@/lib/db";
import styles from "./SubcategoriaDetalle.module.css";

const WHATSAPP_NUMERO = "51908920221";
const PER_PAGE = 10;

interface Props {
  params: { slug: string };
  searchParams: { page?: string };
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

export default async function SubcategoriaDetallePage({ params, searchParams }: Props) {
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

  const total = category.products.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const page = Math.min(Math.max(1, Number(searchParams.page) || 1), totalPages);
  const paginated = category.products.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const waMessage = encodeURIComponent(
    `Hola King Brake! Me interesa la línea de ${category.name}. ¿Podrían darme más información?`
  );

  return (
    <main className={styles.page}>
      <section className={styles.showcase}>
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

          <div className={styles.grid}>
            <div className={styles.imageCol}>
              {category.icon?.startsWith("http") ? (
                <Image
                  src={category.icon}
                  alt={category.name}
                  fill
                  className={styles.imageFill}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className={styles.imagePlaceholder}>Sin imagen</div>
              )}
            </div>

            <div className={styles.infoCol}>
              {category.parent && (
                <span className={styles.parentLabel}>{category.parent.name}</span>
              )}
              <h1 className={styles.title}>{category.name}</h1>
              {category.description && (
                <p className={styles.description}>{category.description}</p>
              )}

              <div className={styles.cta}>
                <a
                  href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMERO}&text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappBtn}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {total > 0 && (
        <section className={styles.productosSection}>
          <div className={styles.container}>
            <h2 className={styles.productosTitulo}>
              PRODUCTOS DE ESTA LÍNEA ({total})
            </h2>
            <div className={styles.productosGrid}>
              {paginated.map((p) => (
                <Link key={p.id} href={`/productos/${p.slug}`} className={styles.prodCard}>
                  <div className={styles.prodImageBox}>
                    {p.images[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 250px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <span className={styles.prodNoImage}>Sin imagen</span>
                    )}
                  </div>
                  <div className={styles.prodInfo}>
                    <span className={styles.prodSku}>{p.sku}</span>
                    <h3 className={styles.prodName}>{p.name}</h3>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                {page > 1 ? (
                  <Link href={`/subcategoria/${params.slug}?page=${page - 1}`} className={styles.pageBtn}>
                    <ChevronLeft size={16} />
                  </Link>
                ) : (
                  <span className={`${styles.pageBtn} ${styles.pageBtnDisabled}`}>
                    <ChevronLeft size={16} />
                  </span>
                )}
                <span className={styles.pageInfo}>{page} / {totalPages}</span>
                {page < totalPages ? (
                  <Link href={`/subcategoria/${params.slug}?page=${page + 1}`} className={styles.pageBtn}>
                    <ChevronRight size={16} />
                  </Link>
                ) : (
                  <span className={`${styles.pageBtn} ${styles.pageBtnDisabled}`}>
                    <ChevronRight size={16} />
                  </span>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {total === 0 && (
        <section className={styles.productosSection}>
          <div className={styles.container}>
            <div className={styles.empty}>
              <p>Aún no hay productos en esta línea.</p>
              <Link href={`/catalogo?categoria=${category.parent?.slug}`} className={styles.emptyLink}>
                Ver catálogo completo
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
