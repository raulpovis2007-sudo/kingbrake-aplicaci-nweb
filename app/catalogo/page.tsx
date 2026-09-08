import { Suspense } from "react";
import BuscadorRepuestos from "./BuscadorRepuestos";

export const metadata = {
  title: "Catálogo de Repuestos | King Brake Peru",
  description:
    "Busca repuestos de freno compatibles con tu vehículo. Pastillas, discos, zapatas, tambores y más.",
};

export default function CatalogoPage() {
  return (
    <main>
      <Suspense>
        <BuscadorRepuestos />
      </Suspense>
    </main>
  );
}
