"use client"
import { useState } from "react";
import { useEscape } from "@/hooks/useEscape";
import styles from './FAQ.module.css';

const faqItems = [
  {
    question: "¿Cómo sé qué pastillas de freno son compatibles con mi vehículo?",
    answer: "En cada ficha de producto encontrarás la lista de vehículos compatibles. También puedes contactarnos por WhatsApp con la marca, modelo y año de tu vehículo y te asesoramos.",
  },
  {
    question: "¿Cuál es la diferencia entre pastillas ceramicadas y semimetálicas?",
    answer: "Las ceramicadas generan menos polvo, son más silenciosas y duran más, ideales para uso urbano. Las semimetálicas ofrecen mayor fricción y son mejores para trabajo pesado, carga y off-road.",
  },
  {
    question: "¿Cada cuánto debo cambiar las pastillas de freno?",
    answer: "Depende del uso, pero generalmente entre 30,000 y 50,000 km. Si escuchas chirridos, sientes vibración al frenar o el pedal se siente esponjoso, es momento de cambiarlas.",
  },
  {
    question: "¿Hacen envíos a todo el Perú?",
    answer: "Sí, realizamos envíos a nivel nacional. En Lima la entrega es en 24-48 horas. Para provincias, coordinamos el envío por agencia de transporte.",
  },
  {
    question: "¿Los productos tienen garantía?",
    answer: "Sí, todos nuestros productos cuentan con garantía de fábrica. Si presentan algún defecto de fabricación, realizamos el cambio sin costo.",
  },
  {
    question: "¿Puedo comprar al por mayor?",
    answer: "Sí, tenemos precios especiales para talleres, mecánicos y distribuidores. Contáctanos por WhatsApp para cotización mayorista.",
  },
  {
    question: "¿Cómo realizo un pedido?",
    answer: "Agrega los productos al carrito, completa tu pedido y se generará un mensaje de WhatsApp con tu cotización. Coordinamos el pago y envío directamente.",
  },
];

const FAQ = () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    const handleFAQToggle = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    useEscape(() => {
        if (openFAQ !== null) {
            setOpenFAQ(null);
        }
    })

    return (
        <section id="faqs" className={styles['faq-section']} aria-labelledby="faq-heading">
            <div className={styles['faq-container']}>
                <div className={styles['faq-inner-container']}>
                    <h2 id="faq-heading" className={styles['faq-heading']}>
                        <strong>TENEMOS RESPUESTA<br /></strong>A TUS DUDAS
                    </h2>
                    <div className={styles['faq-right']} role="list">
                        {faqItems.map((item, index) => (
                            <div key={index} className={styles['label-buttons']}>
                                <div className={`${styles['frame-427318843']} ${openFAQ === index ? styles.open : ""}`} onClick={() => handleFAQToggle(index)}>
                                    <p className={styles['faq-item-header']}>{item.question}</p>
                                    <a className={`${styles['faq-dropdown-btn']} w-inline-block`}>
                                        <img src="/assets/images/image44.svg" loading="lazy" alt="" className={styles['mynauichevron-up']} />
                                    </a>
                                </div>
                                <div className={styles['frame-427318844']}>
                                    <p className={styles['faq-item-description']}>{item.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
