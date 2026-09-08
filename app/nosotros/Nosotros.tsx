"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ShieldCheck,
  Target,
  Handshake,
  Lightbulb,
  Eye,
  Rocket,
  ArrowRight,
  ChevronDown,
  CheckCircle,
} from "lucide-react";
import styles from "./Nosotros.module.css";

/* ── Animated counter with easeOut ── */

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [inView, target]);

  return <span ref={ref}>+{count.toLocaleString()}{suffix}</span>;
}

/* ── Stagger container ── */

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const fadeUpSlow = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

/* ── Data ── */

const VALORES = [
  {
    icon: ShieldCheck,
    titulo: "Compromiso con la calidad",
    texto: "Cada componente pasa por rigurosos controles para garantizar seguridad y rendimiento.",
    accent: "#fe0008",
  },
  {
    icon: Handshake,
    titulo: "Honestidad y transparencia",
    texto: "Relaciones comerciales basadas en la confianza y la comunicación directa con nuestros clientes.",
    accent: "#0e1469",
  },
  {
    icon: Target,
    titulo: "Orientación al cliente",
    texto: "Asesoría técnica especializada y servicio enfocado en la satisfacción de distribuidores y talleres.",
    accent: "#fe0008",
  },
  {
    icon: Lightbulb,
    titulo: "Innovación y mejora continua",
    texto: "Incorporamos materiales y tecnologías de última generación para mantenernos a la vanguardia.",
    accent: "#0e1469",
  },
];

const POR_QUE = [
  "Especialistas en sistemas de frenos.",
  "Amplio portafolio de productos.",
  "Calidad garantizada.",
  "Cobertura nacional.",
  "Asesoría técnica especializada.",
  "Compromiso con nuestros clientes.",
];

const CIFRAS = [
  { valor: 15, sufijo: "", label: "Años en el mercado" },
  { valor: 200, sufijo: "+", label: "Modelos compatibles" },
  { valor: 50, sufijo: "+", label: "Puntos de venta" },
  { valor: 5000, sufijo: "+", label: "Clientes satisfechos" },
];

const TIMELINE = [
  { year: "2009", text: "Fundación de King Brake en Lima, con la visión de revolucionar el mercado de frenos en Perú." },
  { year: "2014", text: "Expansión a 20 puntos de venta y lanzamiento de la línea de pastillas ceramicadas." },
  { year: "2019", text: "Cobertura nacional con más de 40 distribuidores y alianzas estratégicas con talleres." },
  { year: "2024", text: "Más de 50 puntos de venta, catálogo digital y +200 modelos compatibles." },
];

export default function Nosotros() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);

  return (
    <>
      {/* ══════════ HERO ══════════ */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroGrid} />
        <motion.div className={styles.heroOrb} style={{ scale: orbScale }} />
        <motion.div className={styles.heroOrbSecondary} style={{ scale: orbScale }} />

        <motion.div
          className={styles.heroContent}
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.span
            className={styles.heroBreadcrumb}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Inicio / Quiénes somos
          </motion.span>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Quiénes <span className={styles.heroTitleAccent}>somos</span>
          </motion.h1>

          <motion.div
            className={styles.heroLine}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          />

          <motion.p
            className={styles.heroSlogan}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Seguridad en cada frenada
          </motion.p>
        </motion.div>

        <motion.div
          className={styles.heroScroll}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* ══════════ HISTORIA ══════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.div
            className={styles.historiaGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.div className={styles.historiaImagen} variants={scaleIn}>
              <div className={styles.historiaImagenInner}>
                <span className={styles.historiaImagenText}>KB</span>
              </div>
              <div className={styles.historiaAccent} />
              <div className={styles.historiaAccentLine} />
            </motion.div>

            <motion.div className={styles.historiaTexto} variants={fadeUp}>
              <span className={styles.sectionLabel}>¿Quiénes somos?</span>
              <h2 className={styles.sectionTitle}>
                King Brake Perú
              </h2>
              <p className={styles.bodyText}>
                KING BRAKE PERÚ es una empresa especializada en la importación
                y comercialización de repuestos para sistemas de frenos
                automotrices. Nos enfocamos exclusivamente en productos de
                frenado para vehículos livianos y comerciales, ofreciendo
                soluciones confiables, seguras y de alta calidad para el
                mercado peruano.
              </p>
              <p className={styles.bodyText}>
                Atendemos a distribuidores, mayoristas, casas de repuestos y
                talleres especializados en todo el país.
              </p>
              <span className={styles.sectionLabel}>Nuestra historia</span>
              <p className={styles.bodyText}>
                Desde nuestros inicios, hemos trabajado con un objetivo claro:
                convertirnos en un aliado estratégico para nuestros clientes,
                ofreciendo productos con una excelente relación entre calidad,
                rendimiento y precio. Gracias a la confianza de nuestros
                clientes y al compromiso de nuestro equipo, hoy contamos con
                una presencia cada vez mayor en las principales ciudades del
                Perú y continuamos ampliando nuestro portafolio y cobertura
                comercial.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ TIMELINE ══════════ */}
      <section className={styles.timelineSection}>
        <div className={styles.container}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.span className={styles.sectionLabelCenter} variants={fadeUp}>
              Nuestro recorrido
            </motion.span>
            <motion.h2 className={styles.sectionTitleCenter} variants={fadeUp}>
              Hitos que nos definen
            </motion.h2>

            <div className={styles.timeline}>
              <div className={styles.timelineLine} />
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.year}
                  className={`${styles.timelineItem} ${i % 2 === 1 ? styles.timelineItemRight : ""}`}
                  variants={fadeUp}
                >
                  <div className={styles.timelineDot}>
                    <div className={styles.timelineDotInner} />
                  </div>
                  <div className={styles.timelineCard}>
                    <span className={styles.timelineYear}>{item.year}</span>
                    <p className={styles.timelineText}>{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ MISIÓN Y VISIÓN ══════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.div
            className={styles.mvGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.div className={styles.mvCard} variants={fadeUpSlow}>
              <div className={styles.mvGlow} />
              <div className={styles.mvIconWrap}>
                <Rocket size={28} strokeWidth={1.6} />
              </div>
              <h3 className={styles.mvTitle}>Nuestra misión</h3>
              <p className={styles.mvText}>
                Proporcionar soluciones completas para sistemas de frenos,
                ofreciendo productos de alta calidad que garanticen seguridad,
                confianza y un excelente desempeño para nuestros clientes.
              </p>
            </motion.div>

            <motion.div className={`${styles.mvCard} ${styles.mvCardVision}`} variants={fadeUpSlow}>
              <div className={styles.mvGlow} />
              <div className={styles.mvIconWrap}>
                <Eye size={28} strokeWidth={1.6} />
              </div>
              <h3 className={styles.mvTitle}>Nuestra visión</h3>
              <p className={styles.mvText}>
                Consolidarnos como una de las marcas líderes en sistemas de
                frenos del Perú, destacando por nuestra calidad, innovación,
                cobertura nacional y servicio al cliente.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ VALORES ══════════ */}
      <section className={styles.valoresSection}>
        <div className={styles.container}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.span className={styles.sectionLabelCenter} variants={fadeUp}>
              Lo que nos define
            </motion.span>
            <motion.h2 className={styles.sectionTitleCenterLight} variants={fadeUp}>
              Nuestros valores
            </motion.h2>

            <motion.div className={styles.valoresGrid} variants={stagger}>
              {VALORES.map((v, i) => (
                <motion.div
                  key={v.titulo}
                  className={styles.valorCard}
                  variants={fadeUp}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                >
                  <div
                    className={styles.valorIconWrap}
                    style={{ "--valor-accent": v.accent } as React.CSSProperties}
                  >
                    <v.icon size={26} strokeWidth={1.6} />
                  </div>
                  <span className={styles.valorNum}>0{i + 1}</span>
                  <h3 className={styles.valorTitulo}>{v.titulo}</h3>
                  <p className={styles.valorTexto}>{v.texto}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ CIFRAS ══════════ */}
      <section className={styles.cifrasSection}>
        <div className={styles.cifrasBg} />
        <div className={styles.container}>
          <motion.div
            className={styles.cifrasGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={stagger}
          >
            {CIFRAS.map((c) => (
              <motion.div key={c.label} className={styles.cifraItem} variants={fadeUp}>
                <span className={styles.cifraValor}>
                  <AnimatedCounter target={c.valor} suffix={c.sufijo} />
                </span>
                <div className={styles.cifraDivider} />
                <span className={styles.cifraLabel}>{c.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ POR QUÉ ELEGIRNOS ══════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <motion.span className={styles.sectionLabelCenter} variants={fadeUp}>
              Nuestra propuesta
            </motion.span>
            <motion.h2 className={styles.sectionTitleCenter} variants={fadeUp}>
              ¿Por qué elegir King Brake?
            </motion.h2>
            <motion.div className={styles.porQueGrid} variants={stagger}>
              {POR_QUE.map((item) => (
                <motion.div key={item} className={styles.porQueItem} variants={fadeUp}>
                  <CheckCircle size={20} strokeWidth={2} className={styles.porQueIcon} />
                  <span>{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ COMPROMISO ══════════ */}
      <section className={styles.compromisoSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.compromisoInner}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={stagger}
          >
            <motion.span className={styles.sectionLabelCenter} variants={fadeUp}>
              Lo que nos mueve
            </motion.span>
            <motion.h2 className={styles.sectionTitleCenter} variants={fadeUp}>
              Nuestro compromiso
            </motion.h2>
            <motion.p className={styles.compromisoText} variants={fadeUp}>
              En KING BRAKE creemos que el crecimiento de nuestra empresa se
              construye sobre la confianza de nuestros clientes, la calidad de
              nuestros productos y el compromiso de cada integrante de nuestro
              equipo.
            </motion.p>
            <motion.p className={styles.compromisoText} variants={fadeUp}>
              Cada colaborador representa nuestra marca y contribuye a ofrecer
              un servicio responsable, profesional y orientado a la satisfacción
              del cliente.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaOrb} />
        <div className={styles.container}>
          <motion.div
            className={styles.ctaInner}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={stagger}
          >
            <motion.h2 className={styles.ctaTitle} variants={fadeUp}>
              Encuentra el repuesto perfecto<br />para tu vehículo
            </motion.h2>
            <motion.p className={styles.ctaText} variants={fadeUp}>
              Explora nuestro catálogo completo de pastillas, zapatas, discos,
              tambores y componentes hidráulicos.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/catalogo" className={styles.ctaButton}>
                <span>Ver catálogo</span>
                <ArrowRight size={18} strokeWidth={2.2} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
