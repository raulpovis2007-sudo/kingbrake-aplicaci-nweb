"use client";

import { FileText, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import styles from "./MisCotizaciones.module.css";

interface Quote {
  id: string;
  productName: string;
  productSku: string;
  productPrice: number;
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
  adminNote: string | null;
  createdAt: string;
}

const STATUS_CONFIG = {
  PENDING: { label: "Pendiente", icon: Clock, className: "pending" },
  CONFIRMED: { label: "Confirmado", icon: CheckCircle, className: "confirmed" },
  DELIVERED: { label: "Entregado", icon: Truck, className: "delivered" },
  CANCELLED: { label: "Cancelado", icon: XCircle, className: "cancelled" },
} as const;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CotizacionesClient({ quotes }: { quotes: Quote[] }) {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Mis Cotizaciones</h1>

        {quotes.length === 0 ? (
          <div className={styles.empty}>
            <FileText size={48} strokeWidth={1} />
            <p>Aún no has realizado ninguna cotización.</p>
            <a href="/catalogo" className={styles.ctaBtn}>Ver catálogo</a>
          </div>
        ) : (
          <div className={styles.list}>
            {quotes.map((q) => {
              const cfg = STATUS_CONFIG[q.status];
              const Icon = cfg.icon;
              return (
                <div key={q.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <div>
                      <h3 className={styles.productName}>{q.productName}</h3>
                      <p className={styles.sku}>SKU: {q.productSku}</p>
                    </div>
                    <span className={`${styles.badge} ${styles[cfg.className]}`}>
                      <Icon size={14} />
                      {cfg.label}
                    </span>
                  </div>
                  <div className={styles.cardBottom}>
                    <span className={styles.price}>S/ {q.productPrice.toFixed(2)}</span>
                    <span className={styles.date}>{formatDate(q.createdAt)}</span>
                  </div>
                  {q.adminNote && (
                    <p className={styles.note}>Nota: {q.adminNote}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
