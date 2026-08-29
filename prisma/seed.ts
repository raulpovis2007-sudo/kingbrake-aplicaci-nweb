import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Categorías
  const categories = await Promise.all(
    [
      { name: "Pastillas Ceramicadas", slug: "pastillas-ceramicadas", description: "Pastillas de freno con compuesto cerámico para mayor durabilidad y menor ruido", icon: "ceramic", order: 1 },
      { name: "Pastillas Semimetálicas", slug: "pastillas-semimetalicas", description: "Pastillas de freno semimetálicas ideales para uso urbano y carretera", icon: "semimetallic", order: 2 },
      { name: "Zapatas", slug: "zapatas", description: "Zapatas de freno para sistema de tambor", icon: "shoe", order: 3 },
      { name: "Discos de Freno", slug: "discos-de-freno", description: "Discos de freno ventilados y sólidos", icon: "disc", order: 4 },
      { name: "Tambores", slug: "tambores", description: "Tambores de freno de alta resistencia", icon: "drum", order: 5 },
    ].map((c) => prisma.category.create({ data: c }))
  );

  const [ceramicadas, semimetalicas, zapatas, discos, tambores] = categories;

  // Productos
  await Promise.all([
    prisma.product.create({ data: { name: "Pastilla Ceramicada Delantera Universal", slug: "pastilla-ceramicada-del-universal", description: "Pastilla de freno ceramicada delantera. Frenado suave, bajo polvo y mínimo ruido.", price: 89.90, sku: "KB-PC-001", stock: 50, featured: true, categoryId: ceramicadas.id } }),
    prisma.product.create({ data: { name: "Pastilla Ceramicada Delantera Sedán", slug: "pastilla-ceramicada-del-sedan", description: "Pastilla ceramicada de alto rendimiento para sedanes compactos.", price: 79.90, sku: "KB-PC-002", stock: 40, featured: true, categoryId: ceramicadas.id } }),
    prisma.product.create({ data: { name: "Pastilla Ceramicada Delantera SUV", slug: "pastilla-ceramicada-del-suv", description: "Pastilla ceramicada para SUVs. Resistente a altas temperaturas.", price: 129.90, sku: "KB-PC-003", stock: 30, featured: true, categoryId: ceramicadas.id } }),
    prisma.product.create({ data: { name: "Pastilla Semimetálica Delantera Camioneta", slug: "pastilla-semimetalica-del-camioneta", description: "Pastilla semimetálica reforzada. Ideal para uso pesado y off-road.", price: 119.90, sku: "KB-PS-001", stock: 25, categoryId: semimetalicas.id } }),
    prisma.product.create({ data: { name: "Pastilla Semimetálica Delantera Sedán", slug: "pastilla-semimetalica-del-sedan", description: "Pastilla semimetálica económica para sedanes compactos.", price: 59.90, sku: "KB-PS-002", stock: 60, categoryId: semimetalicas.id } }),
    prisma.product.create({ data: { name: "Pastilla Semimetálica Delantera Pick-up", slug: "pastilla-semimetalica-del-pickup", description: "Pastilla semimetálica de alto rendimiento para pick-ups. Trabajo pesado.", price: 114.90, sku: "KB-PS-003", stock: 20, categoryId: semimetalicas.id } }),
    prisma.product.create({ data: { name: "Zapata de Freno Trasera Estándar", slug: "zapata-freno-trasera-estandar", description: "Zapata de freno trasera. Material de fricción de alta calidad.", price: 49.90, sku: "KB-ZP-001", stock: 40, categoryId: zapatas.id } }),
    prisma.product.create({ data: { name: "Zapata de Freno Trasera Compacto", slug: "zapata-freno-trasera-compacto", description: "Zapata trasera para vehículos compactos. Ajuste perfecto y durabilidad.", price: 45.90, sku: "KB-ZP-002", stock: 35, categoryId: zapatas.id } }),
    prisma.product.create({ data: { name: "Disco de Freno Ventilado Delantero", slug: "disco-freno-ventilado-delantero", description: "Disco de freno ventilado delantero. Mayor disipación de calor.", price: 189.90, sku: "KB-DF-001", stock: 15, featured: true, categoryId: discos.id } }),
    prisma.product.create({ data: { name: "Disco de Freno Ventilado SUV", slug: "disco-freno-ventilado-suv", description: "Disco ventilado para SUVs medianos. Diámetro 280mm.", price: 229.90, sku: "KB-DF-002", stock: 12, categoryId: discos.id } }),
    prisma.product.create({ data: { name: "Disco de Freno Sólido Trasero", slug: "disco-freno-solido-trasero", description: "Disco sólido trasero para sedanes. Acabado de precisión.", price: 149.90, sku: "KB-DF-003", stock: 18, categoryId: discos.id } }),
    prisma.product.create({ data: { name: "Tambor de Freno Trasero Estándar", slug: "tambor-freno-trasero-estandar", description: "Tambor de freno trasero. Fundición de alta resistencia.", price: 139.90, sku: "KB-TB-001", stock: 10, categoryId: tambores.id } }),
    prisma.product.create({ data: { name: "Tambor de Freno Trasero Compacto", slug: "tambor-freno-trasero-compacto", description: "Tambor trasero para compactos. Hierro fundido de alta densidad.", price: 119.90, sku: "KB-TB-002", stock: 10, categoryId: tambores.id } }),
  ]);

  // Distribuidores
  await prisma.distributor.createMany({
    data: [
      { name: "King Brake Central", address: "Av. Iquitos 1234, La Victoria, Lima", lat: -12.0650, lng: -77.0200, phone: "+51999888777" },
      { name: "Autopartes San Juan", address: "Av. Los Héroes 567, San Juan de Miraflores, Lima", lat: -12.1560, lng: -76.9720, phone: "+51999777666" },
      { name: "Frenos Express Comas", address: "Av. Tupac Amaru 3456, Comas, Lima", lat: -11.9460, lng: -77.0490, phone: "+51999666555" },
      { name: "Repuestos El Pacifico", address: "Av. Colonial 890, Callao", lat: -12.0560, lng: -77.1020, phone: "+51999555444" },
      { name: "Auto Frenos Lima Norte", address: "Av. Universitaria 4567, Los Olivos, Lima", lat: -11.9820, lng: -77.0710, phone: "+51999444333" },
    ],
  });

  // Blog
  const blogCats = await Promise.all([
    prisma.blogCategory.create({ data: { name: "Mantenimiento", slug: "mantenimiento", color: "#0e1469" } }),
    prisma.blogCategory.create({ data: { name: "Seguridad Vial", slug: "seguridad-vial", color: "#fe0008" } }),
    prisma.blogCategory.create({ data: { name: "Guías de Compra", slug: "guias-de-compra", color: "#2563eb" } }),
  ]);

  await prisma.blogPost.createMany({
    data: [
      {
        title: "¿Cada cuánto cambiar las pastillas de freno?",
        slug: "cada-cuanto-cambiar-pastillas-de-freno",
        excerpt: "Aprende a identificar las señales que indican que es momento de cambiar tus pastillas de freno.",
        content: "<p>Las pastillas de freno son un componente crítico de seguridad...</p>",
        coverImage: "https://placehold.co/800x400/0e1469/ffffff?text=Pastillas+de+Freno",
        categoryId: blogCats[0].id,
        published: true,
      },
      {
        title: "Ceramicadas vs Semimetálicas: ¿Cuál elegir?",
        slug: "ceramicadas-vs-semimetalicas",
        excerpt: "Comparamos ambos tipos de pastillas para ayudarte a elegir la mejor opción para tu vehículo.",
        content: "<p>Elegir entre pastillas ceramicadas y semimetálicas depende de tu estilo de manejo...</p>",
        coverImage: "https://placehold.co/800x400/fe0008/ffffff?text=Comparativa",
        categoryId: blogCats[2].id,
        published: true,
      },
    ],
  });

  console.log("Seed completado: King Brake Peru");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
