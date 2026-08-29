import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "King Brake Peru — Seguridad en cada frenada",
    short_name: "King Brake",
    description:
      "Pastillas de freno, discos, zapatas y tambores para las marcas más populares en Perú.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0e1469",
    orientation: "portrait",
    scope: "/",
    lang: "es-PE",
    categories: ["automotive", "shopping"],
    icons: [
      {
        src: "/assets/images/logo-principal.webp",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/images/logo-principal.webp",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
