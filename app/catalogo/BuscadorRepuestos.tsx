"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./BuscadorRepuestos.module.css";

const PER_PAGE = 10;

const NO_GEN_SLUGS = ["sistema-hidraulico"];
const NO_FILTER_SLUGS = ["lubricantes-de-freno"];

interface ParentCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

interface Brand { id: string; name: string }
interface Model { id: string; name: string }
interface Generation { id: string; name: string }

interface Compatibility {
  vehicleGeneration: {
    name: string;
    model: { name: string; brand: { name: string } };
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  images: string[];
  featured?: boolean;
  category: { name: string; slug: string };
  compatibility?: Compatibility[];
}

type SearchState = "idle" | "loading" | "results" | "empty" | "error";

export default function BuscadorRepuestos() {
  const searchParams = useSearchParams();
  const lineaSlug = searchParams.get("linea") || "";

  const [categories, setCategories] = useState<ParentCategory[]>([]);
  const linea = categories.find((c) => c.slug === lineaSlug);

  const isNoGen = NO_GEN_SLUGS.includes(lineaSlug);
  const isNoFilter = NO_FILTER_SLUGS.includes(lineaSlug);

  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [generationId, setGenerationId] = useState("");

  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchState, setSearchState] = useState<SearchState>("idle");

  const skipCascadeRef = useRef(false);
  const cacheKey = `kb-catalog-${lineaSlug}`;

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data: ParentCategory[]) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!lineaSlug) return;
    try {
      const raw = sessionStorage.getItem(cacheKey);
      if (!raw) return;
      const c = JSON.parse(raw);
      skipCascadeRef.current = true;
      setBrandId(c.brandId || "");
      setModelId(c.modelId || "");
      setGenerationId(c.generationId || "");
      setBrands(c.brands || []);
      setModels(c.models || []);
      setGenerations(c.generations || []);
      setProducts(c.products || []);
      setSearchState(c.searchState || "idle");
    } catch { /* ignore corrupt cache */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isNoFilter) return;
    fetch("/api/vehicles/brands")
      .then((r) => r.json())
      .then(setBrands)
      .catch(() => {});
  }, [isNoFilter]);

  useEffect(() => {
    if (skipCascadeRef.current) return;
    setModelId("");
    setGenerationId("");
    setModels([]);
    setGenerations([]);
    if (!brandId) return;
    fetch(`/api/vehicles/models?brandId=${brandId}`)
      .then((r) => r.json())
      .then(setModels)
      .catch(() => setModels([]));
  }, [brandId]);

  useEffect(() => {
    if (skipCascadeRef.current) {
      skipCascadeRef.current = false;
      return;
    }
    setGenerationId("");
    setGenerations([]);
    if (!modelId) return;
    fetch(`/api/vehicles/generations?modelId=${modelId}`)
      .then((r) => r.json())
      .then(setGenerations)
      .catch(() => setGenerations([]));
  }, [modelId]);

  useEffect(() => {
    if (!isNoFilter || !lineaSlug) return;
    setSearchState("loading");
    fetch(`/api/products?linea=${lineaSlug}`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        if (Array.isArray(data)) {
          setProducts(data);
          const state = data.length > 0 ? "results" : "empty";
          setSearchState(state);
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify({
              products: data, searchState: state,
            }));
          } catch { /* quota exceeded */ }
        } else {
          setSearchState("empty");
        }
      })
      .catch(() => setSearchState("error"));
  }, [isNoFilter, lineaSlug, cacheKey]);

  const prevLineaRef = useRef(lineaSlug);
  useEffect(() => {
    if (prevLineaRef.current === lineaSlug) return;
    prevLineaRef.current = lineaSlug;
    setBrandId("");
    setModelId("");
    setGenerationId("");
    if (!isNoFilter) {
      setSearchState("idle");
      setProducts([]);
    }
  }, [lineaSlug, isNoFilter]);

  const canSearch = isNoFilter
    ? false
    : isNoGen
      ? !!(lineaSlug && brandId && modelId)
      : !!(lineaSlug && brandId && modelId && generationId);

  const handleSearch = useCallback(async () => {
    if (!canSearch) return;
    setSearchState("loading");
    try {
      const res = await fetch("/api/products/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linea: lineaSlug,
          brandId,
          modelId: modelId || undefined,
          generationId: generationId || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(data);
      const state = data.length > 0 ? "results" : "empty";
      setSearchState(state);
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({
          brandId, modelId, generationId,
          brands, models, generations,
          products: data, searchState: state,
        }));
      } catch { /* quota exceeded */ }
    } catch {
      setSearchState("error");
    }
  }, [canSearch, lineaSlug, brandId, modelId, generationId, brands, models, generations, cacheKey]);

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / PER_PAGE));
  const paginated = useMemo(
    () => products.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [products, page],
  );

  useEffect(() => {
    setPage(1);
  }, [products]);

  if (!lineaSlug || !linea) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.lineaPicker}>
          <h1 className={styles.lineaPickerTitle}>Buscar repuestos</h1>
          <p className={styles.lineaPickerText}>
            Selecciona una línea de producto para comenzar
          </p>
          <div className={styles.lineaGrid}>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/catalogo?linea=${c.slug}`}
                className={styles.lineaCard}
              >
                <span>{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <nav className={styles.lineaTabs} aria-label="Líneas de producto">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/catalogo?linea=${c.slug}`}
            className={`${styles.lineaTab} ${c.slug === lineaSlug ? styles.lineaTabActive : ""}`}
          >
            {c.name}
          </Link>
        ))}
      </nav>

      <div className={styles.layout}>
        {!isNoFilter && (
          <aside className={styles.filters}>
            <h2 className={styles.filtersTitle}>Buscar repuestos</h2>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="brand">
                Marca
              </label>
              <select
                id="brand"
                className={styles.select}
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
              >
                <option value="">Seleccionar marca</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="model">
                Modelo
              </label>
              <select
                id="model"
                className={styles.select}
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
                disabled={!brandId}
              >
                <option value="">
                  {brandId ? "Seleccionar modelo" : "Primero selecciona marca"}
                </option>
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {!isNoGen && (
              <div className={styles.field}>
                <label className={styles.label} htmlFor="generation">
                  Generación
                </label>
                <select
                  id="generation"
                  className={styles.select}
                  value={generationId}
                  onChange={(e) => setGenerationId(e.target.value)}
                  disabled={!modelId}
                >
                  <option value="">
                    {modelId ? "Seleccionar generación" : "Primero selecciona modelo"}
                  </option>
                  {generations.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              className={styles.searchButton}
              disabled={!canSearch}
              onClick={handleSearch}
            >
              Buscar
            </button>
          </aside>
        )}

        <section className={styles.results} aria-live="polite">
          {searchState === "idle" && (
            <div className={styles.stateMessage}>
              <svg
                className={styles.stateIcon}
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="24" cy="24" r="16" />
                <circle cx="24" cy="24" r="6" />
                <line x1="24" y1="8" x2="24" y2="12" />
                <line x1="24" y1="36" x2="24" y2="40" />
                <line x1="8" y1="24" x2="12" y2="24" />
                <line x1="36" y1="24" x2="40" y2="24" />
              </svg>
              <p className={styles.stateTitle}>
                Encuentra el repuesto exacto para tu vehículo
              </p>
              <p className={styles.stateText}>
                {isNoGen
                  ? "Selecciona marca y modelo para ver repuestos compatibles."
                  : "Completa los filtros de marca, modelo y generación para ver repuestos compatibles."}
              </p>
            </div>
          )}

          {searchState === "loading" && (
            <div className={styles.stateMessage}>
              <div className={styles.spinner} />
              <p className={styles.stateText}>Buscando repuestos...</p>
            </div>
          )}

          {searchState === "results" && (
            <>
              <p className={styles.resultsCount}>
                {products.length} repuesto{products.length !== 1 ? "s" : ""}{" "}
                encontrado{products.length !== 1 ? "s" : ""}
              </p>
              <div className={styles.productList}>
                {paginated.map((p) => (
                  <Link key={p.id} href={`/productos/${p.slug}`} className={styles.productCardLink}>
                    <article className={styles.productCard}>
                      <div className={styles.productImage}>
                        {p.images[0] ? (
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            sizes="100px"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <svg
                            className={styles.productImagePlaceholder}
                            viewBox="0 0 40 40"
                            fill="none"
                            stroke="#d1d5db"
                            strokeWidth="1.5"
                          >
                            <circle cx="20" cy="20" r="12" />
                            <circle cx="20" cy="20" r="4" />
                          </svg>
                        )}
                      </div>
                      <div className={styles.productInfo}>
                        <span className={styles.productSku}>{p.sku}</span>
                        <h3 className={styles.productName}>{p.name}</h3>
                        <span className={styles.productCategory}>
                          {p.category.name}
                        </span>
                        {p.compatibility && p.compatibility.length > 0 && (
                          <span className={styles.productCompat}>
                            {p.compatibility[0].vehicleGeneration.model.brand.name}{" "}
                            {p.compatibility[0].vehicleGeneration.model.name}{" "}
                            — {p.compatibility[0].vehicleGeneration.name}
                          </span>
                        )}
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.pageBtn}
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className={styles.pageInfo}>
                    {page} / {totalPages}
                  </span>
                  <button
                    className={styles.pageBtn}
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}

          {searchState === "empty" && (
            <div className={styles.stateMessage}>
              <svg
                className={styles.stateIcon}
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <circle cx="20" cy="20" r="14" />
                <line x1="30" y1="30" x2="42" y2="42" />
                <line x1="15" y1="20" x2="25" y2="20" />
              </svg>
              <p className={styles.stateTitle}>Sin resultados</p>
              <p className={styles.stateText}>
                No encontramos repuestos con estos filtros. Intenta con otra
                selección.
              </p>
            </div>
          )}

          {searchState === "error" && (
            <div className={styles.stateMessage}>
              <p className={styles.stateTitle}>Error al buscar</p>
              <p className={styles.stateText}>
                No pudimos completar la búsqueda. Revisa tu conexión e intenta
                de nuevo.
              </p>
              <button className={styles.retryButton} onClick={handleSearch}>
                Reintentar
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
