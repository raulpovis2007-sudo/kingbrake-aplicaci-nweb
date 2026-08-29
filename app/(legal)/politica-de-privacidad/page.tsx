import type { Metadata } from "next";
import LegalPageLayout from "@/app/components/Legal/LegalPageLayout";

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: "Política de Privacidad | King Brake",
  description:
    "Política de privacidad y protección de datos personales de King Brake Peru.",
};

export default function PoliticaPrivacidadPage() {
  return (
    <LegalPageLayout
      title="Política de Privacidad"
      lastUpdated="01 de Agosto de 2026"
    >
      <section>
        <p>
          En King Brake valoramos y respetamos su privacidad. Esta Política de
          Privacidad describe cómo recopilamos, usamos, almacenamos y
          protegemos su información personal en cumplimiento con la{" "}
          <strong>Ley N° 29733 - Ley de Protección de Datos Personales</strong>{" "}
          de la República del Perú y su Reglamento.
        </p>
      </section>

      <section>
        <h2>1. Titular del Banco de Datos Personales</h2>
        <p>El responsable del tratamiento de sus datos personales es:</p>
        <ul>
          <li>
            <strong>Nombre comercial:</strong> King Brake Peru
          </li>
          <li>
            <strong>RUC:</strong> TODO_RUC
          </li>
          <li>
            <strong>Domicilio:</strong> TODO_DIRECCION, Lima, Perú
          </li>
          <li>
            <strong>Correo electrónico:</strong> TODO_EMAIL
          </li>
          <li>
            <strong>Teléfono:</strong> +51 TODO_TELEFONO
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Datos Personales que Recopilamos</h2>

        <h3>2.1. Datos de Contacto</h3>
        <ul>
          <li>Nombre completo</li>
          <li>Número de teléfono</li>
          <li>Correo electrónico</li>
          <li>Dirección de envío</li>
        </ul>

        <h3>2.2. Datos del Vehículo (opcional)</h3>
        <ul>
          <li>Marca y modelo del vehículo</li>
          <li>Año de fabricación</li>
        </ul>

        <h3>2.3. Datos de la Transacción</h3>
        <ul>
          <li>Productos adquiridos</li>
          <li>Información de pago (procesada por terceros)</li>
          <li>Comprobantes de pago</li>
        </ul>

        <h3>2.4. Datos de Navegación y Uso</h3>
        <ul>
          <li>Dirección IP</li>
          <li>Tipo de navegador y dispositivo</li>
          <li>Páginas visitadas y tiempo de permanencia</li>
          <li>Origen de la visita (fuente de tráfico)</li>
          <li>Cookies y tecnologías similares (ver sección 9)</li>
        </ul>

        <h3>2.5. Datos de Marketing (Opcional)</h3>
        <ul>
          <li>
            Suscripción a newsletter (opt-in explícito)
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Finalidad del Tratamiento de Datos</h2>

        <h3>3.1. Gestión de Pedidos</h3>
        <ul>
          <li>Procesar y coordinar pedidos de productos</li>
          <li>Coordinar envíos y entregas</li>
          <li>Brindar soporte post-venta</li>
        </ul>

        <h3>3.2. Gestión Administrativa</h3>
        <ul>
          <li>Emisión de comprobantes de pago</li>
          <li>Gestión contable y tributaria</li>
          <li>Atención de reclamos y consultas</li>
        </ul>

        <h3>3.3. Mejora del Servicio</h3>
        <ul>
          <li>Análisis de uso de la plataforma</li>
          <li>Mejora de la experiencia del usuario</li>
          <li>Desarrollo de nuevas funcionalidades</li>
        </ul>

        <h3>3.4. Marketing (Con su Consentimiento)</h3>
        <ul>
          <li>Envío de ofertas, promociones y contenido sobre mantenimiento de frenos</li>
          <li>Newsletters con consejos y novedades de King Brake</li>
        </ul>
      </section>

      <section>
        <h2>4. Base Legal del Tratamiento</h2>
        <ul>
          <li>
            <strong>Consentimiento:</strong> Al aceptar esta Política y los
            Términos y Condiciones.
          </li>
          <li>
            <strong>Ejecución del Contrato:</strong> Necesario para procesar
            la venta de productos.
          </li>
          <li>
            <strong>Cumplimiento Legal:</strong> Leyes tributarias y
            regulatorias (SUNAT, INDECOPI).
          </li>
          <li>
            <strong>Intereses Legítimos:</strong> Mejora de servicios y
            seguridad de la plataforma.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Compartir Datos con Terceros</h2>

        <h3>5.1. Proveedores de Servicios</h3>
        <ul>
          <li>
            <strong>Hosting y Almacenamiento:</strong> Vercel, Neon, Cloudinary
          </li>
          <li>
            <strong>Email:</strong> Correos transaccionales y de marketing
          </li>
          <li>
            <strong>Analítica:</strong> Google Analytics, Meta Pixel, TikTok
            Pixel (ver sección 9)
          </li>
        </ul>

        <h3>5.2. Lo que NO Hacemos</h3>
        <ul>
          <li><strong>NO vendemos</strong> sus datos personales a terceros.</li>
          <li><strong>NO compartimos</strong> sus datos con fines publicitarios sin su consentimiento.</li>
        </ul>
      </section>

      <section>
        <h2>6. Derechos ARCO (Ley N° 29733)</h2>
        <p>Usted tiene derecho a:</p>
        <ul>
          <li><strong>Acceso:</strong> Saber qué datos tenemos sobre usted.</li>
          <li><strong>Rectificación:</strong> Corregir datos inexactos.</li>
          <li><strong>Cancelación:</strong> Solicitar la eliminación de sus datos.</li>
          <li><strong>Oposición:</strong> Oponerse al tratamiento para fines específicos.</li>
        </ul>
        <p>
          Para ejercer estos derechos, envíe un correo a{" "}
          <strong>TODO_EMAIL</strong> con el asunto {'"'}Solicitud ARCO{'"'}.
          Responderemos en un plazo de <strong>20 días hábiles</strong>.
        </p>
      </section>

      <section>
        <h2>7. Seguridad de los Datos</h2>
        <ul>
          <li>Encriptación SSL/TLS para transmisión de datos</li>
          <li>Almacenamiento en servidores con medidas de seguridad avanzadas</li>
          <li>Acceso restringido solo a personal autorizado</li>
        </ul>
      </section>

      <section>
        <h2>8. Transferencia Internacional de Datos</h2>
        <p>
          Algunos proveedores (hosting, almacenamiento) pueden estar ubicados
          fuera del Perú. Verificamos que cumplan con estándares equivalentes de
          protección de datos.
        </p>
      </section>

      <section>
        <h2>9. Cookies y Tecnologías de Rastreo</h2>

        <h3>9.1. Cookies Esenciales</h3>
        <ul>
          <li>Sesión de usuario y preferencias</li>
          <li>Carrito de compras</li>
        </ul>

        <h3>9.2. Cookies de Analítica</h3>
        <ul>
          <li>Google Analytics — tráfico y comportamiento de usuarios</li>
          <li>Microsoft Clarity — mapas de calor y grabaciones de sesión</li>
        </ul>

        <h3>9.3. Cookies de Marketing</h3>
        <ul>
          <li>Meta Pixel (Facebook)</li>
          <li>TikTok Pixel</li>
          <li>Google Tag Manager</li>
        </ul>
        <p>
          Puede gestionar cookies desde la configuración de su navegador.
          Deshabilitar cookies esenciales puede afectar la funcionalidad del sitio.
        </p>
      </section>

      <section>
        <h2>10. Retención de Datos</h2>
        <ul>
          <li><strong>Datos de transacción:</strong> Mínimo 5 años (SUNAT)</li>
          <li><strong>Comprobantes de pago:</strong> 5 años</li>
          <li><strong>Datos de marketing:</strong> Hasta que revoque su consentimiento</li>
        </ul>
      </section>

      <section>
        <h2>11. Menores de Edad</h2>
        <p>
          Nuestros servicios están dirigidos a personas mayores de 18 años. No
          recopilamos datos de menores sin el consentimiento de sus tutores.
        </p>
      </section>

      <section>
        <h2>12. Modificaciones</h2>
        <p>
          King Brake se reserva el derecho de modificar esta Política en
          cualquier momento. Los cambios se publicarán en el sitio web.
        </p>
      </section>

      <section>
        <h2>13. Autoridad de Control</h2>
        <p>
          Puede presentar una reclamación ante la{" "}
          <strong>Dirección General de Protección de Datos Personales (DGPDP)</strong>{" "}
          del Ministerio de Justicia:{" "}
          <a
            href="https://www.minjus.gob.pe/direccion-general-de-proteccion-de-datos-personales/"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.minjus.gob.pe
          </a>
        </p>
      </section>

      <section>
        <h2>14. Contacto</h2>
        <ul>
          <li><strong>Email:</strong> TODO_EMAIL</li>
          <li><strong>Teléfono/WhatsApp:</strong> +51 TODO_TELEFONO</li>
          <li><strong>Dirección:</strong> TODO_DIRECCION, Lima, Perú</li>
        </ul>
      </section>

    </LegalPageLayout>
  );
}
