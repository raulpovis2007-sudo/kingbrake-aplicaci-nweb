import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Cleanup (order matters for foreign keys)
  await prisma.productCompatibility.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.vehicleModel.deleteMany();
  await prisma.vehicleBrand.deleteMany();

  // ── Categorías (5 líneas de producto) ──
  const categories = await Promise.all(
    [
      { name: "Pastillas de freno", slug: "pastillas-de-freno", description: "Pastillas ceramicadas y semimetálicas", order: 1 },
      { name: "Zapatas", slug: "zapatas", description: "Zapatas de freno para sistema de tambor", order: 2 },
      { name: "Discos y tambores", slug: "discos-y-tambores", description: "Discos ventilados, sólidos y tambores", order: 3 },
      { name: "Sistema hidráulico", slug: "sistema-hidraulico", description: "Cilindros maestros, servos, bombas, bombines y kits", order: 4 },
      { name: "Lubricantes de freno", slug: "lubricantes-de-freno", description: "Limpiadores, líquidos y grasas para frenos", order: 5 },
    ].map((c) => prisma.category.create({ data: c })),
  );

  const [pastillas, zapatas, discosYTambores, sistemaHidraulico, lubricantes] = categories;

  // ── Productos ──
  const products = await Promise.all([
    // Featured products (from lineas-producto.ts)
    prisma.product.create({ data: { name: "Ceramic Ultra", slug: "ceramic-ultra", description: "Pastillas ceramicadas de alto rendimiento. Frenado silencioso, baja emisión de polvo y máxima durabilidad.", price: 89.90, sku: "KB-CU-001", stock: 100, featured: true, images: ["/assets/images/productos/1.1 - CERAMIC-ULTRA.png"], categoryId: pastillas.id } }),
    prisma.product.create({ data: { name: "Ceramic Heavy", slug: "ceramic-heavy", description: "Pastillas ceramicadas de servicio pesado. Soporta altas temperaturas y cargas pesadas.", price: 99.90, sku: "KB-CH-001", stock: 100, featured: true, images: ["/assets/images/productos/1.3 - CERAMIC-HEAVY.png"], categoryId: pastillas.id } }),
    prisma.product.create({ data: { name: "Metal Power", slug: "metal-power", description: "Pastillas semimetálicas con máxima potencia de frenado y respuesta inmediata.", price: 79.90, sku: "KB-MP-001", stock: 100, featured: true, images: ["/assets/images/productos/1.2 - METAL-POWER.png"], categoryId: pastillas.id } }),
    prisma.product.create({ data: { name: "Zapatas", slug: "zapatas-king-brake", description: "Zapatas King Brake con materiales de fricción de alta calidad. Larga vida útil y frenado consistente.", price: 49.90, sku: "KB-ZP-100", stock: 100, featured: true, images: ["/assets/images/productos/2.1-ZAPATAS.png"], categoryId: zapatas.id } }),
    prisma.product.create({ data: { name: "Discos", slug: "discos-king-brake", description: "Discos de freno en fundición gris de alta resistencia. Disipación de calor óptima.", price: 189.90, sku: "KB-DI-001", stock: 100, featured: true, images: ["/assets/images/productos/3.1-DISCOS.png"], categoryId: discosYTambores.id } }),
    prisma.product.create({ data: { name: "Tambores", slug: "tambores-king-brake", description: "Tambores de freno de fundición balanceada. Frenado uniforme y sin vibraciones.", price: 139.90, sku: "KB-TA-001", stock: 100, featured: true, images: ["/assets/images/productos/3.2-TAMBORES.png"], categoryId: discosYTambores.id } }),
    prisma.product.create({ data: { name: "Master", slug: "master-king-brake", description: "Cilindro maestro King Brake. Precisión de sellado para frenado seguro y progresivo.", price: 185.00, sku: "KB-MA-001", stock: 100, featured: true, images: ["/assets/images/productos/4.1-MASTER.png"], categoryId: sistemaHidraulico.id } }),
    prisma.product.create({ data: { name: "Servo", slug: "servo-king-brake", description: "Servofreno King Brake que amplifica la fuerza de frenado mediante vacío del motor.", price: 250.00, sku: "KB-SV-001", stock: 100, featured: true, images: ["/assets/images/productos/4-SISTEMA-HIDRAULICO.png"], categoryId: sistemaHidraulico.id } }),
    prisma.product.create({ data: { name: "Bomba de Freno", slug: "bomba-de-freno-king-brake", description: "Bomba de freno con sellos de alta durabilidad. Distribución equilibrada y sin fugas.", price: 165.00, sku: "KB-BF-001", stock: 100, featured: true, images: ["/assets/images/productos/4.3-BOMBA-DE-FRENO-Y-EMBRAGUE.png"], categoryId: sistemaHidraulico.id } }),
    prisma.product.create({ data: { name: "Bomba de Embrague", slug: "bomba-de-embrague-king-brake", description: "Bomba de embrague con operación suave y precisa. Materiales anticorrosivos.", price: 145.00, sku: "KB-BE-001", stock: 100, featured: true, images: ["/assets/images/productos/4.3-BOMBA-DE-FRENO-Y-EMBRAGUE.png"], categoryId: sistemaHidraulico.id } }),
    prisma.product.create({ data: { name: "Bombín de Rueda", slug: "bombin-de-rueda-king-brake", description: "Bombín de rueda con pistones de precisión. Sellado hermético.", price: 55.00, sku: "KB-BR-001", stock: 100, featured: true, images: ["/assets/images/productos/4.2-BOMBIN-DE-FRENO-EMBRAGUE.png"], categoryId: sistemaHidraulico.id } }),
    prisma.product.create({ data: { name: "Bombín auxiliar de Embrague", slug: "bombin-auxiliar-embrague-king-brake", description: "Cilindro receptor de embrague. Cambio de marcha suave y preciso.", price: 65.00, sku: "KB-BA-001", stock: 100, featured: true, images: ["/assets/images/productos/4.2-BOMBIN-DE-FRENO-EMBRAGUE.png"], categoryId: sistemaHidraulico.id } }),
    prisma.product.create({ data: { name: "Kit de reparación de Embrague", slug: "kit-reparacion-embrague-king-brake", description: "Kit completo con retenes, resortes y pistones para restaurar el sistema de embrague.", price: 35.90, sku: "KB-KR-001", stock: 100, featured: true, images: ["/assets/images/productos/4.4-KIT-DE-REPARACION-DE-EMBRAGUE.png"], categoryId: sistemaHidraulico.id } }),
    prisma.product.create({ data: { name: "Limpiador de frenos", slug: "limpiador-de-frenos-king-brake", description: "Elimina grasa, aceite y residuos. Evaporación rápida sin residuos.", price: 25.00, sku: "KB-LI-001", stock: 100, featured: true, images: ["/assets/images/productos/5.1-LIMPIADOR-DE-FRENOS.png"], categoryId: lubricantes.id } }),
    prisma.product.create({ data: { name: "Líquido para frenos", slug: "liquido-para-frenos-king-brake", description: "Líquido DOT 3 y DOT 4 con alto punto de ebullición y aditivos anticorrosivos.", price: 28.90, sku: "KB-LQ-001", stock: 100, featured: true, images: ["/assets/images/productos/5.2-LIQUIDOOS-DE-FRENOS-DOT-3.png"], categoryId: lubricantes.id } }),
    prisma.product.create({ data: { name: "Grasas para frenos", slug: "grasas-para-frenos-king-brake", description: "Grasa especial resistente a altas temperaturas. Previene ruidos y desgaste.", price: 18.90, sku: "KB-GR-001", stock: 100, featured: true, images: ["/assets/images/productos/5.5-GRASAS-PARA-FRENOS-CERAMIC-EXTREME.png"], categoryId: lubricantes.id } }),
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
    15: allModelRecords,      // Lubricante → todos
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
        coverImage: "https://placehold.co/800x400/0e1469/ffffff.png?text=Pastillas+de+Freno",
        categoryId: blogCats[0].id,
        published: true,
      },
      {
        title: "Ceramicadas vs Semimetálicas: ¿Cuál elegir?",
        slug: "ceramicadas-vs-semimetalicas",
        excerpt: "Comparamos ambos tipos de pastillas para ayudarte a elegir la mejor opción para tu vehículo.",
        content: "<p>Elegir entre pastillas ceramicadas y semimetálicas depende de tu estilo de manejo...</p>",
        coverImage: "https://placehold.co/800x400/fe0008/ffffff.png?text=Comparativa",
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
