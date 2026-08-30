"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { MapPin, Phone } from "lucide-react";
import styles from "./Distribuidores.module.css";

const DistribuidorMap = dynamic(() => import("./DistribuidorMap"), {
  ssr: false,
  loading: () => <div className={styles.mapSkeleton} />,
});

interface Distributor {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
}

export default function Distribuidores() {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    fetch("/api/distributors")
      .then((r) => r.json())
      .then(setDistributors)
      .catch(() => {});
  }, []);

  const handleSelect = (id: string) => {
    const next = id === selectedId ? null : id;
    setSelectedId(next);
    if (next) {
      const el = itemRefs.current.get(next);
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <section className={styles.section} id="distribuidores">
      <div className={styles.container}>
        <p className={styles.subtitle}>Encuentra tu</p>
        <h2 className={styles.title}>Red de distribuidores</h2>

        <div className={styles.layout}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <MapPin size={16} />
              <span>
                {distributors.length} punto{distributors.length !== 1 && "s"} de
                venta
              </span>
            </div>

            <div className={styles.list}>
              {distributors.map((d) => (
                <button
                  key={d.id}
                  ref={(el) => {
                    if (el) itemRefs.current.set(d.id, el);
                  }}
                  className={`${styles.item} ${selectedId === d.id ? styles.itemActive : ""}`}
                  onClick={() => handleSelect(d.id)}
                >
                  <div className={styles.itemDot} />
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{d.name}</span>
                    <span className={styles.itemAddress}>{d.address}</span>
                    {d.phone && (
                      <a
                        href={`tel:${d.phone}`}
                        className={styles.itemPhone}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone size={12} />
                        {d.phone}
                      </a>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.mapContainer}>
            <DistribuidorMap
              distributors={distributors}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
