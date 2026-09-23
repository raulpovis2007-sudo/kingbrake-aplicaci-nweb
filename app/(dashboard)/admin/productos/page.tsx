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
  parentId: string | null;
  children?: Category[];
}

interface VehicleBrand {
  id: string;
  name: string;
}

interface VehicleModelItem {
  id: string;
  name: string;
}

interface VehicleGenerationItem {
  id: string;
  name: string;
}

// Compatibilidad puede ser a nivel generación o modelo
interface CompatEntry {
  type: "generation" | "model";
  id: string;
  label: string; // Para mostrar en el tag
}

interface ProductFromAPI {
  id: string;
  name: string;
  slug: string;
  description: string;
  sku: string;
  images: string[];
  stock: number;
  featured: boolean;
  isActive: boolean;
  categoryId: string;
  category: { id: string; name: string };
  compatibility?: {
    vehicleGenerationId: string | null;
    vehicleGeneration: {
      id: string;
      name: string;
      model: { id: string; name: string; brand: { id: string; name: string } };
    } | null;
    vehicleModelId: string | null;
    vehicleModel: {
      id: string;
      name: string;
      brand: { id: string; name: string };
    } | null;
  }[];
  createdAt: string;
}

interface FormData {
  name: string;
  description: string;
  sku: string;
  images: string[];
  stock: string;
  featured: boolean;
  isActive: boolean;
  parentCategoryId: string;
  categoryId: string;
  compatibility: CompatEntry[];
}

const EMPTY_FORM: FormData = {
  name: "", description: "", sku: "",
  images: [], stock: "0", featured: false, isActive: true,
  parentCategoryId: "", categoryId: "",
  compatibility: [],
};

// Reglas de compatibilidad por categoría padre
// - Pastillas, Zapatas, Discos y tambores: marca + modelo + generación
// - Sistema hidráulico: solo marca + modelo (sin generación)
// - Lubricantes de freno: ninguna compatibilidad
const COMPAT_RULES: Record<string, "full" | "model-only" | "none"> = {
  "pastillas-de-freno": "full",
  "zapatas": "full",
  "discos-y-tambores": "full",
  "sistema-hidraulico": "model-only",
  "lubricantes-de-freno": "none",
};

function getCompatLevel(categories: Category[], parentCategoryId: string): "full" | "model-only" | "none" {
  const parent = categories.find((c) => c.id === parentCategoryId);
  if (!parent) return "full";
  // Buscar por slug que se infiere del nombre
  const slug = parent.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return COMPAT_RULES[slug] ?? "full";
}

const MAX_IMAGES = 3;

export default function AdminProductosPage() {
  const [products, setProducts] = useState<ProductFromAPI[]>([]);
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
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replaceIndexRef = useRef<number>(-1);

  const [brands, setBrands] = useState<VehicleBrand[]>([]);
  const [vehicleModels, setVehicleModels] = useState<VehicleModelItem[]>([]);
  const [vehicleGenerations, setVehicleGenerations] = useState<VehicleGenerationItem[]>([]);
  const [selBrandId, setSelBrandId] = useState("");
  const [selModelId, setSelModelId] = useState("");
  const [selGenId, setSelGenId] = useState("");

  // Categorías padre (sin parentId)
  const parentCategories = useMemo(
    () => categories.filter((c) => !c.parentId),
    [categories]
  );

  // Subcategorías de la categoría padre seleccionada
  const subcategories = useMemo(() => {
    if (!form.parentCategoryId) return [];
    const parent = categories.find((c) => c.id === form.parentCategoryId);
    return parent?.children ?? [];
  }, [categories, form.parentCategoryId]);

  // Nivel de compatibilidad según categoría seleccionada
  const compatLevel = useMemo(
    () => getCompatLevel(categories, form.parentCategoryId),
    [categories, form.parentCategoryId]
  );

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

  useEffect(() => {
    fetch("/api/vehicles/brands").then((r) => r.json()).then(setBrands).catch(() => {});
  }, []);

  useEffect(() => {
    setSelModelId("");
    setSelGenId("");
    setVehicleModels([]);
    setVehicleGenerations([]);
    if (!selBrandId) return;
    fetch(`/api/vehicles/models?brandId=${selBrandId}`)
      .then((r) => r.json())
      .then(setVehicleModels)
      .catch(() => {});
  }, [selBrandId]);

  useEffect(() => {
    setSelGenId("");
    setVehicleGenerations([]);
    if (!selModelId) return;
    fetch(`/api/vehicles/generations?modelId=${selModelId}`)
      .then((r) => r.json())
      .then(setVehicleGenerations)
      .catch(() => {});
  }, [selModelId]);

  // Auto-seleccionar subcategoría cuando solo hay una
  useEffect(() => {
    if (subcategories.length === 1) {
      setForm((p) => ({ ...p, categoryId: subcategories[0].id }));
    } else if (subcategories.length === 0 && form.parentCategoryId) {
      // Sin subcategorías → el producto va directo a la categoría padre
      setForm((p) => ({ ...p, categoryId: form.parentCategoryId }));
    }
  }, [subcategories, form.parentCategoryId]);

  const filtered = useMemo(() => {
    let list = products;
    if (filterCategory) list = list.filter((p) => p.categoryId === filterCategory || p.category?.id === filterCategory);
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

  // Determinar parentCategoryId a partir de categoryId (al editar)
  function resolveParentCategory(categoryId: string): string {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return "";
    // Si es subcategoría, el padre es parentId; si es padre, es él mismo
    if (cat.parentId) return cat.parentId;
    return categoryId;
  }

  function isFormDirty() {
    return !!(form.name || form.sku || form.description || form.images.length > 0 || form.compatibility.length > 0 || form.parentCategoryId);
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

  function openNew() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setSelBrandId("");
    setSelModelId("");
    setSelGenId("");
    setError("");
    setShowModal(true);
  }

  function openEdit(p: ProductFromAPI) {
    const parentCatId = resolveParentCategory(p.categoryId);
    // Si categoryId es un padre sin hijos, categoryId = parentCategoryId
    const cat = categories.find((c) => c.id === p.categoryId);
    const isSubcat = cat?.parentId != null;

    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      sku: p.sku,
      images: [...p.images],
      stock: p.stock.toString(),
      featured: p.featured,
      isActive: p.isActive,
      parentCategoryId: parentCatId,
      categoryId: p.categoryId,
      compatibility: (p.compatibility || []).map((c) => {
        if (c.vehicleModelId && c.vehicleModel) {
          return {
            type: "model" as const,
            id: c.vehicleModelId,
            label: `${c.vehicleModel.brand.name} ${c.vehicleModel.name}`,
          };
        }
        const gen = c.vehicleGeneration!;
        return {
          type: "generation" as const,
          id: c.vehicleGenerationId!,
          label: `${gen.model.brand.name} ${gen.model.name} — ${gen.name}`,
        };
      }),
    });
    setSelBrandId("");
    setSelModelId("");
    setSelGenId("");
    setError("");
    setShowModal(true);
  }

  async function handleImageUpload(file: File, replaceIndex = -1) {
    if (!file.type.startsWith("image/")) { setError("El archivo debe ser una imagen"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("La imagen no debe superar 5MB"); return; }
    if (replaceIndex < 0 && form.images.length >= MAX_IMAGES) {
      setError(`Máximo ${MAX_IMAGES} imágenes por producto`);
      return;
    }

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

      if (replaceIndex >= 0) {
        setForm((prev) => ({
          ...prev,
          images: prev.images.map((img, i) => i === replaceIndex ? cloudData.secure_url : img),
        }));
      } else {
        setForm((prev) => ({ ...prev, images: [...prev.images, cloudData.secure_url] }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir imagen");
    } finally {
      setUploading(false);
      replaceIndexRef.current = -1;
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }

  function addCompatibility() {
    if (compatLevel === "none") return;

    if (compatLevel === "model-only") {
      // Sistema hidráulico: agregar a nivel de modelo (sin generación)
      if (!selModelId) return;
      const model = vehicleModels.find((m) => m.id === selModelId);
      const brand = brands.find((b) => b.id === selBrandId);
      if (!model || !brand) return;
      if (form.compatibility.some((c) => c.type === "model" && c.id === selModelId)) return;
      setForm((prev) => ({
        ...prev,
        compatibility: [
          ...prev.compatibility,
          { type: "model", id: selModelId, label: `${brand.name} ${model.name}` },
        ],
      }));
      setSelModelId("");
      return;
    }

    // full: agregar a nivel de generación
    if (!selGenId) return;
    const gen = vehicleGenerations.find((g) => g.id === selGenId);
    const model = vehicleModels.find((m) => m.id === selModelId);
    const brand = brands.find((b) => b.id === selBrandId);
    if (!gen || !model || !brand) return;
    if (form.compatibility.some((c) => c.type === "generation" && c.id === selGenId)) return;
    setForm((prev) => ({
      ...prev,
      compatibility: [
        ...prev.compatibility,
        { type: "generation", id: selGenId, label: `${brand.name} ${model.name} — ${gen.name}` },
      ],
    }));
    setSelGenId("");
  }

  function removeCompatibility(entry: CompatEntry) {
    setForm((prev) => ({
      ...prev,
      compatibility: prev.compatibility.filter((c) => !(c.type === entry.type && c.id === entry.id)),
    }));
  }

  function buildPendingCompat(): CompatEntry | null {
    if (compatLevel === "none") return null;
    if (compatLevel === "model-only") {
      if (!selModelId) return null;
      const model = vehicleModels.find((m) => m.id === selModelId);
      const brand = brands.find((b) => b.id === selBrandId);
      if (!model || !brand) return null;
      if (form.compatibility.some((c) => c.type === "model" && c.id === selModelId)) return null;
      return { type: "model", id: selModelId, label: `${brand.name} ${model.name}` };
    }
    if (!selGenId) return null;
    const gen = vehicleGenerations.find((g) => g.id === selGenId);
    const model = vehicleModels.find((m) => m.id === selModelId);
    const brand = brands.find((b) => b.id === selBrandId);
    if (!gen || !model || !brand) return null;
    if (form.compatibility.some((c) => c.type === "generation" && c.id === selGenId)) return null;
    return { type: "generation", id: selGenId, label: `${brand.name} ${model.name} — ${gen.name}` };
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("El nombre es obligatorio"); return; }
    if (!form.sku.trim()) { setError("El SKU es obligatorio"); return; }
    if (!form.categoryId) { setError("Debe seleccionar una categoría"); return; }

    const pending = buildPendingCompat();
    const finalCompat = pending
      ? [...form.compatibility, pending]
      : form.compatibility;

    setSaving(true);
    setError("");

    const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        sku: form.sku,
        images: form.images,
        stock: parseInt(form.stock) || 0,
        featured: form.featured,
        isActive: form.isActive,
        categoryId: form.categoryId,
        compatibility: finalCompat.map((c) => ({ type: c.type, id: c.id })),
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

  async function toggleActive(p: ProductFromAPI) {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    fetchData();
  }

  async function toggleFeatured(p: ProductFromAPI) {
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
            {parentCategories.map((cat) => (
              <optgroup key={cat.id} label={cat.name}>
                {/* Opción del padre */}
                <option value={cat.id}>{cat.name} (todos)</option>
                {cat.children?.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </optgroup>
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
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className={`${!p.isActive ? styles.rowInactive : ""} ${p.featured ? styles.rowFeatured : ""}`}>
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
        <div className={styles.overlay} onClick={tryCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? "Editar producto" : "Nuevo producto"}</h2>
              <button className={styles.closeBtn} onClick={tryCloseModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.formGrid}>
                {/* ─── Nombre y SKU ─── */}
                <div className={styles.fieldFull}>
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Ej: Pastilla Ceramic Ultra KB-CU-001"
                    maxLength={120}
                  />
                </div>

                <div className={styles.field}>
                  <label>SKU *</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
                    placeholder="KB-CU-001"
                    maxLength={30}
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

                {/* ─── Categoría → Subcategoría (cascada) ─── */}
                <div className={styles.field}>
                  <label>Categoría *</label>
                  <select
                    value={form.parentCategoryId}
                    onChange={(e) => {
                      const newParent = e.target.value;
                      setForm((p) => ({ ...p, parentCategoryId: newParent, categoryId: "", compatibility: [] }));
                    }}
                    className={styles.select}
                  >
                    <option value="">Seleccionar categoría...</option>
                    {parentCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <span style={{ fontSize: "0.75rem", color: "#999" }}>
                    Categoría principal del producto (ej: Pastillas de freno)
                  </span>
                </div>

                {subcategories.length > 0 && (
                  <div className={styles.field}>
                    <label>Subcategoría *</label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                      className={styles.select}
                      disabled={subcategories.length === 1}
                    >
                      {subcategories.length > 1 && <option value="">Seleccionar subcategoría...</option>}
                      {subcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                    <span style={{ fontSize: "0.75rem", color: "#999" }}>
                      Tipo específico dentro de {parentCategories.find((c) => c.id === form.parentCategoryId)?.name || "la categoría"}
                    </span>
                  </div>
                )}

                {/* ─── Compatibilidad vehicular (condicionada por categoría) ─── */}
                {compatLevel !== "none" && (
                  <div className={styles.fieldFull}>
                    <label>
                      Compatibilidad vehicular
                      {compatLevel === "model-only" && (
                        <span style={{ fontWeight: 400, color: "#999", marginLeft: 8 }}>
                          (solo marca y modelo para esta categoría)
                        </span>
                      )}
                    </label>
                    <div className={styles.compatRow}>
                      <select
                        value={selBrandId}
                        onChange={(e) => setSelBrandId(e.target.value)}
                        className={styles.select}
                      >
                        <option value="">Marca</option>
                        {brands.map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                      <select
                        value={selModelId}
                        onChange={(e) => {
                          const newModelId = e.target.value;
                          setSelModelId(newModelId);
                          if (compatLevel === "model-only" && newModelId) {
                            const model = vehicleModels.find((m) => m.id === newModelId);
                            const brand = brands.find((b) => b.id === selBrandId);
                            if (model && brand && !form.compatibility.some((c) => c.type === "model" && c.id === newModelId)) {
                              setForm((prev) => ({
                                ...prev,
                                compatibility: [...prev.compatibility, { type: "model", id: newModelId, label: `${brand.name} ${model.name}` }],
                              }));
                              setSelBrandId("");
                              setSelModelId("");
                            }
                          }
                        }}
                        className={styles.select}
                        disabled={!selBrandId}
                      >
                        <option value="">{selBrandId ? "Modelo" : "Selecciona marca"}</option>
                        {vehicleModels.map((m) => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                      {compatLevel === "full" && (
                        <select
                          value={selGenId}
                          onChange={(e) => {
                            const newGenId = e.target.value;
                            setSelGenId(newGenId);
                            if (newGenId) {
                              const gen = vehicleGenerations.find((g) => g.id === newGenId);
                              const model = vehicleModels.find((m) => m.id === selModelId);
                              const brand = brands.find((b) => b.id === selBrandId);
                              if (gen && model && brand && !form.compatibility.some((c) => c.type === "generation" && c.id === newGenId)) {
                                setForm((prev) => ({
                                  ...prev,
                                  compatibility: [...prev.compatibility, { type: "generation", id: newGenId, label: `${brand.name} ${model.name} — ${gen.name}` }],
                                }));
                                setSelBrandId("");
                                setSelModelId("");
                                setSelGenId("");
                              }
                            }
                          }}
                          className={styles.select}
                          disabled={!selModelId}
                        >
                          <option value="">{selModelId ? "Generación" : "Selecciona modelo"}</option>
                          {vehicleGenerations.map((g) => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    {form.compatibility.length > 0 && (
                      <div className={styles.compatList}>
                        {form.compatibility.map((c) => (
                          <div key={`${c.type}-${c.id}`} className={styles.compatTag}>
                            <span>{c.label}</span>
                            <button type="button" onClick={() => removeCompatibility(c)}>
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {compatLevel === "none" && form.parentCategoryId && (
                  <div className={styles.fieldFull}>
                    <label style={{ color: "#999" }}>
                      Compatibilidad vehicular — no aplica para esta categoría
                    </label>
                  </div>
                )}

                {/* ─── Descripción (rich text único) ─── */}
                <div className={styles.fieldFull}>
                  <label>Descripción del producto</label>
                  <RichTextEditor
                    value={form.description}
                    onChange={(val) => setForm((p) => ({ ...p, description: val }))}
                    placeholder="Escribe la descripción del producto..."
                  />
                </div>

                {/* ─── Imágenes (máx 3) ─── */}
                <div className={styles.fieldFull}>
                  <label>Imágenes (máximo {MAX_IMAGES})</label>
                  <div className={styles.imageGrid}>
                    {form.images.map((url, i) => (
                      <div key={i} className={styles.imagePreview}>
                        <img src={url} alt={`Imagen ${i + 1}`} />
                        <div className={styles.imageActions}>
                          <button type="button" className={styles.replaceImg} onClick={() => { replaceIndexRef.current = i; replaceInputRef.current?.click(); }} title="Cambiar imagen"><Pencil size={12} /></button>
                          <button type="button" className={styles.removeImg} onClick={() => removeImage(i)} title="Eliminar imagen"><X size={14} /></button>
                        </div>
                      </div>
                    ))}
                    {form.images.length < MAX_IMAGES && (
                      <div
                        className={`${styles.uploadZone} ${uploading ? styles.uploading : ""}`}
                        onClick={() => !uploading && fileInputRef.current?.click()}
                      >
                        {uploading ? (
                          <Loader2 size={20} className={styles.spinner} />
                        ) : (
                          <><Upload size={20} /><span>Subir</span></>
                        )}
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                      hidden
                      disabled={uploading}
                    />
                    <input
                      ref={replaceInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], replaceIndexRef.current)}
                      hidden
                      disabled={uploading}
                    />
                  </div>
                </div>

                {/* ─── Opciones ─── */}
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
                  <div className={styles.callout}>
                    <Star size={14} className={styles.calloutIcon} />
                    <span><strong>Destacado:</strong> Los productos destacados aparecen primero en el catálogo y se muestran con un color diferente para llamar la atención.</span>
                  </div>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={tryCloseModal}>Cancelar</button>
                <button type="submit" className={styles.saveBtn} disabled={saving || uploading}>
                  {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear producto"}
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
