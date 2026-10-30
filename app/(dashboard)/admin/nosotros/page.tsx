"use client";

import { useEffect, useState, useRef } from "react";
import { Save, Upload, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import styles from "./AdminNosotros.module.css";

interface NosotrosData {
  quienesSomos: string;
  historia: string;
  image: string;
}

const DEFAULT_DATA: NosotrosData = {
  quienesSomos: "",
  historia: "",
  image: "",
};

export default function AdminNosotrosPage() {
  const [data, setData] = useState<NosotrosData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/page-content/nosotros")
      .then((r) => (r.ok ? r.json() : DEFAULT_DATA))
      .then((d: NosotrosData) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const sigRes = await fetch("/api/admin/page-content/upload-signature", { method: "POST" });
      if (!sigRes.ok) throw new Error("Error al obtener firma");
      const { signature, timestamp, cloudName, apiKey, folder } = await sigRes.json();

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", apiKey);
      form.append("timestamp", String(timestamp));
      form.append("signature", signature);
      form.append("folder", folder);

      const upRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: form,
      });
      if (!upRes.ok) throw new Error("Error al subir imagen");
      const result = await upRes.json();
      setData((prev) => ({ ...prev, image: result.secure_url }));
    } catch {
      setMessage({ type: "error", text: "Error al subir la imagen" });
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/page-content/nosotros", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setMessage({ type: "success", text: "Contenido guardado correctamente" });
    } catch {
      setMessage({ type: "error", text: "Error al guardar el contenido" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Quiénes Somos</h1>
          <p className={styles.subtitle}>
            Edita el contenido y la imagen de la sección &quot;Quiénes somos&quot;
          </p>
        </div>
        <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={18} className={styles.spin} /> : <Save size={18} />}
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.grid}>
        {/* Columna izquierda: textos */}
        <div className={styles.textsColumn}>
          <div className={styles.field}>
            <label className={styles.label}>¿Quiénes somos?</label>
            <p className={styles.hint}>Descripción principal de la empresa. Usa doble salto de línea para separar párrafos.</p>
            <textarea
              className={styles.textarea}
              rows={8}
              value={data.quienesSomos}
              onChange={(e) => setData((prev) => ({ ...prev, quienesSomos: e.target.value }))}
              placeholder="Descripción de la empresa..."
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Nuestra historia</label>
            <p className={styles.hint}>Historia y trayectoria de King Brake.</p>
            <textarea
              className={styles.textarea}
              rows={6}
              value={data.historia}
              onChange={(e) => setData((prev) => ({ ...prev, historia: e.target.value }))}
              placeholder="Historia de la empresa..."
            />
          </div>
        </div>

        {/* Columna derecha: imagen */}
        <div className={styles.imageColumn}>
          <label className={styles.label}>Imagen</label>
          <p className={styles.hint}>Se muestra al costado del texto. Recomendado: formato cuadrado.</p>

          <div className={styles.imagePreview}>
            {data.image ? (
              <Image
                src={data.image}
                alt="Preview"
                fill
                sizes="400px"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <ImageIcon size={40} />
                <span>Sin imagen</span>
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadImage(file);
              e.target.value = "";
            }}
          />
          <button
            className={styles.uploadButton}
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 size={16} className={styles.spin} /> : <Upload size={16} />}
            {uploading ? "Subiendo..." : "Cambiar imagen"}
          </button>
        </div>
      </div>
    </div>
  );
}
