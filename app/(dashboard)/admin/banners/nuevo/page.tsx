"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, X, Loader2, ImageIcon } from "lucide-react";
import formStyles from "./BannerForm.module.css";

export default function NuevoBannerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    link: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no debe superar 5MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const sigRes = await fetch("/api/admin/banners/upload-signature", { method: "POST" });
      if (!sigRes.ok) throw new Error("Error al obtener firma");

      const { signature, timestamp, cloudName, apiKey, folder } = await sigRes.json();

      const fd = new FormData();
      fd.append("file", file);
      fd.append("signature", signature);
      fd.append("timestamp", timestamp.toString());
      fd.append("api_key", apiKey);
      fd.append("folder", folder);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: fd }
      );
      const cloudData = await cloudRes.json();

      if (!cloudRes.ok) throw new Error(cloudData.error?.message || "Error al subir imagen");

      setFormData((prev) => ({ ...prev, image: cloudData.secure_url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) { setError("El título es obligatorio"); return; }
    if (!formData.image.trim()) { setError("Debes subir una imagen"); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: "BANNER" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear el banner");
      router.push("/admin/banners");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={formStyles.container}>
      <div className={formStyles.header}>
        <Link href="/admin/banners" className={formStyles.backButton}>
          <ArrowLeft size={20} /> Volver
        </Link>
        <h1 className={formStyles.title}>Nuevo Banner</h1>
      </div>

      <form onSubmit={handleSubmit} className={formStyles.form}>
        <div className={formStyles.formGrid}>
          <div className={formStyles.formFields}>
            {error && <div className={formStyles.error}>{error}</div>}

            <div className={formStyles.formGroup}>
              <label className={formStyles.label}>
                Título <span className={formStyles.required}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Campaña de verano 2026"
                className={formStyles.input}
                maxLength={100}
              />
              <span className={formStyles.hint}>Solo para identificar el banner en el panel</span>
            </div>

            <div className={formStyles.formGroup}>
              <label className={formStyles.label}>
                Imagen <span className={formStyles.required}>*</span>
              </label>
              {formData.image ? (
                <div className={formStyles.uploadedPreview}>
                  <img src={formData.image} alt="Banner" />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, image: "" }));
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className={formStyles.removeButton}
                    title="Eliminar imagen"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  className={`${formStyles.uploadZone} ${dragActive ? formStyles.uploadZoneActive : ""} ${uploading ? formStyles.uploadZoneUploading : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => !uploading && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    className={formStyles.fileInput}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <>
                      <Loader2 size={32} className={formStyles.spinner} />
                      <span>Subiendo imagen...</span>
                    </>
                  ) : (
                    <>
                      <div className={formStyles.uploadIcon}>
                        <ImageIcon size={28} />
                        <Upload size={16} className={formStyles.uploadArrow} />
                      </div>
                      <span className={formStyles.uploadText}>
                        Arrastra una imagen o haz clic para seleccionar
                      </span>
                      <span className={formStyles.uploadHint}>
                        Recomendado: 1200×400px (PNG, JPG, WebP, máx. 5MB)
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className={formStyles.formGroup}>
              <label className={formStyles.label}>Link de destino</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://kingbrake.com/productos?categoria=..."
                className={formStyles.input}
              />
              <span className={formStyles.hint}>URL a donde redirige al hacer clic (opcional)</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Fecha inicio</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={formStyles.input}
                />
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Fecha fin</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={formStyles.input}
                />
              </div>
            </div>
            <span className={formStyles.hint}>
              Dejar vacío para que esté siempre visible
            </span>

            <div className={formStyles.formActions}>
              <Link href="/admin/banners" className={formStyles.cancelButton}>
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving || uploading}
                className={formStyles.submitButton}
              >
                {saving ? "Guardando..." : <><Save size={18} /> Crear Banner</>}
              </button>
            </div>
          </div>

          <div className={formStyles.previewColumn}>
            <h3 className={formStyles.previewTitle}>Vista previa</h3>
            <div className={formStyles.previewCard}>
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Preview"
                  style={{ width: "100%", borderRadius: 8, display: "block" }}
                />
              ) : (
                <div className={formStyles.thumbnailPlaceholder} style={{ aspectRatio: "3/1", width: "100%" }}>
                  <ImageIcon size={32} />
                  <span>Banner</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
