import Image from "next/image";
import styles from "./footer.module.css";
import ComplaintBookButton from "@/app/components/ComplaintBook/ComplaintBookButton";

export default function Footer() {
  const keywords = [
    "pastillas de freno Lima",
    "repuestos de freno Perú",
    "autopartes de freno",
    "King Brake",
    "pastillas ceramicadas",
    "pastillas semimetálicas",
    "zapatas de freno",
    "discos de freno Lima",
    "tambores de freno",
    "frenos para Toyota",
    "frenos para Hyundai",
    "componentes de frenado",
    "repuestos automotrices Lima",
    "frenos de calidad Perú",
    "distribuidores de frenos Lima",
  ];

  return (
    <footer className={styles.footer} id="contacto">
      <div className={styles.container}>
        {/* Logo - visible en móvil arriba */}
        <div className={styles.logoMobile}>
          <Image
            src="/assets/images/logo-principal.webp"
            alt="King Brake"
            className={styles.logoImage}
            width={150}
            height={40}
            quality={80}
          />
        </div>

        {/* Sección principal */}
        <div className={styles.mainSection}>
          {/* Columna 1: Logo (desktop) + Redes + CTA */}
          <div className={styles.brandColumn}>
            <div className={styles.logoDesktop}>
              <Image
                src="/assets/images/logo-principal.webp"
                alt="King Brake"
                className={styles.logoImage}
                width={150}
                height={40}
                quality={80}
              />
            </div>
            <div className={styles.socialIcons}>
              <a
                href="https://www.facebook.com/KingBrakePeru"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <img src="/assets/images/image67.svg" alt="Facebook" />
              </a>
              <a
                href="https://www.instagram.com/kingbrakeperu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <img src="/assets/images/image68.svg" alt="Instagram" />
              </a>
              <a
                href="https://www.tiktok.com/@kingbrakeperu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <img src="/assets/images/image69.svg" alt="TikTok" />
              </a>
            </div>
            <a
              href="https://wa.me/TODO_WHATSAPP_NUMBER?text=%C2%A1Hola!%20Quiero%20cotizar%20productos%20King%20Brake"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaButton}
            >
              Cotizar ahora
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Grupo de columnas */}
          <div className={styles.columnsGroup}>
            {/* Columna: Navegación */}
            <div className={styles.navColumn}>
              <h4 className={styles.columnTitle}>Navegación</h4>
              <nav className={styles.navLinks}>
                <a href="/">Inicio</a>
                <a href="/productos">Productos</a>
                <a href="/#nosotros">Quiénes somos</a>
                <a href="/#distribuidores">Distribuidores</a>
                <a href="#blog">Blog</a>
              </nav>
            </div>

            {/* Columna: Categorías */}
            <div className={styles.plansColumn}>
              <h4 className={styles.columnTitle}>Categorías</h4>
              <nav className={styles.navLinks}>
                <a href="/productos?categoria=pastillas-ceramicadas">Pastillas Ceramicadas</a>
                <a href="/productos?categoria=pastillas-semimetalicas">Pastillas Semimetálicas</a>
                <a href="/productos?categoria=zapatas">Zapatas</a>
                <a href="/productos?categoria=discos-de-freno">Discos de Freno</a>
                <a href="/productos?categoria=tambores">Tambores</a>
              </nav>
            </div>

            {/* Columna: Contacto */}
            <div className={styles.contactColumn}>
              <div className={styles.dividerMobile}></div>
              <h4 className={`${styles.columnTitle} ${styles.contactTitle}`}>
                Contacto
              </h4>
              <div className={styles.contactItems}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <img src="/assets/images/image64.svg" alt="" />
                  </div>
                  <span>Lima, Perú</span>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <img src="/assets/images/image65.svg" alt="" />
                  </div>
                  <a
                    href="https://api.whatsapp.com/send?phone=TODO_WHATSAPP_NUMBER&text=%C2%A1Hola!%20Quiero%20cotizar%20productos%20King%20Brake"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +51 TODO TELEFONO
                  </a>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <img src="/assets/images/image66.svg" alt="" />
                  </div>
                  <a href="mailto:contacto@kingbrake.com">contacto@kingbrake.com</a>
                </div>
              </div>
              <div className={styles.dividerAfterContact}></div>
            </div>
          </div>
        </div>

        {/* Keywords SEO */}
        <div className={styles.dividerDesktop}></div>
        <div className={styles.keywordsSection}>
          {keywords.map((keyword, index) => (
            <span key={index} className={styles.keyword}>
              {keyword}
              {index < keywords.length - 1 && (
                <span className={styles.separator}>|</span>
              )}
            </span>
          ))}
        </div>

        <div className={styles.divider}></div>

        {/* Enlaces Legales */}
        <div className={styles.legalSection}>
          <a href="/terminos-y-condiciones" className={styles.legalLink}>
            Términos y Condiciones
          </a>
          <span className={styles.legalSeparator}>•</span>
          <a href="/politica-de-privacidad" className={styles.legalLink}>
            Política de Privacidad
          </a>
          <span className={styles.legalSeparator}>•</span>
          <a href="/politica-de-cambios-y-devoluciones" className={styles.legalLink}>
            Política de Cambios y Devoluciones
          </a>
        </div>

        {/* Libro de Reclamaciones */}
        <div className={styles.complaintRow}>
          <ComplaintBookButton variant="footer" mode="external" />
          <span className={styles.complaintLegal}>Ley N° 29571</span>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <p>© {new Date().getFullYear()} King Brake Perú. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
