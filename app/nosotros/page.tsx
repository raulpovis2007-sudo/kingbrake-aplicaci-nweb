import type { Metadata } from "next";
import Nosotros from "./Nosotros";

export const metadata: Metadata = {
  title: "Quiénes somos | King Brake Peru",
  description:
    "Conoce la historia, misión y valores de King Brake Peru. Más de 15 años ofreciendo componentes de frenado de calidad en Lima y todo el Perú.",
  openGraph: {
    title: "Quiénes somos | King Brake Peru",
    description:
      "Conoce la historia, misión y valores de King Brake Peru. Más de 15 años ofreciendo componentes de frenado de calidad.",
    type: "website",
  },
};

export default function NosotrosPage() {
  return <Nosotros />;
}
