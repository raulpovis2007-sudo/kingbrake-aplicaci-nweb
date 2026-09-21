import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Cleanup (order matters for foreign keys)
  await prisma.productCompatibility.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.vehicleGeneration.deleteMany();
  await prisma.vehicleModel.deleteMany();
  await prisma.vehicleBrand.deleteMany();

  // ── Categorías padre (5 líneas de producto) ──
  const pastillas = await prisma.category.create({ data: { name: "Pastillas de freno", slug: "pastillas-de-freno", description: "Pastillas ceramicadas y semimetálicas", order: 1 } });
  const zapatas = await prisma.category.create({ data: { name: "Zapatas", slug: "zapatas", description: "Zapatas de freno para sistema de tambor", order: 2 } });
  const discosYTambores = await prisma.category.create({ data: { name: "Discos y tambores", slug: "discos-y-tambores", description: "Discos ventilados, sólidos y tambores", order: 3 } });
  const sistemaHidraulico = await prisma.category.create({ data: { name: "Sistema hidráulico", slug: "sistema-hidraulico", description: "Cilindros maestros, servos, bombas, bombines y kits", order: 4 } });
  const lubricantes = await prisma.category.create({ data: { name: "Lubricantes de freno", slug: "lubricantes-de-freno", description: "Limpiadores, líquidos y grasas para frenos", order: 5 } });

  // ── Subcategorías ──
  // Pastillas de freno → 3 subcategorías
  const ceramicUltra = await prisma.category.create({ data: { name: "Ceramic Ultra", slug: "ceramic-ultra", description: "Pastillas ceramicadas de alto rendimiento", parentId: pastillas.id, order: 1 } });
  const ceramicHeavy = await prisma.category.create({ data: { name: "Ceramic Heavy", slug: "ceramic-heavy", description: "Pastillas ceramicadas de servicio pesado", parentId: pastillas.id, order: 2 } });
  const metalPower = await prisma.category.create({ data: { name: "Metal Power", slug: "metal-power", description: "Pastillas semimetálicas de alta potencia", parentId: pastillas.id, order: 3 } });

  // Zapatas → sin subcategorías (productos van directo al padre)

  // Discos y tambores → 2 subcategorías
  const discos = await prisma.category.create({ data: { name: "Discos", slug: "discos", description: "Discos de freno ventilados y sólidos", parentId: discosYTambores.id, order: 1 } });
  const tambores = await prisma.category.create({ data: { name: "Tambores", slug: "tambores", description: "Tambores de freno de fundición balanceada", parentId: discosYTambores.id, order: 2 } });

  // Sistema hidráulico → 7 subcategorías
  const master = await prisma.category.create({ data: { name: "Master", slug: "master", parentId: sistemaHidraulico.id, order: 1 } });
  const servo = await prisma.category.create({ data: { name: "Servo", slug: "servo", parentId: sistemaHidraulico.id, order: 2 } });
  const bombaFreno = await prisma.category.create({ data: { name: "Bomba de Freno", slug: "bomba-de-freno", parentId: sistemaHidraulico.id, order: 3 } });
  const bombaEmbrague = await prisma.category.create({ data: { name: "Bomba de Embrague", slug: "bomba-de-embrague", parentId: sistemaHidraulico.id, order: 4 } });
  const bombinRueda = await prisma.category.create({ data: { name: "Bombín de Rueda", slug: "bombin-de-rueda", parentId: sistemaHidraulico.id, order: 5 } });
  const bombinAuxEmbrague = await prisma.category.create({ data: { name: "Bombín auxiliar de Embrague", slug: "bombin-auxiliar-de-embrague", parentId: sistemaHidraulico.id, order: 6 } });
  const kitReparacion = await prisma.category.create({ data: { name: "Kit de reparación de Embrague", slug: "kit-de-reparacion-de-embrague", parentId: sistemaHidraulico.id, order: 7 } });

  // Lubricantes → 3 subcategorías
  const limpiador = await prisma.category.create({ data: { name: "Limpiador de frenos", slug: "limpiador-de-frenos", parentId: lubricantes.id, order: 1 } });
  const liquidoFreno = await prisma.category.create({ data: { name: "Líquido para frenos", slug: "liquido-para-frenos", parentId: lubricantes.id, order: 2 } });
  const grasas = await prisma.category.create({ data: { name: "Grasas para frenos", slug: "grasas-para-frenos", parentId: lubricantes.id, order: 3 } });

  // ── Productos (sin precio — cotización vía WhatsApp) ──
  const products = await Promise.all([
    // Pastillas de freno (asignados a subcategorías)
    prisma.product.create({ data: { name: "Ceramic Ultra", slug: "ceramic-ultra-kb", description: "Pastillas ceramicadas de alto rendimiento. Frenado silencioso, baja emisión de polvo y máxima durabilidad.", sku: "KB-CU-001", stock: 100, featured: true, images: ["/assets/images/productos/1.1 - CERAMIC-ULTRA.png"], categoryId: ceramicUltra.id } }),
    prisma.product.create({ data: { name: "Ceramic Heavy", slug: "ceramic-heavy-kb", description: "Pastillas ceramicadas de servicio pesado. Soporta altas temperaturas y cargas pesadas.", sku: "KB-CH-001", stock: 100, featured: true, images: ["/assets/images/productos/1.3 - CERAMIC-HEAVY.png"], categoryId: ceramicHeavy.id } }),
    prisma.product.create({ data: { name: "Metal Power", slug: "metal-power-kb", description: "Pastillas semimetálicas con máxima potencia de frenado y respuesta inmediata.", sku: "KB-MP-001", stock: 100, featured: true, images: ["/assets/images/productos/1.2 - METAL-POWER.png"], categoryId: metalPower.id } }),
    // Zapatas (directo al padre)
    prisma.product.create({ data: { name: "Zapatas King Brake", slug: "zapatas-king-brake", description: "Zapatas King Brake con materiales de fricción de alta calidad. Larga vida útil y frenado consistente.", sku: "KB-ZP-100", stock: 100, featured: true, images: ["/assets/images/productos/2.1-ZAPATAS.png"], categoryId: zapatas.id } }),
    // Discos y tambores (asignados a subcategorías)
    prisma.product.create({ data: { name: "Discos King Brake", slug: "discos-king-brake", description: "Discos de freno en fundición gris de alta resistencia. Disipación de calor óptima.", sku: "KB-DI-001", stock: 100, featured: true, images: ["/assets/images/productos/3.1-DISCOS.png"], categoryId: discos.id } }),
    prisma.product.create({ data: { name: "Tambores King Brake", slug: "tambores-king-brake", description: "Tambores de freno de fundición balanceada. Frenado uniforme y sin vibraciones.", sku: "KB-TA-001", stock: 100, featured: true, images: ["/assets/images/productos/3.2-TAMBORES.png"], categoryId: tambores.id } }),
    // Sistema hidráulico (asignados a subcategorías)
    prisma.product.create({ data: { name: "Master King Brake", slug: "master-king-brake", description: "Cilindro maestro King Brake. Precisión de sellado para frenado seguro y progresivo.", sku: "KB-MA-001", stock: 100, featured: true, images: ["/assets/images/productos/4.1-MASTER.png"], categoryId: master.id } }),
    prisma.product.create({ data: { name: "Servo King Brake", slug: "servo-king-brake", description: "Servofreno King Brake que amplifica la fuerza de frenado mediante vacío del motor.", sku: "KB-SV-001", stock: 100, featured: true, images: ["/assets/images/productos/4-SISTEMA-HIDRAULICO.png"], categoryId: servo.id } }),
    prisma.product.create({ data: { name: "Bomba de Freno King Brake", slug: "bomba-de-freno-king-brake", description: "Bomba de freno con sellos de alta durabilidad. Distribución equilibrada y sin fugas.", sku: "KB-BF-001", stock: 100, featured: true, images: ["/assets/images/productos/4.3-BOMBA-DE-FRENO-Y-EMBRAGUE.png"], categoryId: bombaFreno.id } }),
    prisma.product.create({ data: { name: "Bomba de Embrague King Brake", slug: "bomba-de-embrague-king-brake", description: "Bomba de embrague con operación suave y precisa. Materiales anticorrosivos.", sku: "KB-BE-001", stock: 100, featured: true, images: ["/assets/images/productos/4.3-BOMBA-DE-FRENO-Y-EMBRAGUE.png"], categoryId: bombaEmbrague.id } }),
    prisma.product.create({ data: { name: "Bombín de Rueda King Brake", slug: "bombin-de-rueda-king-brake", description: "Bombín de rueda con pistones de precisión. Sellado hermético.", sku: "KB-BR-001", stock: 100, featured: true, images: ["/assets/images/productos/4.2-BOMBIN-DE-FRENO-EMBRAGUE.png"], categoryId: bombinRueda.id } }),
    prisma.product.create({ data: { name: "Bombín auxiliar de Embrague King Brake", slug: "bombin-auxiliar-embrague-king-brake", description: "Cilindro receptor de embrague. Cambio de marcha suave y preciso.", sku: "KB-BA-001", stock: 100, featured: true, images: ["/assets/images/productos/4.2-BOMBIN-DE-FRENO-EMBRAGUE.png"], categoryId: bombinAuxEmbrague.id } }),
    prisma.product.create({ data: { name: "Kit de reparación de Embrague King Brake", slug: "kit-reparacion-embrague-king-brake", description: "Kit completo con retenes, resortes y pistones para restaurar el sistema de embrague.", sku: "KB-KR-001", stock: 100, featured: true, images: ["/assets/images/productos/4.4-KIT-DE-REPARACION-DE-EMBRAGUE.png"], categoryId: kitReparacion.id } }),
    // Lubricantes (asignados a subcategorías)
    prisma.product.create({ data: { name: "Limpiador de frenos King Brake", slug: "limpiador-de-frenos-king-brake", description: "Elimina grasa, aceite y residuos. Evaporación rápida sin residuos.", sku: "KB-LI-001", stock: 100, featured: true, images: ["/assets/images/productos/5.1-LIMPIADOR-DE-FRENOS.png"], categoryId: limpiador.id } }),
    prisma.product.create({ data: { name: "Líquido para frenos King Brake", slug: "liquido-para-frenos-king-brake", description: "Líquido DOT 3 y DOT 4 con alto punto de ebullición y aditivos anticorrosivos.", sku: "KB-LQ-001", stock: 100, featured: true, images: ["/assets/images/productos/5.2-LIQUIDOOS-DE-FRENOS-DOT-3.png"], categoryId: liquidoFreno.id } }),
    prisma.product.create({ data: { name: "Grasas para frenos King Brake", slug: "grasas-para-frenos-king-brake", description: "Grasa especial resistente a altas temperaturas. Previene ruidos y desgaste.", sku: "KB-GR-001", stock: 100, featured: true, images: ["/assets/images/productos/5.5-GRASAS-PARA-FRENOS-CERAMIC-EXTREME.png"], categoryId: grasas.id } }),
  ]);

  // ── Marcas de vehículos ──
  const brandsData = [
    { name: "Toyota", slug: "toyota", models: ["Yaris", "Corolla", "Hilux", "RAV4"] },
    { name: "Hyundai", slug: "hyundai", models: ["Accent", "Tucson", "i10"] },
    { name: "Kia", slug: "kia", models: ["Rio", "Sportage", "Picanto"] },
    { name: "Nissan", slug: "nissan", models: ["Sentra", "X-Trail", "Frontier"] },
    { name: "Chevrolet", slug: "chevrolet", models: ["Sail", "Spark", "Tracker"] },
    { name: "Suzuki", slug: "suzuki", models: ["Swift", "Vitara"] },
    { name: "Mitsubishi", slug: "mitsubishi", models: ["L200", "ASX", "Outlander"] },
    { name: "Honda", slug: "honda", models: ["Civic", "CR-V", "HR-V"] },
    { name: "Mazda", slug: "mazda", models: ["Mazda 3", "CX-5"] },
    { name: "Volkswagen", slug: "volkswagen", models: ["Gol", "T-Cross", "Tiguan"] },
  ];

  const suvModelNames = new Set([
    "Hilux", "RAV4", "Tucson", "Sportage", "X-Trail", "Frontier",
    "Tracker", "Vitara", "L200", "ASX", "Outlander", "CR-V", "HR-V",
    "CX-5", "T-Cross", "Tiguan",
  ]);

  const allGenRecords: { id: string; modelId: string; modelName: string }[] = [];

  for (const brandData of brandsData) {
    const brand = await prisma.vehicleBrand.create({
      data: { name: brandData.name, slug: brandData.slug },
    });
    for (const modelName of brandData.models) {
      const model = await prisma.vehicleModel.create({
        data: { name: modelName, brandId: brand.id },
      });
      const gen = await prisma.vehicleGeneration.create({
        data: { name: "Primera generación", modelId: model.id },
      });
      allGenRecords.push({ id: gen.id, modelId: model.id, modelName });
    }
  }

  const sedanGens = allGenRecords.filter((g) => !suvModelNames.has(g.modelName));
  const suvGens = allGenRecords.filter((g) => suvModelNames.has(g.modelName));

  // Pastillas/Zapatas/Discos/Tambores: compatibilidad a nivel generación
  // Sistema hidráulico: compatibilidad a nivel modelo (sin generación)
  // Lubricantes: sin compatibilidad
  const genCompatProducts = products.slice(0, 6); // pastillas + zapatas + discos/tambores
  const modelCompatProducts = products.slice(6, 13); // sistema hidráulico
  // products[13..15] = lubricantes → sin compatibilidad

  const compatMapGen: Record<number, typeof allGenRecords> = {
    0: allGenRecords, 1: sedanGens, 2: suvGens,
    3: allGenRecords, 4: sedanGens, 5: suvGens,
  };

  for (let i = 0; i < genCompatProducts.length; i++) {
    const gens = compatMapGen[i] ?? [];
    if (gens.length > 0) {
      await prisma.productCompatibility.createMany({
        data: gens.map((g) => ({
          productId: genCompatProducts[i].id,
          vehicleGenerationId: g.id,
        })),
      });
    }
  }

  // Sistema hidráulico: compatibilidad a nivel modelo
  for (const product of modelCompatProducts) {
    const models = allGenRecords.map((g) => g.modelId);
    const uniqueModels = [...new Set(models)];
    await prisma.productCompatibility.createMany({
      data: uniqueModels.map((modelId) => ({
        productId: product.id,
        vehicleModelId: modelId,
      })),
    });
  }

  // ── Distribuidores ──
  await prisma.distributor.deleteMany();
  await prisma.distributor.createMany({
    data: [
      { name: "King Brake Central", address: "Av. Iquitos 1234, La Victoria, Lima", lat: -12.0650, lng: -77.0200, phone: "+51999888777" },
      { name: "Autopartes San Juan", address: "Av. Los Héroes 567, San Juan de Miraflores, Lima", lat: -12.1560, lng: -76.9720, phone: "+51999777666" },
      { name: "Frenos Express Comas", address: "Av. Tupac Amaru 3456, Comas, Lima", lat: -11.9460, lng: -77.0490, phone: "+51999666555" },
      { name: "Repuestos El Pacifico", address: "Av. Colonial 890, Callao", lat: -12.0560, lng: -77.1020, phone: "+51999555444" },
      { name: "Auto Frenos Lima Norte", address: "Av. Universitaria 4567, Los Olivos, Lima", lat: -11.9820, lng: -77.0710, phone: "+51999444333" },
      { name: "Frenos del Sur Arequipa", address: "Av. Ejército 456, Cayma, Arequipa", lat: -16.3989, lng: -71.5350, phone: "+51954111222" },
      { name: "Autopartes Arequipa Centro", address: "Calle Mercaderes 312, Cercado, Arequipa", lat: -16.4090, lng: -71.5375, phone: "+51954222333" },
      { name: "King Brake Trujillo", address: "Av. España 1520, Trujillo, La Libertad", lat: -8.1116, lng: -79.0288, phone: "+51944111222" },
      { name: "Frenos Chiclayo", address: "Av. Balta 890, Chiclayo, Lambayeque", lat: -6.7714, lng: -79.8409, phone: "+51974111222" },
      { name: "Autofrenos Cusco", address: "Av. de la Cultura 1200, Cusco", lat: -13.5250, lng: -71.9672, phone: "+51984111222" },
      { name: "Repuestos Piura Norte", address: "Av. Grau 650, Piura", lat: -5.1945, lng: -80.6328, phone: "+51964111222" },
      { name: "Frenos Huancayo", address: "Calle Real 1450, Huancayo, Junín", lat: -12.0651, lng: -75.2049, phone: "+51934111222" },
      { name: "King Brake Ica", address: "Av. San Martín 380, Ica", lat: -14.0755, lng: -75.7342, phone: "+51924111222" },
      { name: "Autopartes Tacna", address: "Av. Bolognesi 520, Tacna", lat: -18.0146, lng: -70.2536, phone: "+51952111222" },
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
