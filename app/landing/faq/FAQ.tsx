"use client";
import { useState } from "react";
import { ChevronUp } from "lucide-react";
import styles from "./FAQ.module.css";

const faqItems = [
  {
    question: "¿Cómo sé qué pastillas de freno son compatibles con mi vehículo?",
    answer:
      "En cada ficha de producto encontrarás la lista de vehículos compatibles. También puedes usar nuestro buscador por marca, modelo y año en la página de catálogo, o contactarnos por WhatsApp y te asesoramos.",
  },
  {
    question: "¿Cuál es la diferencia entre pastillas ceramicadas y semimetálicas?",
    answer:
      "Las ceramicadas (Ceramic Ultra y Ceramic Heavy) generan menos polvo, son más silenciosas y duran más, ideales para uso urbano. Las semimetálicas (Metal Power) ofrecen mayor fricción y potencia de frenado, mejores para trabajo pesado, carga y off-road.",
  },
  {
    question: "¿Cada cuánto debo cambiar las pastillas de freno?",
    answer:
      "Depende del uso, pero generalmente entre 30,000 y 50,000 km. Si escuchas chirridos, sientes vibración al frenar o el pedal se siente esponjoso, es momento de revisarlas. Recomendamos una inspección visual cada 20,000 km.",
  },
  {
    question: "¿Qué lubricante de freno debo usar?",
    answer:
      "King Brake ofrece lubricantes DOT 3 y DOT 4. El DOT 4 tiene un punto de ebullición más alto y es recomendado para vehículos modernos con ABS. Consulta el manual de tu vehículo o pregúntanos para saber cuál necesitas. Cámbialo cada 10,000 km o una vez al año.",
  },
  {
    question: "¿Hacen envíos a todo el Perú?",
    answer:
      "Sí, realizamos envíos a nivel nacional. En Lima Metropolitana la entrega es en 24-48 horas. Para provincias, coordinamos el envío por agencia de transporte con seguimiento.",
  },
  {
    question: "¿Los productos tienen garantía?",
    answer:
      "Todos nuestros productos cuentan con garantía de fábrica contra defectos de fabricación. Si presentan algún problema, realizamos el cambio sin costo. Consulta nuestra política de devoluciones para más detalles.",
  },
  {
    question: "¿Puedo comprar al por mayor?",
    answer:
      "Sí, tenemos precios especiales para talleres, mecánicos y distribuidores. Contáctanos por WhatsApp para solicitar una cotización mayorista con condiciones preferenciales.",
  },
  {
    question: "¿Cómo realizo un pedido?",
    answer:
      "Navega nuestro catálogo, agrega los productos al carrito y haz clic en \"Completar pedido\". Se generará un mensaje de WhatsApp con tu cotización detallada. Coordinamos el pago y envío directamente contigo.",
  },
  {
    question: "¿Venden repuestos para el sistema hidráulico de frenos?",
    answer:
      "Sí, contamos con cilindros maestros (master), bombas de freno y embrague, bombines de rueda, servofrenos y kits de reparación. Todos probados a alta presión antes de salir de fábrica.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faqs" className={styles["faq-section"]} aria-labelledby="faq-heading">
      <div className={styles["faq-container"]}>
        <div className={styles["faq-inner-container"]}>
          <h2 id="faq-heading" className={styles["faq-heading"]}>
            <strong>TENEMOS RESPUESTA<br /></strong>A TUS DUDAS
          </h2>
          <div className={styles["faq-right"]} role="list">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={styles["label-buttons"]}
                role="listitem"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div
                  className={`${styles["frame-427318843"]} ${openIndex === index ? styles.open : ""}`}
                >
                  <p className={styles["faq-item-header"]}>{item.question}</p>
                  <span className={styles["faq-dropdown-btn"]}>
                    <ChevronUp size={20} className={styles["mynauichevron-up"]} />
                  </span>
                </div>
                <div className={styles["frame-427318844"]}>
                  <p className={styles["faq-item-description"]}>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
