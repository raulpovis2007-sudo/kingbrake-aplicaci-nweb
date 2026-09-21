"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Car, ChevronRight } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  slug: string;
  _count: { models: number };
}

interface Model {
  id: string;
  name: string;
  brand: { id: string; name: string };
  _count: { generations: number };
}

interface Generation {
  id: string;
  name: string;
  _count: { compatibility: number };
}

export default function AdminCompatibilidadPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [newBrand, setNewBrand] = useState("");
  const [addingBrand, setAddingBrand] = useState(false);
  const [newModel, setNewModel] = useState("");
  const [addingModel, setAddingModel] = useState(false);

  const [showGenModal, setShowGenModal] = useState(false);
  const [editingGen, setEditingGen] = useState<Generation | null>(null);
  const [genForm, setGenForm] = useState({ name: "" });
  const [savingGen, setSavingGen] = useState(false);
  const [error, setError] = useState("");

  async function fetchBrands() {
    const res = await fetch("/api/admin/vehicles/brands");
    if (res.ok) setBrands(await res.json());
    setLoading(false);
  }

  async function fetchModels(brandId: string) {
    const res = await fetch(`/api/admin/vehicles/models?brandId=${brandId}`);
    if (res.ok) setModels(await res.json());
  }

  async function fetchGenerations(modelId: string) {
    const res = await fetch(`/api/admin/vehicles/generations?modelId=${modelId}`);
    if (res.ok) setGenerations(await res.json());
  }

  useEffect(() => { fetchBrands(); }, []);

  useEffect(() => {
    if (selectedBrand) {
      fetchModels(selectedBrand);
      setSelectedModel(null);
      setGenerations([]);
    } else {
      setModels([]);
      setSelectedModel(null);
      setGenerations([]);
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedModel) fetchGenerations(selectedModel);
    else setGenerations([]);
  }, [selectedModel]);

  // --- Brands ---
  async function addBrand() {
    if (!newBrand.trim()) return;
    setAddingBrand(true);
    const res = await fetch("/api/admin/vehicles/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newBrand.trim() }),
    });
    setAddingBrand(false);
    if (!res.ok) { const d = await res.json(); alert(d.error); return; }
    setNewBrand("");
    fetchBrands();
  }

  async function deleteBrand(id: string) {
    if (!confirm("¿Eliminar esta marca?")) return;
    const res = await fetch(`/api/admin/vehicles/brands?id=${id}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json(); alert(d.error); return; }
    if (selectedBrand === id) setSelectedBrand(null);
    fetchBrands();
  }

  // --- Models ---
  async function addModel() {
    if (!newModel.trim() || !selectedBrand) return;
    setAddingModel(true);
    const res = await fetch("/api/admin/vehicles/models", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newModel.trim(), brandId: selectedBrand }),
    });
    setAddingModel(false);
    if (!res.ok) { const d = await res.json(); alert(d.error); return; }
    setNewModel("");
    fetchModels(selectedBrand);
    fetchBrands();
  }

  async function deleteModel(id: string) {
    if (!confirm("¿Eliminar este modelo?")) return;
    const res = await fetch(`/api/admin/vehicles/models?id=${id}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json(); alert(d.error); return; }
    if (selectedModel === id) setSelectedModel(null);
    fetchModels(selectedBrand!);
    fetchBrands();
  }

  // --- Generations ---
  function openNewGen() {
    setEditingGen(null);
    setGenForm({ name: "" });
    setError("");
    setShowGenModal(true);
  }

  function openEditGen(g: Generation) {
    setEditingGen(g);
    setGenForm({ name: g.name });
    setError("");
    setShowGenModal(true);
  }

  async function saveGen(e: React.FormEvent) {
    e.preventDefault();
    if (!genForm.name.trim()) { setError("Nombre requerido"); return; }
    setSavingGen(true);
    setError("");

    const res = editingGen
      ? await fetch("/api/admin/vehicles/generations", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingGen.id, ...genForm }),
        })
      : await fetch("/api/admin/vehicles/generations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modelId: selectedModel, ...genForm }),
        });

    setSavingGen(false);
    if (!res.ok) { const d = await res.json(); setError(d.error); return; }
    setShowGenModal(false);
    fetchGenerations(selectedModel!);
  }

  async function deleteGen(id: string) {
    if (!confirm("¿Eliminar esta generación?")) return;
    const res = await fetch(`/api/admin/vehicles/generations?id=${id}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json(); alert(d.error); return; }
    fetchGenerations(selectedModel!);
  }

  const selectedBrandData = brands.find((b) => b.id === selectedBrand);
  const selectedModelData = models.find((m) => m.id === selectedModel);

  if (loading) return <div style={{ padding: "2rem" }}>Cargando...</div>;

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Vehículos</h1>
        <p style={{ fontSize: "0.875rem", color: "#888", margin: "4px 0 0" }}>Administra marcas, modelos y generaciones</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 220px 1fr", gap: "16px", minHeight: "400px" }}>
        {/* Brands column */}
        <div style={{ background: "#f9f9f9", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <h2 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>Marcas</h2>

          <div style={{ display: "flex", gap: "6px" }}>
            <input
              type="text"
              placeholder="Nueva marca..."
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addBrand()}
              style={{ flex: 1, padding: "7px 10px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "0.8125rem" }}
            />
            <button
              onClick={addBrand}
              disabled={addingBrand || !newBrand.trim()}
              style={{ padding: "7px", background: "#fe0008", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", opacity: !newBrand.trim() ? 0.5 : 1 }}
            >
              <Plus size={14} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1, overflowY: "auto" }}>
            {brands.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBrand(b.id)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 10px", borderRadius: "6px", cursor: "pointer",
                  background: selectedBrand === b.id ? "#0e1469" : "transparent",
                  color: selectedBrand === b.id ? "#fff" : "#333",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
                  <Car size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name}</span>
                  <span style={{ fontSize: "0.6875rem", opacity: 0.6, flexShrink: 0 }}>({b._count.models})</span>
                </div>
                <div style={{ display: "flex", gap: "2px", flexShrink: 0 }}>
                  {b._count.models === 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteBrand(b.id); }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: selectedBrand === b.id ? "rgba(255,255,255,0.5)" : "#ccc", padding: "2px" }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  <ChevronRight size={12} style={{ opacity: 0.4 }} />
                </div>
              </div>
            ))}
            {brands.length === 0 && (
              <p style={{ fontSize: "0.8125rem", color: "#999", textAlign: "center", padding: "2rem 0" }}>Sin marcas</p>
            )}
          </div>
        </div>

        {/* Models column */}
        <div style={{ background: "#f9f9f9", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <h2 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
            {selectedBrandData ? `Modelos — ${selectedBrandData.name}` : "Modelos"}
          </h2>

          {selectedBrand ? (
            <>
              <div style={{ display: "flex", gap: "6px" }}>
                <input
                  type="text"
                  placeholder="Nuevo modelo..."
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addModel()}
                  style={{ flex: 1, padding: "7px 10px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "0.8125rem" }}
                />
                <button
                  onClick={addModel}
                  disabled={addingModel || !newModel.trim()}
                  style={{ padding: "7px", background: "#fe0008", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", opacity: !newModel.trim() ? 0.5 : 1 }}
                >
                  <Plus size={14} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1, overflowY: "auto" }}>
                {models.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "8px 10px", borderRadius: "6px", cursor: "pointer",
                      background: selectedModel === m.id ? "#0e1469" : "transparent",
                      color: selectedModel === m.id ? "#fff" : "#333",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
                      <span style={{ fontSize: "0.8125rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</span>
                      <span style={{ fontSize: "0.6875rem", opacity: 0.6, flexShrink: 0 }}>({m._count.generations})</span>
                    </div>
                    <div style={{ display: "flex", gap: "2px", flexShrink: 0 }}>
                      {m._count.generations === 0 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteModel(m.id); }}
                          style={{ background: "none", border: "none", cursor: "pointer", color: selectedModel === m.id ? "rgba(255,255,255,0.5)" : "#ccc", padding: "2px" }}
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                      <ChevronRight size={12} style={{ opacity: 0.4 }} />
                    </div>
                  </div>
                ))}
                {models.length === 0 && (
                  <p style={{ fontSize: "0.8125rem", color: "#999", textAlign: "center", padding: "2rem 0" }}>Sin modelos</p>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, color: "#bbb", fontSize: "0.8125rem" }}>
              Selecciona una marca
            </div>
          )}
        </div>

        {/* Generations column */}
        <div>
          {!selectedModel ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#999", gap: "8px" }}>
              <Car size={40} strokeWidth={1.2} />
              <p style={{ fontSize: "0.9375rem" }}>Selecciona marca y modelo para ver generaciones</p>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                  Generaciones — {selectedBrandData?.name} {selectedModelData?.name}
                </h2>
                <button
                  onClick={openNewGen}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "#fe0008", color: "#fff", border: "none", borderRadius: "8px", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}
                >
                  <Plus size={16} /> Nueva generación
                </button>
              </div>

              {generations.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", background: "#f9f9f9", borderRadius: "12px", color: "#999" }}>
                  <p>No hay generaciones registradas para este modelo</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {generations.map((g) => (
                    <div
                      key={g.id}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px" }}
                    >
                      <div>
                        <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1a1a1a" }}>{g.name}</span>
                        {g._count.compatibility > 0 && (
                          <span style={{ fontSize: "0.75rem", color: "#888", marginLeft: "8px" }}>
                            {g._count.compatibility} producto{g._count.compatibility !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => openEditGen(g)}
                          style={{ background: "none", border: "1px solid #ddd", borderRadius: "6px", padding: "6px", cursor: "pointer", color: "#666" }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => deleteGen(g.id)}
                          style={{ background: "none", border: "1px solid #ddd", borderRadius: "6px", padding: "6px", cursor: "pointer", color: "#999" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal generación */}
      {showGenModal && (
        <div
          onClick={() => setShowGenModal(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: "14px", padding: "24px", width: "100%", maxWidth: "420px", margin: "0 16px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0 }}>{editingGen ? "Editar generación" : "Nueva generación"}</h3>
              <button onClick={() => setShowGenModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#999" }}><X size={20} /></button>
            </div>

            <form onSubmit={saveGen} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {error && <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", fontSize: "0.875rem" }}>{error}</div>}

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#555", marginBottom: "6px" }}>Nombre de la generación *</label>
                <input
                  type="text"
                  value={genForm.name}
                  onChange={(e) => setGenForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Ej: Primera generación"
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "0.875rem", boxSizing: "border-box" }}
                />
              </div>


              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowGenModal(false)}
                  style={{ padding: "10px 20px", border: "1px solid #ddd", borderRadius: "8px", background: "#fff", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingGen}
                  style={{ padding: "10px 20px", background: "#0e1469", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, opacity: savingGen ? 0.6 : 1 }}
                >
                  {savingGen ? "Guardando..." : editingGen ? "Guardar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
