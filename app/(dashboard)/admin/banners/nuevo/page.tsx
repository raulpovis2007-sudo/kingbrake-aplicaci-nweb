"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, X, Loader2, ImageIcon, Video, Monitor, Smartphone } from "lucide-react";
import formStyles from "./BannerForm.module.css";

const TYPE_LABELS: Record<string, string> = {
  HERO: "Imagen del Hero",
  NOSOTROS_VIDEO: "Video Quiénes Somos",
};

type Platform = "desktop" | "mobile";

export default function NuevoBannerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bannerType = searchParams.get("type") || "BANNER";
  const isVideo = bannerType === "NOSOTROS_VIDEO";
  const typeLabel = TYPE_LABELS[bannerType] || "Banner";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);
  const dirtyRef = useRef(false);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [activePlatform, setActivePlatform] = useState<Platform>("desktop");

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    imageMobile: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    dirtyRef.current = true;
    setError(null);
  };

  const handleFileSelect = async (file: File, target: "image" | "imageMobile" = "image") => {
    const expectVideo = isVideo && target === "image";
    const isValid = expectVideo
      ? file.type.startsWith("video/")
      : file.type.startsWith("image/");
    if (!isValid) {
      setError(expectVideo ? "El archivo debe ser un video (MP4, WebM)" : "El archivo debe ser una imagen");
      return;
    }
    const maxSize = expectVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`El archivo no debe superar ${expectVideo ? "50MB" : "5MB"}`);
      return;
    }

    const setUploadState = target === "imageMobile" ? setUploadingMobile : setUploading;
    setUploadState(true);
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

      const resourceType = file.type.startsWith("video/") ? "video" : "image";
      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        { method: "POST", body: fd }
      );
      const cloudData = await cloudRes.json();

      if (!cloudRes.ok) throw new Error(cloudData.error?.message || "Error al subir imagen");

      setFormData((prev) => ({ ...prev, [target]: cloudData.secure_url }));
      dirtyRef.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir imagen");
    } finally {
      setUploadState(false);
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
    const target = activePlatform === "mobile" ? "imageMobile" : "image";
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0], target);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isVideo && !formData.title.trim()) { setError("El título es obligatorio"); return; }
    const hasAny = formData.image.trim() || formData.imageMobile.trim();
    if (isVideo && !formData.image.trim()) { setError("Debes subir un video"); return; }
    if (!isVideo && !hasAny) { setError("Debes subir al menos una imagen (desktop o móvil)"); return; }

    const mainImage = formData.image.trim() || formData.imageMobile.trim();

    setSaving(true);
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: isVideo ? "Video Quiénes Somos" : formData.title,
          image: mainImage,
          imageMobile: formData.imageMobile || null,
          type: bannerType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear");
      dirtyRef.current = false;
      router.push(`/admin/banners?type=${bannerType}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  };

  const currentUploading = activePlatform === "mobile" ? uploadingMobile : uploading;
  const currentImage = activePlatform === "mobile" ? formData.imageMobile : formData.image;
  const currentInputRef = activePlatform === "mobile" ? mobileFileInputRef : fileInputRef;
  const currentTarget: "image" | "imageMobile" = activePlatform === "mobile" ? "imageMobile" : "image";

  return (
    <div className={formStyles.container}>
      <div className={formStyles.header}>
        <Link href={`/admin/banners?type=${bannerType}`} className={formStyles.backButton}>
          <ArrowLeft size={20} /> Volver
        </Link>
        <h1 className={formStyles.title}>Nuevo: {typeLabel}</h1>
      </div>

      <form onSubmit={handleSubmit} className={formStyles.form}>
        <div className={formStyles.formGrid}>
          <div className={formStyles.formFields}>
            {error && <div className={formStyles.error}>{error}</div>}

            {!isVideo && (
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>
                  Título <span className={formStyles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ej: Hero principal"
                  className={formStyles.input}
                  maxLength={100}
                />
                <span className={formStyles.hint}>Solo para identificar la imagen en el panel</span>
              </div>
            )}

            {isVideo ? (
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>
                  Video <span className={formStyles.required}>*</span>
                </label>
                {formData.image ? (
                  <div className={formStyles.videoPreview}>
                    <video src={formData.image} controls muted playsInline />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, image: "" }));
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className={formStyles.removeButton}
                      title="Eliminar video"
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
                    onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]); }}
                    onClick={() => !uploading && fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/webm"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      className={formStyles.fileInput}
                      disabled={uploading}
                    />
                    {uploading ? (
                      <>
                        <Loader2 size={32} className={formStyles.spinner} />
                        <span>Subiendo video...</span>
                      </>
                    ) : (
                      <>
                        <div className={formStyles.uploadIcon}>
                          <Video size={28} />
                          <Upload size={16} className={formStyles.uploadArrow} />
                        </div>
                        <span className={formStyles.uploadText}>Arrastra un video o haz clic para seleccionar</span>
                        <span className={formStyles.uploadHint}>MP4, WebM — máx. 1 min, 50MB</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Subir imagen para</label>
                  <div className={formStyles.platformSelector}>
                    <button
                      type="button"
                      className={`${formStyles.platformButton} ${activePlatform === "desktop" ? formStyles.platformActive : ""}`}
                      onClick={() => setActivePlatform("desktop")}
                    >
                      <Monitor size={18} />
                      Desktop {formData.image && "✓"}
                    </button>
                    <button
                      type="button"
                      className={`${formStyles.platformButton} ${activePlatform === "mobile" ? formStyles.platformActive : ""}`}
                      onClick={() => setActivePlatform("mobile")}
                    >
                      <Smartphone size={18} />
                      Móvil {formData.imageMobile && "✓"}
                    </button>
                  </div>
                  <span className={formStyles.hint}>
                    {activePlatform === "desktop"
                      ? "Imagen obligatoria — formato horizontal"
                      : "Opcional — si no se sube, se usará la de desktop"}
                  </span>
                </div>

                <div className={formStyles.formGroup}>
                  {currentImage ? (
                    <div
                      className={formStyles.uploadedPreview}
                      style={{
                        width: "100%",
                        aspectRatio: activePlatform === "desktop" ? "3/1" : "9/16",
                        maxHeight: activePlatform === "mobile" ? 300 : undefined,
                      }}
                    >
                      <img src={currentImage} alt={`Banner ${activePlatform}`} />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, [currentTarget]: "" }));
                          if (currentInputRef.current) currentInputRef.current.value = "";
                        }}
                        className={formStyles.removeButton}
                        title="Eliminar imagen"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`${formStyles.uploadZone} ${dragActive ? formStyles.uploadZoneActive : ""} ${currentUploading ? formStyles.uploadZoneUploading : ""}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => !currentUploading && currentInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], "image")}
                        className={formStyles.fileInput}
                        disabled={uploading}
                      />
                      <input
                        ref={mobileFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], "imageMobile")}
                        className={formStyles.fileInput}
                        disabled={uploadingMobile}
                      />
                      {currentUploading ? (
                        <>
                          <Loader2 size={32} className={formStyles.spinner} />
                          <span>Subiendo imagen...</span>
                        </>
                      ) : (
                        <>
                          <div className={formStyles.uploadIcon}>
                            {activePlatform === "desktop" ? <Monitor size={28} /> : <Smartphone size={28} />}
                            <Upload size={16} className={formStyles.uploadArrow} />
                          </div>
                          <span className={formStyles.uploadText}>
                            Arrastra una imagen o haz clic para seleccionar
                          </span>
                          <span className={formStyles.uploadHint}>
                            {activePlatform === "desktop"
                              ? "Formato horizontal. Recomendado: 1920×600px (PNG, JPG, WebP, máx. 5MB)"
                              : "Formato vertical. Recomendado: 600×800px (PNG, JPG, WebP, máx. 5MB)"}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            <div className={formStyles.formActions}>
              <Link href={`/admin/banners?type=${bannerType}`} className={formStyles.cancelButton}>
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving || uploading || uploadingMobile}
                className={formStyles.submitButton}
              >
                {saving ? "Guardando..." : <><Save size={18} /> Guardar</>}
              </button>
            </div>
          </div>

          <div className={formStyles.previewColumn}>
            {isVideo ? (
              <>
                <h3 className={formStyles.previewTitle}>Vista previa Video</h3>
                <div className={formStyles.previewCard}>
                  {formData.image ? (
                    <video src={formData.image} controls muted playsInline style={{ width: "100%", borderRadius: 8, display: "block" }} />
                  ) : (
                    <div className={formStyles.thumbnailPlaceholder} style={{ aspectRatio: "9/16", width: "100%" }}>
                      <Video size={32} />
                      <span>Video</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <h3 className={formStyles.previewTitle}>Vista previa Desktop</h3>
                <div className={formStyles.previewCard}>
                  {formData.image ? (
                    <img src={formData.image} alt="Preview desktop" style={{ width: "100%", borderRadius: 8, display: "block" }} />
                  ) : (
                    <div className={formStyles.thumbnailPlaceholder} style={{ aspectRatio: "3/1", width: "100%" }}>
                      <Monitor size={32} />
                      <span>Desktop</span>
                    </div>
                  )}
                </div>
                <h3 className={formStyles.previewTitle} style={{ marginTop: 16 }}>Vista previa Móvil</h3>
                <div className={formStyles.previewCard} style={{ maxWidth: 200 }}>
                  {(formData.imageMobile || formData.image) ? (
                    <img
                      src={formData.imageMobile || formData.image}
                      alt="Preview móvil"
                      style={{ width: "100%", borderRadius: 8, display: "block" }}
                    />
                  ) : (
                    <div className={formStyles.thumbnailPlaceholder} style={{ aspectRatio: "3/4", width: "100%" }}>
                      <Smartphone size={24} />
                      <span>Móvil</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
