"use client";

import { useEffect, useState, useMemo } from "react";
import { Pencil, Trash2, Plus, X, Package } from "lucide-react";
import styles from "./AdminCategorias.module.css";

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
}

const EMPTY_FORM: FormData = { name: "", description: "", icon: "" };

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  function isFormDirty() {
    return !!(form.name || form.description || form.icon);
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

  // Solo categorías padre (sin parentId) — las hijas vienen en .children
  const parentCategories = useMemo(
    () => categories.filter((c) => !c.parentId),
    [categories]
  );

  function openNew() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setError("");
    setShowModal(true);
  }

  function openEdit(cat: Category) {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      description: cat.description || "",
      icon: cat.icon || "",
    });
    setError("");
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("El nombre es obligatorio"); return; }
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
    if (!confirm("¿Eliminar esta categoría?")) return;
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
        <h1 className={styles.title}>Categorías</h1>
        <button className={styles.addBtn} onClick={() => openNew()}>
          <Plus size={18} /> Nueva categoría
        </button>
      </div>

      {parentCategories.length === 0 ? (
        <div className={styles.empty}>
          <Package size={48} />
          <p>No hay categorías registradas</p>
          <button className={styles.addBtn} onClick={() => openNew()}>
            <Plus size={18} /> Crear primera categoría
          </button>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Slug</th>
                <th>Descripción</th>
                <th>Productos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {parentCategories.map((cat) => (
                <tr key={cat.id}>
                  <td className={styles.nameCell}>
                    {cat.icon && <span className={styles.icon}>{cat.icon}</span>}
                    {cat.name}
                  </td>
                  <td className={styles.slug}>{cat.slug}</td>
                  <td className={styles.desc}>{cat.description || "—"}</td>
                  <td>{cat._count.products}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => openEdit(cat)} title="Editar">
                        <Pencil size={16} />
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(cat.id)}
                        disabled={deleting === cat.id}
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

      {showModal && (
        <div className={styles.overlay} onClick={tryCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? "Editar categoría" : "Nueva categoría"}</h2>
              <button className={styles.closeBtn} onClick={tryCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.field}>
                <label>Nombre *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Ej: Pastillas de freno"
                  maxLength={80}
                />
              </div>

              <div className={styles.field}>
                <label>Descripción</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Breve descripción de la categoría"
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
