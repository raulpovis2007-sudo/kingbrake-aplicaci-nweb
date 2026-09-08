"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { LineaProducto } from "@/lib/lineas-producto";
import styles from "./LineaDetalle.module.css";

interface Props {
  linea: LineaProducto;
  relacionadas: readonly LineaProducto[];
}

function renderDescripcion(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function LineaDetalle({ linea, relacionadas }: Props) {
  const [presentacion, setPresentacion] = useState<string>(linea.presentaciones[0]);

  const whatsappNumero = "51999999999";

  const handleCotizar = () => {
    const mensaje = encodeURIComponent(
      `Hola King Brake! Quiero cotizar:\n• ${linea.nombre} — ${presentacion}\n\nPor favor envíenme más información.`
    );
    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumero}&text=${mensaje}`, "_blank");
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nombre = form.get("nombres") as string;
    const razon = form.get("razon") as string;
    const pais = form.get("pais") as string;
    const direccion = form.get("direccion") as string;
    const correo = form.get("correo") as string;
    const telefono = form.get("telefono") as string;
    const mensaje = form.get("mensaje") as string;

    const texto = encodeURIComponent(
      `Hola King Brake! Quiero cotizar *${linea.nombre}*.\n\n` +
        `Nombre: ${nombre}\n` +
        (razon ? `Razón social: ${razon}\n` : "") +
        `País: ${pais}\nDirección: ${direccion}\n` +
        `Correo: ${correo}\nTeléfono: ${telefono}\n` +
        (mensaje ? `\nMensaje: ${mensaje}` : "")
    );
    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumero}&text=${texto}`, "_blank");
  };

  return (
    <main className={styles.page}>
      {/* SECCIÓN 1: Detalle del producto */}
      <section className={styles.detalle}>
        <div className={styles.detalleContainer}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={18} />
            Regresar
          </Link>

          <div className={styles.detalleGrid}>
            {/* Columna izquierda: Imagen */}
            <div className={styles.galeriaCol}>
              <div className={styles.imagenBox}>
                <Image
                  src={linea.imagen}
                  alt={linea.nombre}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className={styles.imagenProducto}
                />
              </div>
              {linea.tip && <p className={styles.tip}>{linea.tip}</p>}
            </div>

            {/* Columna derecha: Info */}
            <div className={styles.infoCol}>
              <span className={styles.categoriaLabel}>{linea.categoriaLabel}</span>
              <h1 className={styles.titulo}>{linea.nombre}</h1>
              <p className={styles.descripcion}>{renderDescripcion(linea.descripcion)}</p>

              <h3 className={styles.subtitulo}>{linea.subtitulo}</h3>
              <div className={styles.badge}>{linea.badge}</div>

              {linea.presentaciones.length > 1 && (
                <div className={styles.presentacionGroup}>
                  <label className={styles.presentacionLabel}>PRESENTACIONES</label>
                  <select
                    className={styles.presentacionSelect}
                    value={presentacion}
                    onChange={(e) => setPresentacion(e.target.value)}
                  >
                    {linea.presentaciones.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className={styles.acciones}>
                <button onClick={handleCotizar} className={styles.cotizarBtn}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Cotizar
                </button>
                <Link href={`/catalogo?linea=${linea.slug}`} className={styles.verCatalogoBtn}>
                  Ver catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: Formulario de cotización */}
      <section className={styles.cotizacion} id="cotizar">
        <div className={styles.cotizacionContainer}>
          <div className={styles.cotizacionGrid}>
            {/* Columna izquierda: Info */}
            <div className={styles.cotizacionInfo}>
              <h2 className={styles.cotizacionTitulo}>COTIZA ESTE PRODUCTO AQUÍ</h2>
              <Link href="/" className={styles.cotizacionLink}>
                ¿No es el producto que buscabas?
              </Link>
              <p className={styles.cotizacionTel}>
                Llámanos — Tel: <a href="tel:+5117024590">(511) 702 4590</a>
              </p>
            </div>

            {/* Columna derecha: Form */}
            <div className={styles.cotizacionForm}>
              <p className={styles.formIntro}>
                Si desea enviarnos algún mensaje o hacernos alguna consulta sobre{" "}
                <strong>{linea.nombre}</strong>, complete el formulario y lo contactaremos por
                WhatsApp.
              </p>
              <form onSubmit={handleFormSubmit}>
                <div className={styles.formGrid}>
                  <input name="nombres" placeholder="Nombres *" required className={styles.input} />
                  <input name="razon" placeholder="Razón social" className={styles.input} />
                  <select name="pais" defaultValue="Peru" className={styles.input}>
                    <option value="Peru">Perú</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Chile">Chile</option>
                    <option value="Otro">Otro</option>
                  </select>
                  <input name="direccion" placeholder="Dirección" className={styles.input} />
                  <input
                    name="correo"
                    type="email"
                    placeholder="Correo *"
                    required
                    className={styles.input}
                  />
                  <input name="telefono" type="tel" placeholder="Teléfono *" required className={styles.input} />
                </div>
                <textarea
                  name="mensaje"
                  placeholder="Mensaje"
                  rows={4}
                  className={styles.textarea}
                />
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" required />
                  Acepto los{" "}
                  <Link href="/terminos-y-condiciones" target="_blank">
                    Términos y Condiciones
                  </Link>
                </label>
                <button type="submit" className={styles.enviarBtn}>
                  Enviar
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: Productos relacionados */}
      <section className={styles.relacionados}>
        <div className={styles.relacionadosContainer}>
          <h2 className={styles.relacionadosTitulo}>PRODUCTOS RELACIONADOS</h2>
          <div className={styles.relacionadosGrid}>
            {relacionadas.map((r) => (
              <Link key={r.slug} href={`/productos/linea/${r.slug}`} className={styles.relCard}>
                <div className={styles.relImageBox}>
                  <Image
                    src={r.imagen}
                    alt={r.nombre}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className={styles.relImage}
                  />
                </div>
                <span className={styles.relNombre}>{r.nombre.toUpperCase()}</span>
              </Link>
            ))}
          </div>
          <div className={styles.verCatalogoCta}>
            <Link
              href={`/catalogo?linea=${linea.slug}`}
              className={styles.verCatalogoBtn}
            >
              Ver catálogo de {linea.nombre} →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
