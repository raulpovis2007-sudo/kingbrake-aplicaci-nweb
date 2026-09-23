"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Pencil, Trash2, Plus, X, FolderTree, Upload } from "lucide-react";
import styles from "../categorias/AdminCategorias.module.css";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order: number;
  parentId: string | null;
  _count: { products: number };
  children?: Category[];
}

interface FormData {
  name: string;
  description: string;
  icon: string;
  parentId: string;
}

const EMPTY_FORM: FormData = { name: "", description: "", icon: "", parentId: "" };

async function uploadImage(file: File): Promise<string> {
  const sigRes = await fetch("/api/admin/categories/upload-signature", { method: "POST" });
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

export default function AdminSubcategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filterParent, setFilterParent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  function isFormDirty() {
    return !!(form.name || form.description || form.icon || form.parentId);
  }

  function tryCloseModal() {
    if (isFormDirty()) {
      setShowConfirmClose(true);
    } else {
      setShowModal(false);
    }
  }

  function confirmCloseModal() {
    setShowConfirmClose(false);
    setShowModal(false);
  }

  async function fetchCategories() {
    const res = await fetch("/api/admin/categories");
    if (res.ok) setCategories(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchCategories(); }, []);

  const parentCategories = useMemo(
    () => categories.filter((c) => !c.parentId),
    [categories]
  );

  const subcategories = useMemo(() => {
    const allSubs = parentCategories.flatMap((p) =>
      (p.children ?? []).map((child) => ({ ...child, parentName: p.name, parentId: p.id }))
    );
    if (filterParent) return allSubs.filter((s) => s.parentId === filterParent);
    return allSubs;
  }, [parentCategories, filterParent]);

  function openNew() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, parentId: filterParent });
    setError("");
    setShowModal(true);
  }

  function openEdit(sub: Category) {
    setEditingId(sub.id);
    setForm({
      name: sub.name,
      description: sub.description || "",
      icon: sub.icon || "",
      parentId: sub.parentId || "",
    });
    setError("");
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("El nombre es obligatorio"); return; }
    if (!form.parentId) { setError("Debe seleccionar una categoría padre"); return; }
    setSaving(true);
    setError("");

    const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) { setError(data.error || "Error al guardar"); return; }
    setShowModal(false);
    fetchCategories();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta subcategoría?")) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const data = await res.json();
    setDeleting(null);
    if (!res.ok) { alert(data.error || "Error al eliminar"); return; }
    fetchCategories();
  }

  if (loading) return <div className={styles.container}><p>Cargando...</p></div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Subcategorías</h1>
        <button className={styles.addBtn} onClick={openNew}>
          <Plus size={18} /> Nueva subcategoría
        </button>
      </div>

      {parentCategories.length === 0 ? (
        <div className={styles.empty}>
          <FolderTree size={48} />
          <p>Primero crea categorías principales en la sección Categorías</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <select
              value={filterParent}
              onChange={(e) => setFilterParent(e.target.value)}
              style={{
                padding: "0.5rem 0.75rem",
                border: "1.5px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontFamily: "inherit",
                color: "#1f2937",
                background: "white",
              }}
            >
              <option value="">Todas las categorías</option>
              {parentCategories.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {subcategories.length === 0 ? (
            <div className={styles.empty}>
              <FolderTree size={48} />
              <p>No hay subcategorías{filterParent ? " en esta categoría" : " registradas"}</p>
              <button className={styles.addBtn} onClick={openNew}>
                <Plus size={18} /> Crear primera subcategoría
              </button>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Categoría padre</th>
                    <th>Nombre</th>
                    <th>Slug</th>
                    <th>Productos</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {subcategories.map((sub) => (
                    <tr key={sub.id}>
                      <td style={{ color: "#666", fontSize: "0.8rem" }}>
                        {("parentName" in sub) ? (sub as any).parentName : "—"}
                      </td>
                      <td className={styles.nameCell}>
                        {sub.icon?.startsWith("http") && (
                          <span style={{ display: "inline-block", width: 32, height: 32, borderRadius: 4, overflow: "hidden", verticalAlign: "middle", marginRight: 8, position: "relative" }}>
                            <Image src={sub.icon} alt="" fill style={{ objectFit: "cover" }} sizes="32px" />
                          </span>
                        )}
                        {sub.name}
                      </td>
                      <td className={styles.slug}>{sub.slug}</td>
                      <td>{sub._count.products}</td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.editBtn} onClick={() => openEdit(sub)} title="Editar">
                            <Pencil size={16} />
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDelete(sub.id)}
                            disabled={deleting === sub.id}
                            title="Eliminar"
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
          )}
        </>
      )}

      {showModal && (
        <div className={styles.overlay} onClick={tryCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? "Editar subcategoría" : "Nueva subcategoría"}</h2>
              <button className={styles.closeBtn} onClick={tryCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.field}>
                <label>Categoría padre *</label>
                <select
                  value={form.parentId}
                  onChange={(e) => setForm((p) => ({ ...p, parentId: e.target.value }))}
                >
                  <option value="">Seleccionar categoría...</option>
                  {parentCategories.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>Nombre *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Ej: Ceramic Ultra"
                  maxLength={80}
                />
              </div>

              <div className={styles.field}>
                <label>Descripción</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Breve descripción de la subcategoría"
                  rows={3}
                  maxLength={300}
                />
              </div>

              <div className={styles.field}>
                <label>Imagen</label>
                {form.icon && (
                  <div style={{ marginBottom: 8, position: "relative", width: 120, height: 120, borderRadius: 8, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                    <Image src={form.icon} alt="Preview" fill style={{ objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, icon: "" }))}
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
                        setForm((p) => ({ ...p, icon: url }));
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
        <div className={styles.overlay} style={{ zIndex: 1100 }} onClick={() => setShowConfirmClose(false)}>
          <div className={styles.modal} style={{ maxWidth: 400, padding: 24 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem", color: "#1f2937" }}>¿Salir del formulario?</h3>
            <p style={{ margin: "0 0 20px", fontSize: "0.9rem", color: "#6b7280" }}>
              Los datos ingresados se perderán si sales sin guardar.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button type="button" className={styles.cancelBtn} onClick={() => setShowConfirmClose(false)}>
                Seguir editando
              </button>
              <button type="button" className={styles.deleteBtn} style={{ padding: "8px 20px" }} onClick={confirmCloseModal}>
                Salir sin guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
