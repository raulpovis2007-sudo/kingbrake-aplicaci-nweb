import Hero from "./landing/hero/Hero";
import MetricasSection from "./landing/metricas/MetricasSection";
import GoogleReviews from "./landing/googleReviews/GoogleReviews";
import { ReelsSection } from "./components/Reels";
import BlogSection from "./landing/blogSection/BlogSection";
import FAQ from "./landing/faq/FAQ";

export default function Home() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      <main id="main-content">
        <Hero />

        {/* TODO: Categorías grid — 5 categorías con imagen y count */}

        {/* TODO: Por qué King Brake — 4 cards: Calidad, Durabilidad, Compatibilidad, Soporte */}

        <MetricasSection />

        <GoogleReviews />

        <ReelsSection />

        <BlogSection />

        <FAQ />

        {/* TODO: Puntos de venta — Mapa Google Maps con distribuidores */}
      </main>
    </>
  );
}
