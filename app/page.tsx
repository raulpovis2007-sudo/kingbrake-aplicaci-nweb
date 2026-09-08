import Hero from "./landing/hero/Hero";
import LineaProductos from "./landing/lineaProductos/LineaProductos";
import BannerCarrusel from "./landing/bannerCarrusel/BannerCarrusel";
import EventosCarrusel from "./landing/eventosCarrusel/EventosCarrusel";
import MetricasSection from "./landing/metricas/MetricasSection";
import GoogleReviews from "./landing/googleReviews/GoogleReviews";
import { ReelsSection } from "./components/Reels";
import BlogSection from "./landing/blogSection/BlogSection";
import Distribuidores from "./landing/distribuidores/Distribuidores";
import FAQ from "./landing/faq/FAQ";

export default function Home() {
  return (
    <>
      <main>
        <Hero />

        <LineaProductos />

        <BannerCarrusel />

        <EventosCarrusel />

        {/* TODO: Por qué King Brake — 4 cards: Calidad, Durabilidad, Compatibilidad, Soporte */}

        {/* <MetricasSection /> */}

        <GoogleReviews />

        <ReelsSection />

        <BlogSection />

        {/* <Distribuidores /> */}

        <FAQ />
      </main>
    </>
  );
}
