const PHONE = "+51 908 920 221";
const EMAIL = "atencionalcliente@kingbrake.com";
const WA_LINK = `https://api.whatsapp.com/send?phone=51908920221`;

interface KeywordRule {
  keywords: string[];
  response: string;
  priority?: number;
}

const RULES: KeywordRule[] = [
  // ── Saludos ──
  { keywords: ["hola", "buenas", "buenos dias", "buenas tardes", "buenas noches", "hey", "hi", "hello", "que tal", "saludos", "ola"], response: "¡Hola! Soy Kira, asesora virtual de King Brake 🚗 ¿En qué puedo ayudarte?", priority: 0 },

  // ── Despedidas ──
  { keywords: ["gracias", "grax", "thanks", "muchas gracias", "perfecto gracias", "vale gracias", "ok gracias"], response: "¡Con mucho gusto! Si necesitas algo más, aquí estaré. También puedes escribirnos al WhatsApp " + PHONE + " 😊" },
  { keywords: ["chau", "adios", "bye", "nos vemos", "hasta luego", "ya fue"], response: "¡Hasta pronto! Recuerda que puedes contactarnos al " + PHONE + " o al correo " + EMAIL + ". ¡Seguridad en cada frenada! 🛞" },

  // ── Contacto directo ──
  { keywords: ["telefono", "celular", "numero", "llamar", "contacto", "comunicarme", "contactar", "linea"], response: `📞 Nuestro número es ${PHONE}. También puedes escribirnos por WhatsApp al mismo número o al correo ${EMAIL}.`, priority: 5 },
  { keywords: ["whatsapp", "wsp", "wasap", "wa", "whats", "whatssap"], response: `📱 Escríbenos por WhatsApp: ${PHONE}\n${WA_LINK}`, priority: 5 },
  { keywords: ["correo", "email", "mail", "e-mail", "escribir"], response: `📧 Nuestro correo es: ${EMAIL}\nTambién puedes contactarnos al ${PHONE}.`, priority: 5 },

  // ── Horarios ──
  { keywords: ["horario", "hora", "atienden", "abierto", "cerrado", "horarios de atencion", "que horas", "a que hora"], response: `Nuestro horario de atención es de lunes a viernes de 8:00 am a 6:00 pm y sábados de 8:00 am a 1:00 pm. Para consultas fuera de horario, escríbenos al WhatsApp ${PHONE}.` },

  // ── Ubicación / Tienda ──
  { keywords: ["donde estan", "ubicacion", "direccion", "tienda", "local", "donde queda", "como llego", "mapa", "donde los encuentro", "ubicados"], response: "📍 Puedes ver todos nuestros puntos de venta en la sección de distribuidores de nuestra web. También escríbenos al WhatsApp " + PHONE + " con tu zona y te indicamos el más cercano." },
  { keywords: ["distribuidor", "punto de venta", "sucursal", "distribuidores", "puntos de venta", "red de distribuidores"], response: "Tenemos más de 50 puntos de venta a nivel nacional. Visita nuestra sección de Red de Distribuidores en /nosotros o escríbenos al " + PHONE + " para ubicar el más cercano." },

  // ── Productos generales ──
  { keywords: ["productos", "que venden", "que tienen", "catalogo", "que ofrecen", "linea de productos", "que manejan"], response: "Nuestra línea incluye:\n• Pastillas ceramicadas\n• Pastillas semimetálicas\n• Zapatas de freno\n• Discos de freno\n• Tambores\n• Componentes del sistema hidráulico\n\nTodos con garantía King Brake. Visita /productos para ver el catálogo completo." },

  // ── Pastillas ceramicadas ──
  { keywords: ["pastilla ceramicada", "pastillas ceramicadas", "ceramicada", "ceramicadas", "ceramica", "pastilla ceramica"], response: "Nuestras pastillas ceramicadas ofrecen frenado suave, bajo ruido y menor desgaste del disco. Son ideales para uso urbano y vehículos modernos. Encuéntralas en /productos?categoria=pastillas-ceramicadas", priority: 3 },

  // ── Pastillas semimetálicas ──
  { keywords: ["pastilla semimetalica", "pastillas semimetalicas", "semimetalica", "semimetalicas", "semi metalica", "semi metalicas"], response: "Las pastillas semimetálicas son más resistentes al calor y duran más bajo uso exigente. Ideales para camionetas, carga pesada y conducción en ruta. Encuéntralas en /productos?categoria=pastillas-semimetalicas", priority: 3 },

  // ── Pastillas general ──
  { keywords: ["pastilla", "pastillas", "pastillas de freno", "pastilla de freno", "pad", "pads", "brake pad"], response: "Manejamos pastillas ceramicadas (uso urbano, bajo ruido) y semimetálicas (mayor resistencia al calor). ¿Cuál te interesa? También puedes decirnos tu vehículo para recomendarte la ideal." },

  // ── Diferencia entre pastillas ──
  { keywords: ["diferencia", "cual es mejor", "que me conviene", "ceramicada o semimetalica", "cual me recomiendas", "comparar pastillas", "que pastilla uso"], response: "📌 Ceramicadas: frenado suave, bajo ruido, menos polvo. Ideal para ciudad.\n📌 Semimetálicas: mayor resistencia al calor, más agarre. Ideal para camionetas y uso exigente.\n\nSi me dices tu vehículo y uso, te recomiendo la mejor opción.", priority: 4 },

  // ── Discos ──
  { keywords: ["disco", "discos", "discos de freno", "disco de freno", "disco ventilado", "rotor", "rotores"], response: "Contamos con discos de freno ventilados y sólidos con especificaciones OEM. Encuéntralos en /productos?categoria=discos-de-freno" },

  // ── Tambores ──
  { keywords: ["tambor", "tambores", "tambor de freno", "tambores de freno", "drum"], response: "Nuestros tambores de freno son de alta calidad y compatibles con los modelos más populares del mercado. Encuéntralos en /productos?categoria=tambores" },

  // ── Zapatas ──
  { keywords: ["zapata", "zapatas", "zapatas de freno", "zapata de freno", "shoe", "shoes", "brake shoe"], response: "Nuestras zapatas de freno son ideales para freno de tambor posterior. Compatibles con los modelos más populares en Perú. Mira el catálogo en /productos?categoria=zapatas" },

  // ── Sistema hidráulico ──
  { keywords: ["hidraulico", "liquido de freno", "cilindro", "bombín", "bomba de freno", "caliper", "calipers", "manguera de freno", "componente hidraulico"], response: "Manejamos componentes del sistema hidráulico de frenos. Para verificar disponibilidad del repuesto que necesitas, escríbenos al WhatsApp " + PHONE + " con los datos de tu vehículo." },

  // ── Compatibilidad general ──
  { keywords: ["compatible", "compatibilidad", "le sirve", "le queda", "para mi carro", "para mi auto", "para mi vehiculo", "encaja", "sirve para"], response: "Nuestros productos son compatibles con más de 200 modelos. Dime la marca, modelo y año de tu vehículo y te confirmo. También puedes buscar en /productos usando el filtro por vehículo." },

  // ── Marcas de vehículos ──
  { keywords: ["toyota", "yaris", "corolla", "hilux", "rav4", "fortuner", "land cruiser", "camry"], response: "Tenemos repuestos para Toyota: Yaris, Corolla, Hilux, RAV4, Fortuner y más. Busca tu modelo en /productos?marca=toyota o escríbenos al " + PHONE + " con tu modelo y año.", priority: 2 },
  { keywords: ["hyundai", "accent", "tucson", "santa fe", "elantra", "i10", "creta", "venue"], response: "Cubrimos modelos Hyundai: Accent, Tucson, Santa Fe, Elantra, i10 y más. Busca en /productos?marca=hyundai o escríbenos al " + PHONE + ".", priority: 2 },
  { keywords: ["kia", "sportage", "rio", "sorento", "cerato", "picanto", "seltos", "carnival"], response: "Tenemos repuestos para Kia: Sportage, Rio, Sorento, Cerato, Picanto y más. Busca en /productos?marca=kia o consúltanos al " + PHONE + ".", priority: 2 },
  { keywords: ["nissan", "sentra", "versa", "frontier", "np300", "kicks", "qashqai", "navara", "pathfinder"], response: "Cubrimos modelos Nissan: Sentra, Versa, Frontier, NP300, Kicks y más. Busca en /productos?marca=nissan o escríbenos al " + PHONE + ".", priority: 2 },
  { keywords: ["chevrolet", "spark", "sail", "cruze", "tracker", "onix", "aveo", "captiva", "dmax"], response: "Tenemos repuestos para Chevrolet: Spark, Sail, Cruze, Tracker, Onix y más. Busca en /productos?marca=chevrolet o al " + PHONE + ".", priority: 2 },
  { keywords: ["suzuki", "swift", "vitara", "jimny", "celerio", "alto", "s-cross", "ertiga"], response: "Cubrimos modelos Suzuki: Swift, Vitara, Jimny, Celerio y más. Busca en /productos?marca=suzuki o consúltanos al " + PHONE + ".", priority: 2 },
  { keywords: ["mitsubishi", "l200", "outlander", "montero", "lancer", "mirage", "asx"], response: "Tenemos repuestos Mitsubishi: L200, Outlander, Montero, Lancer y más. Busca en /productos?marca=mitsubishi o al " + PHONE + ".", priority: 2 },
  { keywords: ["honda", "civic", "crv", "cr-v", "city", "fit", "hrv", "hr-v", "accord", "pilot"], response: "Cubrimos modelos Honda: Civic, CR-V, City, HR-V y más. Busca en /productos?marca=honda o al " + PHONE + ".", priority: 2 },
  { keywords: ["mazda", "mazda 2", "mazda 3", "mazda 6", "cx-3", "cx-5", "cx-30", "cx3", "cx5", "cx30", "bt-50"], response: "Tenemos repuestos Mazda: Mazda 2, 3, 6, CX-3, CX-5, CX-30 y más. Busca en /productos?marca=mazda o al " + PHONE + ".", priority: 2 },
  { keywords: ["volkswagen", "vw", "gol", "polo", "jetta", "tiguan", "t-cross", "amarok", "golf"], response: "Cubrimos modelos Volkswagen: Gol, Polo, Jetta, Tiguan, T-Cross y más. Busca en /productos?marca=volkswagen o al " + PHONE + ".", priority: 2 },
  { keywords: ["chery", "tiggo", "qq", "arrizo"], response: "Tenemos repuestos para algunos modelos Chery. Consúltanos disponibilidad al " + PHONE + " con tu modelo y año.", priority: 2 },
  { keywords: ["jac", "refine", "s2", "s3", "s4", "t8"], response: "Cubrimos algunos modelos JAC. Escríbenos al " + PHONE + " con tu modelo y año para confirmar disponibilidad.", priority: 2 },
  { keywords: ["subaru", "impreza", "forester", "xv", "outback"], response: "Tenemos repuestos para algunos modelos Subaru. Consúltanos al " + PHONE + " con tu modelo y año.", priority: 2 },

  // ── Precios ──
  { keywords: ["precio", "precios", "cuanto cuesta", "cuanto vale", "cuanto sale", "costo", "costos", "cotizar", "cotizacion", "presupuesto", "tarifas", "cuanto esta"], response: `Los precios varían según el producto y modelo de vehículo. Para una cotización exacta escríbenos al WhatsApp ${PHONE} o al correo ${EMAIL} con los datos de tu vehículo. También puedes ver precios referenciales en /productos.`, priority: 4 },

  // ── Stock / Disponibilidad ──
  { keywords: ["stock", "disponible", "disponibilidad", "tienen en stock", "hay", "queda", "cuando llega", "agotado"], response: `Para verificar stock en tiempo real, escríbenos al WhatsApp ${PHONE} con el producto y modelo de tu vehículo. Nuestro equipo te confirma al instante.` },

  // ── Envíos ──
  { keywords: ["envio", "envios", "delivery", "despacho", "envian", "hacen envios", "envio a provincia", "provincia", "envian a provincia", "como me llega", "llega a", "mandan a"], response: `Sí realizamos envíos a todo el Perú. Para conocer costos y tiempos de envío a tu zona, contáctanos al ${PHONE} o al correo ${EMAIL}.` },

  // ── Garantía ──
  { keywords: ["garantia", "warranty", "tiene garantia", "cuanto dura la garantia", "garantizado", "respaldo"], response: "Todos nuestros productos cuentan con garantía King Brake respaldada por más de 15 años de experiencia. La garantía cubre defectos de fabricación. Para hacer válida la garantía, presenta tu boleta de compra en el punto de venta." },
  { keywords: ["devolucion", "devoluciones", "devolver", "cambio", "cambiar producto", "politica de cambio", "quiero devolver"], response: `Puedes revisar nuestra política de cambios y devoluciones en /politica-de-cambios-y-devoluciones. Para gestionar un cambio, contáctanos al ${PHONE} con tu comprobante de compra.` },

  // ── Instalación ──
  { keywords: ["instalacion", "instalar", "como se instala", "instalador", "taller", "mecanico", "donde instalo", "poner", "colocar", "montaje"], response: "Recomendamos que la instalación la realice un mecánico profesional. Si necesitas referencia de un taller de confianza cerca a tu zona, escríbenos al " + PHONE + "." },

  // ── Pago ──
  { keywords: ["pago", "forma de pago", "metodo de pago", "efectivo", "tarjeta", "transferencia", "yape", "plin", "como pago", "medios de pago", "aceptan tarjeta"], response: `Aceptamos efectivo, transferencia bancaria, Yape y Plin. Para pagos con tarjeta, consulta directamente en el punto de venta. Más info al ${PHONE}.` },

  // ── Factura / Boleta ──
  { keywords: ["factura", "boleta", "comprobante", "ruc", "facturar", "emiten factura"], response: `Sí, emitimos boleta y factura electrónica. Si necesitas factura, ten listo tu RUC al momento de la compra. Consultas al ${PHONE} o ${EMAIL}.` },

  // ── Cuando cambiar frenos ──
  { keywords: ["cuando cambiar", "cada cuanto", "vida util", "duracion", "cuanto duran", "señales de desgaste", "desgaste", "como saber", "se desgasto", "chirrido", "ruido al frenar", "rechina"], response: "📌 Señales de que debes cambiar tus frenos:\n• Chirrido o rechinado al frenar\n• Vibración en el pedal\n• Mayor distancia de frenado\n• Pedal esponjoso\n• Más de 40,000 km sin cambio\n\nSi notas alguna, revísalos cuanto antes. Lee más en nuestro blog: /blog/cada-cuanto-cambiar-pastillas-de-freno" },

  // ── Seguridad ──
  { keywords: ["seguro", "seguridad", "confiable", "calidad", "certificacion", "certificado", "norma", "calidad de producto", "bueno", "buenos"], response: "King Brake tiene más de 15 años en el mercado peruano. Nuestros productos cumplen estándares de calidad OEM y son probados para garantizar seguridad en cada frenada. Más de 50 puntos de venta y 200+ modelos compatibles nos respaldan." },

  // ── Blog ──
  { keywords: ["blog", "articulo", "articulos", "informacion tecnica", "contenido", "noticias", "leer"], response: "Visita nuestro blog en /blog para artículos sobre mantenimiento de frenos, comparativas de productos y tips de seguridad vehicular." },

  // ── Quiénes somos ──
  { keywords: ["quienes son", "sobre ustedes", "empresa", "king brake", "historia", "acerca de", "nosotros", "mision", "vision"], response: "King Brake es una empresa peruana especializada en componentes de frenado automotriz con más de 15 años en el mercado. Nuestro lema: 'Seguridad en cada frenada'. Conoce más en /nosotros." },

  // ── Redes sociales ──
  { keywords: ["instagram", "facebook", "redes sociales", "redes", "siguenos", "tiktok", "red social"], response: "¡Síguenos en redes!\n📸 Instagram: @kingbrakeperu\n📘 Facebook: /KingBrakePeru\n\nPublicamos contenido educativo, promociones y novedades." },

  // ── Promociones ──
  { keywords: ["promocion", "promociones", "oferta", "ofertas", "descuento", "descuentos", "rebaja", "liquidacion", "combo", "pack"], response: `Para conocer promociones vigentes, síguenos en Instagram @kingbrakeperu o consúltanos al WhatsApp ${PHONE}. También publicamos ofertas especiales en nuestras redes.` },

  // ── Mayoreo / Distribución ──
  { keywords: ["mayoreo", "mayorista", "al por mayor", "distribuir", "ser distribuidor", "revender", "precio por mayor", "negocio", "lote"], response: `Para compras al por mayor o si deseas ser distribuidor King Brake, contáctanos al ${PHONE} o al correo ${EMAIL}. Nuestro equipo comercial te atenderá.`, priority: 3 },

  // ── Newsletter ──
  { keywords: ["newsletter", "suscripcion", "suscribirme", "novedades por correo", "recibir noticias"], response: "Puedes suscribirte a nuestro newsletter en la sección del blog en nuestra web. Recibirás novedades, tips de mantenimiento y ofertas exclusivas." },

  // ── Reclamos ──
  { keywords: ["reclamo", "queja", "mal producto", "defectuoso", "problema con", "no funciona", "fallo", "mal estado", "roto", "dañado", "libro de reclamaciones"], response: `Lamentamos el inconveniente. Para gestionar tu reclamo, contáctanos al ${PHONE} o al correo ${EMAIL} con tu comprobante de compra y descripción del problema. Te responderemos a la brevedad.` },

  // ── Pedidos / Comprar ──
  { keywords: ["comprar", "quiero comprar", "como compro", "hacer pedido", "pedido", "ordenar", "carrito", "agregar al carrito"], response: `Para comprar:\n1. Navega a /productos\n2. Agrega productos al carrito\n3. Haz clic en 'Completar pedido'\n4. Se genera tu cotización por WhatsApp\n\nO escríbenos directo al ${PHONE} con lo que necesitas.` },

  // ── ABS / Sistemas avanzados ──
  { keywords: ["abs", "sistema abs", "antibloqueo", "sensor abs", "sensor de freno"], response: "Para componentes de sistemas ABS y sensores, consúltanos disponibilidad al " + PHONE + " indicando marca, modelo y año de tu vehículo." },

  // ── Líquido de frenos ──
  { keywords: ["liquido", "fluido", "dot 3", "dot 4", "dot3", "dot4", "aceite de freno"], response: "Es fundamental usar el líquido de frenos correcto (DOT 3 o DOT 4 según tu vehículo). Consulta disponibilidad al " + PHONE + "." },

  // ── Freno de mano ──
  { keywords: ["freno de mano", "freno parking", "freno estacionamiento", "handbrake"], response: "Para componentes del freno de estacionamiento (cables, zapatas de freno de mano), consúltanos al " + PHONE + " con los datos de tu vehículo." },

  // ── Emergencia ──
  { keywords: ["urgente", "emergencia", "se me rompio", "no frena", "freno no funciona", "peligro", "ayuda urgente"], response: `⚠️ Si tu vehículo tiene problemas de frenado, NO lo conduzcas. Llévalo a un taller de inmediato. Para asesoría urgente llámanos al ${PHONE}. Tu seguridad es lo primero.`, priority: 10 },
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchKeywords(input: string): string {
  const normalized = normalize(input);
  if (!normalized) return "";

  let bestScore = 0;
  let bestResponse = "";

  for (const rule of RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      const nkw = normalize(kw);
      if (normalized.includes(nkw)) {
        score += nkw.split(" ").length + (rule.priority ?? 1);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestResponse = rule.response;
    }
  }

  if (bestScore === 0) {
    return `No estoy segura de entender tu consulta. Puedes escribirme de otra forma o contactarnos directamente:\n📱 WhatsApp: ${PHONE}\n📧 Correo: ${EMAIL}\n\nTambién puedes elegir una de las opciones rápidas de abajo 👇`;
  }

  return bestResponse;
}
