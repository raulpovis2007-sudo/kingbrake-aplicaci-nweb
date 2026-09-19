import type { Metadata } from "next";
import LegalPageLayout from "@/app/components/Legal/LegalPageLayout";

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: "Términos y Condiciones | King Brake",
  description:
    "Términos y condiciones de venta de productos de frenado King Brake Peru.",
};

export default function TerminosCondicionesPage() {
  return (
    <LegalPageLayout
      title="Términos y Condiciones"
      lastUpdated="19 de Septiembre de 2026"
    >
      <section>
        <p>
          <strong>IMPORTANTE:</strong> Por favor, lea cuidadosamente estos
          Términos y Condiciones antes de adquirir nuestros productos. Al
          utilizar nuestra plataforma y/o realizar una compra,
          usted acepta estar sujeto a estos términos.
        </p>
      </section>

      <section>
        <h2>1. Identificación de la Empresa</h2>
        <p>
          Los productos que se ofrecen a través de este sitio web son
          comercializados por:
        </p>
        <ul>
          <li>
            <strong>Nombre comercial:</strong> King Brake
          </li>
          <li>
            <strong>RUC:</strong> 20611801867
          </li>
          <li>
            <strong>Domicilio fiscal:</strong> Av. Wiesse Mza. A Lote. 4a A.H. Enrique Montenegro, San Juan De Lurigancho - Lima, Perú
          </li>
          <li>
            <strong>Correo electrónico:</strong> contabilidad@kingbrake.com
          </li>
          <li>
            <strong>Teléfono:</strong> +51 993 214 144
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Definiciones</h2>
        <p>Para efectos de estos Términos y Condiciones, se entiende por:</p>
        <ul>
          <li>
            <strong>{'"'}King Brake{'"'} o {'"'}la Empresa{'"'}:</strong> Se refiere al
            comercializador de componentes de frenado automotriz.
          </li>
          <li>
            <strong>{'"'}Usuario{'"'} o {'"'}Cliente{'"'}:</strong> Persona natural o jurídica
            que adquiere productos a través de nuestra plataforma o puntos de venta.
          </li>
          <li>
            <strong>{'"'}Producto{'"'}:</strong> Componentes de frenado automotriz
            (pastillas, discos, zapatas, tambores, partes del sistema hidráulico, líquidos de frenos y accesorios relacionados).
          </li>
          <li>
            <strong>{'"'}Plataforma{'"'}:</strong> El sitio web www.kingbrake.com y
            todas sus funcionalidades.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Productos y Catálogo</h2>
        <p>
          King Brake comercializa componentes de frenado automotriz incluyendo
          pastillas ceramicadas, pastillas semimetálicas, zapatas, discos de freno,
          tambores, partes del sistema hidráulico y líquidos de freno, compatibles
          con las marcas y modelos más populares en Perú.
        </p>

        <h3>3.1. Información del Producto</h3>
        <p>
          Nos esforzamos por presentar información precisa sobre nuestros
          productos (descripciones, precios, compatibilidad, imágenes, etc). Sin
          embargo, pueden existir variaciones menores en color o presentación
          respecto a las imágenes mostradas.
        </p>

        <h3>3.2. Disponibilidad</h3>
        <p>
          Los productos están sujetos a disponibilidad de stock. Nos reservamos
          el derecho de limitar cantidades o descontinuar productos sin previo aviso.
        </p>
      </section>

      <section>
        <h2>4. Proceso de Compra</h2>

        <h3>4.1. Pedido vía WhatsApp</h3>
        <p>
          La compra se realiza a través de nuestra plataforma web mediante el
          siguiente proceso:
        </p>
        <ol>
          <li>Selección de productos y adición al carrito</li>
          <li>Revisión del carrito y cantidades</li>
          <li>Envío del pedido vía WhatsApp para cotización final</li>
          <li>Confirmación y coordinación de pago y entrega</li>
        </ol>

        <h3>4.2. Confirmación</h3>
        <p>
          El pedido se considera confirmado una vez que King Brake valide la
          disponibilidad del stock y el Cliente confirme el pago correspondiente.
        </p>
      </section>

      <section>
        <h2>5. Precio y Forma de Pago</h2>

        <h3>5.1. Precios</h3>
        <ul>
          <li>
            Los precios publicados están expresados en Soles (S/) e incluyen IGV.
          </li>
          <li>
            Los precios pueden variar sin previo aviso. El precio aplicable es
            el vigente al momento de la confirmación del pedido.
          </li>
        </ul>

        <h3>5.2. Medios de Pago</h3>
        <ul>
          <li>Transferencia bancaria</li>
          <li>Billeteras digitales (Yape, Plin, etc)</li>
          <li>Efectivo (en puntos de venta)</li>
          <li>Coordinación directa vía WhatsApp</li>
        </ul>

        <h3>5.3. Facturación</h3>
        <p>
          King Brake emite comprobantes de pago electrónicos (boletas o facturas)
          de acuerdo a la normativa SUNAT vigente.
        </p>
      </section>

      <section>
        <h2>6. Entrega y Envíos</h2>

        <h3>6.1. Zonas de Cobertura</h3>
        <p>
          Realizamos envíos dentro de Lima Metropolitana. Los envíos a provincias
          se coordinan caso por caso vía WhatsApp.
        </p>

        <h3>6.2. Plazos de Entrega</h3>
        <p>
          Los plazos de entrega se coordinan al confirmar el pedido y dependen
          de la disponibilidad del producto y la zona de entrega.
        </p>

        <h3>6.3. Recepción</h3>
        <p>
          El Cliente debe verificar el estado del producto al momento de recibirlo.
          Cualquier daño visible debe reportarse inmediatamente.
        </p>
      </section>

      <section>
        <h2>7. Garantía de Productos</h2>
        <p>
          En King Brake nos comprometemos con la calidad, confiabilidad y correcto
          funcionamiento de nuestros productos para el sistema de frenos. Para
          conocer los detalles sobre la garantía, consulte nuestra{" "}
          <a href="/politica-de-cambios-y-devoluciones">
            Política de Cambios y Devoluciones
          </a>.
        </p>
      </section>

      <section>
        <h2>8. Política de Cambios y Devoluciones</h2>
        <p>
          Para conocer los detalles sobre cambios y devoluciones, consulte
          nuestra{" "}
          <a href="/politica-de-cambios-y-devoluciones">
            Política de Cambios y Devoluciones
          </a>.
        </p>
      </section>

      <section>
        <h2>9. Limitaciones de Responsabilidad</h2>
        <p>
          Para conocer los detalles sobre limitaciones de responsabilidad, consulte
          nuestra{" "}
          <a href="/politica-de-cambios-y-devoluciones">
            Política de Cambios y Devoluciones
          </a>.
        </p>
      </section>

      <section>
        <h2>10. Propiedad Intelectual</h2>
        <p>
          Todo el contenido del sitio web (textos, imágenes, logos, diseños, etc) es
          propiedad intelectual de King Brake. Queda prohibida su
          reproducción, distribución o uso comercial sin autorización expresa.
        </p>
      </section>

      <section>
        <h2>11. Protección de Datos Personales</h2>
        <p>
          King Brake se compromete a proteger la privacidad y los datos
          personales de sus Clientes en cumplimiento con la{" "}
          <strong>Ley N° 29733 - Ley de Protección de Datos Personales</strong>{" "}
          de Perú. Consulte nuestra{" "}
          <a href="/politica-de-privacidad">Política de Privacidad</a>.
        </p>
      </section>

      <section>
        <h2>12. Libro de Reclamaciones</h2>
        <p>
          En cumplimiento con la{" "}
          <strong>
            Ley N° 29571 - Código de Protección y Defensa del Consumidor
          </strong>
          , King Brake pone a disposición de sus clientes un Libro de
          Reclamaciones Digital. Su reclamo será atendido en un plazo máximo de
          30 días calendario.
        </p>
      </section>

      <section>
        <h2>13. Resolución de Conflictos</h2>
        <p>
          Estos Términos y Condiciones se rigen por las leyes de la República
          del Perú. Cualquier disputa será sometida a los tribunales competentes
          de Lima, Perú, o ante INDECOPI según corresponda.
        </p>
      </section>

      <section>
        <h2>14. Modificaciones</h2>
        <p>
          King Brake se reserva el derecho de modificar estos Términos y
          Condiciones en cualquier momento. Los cambios entrarán en vigor
          inmediatamente después de su publicación en el sitio web.
        </p>
      </section>

      <section>
        <h2>15. Contacto</h2>
        <ul>
          <li>
            <strong>Email:</strong> contabilidad@kingbrake.com
          </li>
          <li>
            <strong>Teléfono/WhatsApp:</strong> +51 993 214 144
          </li>
          <li>
            <strong>Dirección:</strong> Av. República de Polonia 753, San Juan de Lurigancho 15419, Lima, Perú
          </li>
        </ul>
      </section>

    </LegalPageLayout>
  );
}
