import type { Metadata } from "next";
import LegalPageLayout from "@/app/components/Legal/LegalPageLayout";

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: "Política de Cambios, Devoluciones y Garantías | King Brake",
  description:
    "Política de cambios, devoluciones y garantías de productos King Brake Peru.",
};

export default function PoliticaCambiosDevolucionesPage() {
  return (
    <LegalPageLayout
      title="Política de Cambios, Devoluciones y Garantías"
      lastUpdated="19 de Septiembre de 2026"
    >
      <section>
        <p>
          <strong>KING BRAKE</strong>
        </p>
      </section>

      <section>
        <h2>1. Objetivo</h2>
        <p>
          En King Brake nos comprometemos con la calidad, confiabilidad y
          correcto funcionamiento de nuestros productos para el sistema de
          frenos.
        </p>
        <p>
          La presente Política establece los lineamientos aplicables a la
          atención de solicitudes de cambio, devolución y reclamos relacionados
          con nuestros productos, así como el proceso mediante el cual estos
          casos son evaluados por el Departamento Técnico.
        </p>
        <p>
          El objetivo es garantizar una atención ordenada, trazable y objetiva
          de cada reclamo, permitiendo determinar técnicamente si corresponde o
          no la atención mediante el cambio del producto.
        </p>
      </section>

      <section>
        <h2>2. Alcance</h2>
        <p>
          La presente política aplica a los productos comercializados por King
          Brake a través de sus tiendas afiliadas y demás canales autorizados.
        </p>
        <p>
          Los reclamos relacionados con productos King Brake deberán ser
          canalizados inicialmente a través de la tienda afiliada donde se
          realizó la compra, quien comunicará el caso al asesor de ventas
          correspondiente.
        </p>
        <p>
          Los reclamos que requieran evaluación técnica serán derivados al
          Departamento Técnico de King Brake.
        </p>
      </section>

      <section>
        <h2>3. Condiciones Generales</h2>
        <p>
          Los cambios o devoluciones estarán sujetos a la naturaleza del caso y,
          cuando corresponda, a la evaluación del producto por parte del
          Departamento Técnico.
        </p>
        <p>
          En los casos relacionados con posibles defectos, fallas o
          comportamiento anormal del producto, King Brake podrá solicitar la
          muestra física del producto reclamado para realizar la evaluación
          técnica correspondiente.
        </p>
        <p>
          La sola presentación de un reclamo no implica la aprobación automática
          del cambio.
        </p>
        <p>
          La resolución será determinada después de la evaluación correspondiente
          y quedará registrada en la ficha de reclamo.
        </p>
      </section>

      <section>
        <h2>4. Tipos de Solicitudes</h2>

        <h3>4.1. Producto incorrecto</h3>
        <p>
          Cuando la tienda afiliada reciba un producto diferente al solicitado,
          deberá comunicar el caso al asesor de ventas correspondiente,
          indicando:
        </p>
        <ul>
          <li>Código del producto recibido</li>
          <li>Código del producto solicitado</li>
          <li>Cantidad</li>
          <li>Comprobante o documento de compra</li>
          <li>Evidencia fotográfica, cuando corresponda</li>
        </ul>
        <p>
          Una vez verificada la información, se coordinará la solución
          correspondiente.
        </p>

        <h3>4.2. Producto con posible defecto o falla</h3>
        <p>
          Cuando se presente un reclamo relacionado con el funcionamiento,
          condición o calidad del producto, la tienda afiliada deberá comunicar
          el caso al asesor de ventas.
        </p>
        <p>
          El asesor de ventas trasladará la información al Departamento Técnico,
          proporcionando todos los antecedentes disponibles.
        </p>
        <p>
          Cuando corresponda, se solicitará la muestra física del producto
          reclamado para su evaluación.
        </p>
        <p>
          La aprobación del cambio estará sujeta al resultado del análisis
          técnico.
        </p>

        <h3>4.3. Reclamos por incompatibilidad o aplicación</h3>
        <p>
          Cuando el producto adquirido no corresponda al vehículo o aplicación
          indicada, el caso deberá ser comunicado a través de la tienda afiliada
          y el asesor de ventas.
        </p>
        <p>
          El Departamento Técnico podrá solicitar información adicional para
          determinar si el reclamo corresponde a:
        </p>
        <ul>
          <li>Aplicación incorrecta</li>
          <li>Selección incorrecta del producto</li>
          <li>Información incorrecta proporcionada durante la venta</li>
          <li>Diferencia de dimensiones o especificaciones</li>
          <li>Otra condición relacionada con la aplicación del producto</li>
        </ul>
        <p>
          Cuando resulte necesario, se podrá solicitar la muestra física para
          realizar las verificaciones correspondientes.
        </p>
      </section>

      <section>
        <h2>5. Procedimiento de Atención de Reclamos</h2>
        <p>
          El proceso de atención de reclamos de King Brake se desarrolla de la
          siguiente manera:
        </p>

        <h3>Paso 1. Reclamo en la tienda afiliada</h3>
        <p>
          El cliente comunica la incidencia a la tienda afiliada donde adquirió
          el producto. La tienda recopila la información relacionada con el
          reclamo.
        </p>

        <h3>Paso 2. Comunicación al asesor de ventas</h3>
        <p>
          La tienda afiliada comunica el reclamo a su asesor de ventas asignado.
          El asesor recopila los detalles del caso y los comunica al
          Departamento Técnico.
        </p>

        <h3>Paso 3. Registro del reclamo</h3>
        <p>
          El Departamento Técnico registra la información proporcionada en la
          Ficha para Reclamos o Devoluciones. La información podrá incluir:
        </p>
        <ul>
          <li>Fecha del reclamo</li>
          <li>Datos de la tienda</li>
          <li>Datos del cliente</li>
          <li>Vendedor o asesor responsable</li>
          <li>Código del producto</li>
          <li>Categoría y subcategoría</li>
          <li>Cantidad de productos reclamados</li>
          <li>Marca y modelo del vehículo</li>
          <li>Kilometraje</li>
          <li>Tipo de uso del vehículo</li>
          <li>Motivo del reclamo</li>
          <li>Descripción detallada del problema</li>
        </ul>

        <h3>Paso 4. Recojo de la muestra</h3>
        <p>
          Cuando el caso requiera evaluación física, se coordinará el recojo del
          producto reclamado. La muestra podrá ser recogida por los repartidores
          de King Brake durante sus rutas habituales, para posteriormente ser
          trasladada al Departamento Técnico.
        </p>

        <h3>Paso 5. Recepción de la muestra</h3>
        <p>
          Una vez recibida la muestra, el Departamento Técnico registra su
          recepción y procede con la evaluación.
        </p>

        <h3>Paso 6. Evaluación técnica</h3>
        <p>
          El Departamento Técnico realizará la inspección del producto
          considerando las características y naturaleza del reclamo. La
          evaluación podrá comprender, entre otros aspectos:
        </p>
        <ul>
          <li>Estado general del producto</li>
          <li>Estado del material de fricción</li>
          <li>Estado de la placa metálica</li>
          <li>Desgaste</li>
          <li>Dimensiones</li>
          <li>Evidencia de oxidación</li>
          <li>Grietas o roturas</li>
          <li>Evidencia de sobrecalentamiento</li>
          <li>Puntos de apoyo</li>
          <li>Condiciones de instalación</li>
          <li>Evidencia de contaminación</li>
          <li>Condiciones relacionadas con el sistema de frenos</li>
          <li>
            Otros aspectos técnicos que puedan estar relacionados con el reclamo
          </li>
        </ul>
        <p>
          La evaluación deberá sustentarse mediante las observaciones técnicas y
          las evidencias disponibles.
        </p>

        <h3>Paso 7. Registro de evidencias</h3>
        <p>
          El Departamento Técnico incorporará en la ficha las observaciones
          obtenidas durante la inspección y, cuando corresponda, fotografías de
          la muestra. Las evidencias deberán permitir sustentar técnicamente la
          conclusión del caso.
        </p>

        <h3>Paso 8. Veredicto técnico</h3>
        <p>
          Finalizada la evaluación, el Departamento Técnico determinará el
          resultado del reclamo: <strong>PROCEDE</strong> o{" "}
          <strong>NO PROCEDE</strong>.
        </p>
        <p>
          El veredicto deberá estar sustentado en las observaciones y evidencias
          obtenidas durante la evaluación.
        </p>

        <h3>Paso 9. Ejecución del cambio</h3>
        <p>
          Cuando el resultado sea <strong>PROCEDE</strong>, la ficha concluida
          será remitida al encargado de Almacén para que se gestione el producto
          de reemplazo. Almacén coordinará la programación correspondiente para
          que el nuevo producto sea enviado mediante los repartidores a la tienda
          afiliada que presentó el reclamo.
        </p>
      </section>

      <section>
        <h2>6. Criterios Generales para la Evaluación Técnica</h2>
        <p>
          La evaluación de un reclamo deberá considerar no solamente el estado
          del producto, sino también las condiciones en las que este fue
          instalado y utilizado.
        </p>
        <p>
          En productos destinados al sistema de frenos, determinadas condiciones
          encontradas durante la inspección pueden estar relacionadas con
          factores externos al proceso de fabricación.
        </p>
        <p>Por ello, el Departamento Técnico podrá considerar:</p>
        <ul>
          <li>Condiciones de instalación</li>
          <li>Aplicación del producto</li>
          <li>Estado de los componentes asociados del sistema de frenos</li>
          <li>Condiciones de operación del vehículo</li>
          <li>Tipo de uso del vehículo</li>
          <li>Kilometraje recorrido</li>
          <li>Evidencia de mantenimiento</li>
          <li>Evidencia de desgaste normal</li>
          <li>Daños ocasionados durante la instalación</li>
          <li>
            Otros factores que puedan afectar el desempeño o condición del
            producto
          </li>
        </ul>
      </section>

      <section>
        <h2>
          7. Casos en los que el Reclamo Puede Ser Declarado No Procedente
        </h2>
        <p>
          Un reclamo podrá ser declarado <strong>NO PROCEDE</strong> cuando la
          evaluación técnica determine que la condición observada no corresponde
          a un defecto atribuible al producto.
        </p>
        <p>
          Entre las condiciones que podrán ser consideradas durante la evaluación
          se encuentran:
        </p>
        <ul>
          <li>Desgaste normal derivado del uso</li>
          <li>Daños ocasionados durante la instalación</li>
          <li>Instalación incorrecta</li>
          <li>Aplicación incorrecta del producto</li>
          <li>
            Uso del producto en una aplicación distinta a la correspondiente
          </li>
          <li>
            Daños ocasionados por componentes defectuosos del sistema de frenos
          </li>
          <li>Evidencia de contaminación del material de fricción</li>
          <li>
            Evidencia de sobrecalentamiento derivado de las condiciones de
            operación
          </li>
          <li>Modificaciones o alteraciones del producto</li>
          <li>Daños producidos por factores externos</li>
          <li>
            Ausencia o instalación incorrecta de componentes complementarios
            necesarios para el correcto montaje
          </li>
          <li>
            Cualquier otra condición que, de acuerdo con la evaluación técnica,
            determine que el producto no presenta un defecto atribuible a
            fabricación
          </li>
        </ul>
        <p>
          <strong>Importante:</strong> estos criterios deberán aplicarse
          considerando las evidencias obtenidas durante la evaluación técnica de
          cada caso.
        </p>
      </section>

      <section>
        <h2>8. Cambio de Producto por Reclamo Aprobado</h2>
        <p>
          Cuando el Departamento Técnico determine que un reclamo{" "}
          <strong>PROCEDE</strong>, se gestionará el cambio del producto de
          acuerdo con la disponibilidad y las condiciones comerciales
          establecidas por King Brake.
        </p>
        <p>
          El Departamento Técnico comunicará el resultado y remitirá la ficha
          correspondiente al encargado de Almacén.
        </p>
        <p>
          El cambio será gestionado logísticamente por Almacén y enviado a la
          tienda afiliada correspondiente.
        </p>
      </section>

      <section>
        <h2>9. Devoluciones</h2>
        <p>
          Las solicitudes de devolución deberán ser comunicadas inicialmente a
          través de la tienda afiliada y serán evaluadas de acuerdo con la
          naturaleza de la solicitud y las condiciones comerciales aplicables.
        </p>
        <p>
          Cuando la devolución esté relacionada con un reclamo técnico, King
          Brake podrá requerir la revisión del producto antes de determinar la
          solución correspondiente.
        </p>
      </section>

      <section>
        <h2>10. Productos Instalados</h2>
        <p>
          En el caso de productos que ya hayan sido instalados, especialmente
          aquellos correspondientes al sistema de frenos, la solicitud será
          considerada como un reclamo técnico cuando exista una alegación
          relacionada con su funcionamiento, calidad o desempeño.
        </p>
        <p>
          En estos casos, el producto podrá ser solicitado para evaluación por
          el Departamento Técnico.
        </p>
        <p>
          La instalación del producto no implica por sí misma la aprobación ni
          el rechazo del reclamo. La determinación dependerá del resultado de la
          evaluación técnica.
        </p>
      </section>

      <section>
        <h2>11. Responsabilidades</h2>

        <h3>Tienda afiliada</h3>
        <p>Es responsable de:</p>
        <ul>
          <li>Recibir inicialmente el reclamo</li>
          <li>Recopilar la información disponible</li>
          <li>Comunicar el caso al asesor de ventas</li>
          <li>Facilitar la muestra cuando sea solicitada</li>
          <li>Recibir el producto de reemplazo cuando corresponda</li>
        </ul>

        <h3>Asesor de ventas</h3>
        <p>Es responsable de:</p>
        <ul>
          <li>Recibir la información proporcionada por la tienda</li>
          <li>Comunicar el reclamo al Departamento Técnico</li>
          <li>Facilitar los antecedentes necesarios para la evaluación</li>
          <li>Mantener la comunicación correspondiente con la tienda</li>
        </ul>

        <h3>Departamento Técnico</h3>
        <p>Es responsable de:</p>
        <ul>
          <li>Registrar el reclamo</li>
          <li>Recibir y evaluar la muestra</li>
          <li>Documentar las observaciones</li>
          <li>Registrar las evidencias fotográficas</li>
          <li>Determinar el resultado técnico</li>
          <li>Emitir el veredicto PROCEDE / NO PROCEDE</li>
          <li>Remitir la ficha concluida al encargado correspondiente</li>
        </ul>

        <h3>Almacén</h3>
        <p>Cuando el reclamo resulte PROCEDE, es responsable de:</p>
        <ul>
          <li>Recibir la ficha autorizada</li>
          <li>Programar el producto de reemplazo</li>
          <li>Coordinar su despacho</li>
          <li>
            Gestionar el envío hacia la tienda afiliada correspondiente
          </li>
        </ul>

        <h3>Repartidores</h3>
        <p>Son responsables de:</p>
        <ul>
          <li>
            Recoger las muestras cuando sean programadas dentro de sus rutas
          </li>
          <li>Trasladar las muestras al Departamento Técnico</li>
          <li>
            Transportar los productos de reemplazo hacia las tiendas afiliadas
            correspondientes
          </li>
        </ul>
      </section>

      <section>
        <h2>12. Trazabilidad del Reclamo</h2>
        <p>
          Cada reclamo deberá contar con una ficha que permita mantener la
          trazabilidad del caso desde su recepción hasta su resolución.
        </p>
        <p>
          La documentación deberá permitir identificar, cuando corresponda:
        </p>
        <p>
          <strong>
            Tienda → Asesor → Departamento Técnico → Muestra → Evaluación →
            Evidencias → Veredicto → Almacén → Cambio
          </strong>
        </p>
      </section>

      <section>
        <h2>13. Comunicación del Resultado</h2>
        <p>
          El resultado de la evaluación será comunicado a través del canal
          interno correspondiente, permitiendo que la tienda afiliada y el
          asesor de ventas conozcan el resultado del reclamo.
        </p>
        <p>
          Cuando el reclamo resulte <strong>PROCEDE</strong>, se continuará con
          la gestión del cambio.
        </p>
        <p>
          Cuando resulte <strong>NO PROCEDE</strong>, se comunicará la
          conclusión sustentada en la evaluación técnica realizada.
        </p>
      </section>

      <section>
        <h2>14. Libro de Reclamaciones</h2>
        <p>
          Los consumidores mantienen su derecho a presentar los reclamos o
          quejas que correspondan mediante el Libro de Reclamaciones, conforme a
          la normativa peruana aplicable.
        </p>
        <p>
          La atención de un reclamo técnico mediante el procedimiento interno de
          King Brake no limita los derechos que correspondan al consumidor
          conforme a la legislación vigente.
        </p>
      </section>

      <section>
        <h2>15. Disposiciones Finales</h2>
        <p>
          King Brake podrá actualizar la presente política cuando resulte
          necesario para mejorar sus procesos de atención, control de calidad y
          evaluación de productos.
        </p>
        <p>
          Las solicitudes serán evaluadas de acuerdo con la información
          proporcionada, las evidencias disponibles y, cuando corresponda, el
          resultado de la evaluación física y técnica del producto.
        </p>
        <p>
          King Brake reafirma su compromiso con la calidad de sus productos y
          con una atención objetiva, trazable y técnicamente sustentada de los
          reclamos recibidos.
        </p>
      </section>

    </LegalPageLayout>
  );
}
