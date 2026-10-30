"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./Chatbot.module.css";
import { matchKeywords } from "./keywords";

interface ChatNode {
  label: string;
  answer: string;
  followUps?: ChatNode[];
}

const FLOW: ChatNode[] = [
  {
    label: "Productos disponibles",
    answer:
      "Tenemos una línea completa de componentes de frenado. ¿Qué tipo de producto te interesa?",
    followUps: [
      {
        label: "Pastillas ceramicadas",
        answer:
          "Nuestras pastillas ceramicadas ofrecen frenado suave, bajo ruido y menor desgaste del disco. Ideales para uso urbano y vehículos modernos.",
        followUps: [
          {
            label: "¿Para qué vehículo es?",
            answer:
              "Dime la marca y modelo de tu vehículo y te confirmo la compatibilidad. También puedes buscarlo directo en nuestro catálogo web.",
            followUps: [
              { label: "Ir al catálogo", answer: "🔗 Te llevo al catálogo: /productos" },
              { label: "Consultar por WhatsApp", answer: "📱 Te conecto con un asesor por WhatsApp para verificar compatibilidad y precio." },
            ],
          },
          { label: "Ver todas las pastillas", answer: "🔗 Mira todas nuestras pastillas en: /productos?categoria=pastillas-ceramicadas" },
        ],
      },
      {
        label: "Pastillas semimetálicas",
        answer:
          "Las pastillas semimetálicas son más resistentes al calor. Perfectas para camionetas, carga pesada o conducción exigente.",
        followUps: [
          { label: "Ver en catálogo", answer: "🔗 Encuéntralas en: /productos?categoria=pastillas-semimetalicas" },
          { label: "Consultar por WhatsApp", answer: "📱 Te conecto con un asesor por WhatsApp para verificar compatibilidad y precio." },
        ],
      },
      {
        label: "Discos y tambores",
        answer:
          "Contamos con discos de freno ventilados y sólidos, además de tambores para freno posterior. Todos con especificaciones OEM.",
        followUps: [
          { label: "Ver discos", answer: "🔗 Discos de freno: /productos?categoria=discos-de-freno" },
          { label: "Ver tambores", answer: "🔗 Tambores: /productos?categoria=tambores" },
          { label: "Consultar por WhatsApp", answer: "📱 Te conecto con un asesor para ayudarte a elegir el correcto." },
        ],
      },
      {
        label: "Zapatas",
        answer:
          "Nuestras zapatas de freno son compatibles con los modelos más populares del mercado peruano. Ideales para freno de tambor posterior.",
        followUps: [
          { label: "Ver en catálogo", answer: "🔗 Zapatas: /productos?categoria=zapatas" },
          { label: "Consultar por WhatsApp", answer: "📱 Te conecto con un asesor por WhatsApp." },
        ],
      },
    ],
  },
  {
    label: "Compatibilidad vehicular",
    answer:
      "Nuestros productos son compatibles con más de 200 modelos. ¿De qué marca es tu vehículo?",
    followUps: [
      {
        label: "Toyota",
        answer: "Tenemos repuestos para Yaris, Corolla, Hilux, RAV4, Fortuner y más. ¿Qué modelo tienes?",
        followUps: [
          { label: "Buscar en catálogo", answer: "🔗 Busca tu Toyota en: /productos?marca=toyota" },
          { label: "Consultar por WhatsApp", answer: "📱 Escríbenos con tu modelo y año, te confirmamos el repuesto exacto." },
        ],
      },
      {
        label: "Hyundai / Kia",
        answer: "Cubrimos Accent, Tucson, Santa Fe, Sportage, Rio, Sorento y más modelos del grupo Hyundai-Kia.",
        followUps: [
          { label: "Buscar Hyundai", answer: "🔗 Repuestos Hyundai: /productos?marca=hyundai" },
          { label: "Buscar Kia", answer: "🔗 Repuestos Kia: /productos?marca=kia" },
          { label: "Consultar por WhatsApp", answer: "📱 Dinos tu modelo y año por WhatsApp." },
        ],
      },
      {
        label: "Otra marca",
        answer: "También cubrimos Nissan, Chevrolet, Suzuki, Mitsubishi, Honda, Mazda y Volkswagen. Busca tu vehículo en el catálogo o consúltanos.",
        followUps: [
          { label: "Ir al catálogo", answer: "🔗 Busca por marca en: /productos" },
          { label: "Consultar por WhatsApp", answer: "📱 Escríbenos con los datos de tu vehículo." },
        ],
      },
    ],
  },
  {
    label: "Puntos de venta",
    answer:
      "Tenemos más de 50 puntos de venta a nivel nacional. ¿Qué necesitas saber?",
    followUps: [
      { label: "Ver mapa de distribuidores", answer: "🔗 Encuentra el más cercano en nuestra sección de distribuidores: /nosotros (sección Red de Distribuidores)" },
      { label: "Consultar por WhatsApp", answer: "📱 Dinos tu zona y te indicamos el punto de venta más cercano." },
    ],
  },
  {
    label: "Cómo cotizar",
    answer: "Cotizar es súper fácil. ¿Cómo prefieres hacerlo?",
    followUps: [
      { label: "Por WhatsApp", answer: "📱 Escríbenos por WhatsApp con el producto que necesitas y los datos de tu vehículo. Un asesor te responderá en minutos." },
      { label: "Desde el catálogo", answer: "🔗 Navega a /productos, agrega lo que necesites al carrito y haz clic en 'Completar pedido'. Se genera tu cotización automáticamente." },
      { label: "Por teléfono", answer: "📞 Llámanos al (511) 702 4590 en horario de oficina. Nuestro equipo te atiende con gusto." },
    ],
  },
  {
    label: "Garantía",
    answer:
      "Todos nuestros productos tienen garantía King Brake. ¿Qué te gustaría saber?",
    followUps: [
      {
        label: "¿Qué cubre la garantía?",
        answer: "La garantía cubre defectos de fabricación en materiales y funcionamiento. No cubre desgaste normal por uso ni instalación incorrecta.",
        followUps: [
          { label: "¿Cómo hacerla válida?", answer: "Presenta tu boleta o factura de compra en el punto de venta donde adquiriste el producto. El equipo técnico evaluará el caso." },
          { label: "Consultar por WhatsApp", answer: "📱 Si tienes un caso de garantía, escríbenos por WhatsApp con tu comprobante de compra." },
        ],
      },
      {
        label: "¿Cómo hacerla válida?",
        answer: "Presenta tu boleta o factura de compra en el punto de venta donde adquiriste el producto. El equipo técnico evaluará el caso.",
        followUps: [
          { label: "Consultar por WhatsApp", answer: "📱 Escríbenos por WhatsApp con tu comprobante y te ayudamos." },
        ],
      },
    ],
  },
];

const WELCOME = "¡Hola! Soy Kira, asesora virtual de King Brake 🚗 ¿En qué puedo ayudarte hoy?";

function getTime() {
  return new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false });
}

interface Message {
  type: "bot" | "user";
  text: string;
  time: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { type: "bot", text: WELCOME, time: getTime() },
  ]);
  const [currentOptions, setCurrentOptions] = useState<ChatNode[]>(FLOW);
  const [history, setHistory] = useState<ChatNode[][]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const pendingVoiceRef = useRef(false);
  const inputTextRef = useRef("");

  const scrollToBottom = useCallback(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    inputTextRef.current = inputText;
  }, [inputText]);

  useEffect(() => {
    if (!isListening && pendingVoiceRef.current && inputTextRef.current.trim()) {
      pendingVoiceRef.current = false;
      handleTextSubmit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  const addBotMessage = (text: string) => {
    setShowOptions(false);
    setIsTyping(true);
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: "bot", text, time: getTime() }]);
      setIsTyping(false);
      setTimeout(() => setShowOptions(true), 150);
    }, delay);
  };

  const addBotMessages = (texts: string[], newOptions: ChatNode[] | null, newHistory: ChatNode[][] | null) => {
    setShowOptions(false);
    setIsTyping(true);
    const delay = 800 + Math.random() * 700;
    texts.forEach((text, i) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, { type: "bot", text, time: getTime() }]);
        if (i === texts.length - 1) {
          setIsTyping(false);
          if (newOptions !== null) setCurrentOptions(newOptions);
          if (newHistory !== null) setHistory(newHistory);
          setTimeout(() => setShowOptions(true), 150);
        }
      }, delay * (i + 1));
    });
  };

  const handleOption = (node: ChatNode) => {
    setMessages((prev) => [...prev, { type: "user", text: node.label, time: getTime() }]);
    const botTexts = [node.answer];
    if (node.followUps && node.followUps.length > 0) {
      addBotMessages(botTexts, node.followUps, [...history, currentOptions]);
    } else {
      botTexts.push("¿Te puedo ayudar con algo más?");
      addBotMessages(botTexts, FLOW, []);
    }
  };

  const handleTextSubmit = () => {
    const text = inputTextRef.current.trim();
    if (!text || isTyping) return;
    setInputText("");
    inputTextRef.current = "";
    setMessages((prev) => [...prev, { type: "user", text, time: getTime() }]);
    const response = matchKeywords(text);
    setHistory([]);
    setCurrentOptions(FLOW);
    addBotMessage(response);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "es-PE";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInputText(transcript);

      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        pendingVoiceRef.current = true;
        recognition.stop();
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const prev = [...history];
    const last = prev.pop()!;
    setMessages((p) => [...p, { type: "user", text: "← Volver", time: getTime() }]);
    addBotMessages(["Claro, ¿qué más necesitas saber?"], last, prev);
  };

  const handleReset = () => {
    setMessages([{ type: "bot", text: WELCOME, time: getTime() }]);
    setCurrentOptions(FLOW);
    setHistory([]);
    setShowOptions(true);
  };

  return (
    <div className={styles.wrapper}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <div className={styles.headerAvatarWrap}>
                <Image
                  src="/assets/images/joven.jpeg"
                  alt="Kira"
                  width={42}
                  height={42}
                  className={styles.headerAvatar}
                />
                <span className={styles.onlineDot} />
              </div>
              <div>
                <p className={styles.headerName}>Kira</p>
                <p className={styles.headerStatus}>
                  {isTyping ? "Escribiendo..." : "En línea"}
                </p>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Cerrar chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className={styles.messages} ref={messagesRef}>
            {messages.map((msg, i) => (
              <div key={i} className={msg.type === "bot" ? styles.botRow : styles.userRow}>
                {msg.type === "bot" && (
                  <Image
                    src="/assets/images/joven-chat-icono.jpeg"
                    alt=""
                    width={28}
                    height={28}
                    className={styles.msgAvatar}
                  />
                )}
                <div className={msg.type === "bot" ? styles.botMsg : styles.userMsg}>
                  <span className={styles.msgText}>{msg.text}</span>
                  <span className={styles.msgTime}>{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className={styles.botRow}>
                <Image
                  src="/assets/images/joven-chat-icono.jpeg"
                  alt=""
                  width={28}
                  height={28}
                  className={styles.msgAvatar}
                />
                <div className={styles.typingBubble}>
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                </div>
              </div>
            )}

            {showOptions && !isTyping && (
              <div className={styles.inlineOptions}>
                {history.length > 0 && (
                  <button className={styles.inlineBack} onClick={handleBack}>
                    ← Volver
                  </button>
                )}
                {currentOptions.map((opt) => (
                  <button key={opt.label} className={styles.inlineBtn} onClick={() => handleOption(opt)}>
                    {opt.label}
                  </button>
                ))}
                {history.length > 0 && (
                  <button className={styles.inlineReset} onClick={handleReset}>
                    Nuevo tema
                  </button>
                )}
              </div>
            )}
          </div>

          <div className={styles.inputBar}>
            <input
              ref={inputRef}
              type="text"
              className={styles.textInput}
              placeholder="Escribe tu consulta..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />
            <button
              className={`${styles.micBtn} ${isListening ? styles.micActive : ""}`}
              onClick={toggleMic}
              aria-label={isListening ? "Detener micrófono" : "Activar micrófono"}
              type="button"
            >
              {isListening ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="12" rx="3" />
                  <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
              )}
            </button>
            <button
              className={styles.sendBtn}
              onClick={handleTextSubmit}
              disabled={!inputText.trim() || isTyping}
              aria-label="Enviar mensaje"
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <div className={styles.fabLabel}>
          <span>¿Necesitas ayuda?</span>
        </div>
      )}

      <button className={`${styles.fab} ${!isOpen ? styles.fabPulse : ""}`} onClick={() => setIsOpen(!isOpen)} aria-label="Abrir asistente virtual">
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <Image
            src="/assets/images/joven-chat-icono.jpeg"
            alt="Chat con Kira"
            width={60}
            height={60}
            className={styles.fabImg}
          />
        )}
      </button>
    </div>
  );
}
