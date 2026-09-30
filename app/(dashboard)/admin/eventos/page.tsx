"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pencil,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  GripVertical,
  CalendarDays,
  ExternalLink,
} from "lucide-react";
import styles from "../banners/AdminBanners.module.css";

interface Banner {
  id: string;
  title: string;
  image: string;
  link: string | null;
  type: string;
  sortOrder: number;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

const FILTERS = [
  { value: "", label: "Todos" },
  { value: "EVENT", label: "Landing" },
  { value: "SOPORTE", label: "Soporte Técnico" },
] as const;

const DESTINO_LABELS: Record<string, string> = {
  EVENT: "Landing",
  SOPORTE: "Soporte Técnico",
};

export default function AdminEventosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get("filter") || "";
  const [eventos, setEventos] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEventos();
  }, []);

  async function fetchEventos() {
    try {
      const res = await fetch("/api/admin/banners?type=EVENT,SOPORTE");
      if (res.ok) setEventos(await res.json());
    } catch (error) {
      console.error("Error fetching eventos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(evento: Banner) {
    try {
      const res = await fetch(`/api/admin/banners/${evento.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !evento.isActive }),
      });
      if (res.ok) {
        setEventos((prev) =>
          prev.map((e) => (e.id === evento.id ? { ...e, isActive: !e.isActive } : e))
        );
      }
    } catch (error) {
      console.error("Error toggling evento:", error);
    }
  }

  async function deleteEvento(evento: Banner) {
    if (!confirm(`¿Eliminar "${evento.title}"?`)) return;
    setDeleting(evento.id);
    try {
      const res = await fetch(`/api/admin/banners/${evento.id}`, { method: "DELETE" });
      if (res.ok) setEventos((prev) => prev.filter((e) => e.id !== evento.id));
    } catch (error) {
      console.error("Error deleting evento:", error);
    } finally {
      setDeleting(null);
    }
  }

  function handleDragStart(e: React.DragEvent, id: string) {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    if (draggingId === null || draggingId === targetId) return;

    const newEventos = [...eventos];
    const dragIndex = newEventos.findIndex((e) => e.id === draggingId);
    const dropIndex = newEventos.findIndex((e) => e.id === targetId);
    const [dragged] = newEventos.splice(dragIndex, 1);
    newEventos.splice(dropIndex, 0, dragged);

    setEventos(newEventos);
    setDraggingId(null);
    saveOrder(newEventos.map((e) => e.id));
  }

  async function saveOrder(orderedIds: string[]) {
    setSaving(true);
    try {
      await fetch("/api/admin/banners/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
    } catch (error) {
      console.error("Error saving order:", error);
    } finally {
      setSaving(false);
    }
  }

  const filtered = activeFilter
    ? eventos.filter((e) => e.type === activeFilter)
    : eventos;

  const formatDate = (d: string | null) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Lima" });
  };

  const isExpired = (evento: Banner) => {
    if (!evento.endDate) return false;
    return new Date(evento.endDate) < new Date();
  };

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Cargando eventos...</div></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Nuevas Aplicaciones</h1>
          <p className={styles.subtitle}>
            Gestiona las publicaciones de nuevas aplicaciones
            {saving && <span className={styles.savingBadge}>Guardando...</span>}
          </p>
        </div>
        <Link href="/admin/eventos/nuevo" className={styles.addButton}>
          <Plus size={20} />
          Nueva publicación
        </Link>
      </div>

      <nav className={styles.tabs}>
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/eventos?filter=${f.value}` : "/admin/eventos"}
            className={`${styles.tab} ${activeFilter === f.value ? styles.tabActive : ""}`}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><CalendarDays size={48} /></div>
          <p>No hay publicaciones todavía</p>
          <Link href="/admin/eventos/nuevo" className={styles.addButton}>
            <Plus size={20} />
            Crear primera publicación
          </Link>
        </div>
      ) : (
        <>
          <p className={styles.dragHint}>
            <GripVertical size={16} />
            Arrastra las filas para reordenar las publicaciones
          </p>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th>Publicación</th>
                  <th>Destino</th>
                  <th>Programación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((evento) => {
                  const expired = isExpired(evento);
                  const start = formatDate(evento.startDate);
                  const end = formatDate(evento.endDate);
                  return (
                  <tr
                    key={evento.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, evento.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, evento.id)}
                    onDragEnd={() => setDraggingId(null)}
                    className={`${draggingId === evento.id ? styles.dragging : ""} ${expired ? styles.expiredRow : ""}`}
                  >
                    <td className={styles.dragHandle}><GripVertical size={16} /></td>
                    <td>
                      <div className={styles.reelInfo}>
                        <div className={styles.thumbnail} style={expired ? { opacity: 0.5, filter: "grayscale(1)" } : undefined}>
                          <img src={evento.image} alt={evento.title} />
                        </div>
                        <div className={styles.reelText}>
                          <span className={styles.reelTitle}>{evento.title}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.categoryBadge} style={{ backgroundColor: evento.type === "EVENT" ? "#3b82f6" : "#8b5cf6" }}>
                        {DESTINO_LABELS[evento.type] || evento.type}
                      </span>
                    </td>
                    <td className={styles.viewsCell}>
                      {start || end ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: "0.8rem" }}>
                          {start && <span>Desde: {start}</span>}
                          {end && <span style={expired ? { color: "#dc2626", fontWeight: 600 } : undefined}>Hasta: {end}</span>}
                        </div>
                      ) : (
                        <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>Permanente</span>
                      )}
                      {expired && <span style={{ display: "inline-block", marginTop: 4, padding: "2px 6px", background: "#fef2f2", color: "#dc2626", borderRadius: 4, fontSize: "0.7rem", fontWeight: 600 }}>Vencida</span>}
                    </td>
                    <td>
                      <button
                        onClick={() => toggleActive(evento)}
                        className={`${styles.statusBadge} ${evento.isActive ? styles.active : styles.inactive}`}
                      >
                        {evento.isActive ? <><Eye size={14} /> Activo</> : <><EyeOff size={14} /> Oculto</>}
                      </button>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => router.push(`/admin/eventos/${evento.id}/editar`)}
                          className={styles.actionButton}
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteEvento(evento)}
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          title="Eliminar"
                          disabled={deleting === evento.id}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
