"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  GripVertical,
  CalendarDays,
} from "lucide-react";
import styles from "../banners/AdminBanners.module.css";

interface Banner {
  id: string;
  title: string;
  image: string;
  link: string | null;
  sortOrder: number;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

export default function AdminEventosPage() {
  const router = useRouter();
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
      const res = await fetch("/api/admin/banners?type=EVENT");
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

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
  };

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Cargando eventos...</div></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Eventos y Exhibiciones</h1>
          <p className={styles.subtitle}>
            Gestiona las fotos de eventos del carrusel de la landing
            {saving && <span className={styles.savingBadge}>Guardando...</span>}
          </p>
        </div>
        <Link href="/admin/eventos/nuevo" className={styles.addButton}>
          <Plus size={20} />
          Nuevo Evento
        </Link>
      </div>

      {eventos.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><CalendarDays size={48} /></div>
          <p>No hay eventos todavía</p>
          <Link href="/admin/eventos/nuevo" className={styles.addButton}>
            <Plus size={20} />
            Crear primer evento
          </Link>
        </div>
      ) : (
        <>
          <p className={styles.dragHint}>
            <GripVertical size={16} />
            Arrastra las filas para reordenar los eventos
          </p>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th>Evento</th>
                  <th>Link</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {eventos.map((evento) => (
                  <tr
                    key={evento.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, evento.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, evento.id)}
                    onDragEnd={() => setDraggingId(null)}
                    className={draggingId === evento.id ? styles.dragging : ""}
                  >
                    <td className={styles.dragHandle}><GripVertical size={16} /></td>
                    <td>
                      <div className={styles.reelInfo}>
                        <div className={styles.thumbnail}>
                          <img src={evento.image} alt={evento.title} />
                        </div>
                        <div className={styles.reelText}>
                          <span className={styles.reelTitle}>{evento.title}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.viewsCell} style={{ fontSize: "0.8rem" }}>
                        {evento.link ? evento.link.slice(0, 40) + (evento.link.length > 40 ? "..." : "") : "Sin link"}
                      </span>
                    </td>
                    <td className={styles.viewsCell}>{formatDate(evento.startDate)}</td>
                    <td className={styles.viewsCell}>{formatDate(evento.endDate)}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
