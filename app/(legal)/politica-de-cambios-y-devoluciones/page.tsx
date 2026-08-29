import type { Metadata } from "next";
import LegalPageLayout from "@/app/components/Legal/LegalPageLayout";

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: "Política de Cambios y Devoluciones | King Brake",
  description:
    "Política de cambios y devoluciones de productos King Brake Peru.",
};

export default function PoliticaCambiosDevolucionesPage() {
  return (
    <LegalPageLayout
      title="Política de Cambios y Devoluciones"
      lastUpdated="01 de Agosto de 2026"
    >
      <section>
        <p>
          En King Brake nos esforzamos por brindar productos de calidad. Esta
          política describe sus derechos de cambio y devolución en cumplimiento
          con la{" "}
          <strong>
            Ley N° 29571 - Código de Protección y Defensa del Consumidor
          </strong>{" "}
          de la República del Perú.
        </p>
      </section>

      <section>
        <h2>1. Derecho de Retracto</h2>
        <p>
          De acuerdo con el artículo 78 del Código de Protección y Defensa del
          Consumidor, tiene derecho a retractarse de la compra dentro de los{" "}
          <strong>7 días calendario</strong> desde la recepción del producto,
          siempre que:
        </p>
        <ul>
          <li>El producto no haya sido instalado ni utilizado</li>
          <li>Se encuentre en su empaque original y en perfecto estado</li>
          <li>Presente el comprobante de pago</li>
        </ul>
      </section>

      <section>
        <h2>2. Cambios de Producto</h2>

        <h3>2.1. Producto Incorrecto</h3>
        <p>
          Si recibió un producto diferente al solicitado, King Brake realizará
          el cambio sin costo adicional dentro de las <strong>48 horas</strong>{" "}
          posteriores a la entrega.
        </p>

        <h3>2.2. Producto con Defecto de Fábrica</h3>
        <p>
          Si el producto presenta un defecto de fabricación comprobable:
        </p>
        <ul>
          <li>Cambio por un producto igual o de características similares</li>
          <li>Devolución del monto pagado, a elección del Cliente</li>
        </ul>

        <h3>2.3. Cambio por Incompatibilidad</h3>
        <p>
          Si el producto no es compatible con su vehículo (siempre que haya
          seguido la guía de compatibilidad del catálogo):
        </p>
        <ul>
          <li>
            Cambio por el producto correcto, sujeto a diferencia de precio si aplica
          </li>
          <li>El producto debe estar sin instalar y en su empaque original</li>
        </ul>
      </section>

      <section>
        <h2>3. Devoluciones y Reembolsos</h2>

        <h3>3.1. Plazo</h3>
        <p>
          Las solicitudes de devolución deben realizarse dentro de los{" "}
          <strong>7 días calendario</strong> desde la recepción del producto.
        </p>

        <h3>3.2. Condiciones</h3>
        <ul>
          <li>Producto sin instalar y sin uso</li>
          <li>En su empaque original y en buen estado</li>
          <li>Con comprobante de pago</li>
        </ul>

        <h3>3.3. Método y Plazo de Reembolso</h3>
        <ul>
          <li>
            El reembolso se realiza por el mismo medio de pago original
          </li>
          <li>
            Plazo máximo de <strong>10 días hábiles</strong> desde la
            aprobación
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Casos Donde NO Aplica Devolución</h2>
        <ul>
          <li>Productos ya instalados o con signos de uso</li>
          <li>Desgaste normal por uso del producto</li>
          <li>
            Daños causados por instalación incorrecta o por personal no
            calificado
          </li>
          <li>
            Productos usados en vehículos no listados en la guía de
            compatibilidad
          </li>
          <li>Productos sin empaque original o dañados por el Cliente</li>
          <li>Solicitudes fuera del plazo de 7 días calendario</li>
        </ul>
      </section>

      <section>
        <h2>5. Procedimiento para Solicitar Cambio o Devolución</h2>
        <ol>
          <li>
            Contacte a King Brake vía WhatsApp (+51 TODO_TELEFONO) o email
            (TODO_EMAIL)
          </li>
          <li>
            Indique el número de comprobante de pago y el motivo de la solicitud
          </li>
          <li>
            Adjunte fotos del producto (en caso de defecto)
          </li>
          <li>
            Recibirá respuesta dentro de las <strong>48 horas hábiles</strong>
          </li>
          <li>
            Coordine la devolución del producto en uno de nuestros puntos de
            venta o vía recojo
          </li>
        </ol>
      </section>

      <section>
        <h2>6. Gastos de Envío</h2>
        <ul>
          <li>
            <strong>Producto defectuoso o incorrecto:</strong> King Brake asume
            el costo de envío
          </li>
          <li>
            <strong>Cambio por preferencia del Cliente:</strong> El Cliente
            asume el costo de envío
          </li>
        </ul>
      </section>

      <section>
        <h2>7. Libro de Reclamaciones</h2>
        <p>
          Si no está conforme con la solución propuesta, puede presentar su
          reclamo en nuestro <strong>Libro de Reclamaciones Digital</strong>. Su
          reclamo será atendido en un plazo máximo de 30 días calendario
          conforme a la Ley N° 29571.
        </p>
      </section>

      <section>
        <h2>8. Modificaciones</h2>
        <p>
          King Brake se reserva el derecho de modificar esta Política en
          cualquier momento. Las compras realizadas antes de una modificación se
          rigen por los términos vigentes al momento de la compra.
        </p>
      </section>

      <section>
        <h2>9. Contacto</h2>
        <ul>
          <li><strong>Email:</strong> TODO_EMAIL</li>
          <li><strong>WhatsApp:</strong> +51 TODO_TELEFONO</li>
          <li>
            <strong>Horario de atención:</strong> Lunes a viernes, 9:00 AM -
            6:00 PM (hora de Lima)
          </li>
        </ul>
      </section>

    </LegalPageLayout>
  );
}
