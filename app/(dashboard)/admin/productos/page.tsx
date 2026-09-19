"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
  Pencil, Trash2, Plus, X, Search, Eye, EyeOff, Star,
  Upload, Loader2, ImageIcon, Package,
} from "lucide-react";
import dynamic from "next/dynamic";
import styles from "./AdminProductos.module.css";

const RichTextEditor = dynamic(
  () => import("../components/RichTextEditor/RichTextEditor"),
  { ssr: false, loading: () => <div style={{ padding: "2rem", textAlign: "center", color: "#999" }}>Cargando editor...</div> }
);

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  detalle: string | null;
  price: number;
  sku: string;
  images: string[];
  stock: number;
  featured: boolean;
  isActive: boolean;
  categoryId: string;
  category: Category;
  createdAt: string;
}

interface FormData {
  name: string;
  description: string;
  detalle: string;
  price: string;
  sku: string;
  images: string[];
  stock: string;
  featured: boolean;
  isActive: boolean;
  categoryId: string;
}

const EMPTY_FORM: FormData = {
  name: "", description: "", detalle: "", price: "", sku: "",
  images: [], stock: "0", featured: false, isActive: true, categoryId: "",
};

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchData() {
    const [prodRes, catRes] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/categories"),
    ]);
    if (prodRes.ok) setProducts(await prodRes.json());
    if (catRes.ok) setCategories(await catRes.json());
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (filterCategory) list = list.filter((p) => p.categoryId === filterCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, search, filterCategory]);

  function openNew() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id || "" });
    setError("");
    setShowModal(true);
  }

  function openEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      detalle: p.detalle || "",
      price: p.price.toString(),
      sku: p.sku,
      images: [...p.images],
      stock: p.stock.toString(),
      featured: p.featured,
      isActive: p.isActive,
      categoryId: p.categoryId,
    });
    setError("");
    setShowModal(true);
  }

  async function handleImageUpload(file: File) {
    if (!file.type.startsWith("image/")) { setError("El archivo debe ser una imagen"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("La imagen no debe superar 5MB"); return; }

    setUploading(true);
    setError("");

    try {
      const sigRes = await fetch("/api/admin/products/upload-signature", { method: "POST" });
      if (!sigRes.ok) {
        const d = await sigRes.json();
        throw new Error(d.error || `Error al obtener firma (${sigRes.status})`);
      }
      const { signature, timestamp, cloudName, apiKey, folder } = await sigRes.json();

      const fd = new FormData();
      fd.append("file", file);
      fd.append("signature", signature);
      fd.append("timestamp", timestamp.toString());
      fd.append("api_key", apiKey);
      fd.append("folder", folder);

      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST", body: fd,
      });
      const cloudData = await cloudRes.json();
      if (!cloudRes.ok) throw new Error(cloudData.error?.message || "Error al subir imagen");

      setForm((prev) => ({ ...prev, images: [...prev.images, cloudData.secure_url] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir imagen");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("El nombre es obligatorio"); return; }
    if (!form.sku.trim()) { setError("El SKU es obligatorio"); return; }
    if (!form.price || parseFloat(form.price) < 0) { setError("El precio debe ser mayor o igual a 0"); return; }
    if (!form.categoryId) { setError("Debe seleccionar una categoría"); return; }

    setSaving(true);
    setError("");

    const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        detalle: form.detalle || null,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) { setError(data.error || "Error al guardar"); return; }
    setShowModal(false);
    fetchData();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeleting(null);
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Error al eliminar");
      return;
    }
    fetchData();
  }

  async function toggleActive(p: Product) {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    fetchData();
  }

  async function toggleFeatured(p: Product) {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !p.featured }),
    });
    fetchData();
  }

  if (loading) return <div className={styles.container}><p>Cargando...</p></div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Productos</h1>
        <button className={styles.addBtn} onClick={openNew}><Plus size={18} /> Nuevo producto</button>
      </div>

      {products.length > 0 && (
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar por nombre, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <span className={styles.resultCount}>{filtered.length} resultado(s)</span>
        </div>
      )}

      {products.length === 0 ? (
        <div className={styles.empty}>
          <Package size={48} />
          <p>No hay productos registrados</p>
          <button className={styles.addBtn} onClick={openNew}><Plus size={18} /> Crear primer producto</button>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>SKU</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className={!p.isActive ? styles.rowInactive : ""}>
                  <td>
                    {p.images[0] ? (
                      <img src={p.images[0]} alt="" className={styles.thumb} />
                    ) : (
                      <div className={styles.noThumb}><ImageIcon size={16} /></div>
                    )}
                  </td>
                  <td>
                    <div className={styles.nameCell}>
                      {p.featured && <Star size={14} className={styles.starIcon} />}
                      {p.name}
                    </div>
                  </td>
                  <td className={styles.sku}>{p.sku}</td>
                  <td className={styles.catCell}>{p.category.name}</td>
                  <td className={styles.price}>S/{p.price.toFixed(2)}</td>
                  <td className={styles.stock}>{p.stock}</td>
                  <td>
                    <button
                      className={`${styles.statusBadge} ${p.isActive ? styles.active : styles.inactive}`}
                      onClick={() => toggleActive(p)}
                      title={p.isActive ? "Desactivar" : "Activar"}
                    >
                      {p.isActive ? <><Eye size={12} /> Activo</> : <><EyeOff size={12} /> Inactivo</>}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.featBtn} onClick={() => toggleFeatured(p)} title={p.featured ? "Quitar destacado" : "Destacar"}>
                        <Star size={16} className={p.featured ? styles.starFilled : ""} />
                      </button>
                      <button className={styles.editBtn} onClick={() => openEdit(p)} title="Editar"><Pencil size={16} /></button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)} disabled={deleting === p.id} title="Eliminar"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? "Editar producto" : "Nuevo producto"}</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.formGrid}>
                <div className={styles.fieldFull}>
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Ej: Pastilla ceramicada KB-PC-001"
                    maxLength={120}
                  />
                </div>

                <div className={styles.field}>
                  <label>SKU *</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
                    placeholder="KB-PC-001"
                    maxLength={30}
                  />
                </div>

                <div className={styles.field}>
                  <label>Categoría *</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                    className={styles.select}
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Precio (S/) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className={styles.field}>
                  <label>Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
                    min="0"
                  />
                </div>

                <div className={styles.fieldFull}>
                  <label>Descripción</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Descripción del producto..."
                    rows={3}
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.fieldFull}>
                  <label>Detalle del producto (visible para el cliente)</label>
                  <RichTextEditor
                    value={form.detalle}
                    onChange={(val) => setForm((p) => ({ ...p, detalle: val }))}
                    placeholder="Escribe el contenido detallado del producto..."
                  />
                </div>

                <div className={styles.fieldFull}>
                  <label>Imágenes</label>
                  <div className={styles.imageGrid}>
                    {form.images.map((url, i) => (
                      <div key={i} className={styles.imagePreview}>
                        <img src={url} alt={`Imagen ${i + 1}`} />
                        <button type="button" className={styles.removeImg} onClick={() => removeImage(i)}><X size={14} /></button>
                      </div>
                    ))}
                    <div
                      className={`${styles.uploadZone} ${uploading ? styles.uploading : ""}`}
                      onClick={() => !uploading && fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                        hidden
                        disabled={uploading}
                      />
                      {uploading ? (
                        <Loader2 size={20} className={styles.spinner} />
                      ) : (
                        <><Upload size={20} /><span>Subir</span></>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.fieldFull}>
                  <div className={styles.checkboxRow}>
                    <label className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                      />
                      Producto destacado
                    </label>
                    <label className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                      />
                      Activo (visible en catálogo)
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className={styles.saveBtn} disabled={saving || uploading}>
                  {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
