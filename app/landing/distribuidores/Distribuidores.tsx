"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { MapPin, Phone, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import styles from "./Distribuidores.module.css";

const DistribuidorMap = dynamic(() => import("./DistribuidorMap"), {
  ssr: false,
  loading: () => <div className={styles.mapSkeleton} />,
});

interface Distributor {
  id: string;
  name: string;
  address: string;
  region: string;
  lat: number;
  lng: number;
  phone: string | null;
}

const PER_PAGE = 4;
const MOCK_IMAGE = "/assets/images/categorias/pastilla-freno.webp";

export default function Distribuidores() {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [region, setRegion] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/distributors")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setDistributors(data); })
      .catch(() => {});
  }, []);

  const regions = useMemo(() => {
    const set = new Set(distributors.map((d) => d.region));
    return Array.from(set).sort();
  }, [distributors]);

  const filtered = useMemo(
    () => region ? distributors.filter((d) => d.region === region) : distributors,
    [distributors, region]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => {
    setPage(1);
    setSelectedId(null);
  }, [region]);

  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const mapRef = useRef<HTMLDivElement>(null);
  const skipFlyTo = useRef(false);
  const pendingScrollId = useRef<string | null>(null);
  const pendingScrollTarget = useRef<"card" | "map" | null>(null);

  const handleSelect = useCallback((id: string, source: "card" | "map" = "card") => {
    const next = id === selectedId ? null : id;
    const mobile = window.innerWidth < 1024;

    if (mobile && source === "map") skipFlyTo.current = true;

    setSelectedId(next);
    if (!next) return;

    const idx = filtered.findIndex((d) => d.id === next);
    if (idx === -1) return;

    const targetPage = Math.floor(idx / PER_PAGE) + 1;
    const needsPageChange = targetPage !== page;

    if (needsPageChange) {
      setPage(targetPage);
    }

    if (!mobile) return;

    const target = source === "card" ? "map" : "card";

    if (needsPageChange && target === "card") {
      pendingScrollId.current = next;
      pendingScrollTarget.current = "card";
    } else {
      setTimeout(() => {
        if (target === "map") {
          mapRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else {
          cardRefs.current.get(next)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [selectedId, filtered, page]);

  useEffect(() => {
    if (pendingScrollId.current) {
      const id = pendingScrollId.current;
      const target = pendingScrollTarget.current;
      pendingScrollId.current = null;
      pendingScrollTarget.current = null;
      requestAnimationFrame(() => {
        if (target === "card") {
          cardRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          mapRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });
    }
  }, [page]);

  const mapsUrl = (d: Distributor) =>
    `https://www.google.com/maps/search/?api=1&query=${d.lat},${d.lng}`;

  return (
    <section className={styles.section} id="distribuidores">
      <div className={styles.container}>
        <div className={styles.ctaBanner}>
          <div className={styles.ctaBlock}>
            <h3 className={styles.ctaTitle}>ENCUENTRA KINGBRAKE CERCA DE TI</h3>
            <p className={styles.ctaText}>Encuentra nuestros productos en nuestra red de distribuidores y puntos de venta a nivel nacional.</p>
          </div>
          <div className={styles.ctaBlock}>
            <h3 className={styles.ctaTitle}>¿QUIERES SER PARTE DE NUESTRA RED?</h3>
            <p className={styles.ctaText}>Si deseas distribuir KINGBRAKE y formar parte de nuestra red de aliados comerciales. Escríbenos a nuestro canal de atención al cliente.</p>
          </div>
        </div>

        <div className={styles.filters}>
          <select
            className={styles.regionSelect}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">Todas las regiones</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <span className={styles.resultCount}>
            {filtered.length} punto{filtered.length !== 1 && "s"} de venta
          </span>
        </div>

        <div className={styles.layout}>
          <div className={styles.panel}>
            <div className={styles.grid}>
              {paginated.map((d) => (
                <div
                  key={d.id}
                  ref={(el) => { if (el) cardRefs.current.set(d.id, el); else cardRefs.current.delete(d.id); }}
                  className={`${styles.card} ${selectedId === d.id ? styles.cardActive : ""}`}
                  onClick={() => handleSelect(d.id)}
                >
                  <div className={styles.cardImageBox}>
                    <Image
                      src={MOCK_IMAGE}
                      alt={d.name}
                      fill
                      sizes="280px"
                      className={styles.cardImage}
                    />
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardName}>{d.name}</h3>
                      <span className={styles.cardRegion}>{d.region}</span>
                    </div>
                    <p className={styles.cardAddress}>
                      <MapPin size={14} />
                      {d.address}
                    </p>
                    {d.phone && (
                      <a
                        href={`tel:${d.phone}`}
                        className={styles.cardPhone}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone size={14} />
                        {d.phone}
                      </a>
                    )}
                    <a
                      href={mapsUrl(d)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.cardMapsLink}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} />
                      Ver en Google Maps
                    </a>
                  </div>
                </div>
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
          </div>

          <div className={styles.mapContainer} ref={mapRef}>
            <DistribuidorMap
              distributors={filtered}
              selectedId={selectedId}
              onSelect={handleSelect}
              skipFlyTo={skipFlyTo}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
