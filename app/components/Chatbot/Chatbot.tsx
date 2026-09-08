"use client";

import { useState } from "react";
import styles from "./Chatbot.module.css";

const QUICK_REPLIES = [
  {
    label: "Productos disponibles",
    answer:
      "Contamos con pastillas de freno (ceramicadas y semimetálicas), zapatas, discos de freno, tambores, componentes del sistema hidráulico y líquido para freno. Todos con garantía King Brake.",
  },
  {
    label: "Compatibilidad vehicular",
    answer:
      "Nuestros productos son compatibles con más de 200 modelos de vehículos. Ingresa al catálogo, selecciona marca, modelo y generación para encontrar el repuesto exacto.",
  },
  {
    label: "Puntos de venta",
    answer:
      "Tenemos más de 50 puntos de venta a nivel nacional. Visita nuestra sección de Red de Distribuidores para encontrar el más cercano a tu ubicación.",
  },
  {
    label: "Cómo cotizar",
    answer:
      "Puedes cotizar directamente por WhatsApp. Navega al producto que necesitas, haz clic en 'Cotizar' y te conectaremos con un asesor. También puedes llamarnos al (511) 702 4590.",
  },
  {
    label: "Garantía",
    answer:
      "Todos nuestros productos cuentan con garantía King Brake respaldada por más de 15 años de experiencia en el mercado de autopartes de freno en Perú.",
  },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ type: "bot" | "user"; text: string }[]>([
    { type: "bot", text: "¡Hola! Soy el asistente de King Brake. ¿En qué puedo ayudarte?" },
  ]);

  const handleQuickReply = (reply: (typeof QUICK_REPLIES)[number]) => {
    setMessages((prev) => [
      ...prev,
      { type: "user", text: reply.label },
      { type: "bot", text: reply.answer },
    ]);
  };

  return (
    <div className={styles.wrapper}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <div className={styles.headerAvatar}>KB</div>
              <div>
                <p className={styles.headerName}>King Brake</p>
                <p className={styles.headerStatus}>Asistente virtual</p>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Cerrar chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={msg.type === "bot" ? styles.botMsg : styles.userMsg}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className={styles.quickReplies}>
            {QUICK_REPLIES.map((r) => (
              <button key={r.label} className={styles.quickBtn} onClick={() => handleQuickReply(r)}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button className={styles.fab} onClick={() => setIsOpen(!isOpen)} aria-label="Abrir asistente virtual">
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="12" rx="3" />
            <circle cx="9" cy="10" r="1" fill="#fff" stroke="none" />
            <circle cx="15" cy="10" r="1" fill="#fff" stroke="none" />
            <path d="M7 16l2 3 2-3" />
          </svg>
        )}
      </button>
    </div>
  );
}
