import CarritoContent from "./CarritoContent";

export const metadata = {
  title: "Carrito | King Brake Peru",
};

export default function CarritoPage() {
  return (
    <main>
      <h1 style={{ textAlign: "center", padding: "2rem 1rem 0" }}>
        Tu Carrito
      </h1>
      <CarritoContent />
    </main>
  );
}
