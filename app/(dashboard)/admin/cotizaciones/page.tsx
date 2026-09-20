"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  X,
  Save,
  FileText,
} from "lucide-react";
import styles from "./AdminCotizaciones.module.css";

interface Quote {
  id: string;
  productName: string;
  productSku: string;
  productPrice: number;
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
  adminNote: string | null;
  createdAt: string;
  user: { name: string; email: string; phone: string | null };
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

export default function AdminCotizacionesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Quote | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNote, setEditNote] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/quotes?${params}`);
    const data = await res.json();
    setQuotes(data);
    setLoading(false);
  }, [statusFilter, search]);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  const openModal = (q: Quote) => {
    setSelected(q);
    setEditStatus(q.status);
    setEditNote(q.adminNote || "");
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    await fetch(`/api/admin/quotes/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: editStatus, adminNote: editNote }),
    });
    setSaving(false);
    setSelected(null);
    fetchQuotes();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cotizaciones</h1>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={16} />
          <input
            className={styles.searchInput}
            placeholder="Buscar por cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchQuotes()}
          />
        </div>
        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="PENDING">Pendiente</option>
          <option value="CONFIRMED">Confirmado</option>
          <option value="DELIVERED">Entregado</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
      </div>

      {loading ? (
        <p className={styles.loading}>Cargando...</p>
      ) : quotes.length === 0 ? (
        <div className={styles.empty}>
          <FileText size={48} strokeWidth={1} />
          <p>No hay cotizaciones.</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => {
                const cfg = STATUS_CONFIG[q.status];
                return (
                  <tr key={q.id} onClick={() => openModal(q)} className={styles.row}>
                    <td className={styles.dateCell}>{formatDate(q.createdAt)}</td>
                    <td>
                      <div className={styles.clientName}>{q.user.name}</div>
                      <div className={styles.clientEmail}>{q.user.email}</div>
                    </td>
                    <td>
                      <div className={styles.productCell}>{q.productName}</div>
                      <div className={styles.skuCell}>{q.productSku}</div>
                    </td>
                    <td className={styles.priceCell}>S/ {q.productPrice.toFixed(2)}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[cfg.className]}`}>{cfg.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Detalle de cotización</h2>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>
                <X size={18} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.infoGroup}>
                <h3>Cliente</h3>
                <p>{selected.user.name}</p>
                <p className={styles.secondary}>{selected.user.email}</p>
                {selected.user.phone && <p className={styles.secondary}>{selected.user.phone}</p>}
              </div>
              <div className={styles.infoGroup}>
                <h3>Producto</h3>
                <p>{selected.productName}</p>
                <p className={styles.secondary}>SKU: {selected.productSku}</p>
                <p className={styles.priceLabel}>S/ {selected.productPrice.toFixed(2)}</p>
              </div>
              <div className={styles.infoGroup}>
                <h3>Estado</h3>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className={styles.modalSelect}>
                  <option value="PENDING">Pendiente</option>
                  <option value="CONFIRMED">Confirmado</option>
                  <option value="DELIVERED">Entregado</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>
              <div className={styles.infoGroup}>
                <h3>Nota del administrador</h3>
                <textarea
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Agregar una nota..."
                />
              </div>
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setSelected(null)}>Cancelar</button>
                <button className={styles.saveModalBtn} onClick={handleSave} disabled={saving}>
                  <Save size={16} />
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
