"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, Plus, X, Clock, Upload, AlertTriangle, Eye, EyeOff } from "lucide-react";
import styles from "../categorias/AdminCategorias.module.css";

interface Milestone {
  id: string;
  year: number;
  month: number | null;
  title: string;
  description: string | null;
  image: string | null;
  order: number;
  isActive: boolean;
}

interface FormData {
  year: string;
  month: string;
  title: string;
  description: string;
  image: string;
}

const EMPTY_FORM: FormData = { year: "", month: "", title: "", description: "", image: "" };

const MONTHS = [
  "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

async function uploadImage(file: File): Promise<string> {
  const sigRes = await fetch("/api/admin/timeline/upload-signature", { method: "POST" });
  if (!sigRes.ok) throw new Error("Error al obtener firma");
  const { signature, timestamp, cloudName, apiKey, folder } = await sigRes.json();
  const fd = new FormData();
  fd.append("file", file);
  fd.append("signature", signature);
  fd.append("timestamp", timestamp.toString());
  fd.append("api_key", apiKey);
  fd.append("folder", folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Error al subir");
  return data.secure_url;
}

export default function AdminTimelinePage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  function isFormDirty() {
    return !!(form.year || form.title || form.description || form.image);
  }

  function tryCloseModal() {
    if (isFormDirty()) setShowConfirmClose(true);
    else setShowModal(false);
  }

  async function fetchData() {
    const res = await fetch("/api/admin/timeline");
    if (res.ok) setMilestones(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  function openNew() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  }

  function openEdit(m: Milestone) {
    setEditingId(m.id);
    setForm({
      year: String(m.year),
      month: m.month ? String(m.month) : "",
      title: m.title,
      description: m.description || "",
      image: m.image || "",
    });
    setError("");
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError("El título es obligatorio"); return; }
    if (!form.year || isNaN(Number(form.year))) { setError("El año es obligatorio"); return; }
    setSaving(true);
    setError("");

    const url = editingId ? `/api/admin/timeline/${editingId}` : "/api/admin/timeline";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: Number(form.year),
        month: form.month ? Number(form.month) : null,
        title: form.title,
        description: form.description,
        image: form.image,
      }),
    });

    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || "Error al guardar"); return; }
    setShowModal(false);
    fetchData();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este hito?")) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/timeline/${id}`, { method: "DELETE" });
    const data = await res.json();
    setDeleting(null);
    if (!res.ok) { alert(data.error || "Error al eliminar"); return; }
    fetchData();
  }

  async function toggleActive(m: Milestone) {
    await fetch(`/api/admin/timeline/${m.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !m.isActive }),
    });
    fetchData();
  }

  function formatDate(m: Milestone) {
    if (m.month) return `${MONTHS[m.month]} ${m.year}`;
    return String(m.year);
  }

  if (loading) return <div className={styles.container}><p>Cargando...</p></div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Línea de tiempo</h1>
        <button className={styles.addBtn} onClick={openNew}>
          <Plus size={18} /> Nuevo hito
        </button>
      </div>

      {milestones.length === 0 ? (
        <div className={styles.empty}>
          <Clock size={48} />
          <p>No hay hitos en la línea de tiempo</p>
          <button className={styles.addBtn} onClick={openNew}>
            <Plus size={18} /> Crear primer hito
          </button>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Título</th>
                <th>Imagen</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((m) => (
                <tr key={m.id} style={{ opacity: m.isActive ? 1 : 0.5 }}>
                  <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{formatDate(m)}</td>
                  <td className={styles.nameCell}>{m.title}</td>
                  <td>
                    {m.image ? (
                      <span style={{ display: "inline-block", width: 48, height: 36, borderRadius: 4, overflow: "hidden", position: "relative" }}>
                        <Image src={m.image} alt="" fill style={{ objectFit: "cover" }} sizes="48px" />
                      </span>
                    ) : (
                      <span style={{ color: "#999", fontSize: "0.8rem" }}>Sin imagen</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => toggleActive(m)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: m.isActive ? "#16a34a" : "#999" }}
                      title={m.isActive ? "Visible" : "Oculto"}
                    >
                      {m.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => openEdit(m)} title="Editar">
                        <Pencil size={16} />
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(m.id)} disabled={deleting === m.id} title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className={styles.overlay} onClick={tryCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? "Editar hito" : "Nuevo hito"}</h2>
              <button className={styles.closeBtn} onClick={tryCloseModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div className={styles.field} style={{ flex: 1 }}>
                  <label>Año *</label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
                    placeholder="2010"
                    min={1900}
                    max={2100}
                  />
                </div>
                <div className={styles.field} style={{ flex: 1 }}>
                  <label>Mes (opcional)</label>
                  <select value={form.month} onChange={(e) => setForm((p) => ({ ...p, month: e.target.value }))}>
                    <option value="">— Sin mes —</option>
                    {MONTHS.slice(1).map((name, i) => (
                      <option key={i + 1} value={i + 1}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label>Título *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Ej: Inauguración de planta"
                  maxLength={120}
                />
              </div>

              <div className={styles.field}>
                <label>Descripción</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Breve descripción del hito"
                  rows={3}
                />
              </div>

              <div className={styles.field}>
                <label>Imagen</label>
                {form.image && (
                  <div style={{ marginBottom: 8, position: "relative", maxWidth: 200, borderRadius: 8, overflow: "hidden" }}>
                    <img src={form.image} alt="Preview" style={{ width: "100%", display: "block" }} />
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, image: "" }))}
                      style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <label
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "1.5px dashed #d1d5db", borderRadius: 8, cursor: uploading ? "wait" : "pointer", fontSize: "0.875rem", color: "#6b7280" }}
                >
                  <Upload size={16} />
                  {uploading ? "Subiendo..." : "Subir imagen"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) { setError("La imagen no debe superar 5MB"); return; }
                      setUploading(true);
                      try {
                        const url = await uploadImage(file);
                        setForm((p) => ({ ...p, image: url }));
                      } catch {
                        setError("Error al subir la imagen");
                      } finally {
                        setUploading(false);
                      }
                    }}
                  />
                </label>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={tryCloseModal}>Cancelar</button>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmClose && (
        <div className={styles.confirmOverlay} onClick={() => setShowConfirmClose(false)}>
          <div className={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIcon}><AlertTriangle size={24} /></div>
            <h3 className={styles.confirmTitle}>¿Salir del formulario?</h3>
            <p className={styles.confirmText}>Los datos ingresados se perderán si sales sin guardar.</p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.confirmKeep} onClick={() => setShowConfirmClose(false)}>Seguir editando</button>
              <button type="button" className={styles.confirmLeave} onClick={() => { setShowConfirmClose(false); setShowModal(false); }}>Salir sin guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
