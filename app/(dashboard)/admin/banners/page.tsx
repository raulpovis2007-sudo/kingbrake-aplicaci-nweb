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
  ImageIcon,
} from "lucide-react";
import styles from "./AdminBanners.module.css";

const TABS = [
  { type: "HERO", label: "Hero (portada)" },
  { type: "BANNER", label: "Banners / Campañas" },
  { type: "NOSOTROS_VIDEO", label: "Video Quiénes Somos" },
] as const;

type TabType = (typeof TABS)[number]["type"];

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

export default function AdminBannersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("type") as TabType) || "HERO";

  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchBanners();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function fetchBanners() {
    try {
      const res = await fetch(`/api/admin/banners?type=${activeTab}`);
      if (res.ok) setBanners(await res.json());
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(banner: Banner) {
    try {
      const res = await fetch(`/api/admin/banners/${banner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      if (res.ok) {
        setBanners((prev) =>
          prev.map((b) =>
            b.id === banner.id ? { ...b, isActive: !b.isActive } : b
          )
        );
      }
    } catch (error) {
      console.error("Error toggling banner:", error);
    }
  }

  async function deleteBanner(banner: Banner) {
    if (!confirm(`¿Eliminar "${banner.title}"?`)) return;
    setDeleting(banner.id);
    try {
      const res = await fetch(`/api/admin/banners/${banner.id}`, { method: "DELETE" });
      if (res.ok) setBanners((prev) => prev.filter((b) => b.id !== banner.id));
    } catch (error) {
      console.error("Error deleting banner:", error);
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

    const newBanners = [...banners];
    const dragIndex = newBanners.findIndex((b) => b.id === draggingId);
    const dropIndex = newBanners.findIndex((b) => b.id === targetId);
    const [dragged] = newBanners.splice(dragIndex, 1);
    newBanners.splice(dropIndex, 0, dragged);

    setBanners(newBanners);
    setDraggingId(null);
    saveOrder(newBanners.map((b) => b.id));
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

  const tabLabel = TABS.find((t) => t.type === activeTab)?.label ?? activeTab;
  const isVideo = activeTab === "NOSOTROS_VIDEO";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Imágenes y Medios</h1>
          <p className={styles.subtitle}>
            Gestiona las imágenes del hero, banners y video
            {saving && <span className={styles.savingBadge}>Guardando...</span>}
          </p>
        </div>
        <Link href={`/admin/banners/nuevo?type=${activeTab}`} className={styles.addButton}>
          <Plus size={20} />
          {isVideo ? "Agregar video" : "Nueva imagen"}
        </Link>
      </div>

      <nav className={styles.tabs}>
        {TABS.map((tab) => (
          <Link
            key={tab.type}
            href={`/admin/banners?type=${tab.type}`}
            className={`${styles.tab} ${activeTab === tab.type ? styles.tabActive : ""}`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {loading ? (
        <div className={styles.loading}>Cargando...</div>
      ) : banners.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><ImageIcon size={48} /></div>
          <p>No hay elementos en {tabLabel}</p>
          <Link href={`/admin/banners/nuevo?type=${activeTab}`} className={styles.addButton}>
            <Plus size={20} />
            {isVideo ? "Agregar video" : "Agregar imagen"}
          </Link>
        </div>
      ) : (
        <>
          {banners.length > 1 && (
            <p className={styles.dragHint}>
              <GripVertical size={16} />
              Arrastra las filas para reordenar
            </p>
          )}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th>{isVideo ? "Video" : "Imagen"}</th>
                  {!isVideo && <th>Link</th>}
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr
                    key={banner.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, banner.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, banner.id)}
                    onDragEnd={() => setDraggingId(null)}
                    className={draggingId === banner.id ? styles.dragging : ""}
                  >
                    <td className={styles.dragHandle}><GripVertical size={16} /></td>
                    <td>
                      <div className={styles.reelInfo}>
                        <div className={styles.thumbnail}>
                          {isVideo ? (
                            <video src={banner.image} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <img src={banner.image} alt={banner.title} />
                          )}
                        </div>
                        <div className={styles.reelText}>
                          <span className={styles.reelTitle}>{banner.title}</span>
                        </div>
                      </div>
                    </td>
                    {!isVideo && (
                      <td>
                        <span className={styles.viewsCell} style={{ fontSize: "0.8rem" }}>
                          {banner.link ? banner.link.slice(0, 40) + (banner.link.length > 40 ? "..." : "") : "Sin link"}
                        </span>
                      </td>
                    )}
                    <td className={styles.viewsCell}>{formatDate(banner.startDate)}</td>
                    <td className={styles.viewsCell}>{formatDate(banner.endDate)}</td>
                    <td>
                      <button
                        onClick={() => toggleActive(banner)}
                        className={`${styles.statusBadge} ${banner.isActive ? styles.active : styles.inactive}`}
                      >
                        {banner.isActive ? <><Eye size={14} /> Activo</> : <><EyeOff size={14} /> Oculto</>}
                      </button>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => router.push(`/admin/banners/${banner.id}/editar`)}
                          className={styles.actionButton}
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteBanner(banner)}
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          title="Eliminar"
                          disabled={deleting === banner.id}
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
