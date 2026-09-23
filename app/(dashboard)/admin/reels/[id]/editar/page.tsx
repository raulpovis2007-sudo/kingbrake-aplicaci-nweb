"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Cropper, { Area } from "react-easy-crop";
import {
  ArrowLeft,
  Save,
  Play,
  Loader2,
  Upload,
  ImageIcon,
  Video,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import styles from "../../nuevo/ReelForm.module.css";

// ============================================
// TIPOS
// ============================================

type ReelCategory = "TIPS" | "PRODUCTOS" | "INSTALACION" | "TESTIMONIOS" | "SOPORTE";

interface FormData {
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  category: ReelCategory;
  isActive: boolean;
}

// ============================================
// HELPERS
// ============================================

const categories: { value: ReelCategory; label: string }[] = [
  { value: "TIPS", label: "Tips de frenado (Landing)" },
  { value: "PRODUCTOS", label: "Productos (Landing)" },
  { value: "INSTALACION", label: "Instalación (Landing)" },
  { value: "TESTIMONIOS", label: "Testimonios (Landing)" },
  { value: "SOPORTE", label: "Soporte (Pág. Soporte Técnico)" },
];


// ============================================
// HELPERS: Crop
// ============================================

async function getCroppedBlob(src: string, crop: Area): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((resolve) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.src = src;
  });
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), "image/webp", 0.9));
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function EditarReelPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const dirtyRef = useRef(false);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [dragActiveVideo, setDragActiveVideo] = useState(false);

  // Crop state
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const croppedAreaRef = useRef<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    croppedAreaRef.current = croppedPixels;
  }, []);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    thumbnailUrl: "",
    videoUrl: "",
    category: "TIPS",
    isActive: true,
  });

  // Cargar datos del reel
  useEffect(() => {
    if (!id) return;

    async function fetchReel() {
      try {
        const response = await fetch(`/api/admin/reels/${id}`);
        if (!response.ok) {
          throw new Error("Reel no encontrado");
        }
        const data = await response.json();
        setFormData({
          title: data.title || "",
          description: data.description || "",
          thumbnailUrl: data.thumbnailUrl || "",
          videoUrl: data.videoUrl || "",
          category: data.category || "TIPS",
          isActive: data.isActive ?? true,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error cargando reel");
      } finally {
        setLoading(false);
      }
    }

    fetchReel();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    dirtyRef.current = true;
    setError(null);
  };

  // ============================================
  // UPLOAD DE THUMBNAIL
  // ============================================

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no debe superar 5MB");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async () => {
    if (!cropImage || !croppedAreaRef.current) return;
    setCropImage(null);
    setUploading(true);

    try {
      const blob = await getCroppedBlob(cropImage, croppedAreaRef.current);

      const signatureRes = await fetch("/api/admin/reels/upload-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceType: "image" }),
      });
      if (!signatureRes.ok) throw new Error("Error al obtener firma");

      const { signature, timestamp, cloudName, apiKey, folder } = await signatureRes.json();

      const fd = new FormData();
      fd.append("file", blob, "thumbnail.webp");
      fd.append("signature", signature);
      fd.append("timestamp", timestamp.toString());
      fd.append("api_key", apiKey);
      fd.append("folder", folder);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: fd }
      );
      const cloudinaryData = await cloudinaryRes.json();
      if (!cloudinaryRes.ok) throw new Error(cloudinaryData.error?.message || "Error al subir imagen");

      setFormData((prev) => ({ ...prev, thumbnailUrl: cloudinaryData.secure_url }));
      dirtyRef.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // ============================================
  // UPLOAD DE VIDEO NATIVO
  // ============================================

  const handleVideoSelect = async (file: File) => {
    const validVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!validVideoTypes.includes(file.type)) {
      setError("El archivo debe ser un video (MP4, WebM o MOV)");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("El video no debe superar 50MB");
      return;
    }

    setUploadingVideo(true);
    setError(null);

    try {
      // 1. Obtener firma para subida directa a Cloudinary
      const signatureRes = await fetch("/api/admin/reels/upload-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceType: "video" }),
      });

      if (!signatureRes.ok) {
        const signatureData = await signatureRes.json();
        throw new Error(signatureData.error || "Error al obtener firma");
      }

      const { signature, timestamp, cloudName, apiKey, folder } =
        await signatureRes.json();

      // 2. Subir directamente a Cloudinary (evita timeout del servidor)
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("signature", signature);
      cloudinaryFormData.append("timestamp", timestamp.toString());
      cloudinaryFormData.append("api_key", apiKey);
      cloudinaryFormData.append("folder", folder);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        }
      );

      const cloudinaryData = await cloudinaryRes.json();

      if (!cloudinaryRes.ok) {
        console.error("Cloudinary error:", cloudinaryData);
        throw new Error(cloudinaryData.error?.message || "Error al subir el video a Cloudinary");
      }

      setFormData((prev) => ({ ...prev, videoUrl: cloudinaryData.secure_url }));
      dirtyRef.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir video");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleDragVideo = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveVideo(true);
    } else if (e.type === "dragleave") {
      setDragActiveVideo(false);
    }
  };

  const handleDropVideo = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveVideo(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleVideoSelect(e.dataTransfer.files[0]);
    }
  };

  const handleVideoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleVideoSelect(e.target.files[0]);
    }
  };

  // ============================================
  // SUBMIT
  // ============================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    if (!formData.videoUrl?.trim()) {
      setError("Debes subir un video");
      return;
    }
    if (!formData.thumbnailUrl.trim()) {
      setError("Debes subir una imagen de thumbnail");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/admin/reels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar el reel");
      }

      dirtyRef.current = false;
      router.push("/admin/reels");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem",
            color: "#666",
            gap: "0.5rem",
          }}
        >
          <Loader2 size={20} className={styles.spinner} />
          Cargando reel...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/admin/reels" className={styles.backButton}>
          <ArrowLeft size={20} />
          Volver
        </Link>
        <h1 className={styles.title}>Editar Reel</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Columna izquierda: Formulario */}
          <div className={styles.formFields}>
            {error && <div className={styles.error}>{error}</div>}

            {/* Título */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Título <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Cómo detectar kilometraje alterado"
                className={styles.input}
                maxLength={100}
              />
              <span className={styles.charCount}>
                {formData.title.length}/100
              </span>
            </div>

            {/* Descripción */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Breve descripción del contenido del video..."
                className={styles.textarea}
                rows={3}
                maxLength={300}
              />
              <span className={styles.charCount}>
                {formData.description.length}/300
              </span>
            </div>

            {/* Thumbnail Upload */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Thumbnail <span className={styles.required}>*</span>
              </label>

              {formData.thumbnailUrl ? (
                <div
                  className={styles.uploadedPreview}
                  onClick={() => fileInputRef.current?.click()}
                  title="Clic para cambiar imagen"
                >
                  <img src={formData.thumbnailUrl} alt="Thumbnail" />
                  <div className={styles.mediaOverlay}>
                    <Upload size={18} />
                    Cambiar
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className={styles.fileInput}
                    disabled={uploading}
                  />
                </div>
              ) : (
                <div
                  className={`${styles.uploadZone} ${dragActive ? styles.uploadZoneActive : ""} ${uploading ? styles.uploadZoneUploading : ""}`}
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
                    onChange={handleFileInput}
                    className={styles.fileInput}
                    disabled={uploading}
                  />

                  {uploading ? (
                    <>
                      <Loader2 size={32} className={styles.spinner} />
                      <span>Subiendo imagen...</span>
                    </>
                  ) : (
                    <>
                      <div className={styles.uploadIcon}>
                        <ImageIcon size={28} />
                        <Upload size={16} className={styles.uploadArrow} />
                      </div>
                      <span className={styles.uploadText}>
                        Arrastra una imagen aquí o haz clic para seleccionar
                      </span>
                      <span className={styles.uploadHint}>
                        PNG, JPG o WebP (máx. 5MB)
                      </span>
                    </>
                  )}
                </div>
              )}
              <span className={styles.hint}>
                La imagen se recortará automáticamente a formato vertical (9:16)
              </span>
            </div>

            {/* Video */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Video <span className={styles.required}>*</span>
              </label>

              {formData.videoUrl ? (
                <div className={styles.videoPreview}>
                  <video src={formData.videoUrl} controls />
                  <div
                    className={styles.mediaOverlay}
                    onClick={() => videoInputRef.current?.click()}
                    style={{ cursor: "pointer", borderRadius: 12 }}
                  >
                    <Upload size={18} />
                    Cambiar video
                  </div>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleVideoInput}
                    className={styles.fileInput}
                    disabled={uploadingVideo}
                  />
                </div>
              ) : (
                <div
                  className={`${styles.uploadZone} ${dragActiveVideo ? styles.uploadZoneActive : ""} ${uploadingVideo ? styles.uploadZoneUploading : ""}`}
                  onDragEnter={handleDragVideo}
                  onDragLeave={handleDragVideo}
                  onDragOver={handleDragVideo}
                  onDrop={handleDropVideo}
                  onClick={() => !uploadingVideo && videoInputRef.current?.click()}
                >
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleVideoInput}
                    className={styles.fileInput}
                    disabled={uploadingVideo}
                  />

                  {uploadingVideo ? (
                    <>
                      <Loader2 size={32} className={styles.spinner} />
                      <span>Subiendo video...</span>
                    </>
                  ) : (
                    <>
                      <div className={styles.uploadIcon}>
                        <Video size={28} />
                        <Upload size={16} className={styles.uploadArrow} />
                      </div>
                      <span className={styles.uploadText}>
                        Arrastra un video aquí o haz clic para seleccionar
                      </span>
                      <span className={styles.uploadHint}>
                        MP4, WebM o MOV (máx. 50MB)
                      </span>
                    </>
                  )}
                </div>
              )}
              <span className={styles.hint}>
                MP4, WebM o MOV (máx. 50MB)
              </span>
            </div>

            {/* Categoría */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Categoría <span className={styles.required}>*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={styles.select}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Botones */}
            <div className={styles.formActions}>
              <Link href="/admin/reels" className={styles.cancelButton}>
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving || uploading || uploadingVideo}
                className={styles.submitButton}
              >
                {saving ? (
                  "Guardando..."
                ) : (
                  <>
                    <Save size={18} />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Columna derecha: Preview */}
          <div className={styles.previewColumn}>
            <h3 className={styles.previewTitle}>Vista previa</h3>

            {/* Preview del Thumbnail */}
            <div className={styles.previewCard}>
              <div className={styles.thumbnailPreview}>
                {formData.thumbnailUrl ? (
                  <img src={formData.thumbnailUrl} alt="Preview" />
                ) : (
                  <div className={styles.thumbnailPlaceholder}>
                    <Play size={32} />
                    <span>Thumbnail</span>
                  </div>
                )}
                <div className={styles.thumbnailOverlay}>
                  <Play size={24} />
                </div>
              </div>
              <div className={styles.previewInfo}>
                <span className={styles.previewReelTitle}>
                  {formData.title || "Título del reel"}
                </span>
                <span className={styles.previewCategory}>
                  {categories.find((c) => c.value === formData.category)?.label}
                </span>
              </div>
            </div>

            {formData.videoUrl && (
              <div className={styles.embedPreview}>
                <h4 className={styles.embedTitle}>Preview del video</h4>
                <div className={styles.embedContainer}>
                  <video
                    src={formData.videoUrl}
                    controls
                    playsInline
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Modal de recorte */}
      {cropImage && (
        <div className={styles.cropOverlay}>
          <div className={styles.cropModal}>
            <h3 className={styles.cropTitle}>Ajustar thumbnail</h3>
            <div className={styles.cropContainer}>
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={9 / 16}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className={styles.cropControls}>
              <ZoomOut size={16} color="#9ca3af" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className={styles.cropSlider}
              />
              <ZoomIn size={16} color="#9ca3af" />
            </div>
            <div className={styles.cropActions}>
              <button type="button" className={styles.cancelButton} onClick={() => setCropImage(null)}>
                Cancelar
              </button>
              <button type="button" className={styles.submitButton} onClick={handleCropConfirm}>
                Confirmar recorte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
