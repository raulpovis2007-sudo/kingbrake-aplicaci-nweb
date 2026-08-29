export async function getBrands() {
  const res = await fetch('/api/vehicles/brands');
  if (!res.ok) throw new Error('Error al obtener marcas');
  return res.json();
}

export async function getModelsByBrand(brandId: string) {
  const res = await fetch(`/api/vehicles/models/${brandId}`);
  if (!res.ok) throw new Error('Error al obtener modelos');
  return res.json();
}
