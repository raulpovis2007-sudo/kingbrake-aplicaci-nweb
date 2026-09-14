"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  MapPin,
  X,
  Search,
} from "lucide-react";
import styles from "./AdminDistribuidores.module.css";

interface Distributor {
  id: string;
  name: string;
  address: string;
  region: string;
  lat: number;
  lng: number;
  phone: string | null;
  isActive: boolean;
}

interface FormData {
  name: string;
  address: string;
  region: string;
  phone: string;
  mapsUrl: string;
}

const REGIONES: Record<string, string[]> = {
  Norte: ["Tumbes", "Piura", "Lambayeque", "La Libertad", "Cajamarca", "Amazonas", "San Martín"],
  Centro: ["Lima", "Callao", "Áncash", "Huánuco", "Pasco", "Junín", "Ica", "Huancavelica"],
  Sur: ["Arequipa", "Moquegua", "Tacna", "Ayacucho", "Apurímac", "Cusco", "Puno", "Madre de Dios"],
  Oriente: ["Loreto", "Ucayali"],
};

const EMPTY_FORM: FormData = { name: "", address: "", region: "Lima", phone: "", mapsUrl: "" };

function parseCoordsFromUrl(url: string): { lat: number; lng: number } | null {
  if (!url.trim()) return null;
  // @lat,lng,zoom
  const atMatch = url.match(/@(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  // ?q=lat,lng or query=lat,lng
  const qMatch = url.match(/[?&](?:q|query)=(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
  // place/.../@lat,lng
  const placeMatch = url.match(/place\/[^/]+\/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (placeMatch) return { lat: parseFloat(placeMatch[1]), lng: parseFloat(placeMatch[2]) };
  // ll=lat,lng
  const llMatch = url.match(/ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch) return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  return null;
}

export default function AdminDistribuidoresPage() {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [coordsPreview, setCoordsPreview] = useState<{ lat: number; lng: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterRegion, setFilterRegion] = useState("");

  const filtered = useMemo(() => {
    let list = distributors;
    if (filterRegion) list = list.filter((d) => d.region === filterRegion);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((d) =>
        d.name.toLowerCase().includes(q) || d.address.toLowerCase().includes(q)
      );
    }
    return list;
  }, [distributors, filterRegion, search]);

  useEffect(() => {
    fetchDistributors();
  }, []);

  async function fetchDistributors() {
    try {
      const res = await fetch("/api/admin/distributors");
      if (res.ok) setDistributors(await res.json());
    } catch (err) {
      console.error("Error fetching distributors:", err);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setCoordsPreview(null);
    setError("");
    setShowModal(true);
  }

  function openEdit(d: Distributor) {
    setEditingId(d.id);
    setForm({
      name: d.name,
      address: d.address,
      region: d.region,
      phone: d.phone || "",
      mapsUrl: "",
    });
    setCoordsPreview({ lat: d.lat, lng: d.lng });
    setError("");
    setShowModal(true);
  }

  function handleMapsUrlChange(url: string) {
    setForm((f) => ({ ...f, mapsUrl: url }));
    const coords = parseCoordsFromUrl(url);
    setCoordsPreview(coords);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const coords = editingId ? (coordsPreview || null) : parseCoordsFromUrl(form.mapsUrl);
    if (!coords) {
      setError("No se pudieron extraer coordenadas. Pega un link válido de Google Maps.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        address: form.address,
        region: form.region,
        phone: form.phone || null,
        lat: coords.lat,
        lng: coords.lng,
      };

      const res = editingId
        ? await fetch(`/api/admin/distributors/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/distributors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al guardar");
        return;
      }

      setShowModal(false);
      fetchDistributors();
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(d: Distributor) {
    try {
      const res = await fetch(`/api/admin/distributors/${d.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !d.isActive }),
      });
      if (res.ok) {
        setDistributors((prev) =>
          prev.map((x) => (x.id === d.id ? { ...x, isActive: !x.isActive } : x))
        );
      }
    } catch (err) {
      console.error("Error toggling distributor:", err);
    }
  }

  async function handleDelete(d: Distributor) {
    if (!confirm(`¿Eliminar "${d.name}"?`)) return;
    setDeleting(d.id);
    try {
      const res = await fetch(`/api/admin/distributors/${d.id}`, { method: "DELETE" });
      if (res.ok) setDistributors((prev) => prev.filter((x) => x.id !== d.id));
    } catch (err) {
      console.error("Error deleting distributor:", err);
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Cargando distribuidores...</div></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Distribuidores</h1>
          <p className={styles.subtitle}>Gestiona los puntos de venta de King Brake</p>
        </div>
        <button onClick={openCreate} className={styles.addButton}>
          <Plus size={20} />
          Nuevo distribuidor
        </button>
      </div>

      {distributors.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><MapPin size={48} /></div>
          <p>No hay distribuidores todavía</p>
          <button onClick={openCreate} className={styles.addButton}>
            <Plus size={20} />
            Crear primer distribuidor
          </button>
        </div>
      ) : (
        <>
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <Search size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o dirección..."
                className={styles.searchInput}
              />
            </div>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Todas las regiones</option>
              {Object.entries(REGIONES).map(([zona, regiones]) => (
                <optgroup key={zona} label={`— ${zona} —`}>
                  {regiones.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <span className={styles.resultCount}>
              {filtered.length} de {distributors.length}
            </span>
          </div>
          <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Región</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td><span className={styles.cellName}>{d.name}</span></td>
                  <td><span className={styles.cellAddress}>{d.address}</span></td>
                  <td><span className={styles.cellRegion}>{d.region}</span></td>
                  <td><span className={styles.cellPhone}>{d.phone || "—"}</span></td>
                  <td>
                    <button
                      onClick={() => toggleActive(d)}
                      className={`${styles.statusBadge} ${d.isActive ? styles.active : styles.inactive}`}
                    >
                      {d.isActive ? <><Eye size={14} /> Activo</> : <><EyeOff size={14} /> Oculto</>}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button onClick={() => openEdit(d)} className={styles.actionButton} title="Editar">
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(d)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        title="Eliminar"
                        disabled={deleting === d.id}
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

      {/* Modal */}
      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? "Editar distribuidor" : "Nuevo distribuidor"}</h2>
              <button onClick={() => setShowModal(false)} className={styles.closeBtn}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Nombre *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Ej: AutoPartes San Miguel"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Región *</label>
                  <select
                    value={form.region}
                    onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                    required
                    className={styles.select}
                  >
                    {Object.entries(REGIONES).map(([zona, regiones]) => (
                      <optgroup key={zona} label={`— ${zona} —`}>
                        {regiones.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div className={styles.fieldFull}>
                  <label>Dirección *</label>
                  <input
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    placeholder="Ej: Av. Colonial 1234, Cercado de Lima"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Teléfono</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="Ej: 01 702 4590"
                  />
                </div>
                <div className={styles.field}>
                  <label>Link de Google Maps *</label>
                  <input
                    value={form.mapsUrl}
                    onChange={(e) => handleMapsUrlChange(e.target.value)}
                    placeholder="Pega el link de Google Maps aquí"
                    required={!editingId}
                  />
                  {coordsPreview && (
                    <span className={styles.coordsHint}>
                      📍 {coordsPreview.lat.toFixed(6)}, {coordsPreview.lng.toFixed(6)}
                    </span>
                  )}
                  {form.mapsUrl && !coordsPreview && (
                    <span className={styles.coordsError}>
                      No se detectaron coordenadas en el link
                    </span>
                  )}
                </div>
              </div>

              {error && <p className={styles.formError}>{error}</p>}

              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitBtn} disabled={saving}>
                  {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear distribuidor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
