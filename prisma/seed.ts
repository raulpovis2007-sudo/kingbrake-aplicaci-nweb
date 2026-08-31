import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Cleanup (order matters for foreign keys)
  await prisma.productCompatibility.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.vehicleModel.deleteMany();
  await prisma.vehicleBrand.deleteMany();

  // ── Categorías ──
  const categories = await Promise.all(
    [
      { name: "Pastillas Ceramicadas", slug: "pastillas-ceramicadas", description: "Pastillas de freno con compuesto cerámico para mayor durabilidad y menor ruido", icon: "ceramic", order: 1 },
      { name: "Pastillas Semimetálicas", slug: "pastillas-semimetalicas", description: "Pastillas de freno semimetálicas ideales para uso urbano y carretera", icon: "semimetallic", order: 2 },
      { name: "Zapatas", slug: "zapatas", description: "Zapatas de freno para sistema de tambor", icon: "shoe", order: 3 },
      { name: "Discos de Freno", slug: "discos-de-freno", description: "Discos de freno ventilados y sólidos", icon: "disc", order: 4 },
      { name: "Tambores", slug: "tambores", description: "Tambores de freno de alta resistencia", icon: "drum", order: 5 },
      { name: "Componentes Hidráulicos", slug: "componentes-hidraulicos", description: "Cilindros maestros, bombines y mangueras de freno", icon: "hydraulic", order: 6 },
      { name: "Líquido de Frenos", slug: "liquido-de-frenos", description: "Líquidos de freno DOT 3 y DOT 4", icon: "fluid", order: 7 },
    ].map((c) => prisma.category.create({ data: c })),
  );

  const [ceramicadas, semimetalicas, zapatas, discos, tambores, hidraulicos, liquidos] = categories;

  // ── Productos ──
  const products = await Promise.all([
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
    prisma.product.create({ data: { name: "Cilindro Maestro de Freno", slug: "cilindro-maestro-freno", description: "Cilindro maestro de freno. Compatible con múltiples modelos.", price: 185.00, sku: "KB-CH-001", stock: 12, categoryId: hidraulicos.id } }),
    prisma.product.create({ data: { name: "Kit Reparación Bombín", slug: "kit-reparacion-bombin", description: "Kit completo de reparación para bombín de freno trasero.", price: 35.90, sku: "KB-CH-002", stock: 30, categoryId: hidraulicos.id } }),
    prisma.product.create({ data: { name: "Líquido de Frenos DOT 4", slug: "liquido-frenos-dot4", description: "Líquido de frenos DOT 4 de alta performance. 500ml.", price: 28.90, sku: "KB-LF-001", stock: 80, categoryId: liquidos.id } }),
  ]);

  // ── Marcas de vehículos ──
  const brandsData = [
    { name: "Toyota", slug: "toyota", models: [
      { name: "Yaris", yearFrom: 2006, yearTo: 2026 },
      { name: "Corolla", yearFrom: 2002, yearTo: 2026 },
      { name: "Hilux", yearFrom: 2005, yearTo: 2026 },
      { name: "RAV4", yearFrom: 2006, yearTo: 2026 },
    ]},
    { name: "Hyundai", slug: "hyundai", models: [
      { name: "Accent", yearFrom: 2006, yearTo: 2026 },
      { name: "Tucson", yearFrom: 2010, yearTo: 2026 },
      { name: "i10", yearFrom: 2008, yearTo: 2026 },
    ]},
    { name: "Kia", slug: "kia", models: [
      { name: "Rio", yearFrom: 2006, yearTo: 2026 },
      { name: "Sportage", yearFrom: 2010, yearTo: 2026 },
      { name: "Picanto", yearFrom: 2004, yearTo: 2026 },
    ]},
    { name: "Nissan", slug: "nissan", models: [
      { name: "Sentra", yearFrom: 2000, yearTo: 2026 },
      { name: "X-Trail", yearFrom: 2008, yearTo: 2026 },
      { name: "Frontier", yearFrom: 2005, yearTo: 2026 },
    ]},
    { name: "Chevrolet", slug: "chevrolet", models: [
      { name: "Sail", yearFrom: 2010, yearTo: 2026 },
      { name: "Spark", yearFrom: 2005, yearTo: 2026 },
      { name: "Tracker", yearFrom: 2020, yearTo: 2026 },
    ]},
    { name: "Suzuki", slug: "suzuki", models: [
      { name: "Swift", yearFrom: 2005, yearTo: 2026 },
      { name: "Vitara", yearFrom: 2015, yearTo: 2026 },
    ]},
    { name: "Mitsubishi", slug: "mitsubishi", models: [
      { name: "L200", yearFrom: 2006, yearTo: 2026 },
      { name: "ASX", yearFrom: 2010, yearTo: 2026 },
      { name: "Outlander", yearFrom: 2007, yearTo: 2026 },
    ]},
    { name: "Honda", slug: "honda", models: [
      { name: "Civic", yearFrom: 2000, yearTo: 2026 },
      { name: "CR-V", yearFrom: 2002, yearTo: 2026 },
      { name: "HR-V", yearFrom: 2015, yearTo: 2026 },
    ]},
    { name: "Mazda", slug: "mazda", models: [
      { name: "Mazda 3", yearFrom: 2004, yearTo: 2026 },
      { name: "CX-5", yearFrom: 2013, yearTo: 2026 },
    ]},
    { name: "Volkswagen", slug: "volkswagen", models: [
      { name: "Gol", yearFrom: 2005, yearTo: 2022 },
      { name: "T-Cross", yearFrom: 2019, yearTo: 2026 },
      { name: "Tiguan", yearFrom: 2008, yearTo: 2026 },
    ]},
  ];

  const suvModelNames = new Set([
    "Hilux", "RAV4", "Tucson", "Sportage", "X-Trail", "Frontier",
    "Tracker", "Vitara", "L200", "ASX", "Outlander", "CR-V", "HR-V",
    "CX-5", "T-Cross", "Tiguan",
  ]);

  const allModelRecords: { id: string; name: string }[] = [];

  for (const brandData of brandsData) {
    const brand = await prisma.vehicleBrand.create({
      data: { name: brandData.name, slug: brandData.slug },
    });
    for (const modelData of brandData.models) {
      const model = await prisma.vehicleModel.create({
        data: { ...modelData, brandId: brand.id },
      });
      allModelRecords.push({ id: model.id, name: modelData.name });
    }
  }

  const sedanModels = allModelRecords.filter((m) => !suvModelNames.has(m.name));
  const suvModels = allModelRecords.filter((m) => suvModelNames.has(m.name));

  // Products by index: 0-2 ceramicadas, 3-5 semimetalicas, 6-7 zapatas,
  // 8-10 discos, 11-12 tambores, 13-14 hidraulicos, 15 liquidos
  const compatMap: Record<number, typeof allModelRecords> = {
    0: allModelRecords,       // Universal → todos
    1: sedanModels,           // Sedán
    2: suvModels,             // SUV
    3: suvModels,             // Camioneta
    4: sedanModels,           // Sedán
    5: suvModels,             // Pick-up
    6: allModelRecords,       // Estándar → todos
    7: sedanModels,           // Compacto
    8: allModelRecords,       // Ventilado → todos
    9: suvModels,             // SUV
    10: sedanModels,          // Trasero sedán
    11: allModelRecords,      // Estándar → todos
    12: sedanModels,          // Compacto
    13: allModelRecords,      // Cilindro maestro → todos
    14: sedanModels,          // Kit bombín → sedán
    15: allModelRecords,      // Líquido → todos
  };

  for (let i = 0; i < products.length; i++) {
    const compatibleModels = compatMap[i] ?? [];
    if (compatibleModels.length > 0) {
      await prisma.productCompatibility.createMany({
        data: compatibleModels.map((m) => ({
          productId: products[i].id,
          vehicleModelId: m.id,
        })),
      });
    }
  }

  // ── Distribuidores ──
  await prisma.distributor.deleteMany();
  await prisma.distributor.createMany({
    data: [
      // Lima
      { name: "King Brake Central", address: "Av. Iquitos 1234, La Victoria, Lima", lat: -12.0650, lng: -77.0200, phone: "+51999888777" },
      { name: "Autopartes San Juan", address: "Av. Los Héroes 567, San Juan de Miraflores, Lima", lat: -12.1560, lng: -76.9720, phone: "+51999777666" },
      { name: "Frenos Express Comas", address: "Av. Tupac Amaru 3456, Comas, Lima", lat: -11.9460, lng: -77.0490, phone: "+51999666555" },
      { name: "Repuestos El Pacifico", address: "Av. Colonial 890, Callao", lat: -12.0560, lng: -77.1020, phone: "+51999555444" },
      { name: "Auto Frenos Lima Norte", address: "Av. Universitaria 4567, Los Olivos, Lima", lat: -11.9820, lng: -77.0710, phone: "+51999444333" },
      // Arequipa
      { name: "Frenos del Sur Arequipa", address: "Av. Ejército 456, Cayma, Arequipa", lat: -16.3989, lng: -71.5350, phone: "+51954111222" },
      { name: "Autopartes Arequipa Centro", address: "Calle Mercaderes 312, Cercado, Arequipa", lat: -16.4090, lng: -71.5375, phone: "+51954222333" },
      // Trujillo
      { name: "King Brake Trujillo", address: "Av. España 1520, Trujillo, La Libertad", lat: -8.1116, lng: -79.0288, phone: "+51944111222" },
      // Chiclayo
      { name: "Frenos Chiclayo", address: "Av. Balta 890, Chiclayo, Lambayeque", lat: -6.7714, lng: -79.8409, phone: "+51974111222" },
      // Cusco
      { name: "Autofrenos Cusco", address: "Av. de la Cultura 1200, Cusco", lat: -13.5250, lng: -71.9672, phone: "+51984111222" },
      // Piura
      { name: "Repuestos Piura Norte", address: "Av. Grau 650, Piura", lat: -5.1945, lng: -80.6328, phone: "+51964111222" },
      // Huancayo
      { name: "Frenos Huancayo", address: "Calle Real 1450, Huancayo, Junín", lat: -12.0651, lng: -75.2049, phone: "+51934111222" },
      // Ica
      { name: "King Brake Ica", address: "Av. San Martín 380, Ica", lat: -14.0755, lng: -75.7342, phone: "+51924111222" },
      // Tacna
      { name: "Autopartes Tacna", address: "Av. Bolognesi 520, Tacna", lat: -18.0146, lng: -70.2536, phone: "+51952111222" },
      // Pucallpa
      { name: "Frenos Pucallpa", address: "Jr. Tarapacá 340, Pucallpa, Ucayali", lat: -8.3791, lng: -74.5539, phone: "+51962111222" },
    ],
  });

  // ── Blog ──
  await prisma.blogPost.deleteMany();
  await prisma.blogCategory.deleteMany();

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
