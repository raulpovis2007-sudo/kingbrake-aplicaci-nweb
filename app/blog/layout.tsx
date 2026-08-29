import { Metadata } from "next";
import BfcacheFix from "./components/BfcacheFix";

export const metadata: Metadata = {
  title: "Blog | King Brake Peru",
  description:
    "Consejos sobre mantenimiento de frenos, guías de compra de repuestos y tips de seguridad vial para tu vehículo.",
  openGraph: {
    title: "Blog | King Brake Peru",
    description:
      "Consejos sobre frenos, mantenimiento y seguridad vial.",
    type: "website",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BfcacheFix />
      {children}
    </>
  );
}
