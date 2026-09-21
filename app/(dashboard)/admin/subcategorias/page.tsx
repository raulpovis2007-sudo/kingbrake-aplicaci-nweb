"use client";

import { useEffect, useState, useMemo } from "react";
import { Pencil, Trash2, Plus, X, FolderTree } from "lucide-react";
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
                        {sub.icon && <span className={styles.icon}>{sub.icon}</span>}
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
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? "Editar subcategoría" : "Nueva subcategoría"}</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
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
                <label>Icono (emoji o identificador)</label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                  placeholder="Ej: 🔧"
                  maxLength={20}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
