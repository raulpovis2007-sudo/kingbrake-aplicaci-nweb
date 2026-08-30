"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LINEAS_PRODUCTO } from "@/lib/lineas-producto";
import styles from "./BuscadorRepuestos.module.css";

interface Brand {
  id: string;
  name: string;
}

interface Model {
  id: string;
  name: string;
  yearFrom: number;
  yearTo: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sku: string;
  images: string[];
  category: { name: string; slug: string };
}

type SearchState = "idle" | "loading" | "results" | "empty" | "error";

export default function BuscadorRepuestos() {
  const searchParams = useSearchParams();
  const lineaSlug = searchParams.get("linea");
  const linea = LINEAS_PRODUCTO.find((l) => l.slug === lineaSlug);

  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [year, setYear] = useState("");
  const [categorySlug, setCategorySlug] = useState("");

  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchState, setSearchState] = useState<SearchState>("idle");

  useEffect(() => {
    fetch("/api/vehicles/brands")
      .then((r) => r.json())
      .then(setBrands)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setModelId("");
    setYear("");
    if (!brandId) {
      setModels([]);
      return;
    }
    fetch(`/api/vehicles/models?brandId=${brandId}`)
      .then((r) => r.json())
      .then(setModels)
      .catch(() => setModels([]));
  }, [brandId]);

  useEffect(() => {
    setYear("");
  }, [modelId]);

  useEffect(() => {
    if (linea && linea.categorias.length === 1) {
      setCategorySlug(linea.categorias[0].slug);
    } else {
      setCategorySlug("");
    }
    setSearchState("idle");
    setProducts([]);
  }, [lineaSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedModel = models.find((m) => m.id === modelId);
  const years = selectedModel
    ? Array.from(
        { length: selectedModel.yearTo - selectedModel.yearFrom + 1 },
        (_, i) => selectedModel.yearTo - i,
      )
    : [];

  const canSearch = !!(lineaSlug && brandId && modelId && year && categorySlug);

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
          modelId,
          year: parseInt(year),
          categorySlug,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(data);
      setSearchState(data.length > 0 ? "results" : "empty");
    } catch {
      setSearchState("error");
    }
  }, [canSearch, lineaSlug, brandId, modelId, year, categorySlug]);

  if (!linea) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.lineaPicker}>
          <h1 className={styles.lineaPickerTitle}>Buscar repuestos</h1>
          <p className={styles.lineaPickerText}>
            Selecciona una línea de producto para comenzar
          </p>
          <div className={styles.lineaGrid}>
            {LINEAS_PRODUCTO.map((l) => (
              <Link
                key={l.slug}
                href={`/productos?linea=${l.slug}`}
                className={styles.lineaCard}
              >
                <div className={styles.lineaCardImg}>
                  <Image
                    src={l.imagen}
                    alt={l.nombre}
                    fill
                    sizes="160px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <span>{l.nombre}</span>
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
        {LINEAS_PRODUCTO.map((l) => (
          <Link
            key={l.slug}
            href={`/productos?linea=${l.slug}`}
            className={`${styles.lineaTab} ${l.slug === lineaSlug ? styles.lineaTabActive : ""}`}
          >
            {l.nombre}
          </Link>
        ))}
      </nav>

      <div className={styles.layout}>
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

          <div className={styles.field}>
            <label className={styles.label} htmlFor="year">
              Año
            </label>
            <select
              id="year"
              className={styles.select}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={!modelId}
            >
              <option value="">
                {modelId ? "Seleccionar año" : "Primero selecciona modelo"}
              </option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {linea.categorias.length > 1 && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="type">
                Tipo de repuesto
              </label>
              <select
                id="type"
                className={styles.select}
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
              >
                <option value="">Seleccionar tipo</option>
                {linea.categorias.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.nombre}
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
                Completa los filtros de marca, modelo y año para ver repuestos
                compatibles.
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
                {products.map((p) => (
                  <article key={p.id} className={styles.productCard}>
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
                      <p className={styles.productDescription}>
                        {p.description}
                      </p>
                    </div>
                    <div className={styles.productPriceCol}>
                      <span className={styles.productPrice}>
                        S/{p.price.toFixed(2)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
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
                No encontramos repuestos con estos filtros. Intenta con otro
                modelo o tipo de repuesto.
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
