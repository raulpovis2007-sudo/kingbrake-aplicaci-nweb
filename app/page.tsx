import Hero from "./landing/hero/Hero";
import LineaProductos from "./landing/lineaProductos/LineaProductos";
import MetricasSection from "./landing/metricas/MetricasSection";
import EventosCarrusel from "./landing/eventosCarrusel/EventosCarrusel";
import { ReelsSection } from "./components/Reels";
import BlogSection from "./landing/blogSection/BlogSection";

export default function Home() {
  return (
    <>
      <main>
        <Hero />

        <LineaProductos />

        <MetricasSection />

        <EventosCarrusel />

        <ReelsSection />

        <BlogSection />
      </main>
    </>
  );
}
