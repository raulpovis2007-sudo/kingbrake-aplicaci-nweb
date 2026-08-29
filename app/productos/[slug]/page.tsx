export default function ProductoPage({ params }: { params: { slug: string } }) {
  return (
    <main>
      <h1>Ficha de Producto: {params.slug}</h1>
      {/* TODO: Ficha de producto + botón agregar al carrito + compatibilidad */}
    </main>
  );
}
