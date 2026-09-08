export interface SubCategoria {
  nombre: string;
  slug: string;
  imagen: string;
  descripcion: string;
  subtitulo: string;
  badge: string;
  tip: string;
  presentaciones: string[];
}

export interface LineaProducto {
  nombre: string;
  slug: string;
  imagen: string;
  categoriaLabel: string;
  descripcion: string;
  subtitulo: string;
  badge: string;
  tip: string;
  presentaciones: string[];
  categorias: SubCategoria[];
}

export const LINEAS_PRODUCTO: LineaProducto[] = [
  {
    nombre: "Pastillas de freno",
    slug: "pastillas-de-freno",
    imagen: "/assets/images/linea-productos/pastilla-freno.webp",
    categoriaLabel: "Sistema de frenado",
    descripcion:
      "Nuestras pastillas de freno King Brake están diseñadas con compuestos de alta tecnología que garantizan una **frenada segura y silenciosa**. Disponibles en formulaciones **ceramicadas** y **semimetálicas**, adaptadas a las condiciones de manejo en Perú.",
    subtitulo: "EFICIENCIA DE FRENADO",
    badge: "Compatible con más de 200 modelos de vehículos en el mercado peruano",
    tip: "** Revisa tus pastillas de freno cada 20,000 km o cuando escuches ruidos al frenar.",
    presentaciones: ["Juego x4 delanteras", "Juego x4 posteriores"],
    categorias: [
      {
        nombre: "Ceramic Ultra",
        slug: "ceramic-ultra",
        imagen: "/assets/images/linea-productos/pastilla-freno.webp",
        descripcion: "Pastillas ceramicadas de **alto rendimiento** con tecnología de última generación. Diseñadas para frenado **silencioso**, baja emisión de polvo y máxima durabilidad en condiciones urbanas y de carretera.",
        subtitulo: "FRENADO SILENCIOSO",
        badge: "Formulación cerámica premium para vehículos livianos",
        tip: "** Ideales para uso urbano y carretera. Revisar cada 20,000 km.",
        presentaciones: ["Juego x4 delanteras", "Juego x4 posteriores"],
      },
      {
        nombre: "Ceramic Heavy",
        slug: "ceramic-heavy",
        imagen: "/assets/images/linea-productos/pastilla-freno.webp",
        descripcion: "Pastillas ceramicadas de **servicio pesado** para vehículos que exigen mayor capacidad de frenado. Compuesto reforzado que soporta **altas temperaturas** y cargas pesadas sin perder eficiencia.",
        subtitulo: "RESISTENCIA EXTREMA",
        badge: "Para SUVs, camionetas y vehículos de carga liviana",
        tip: "** Recomendadas para vehículos de carga o uso intensivo.",
        presentaciones: ["Juego x4 delanteras", "Juego x4 posteriores"],
      },
      {
        nombre: "Metal Power",
        slug: "metal-power",
        imagen: "/assets/images/linea-productos/pastilla-freno.webp",
        descripcion: "Pastillas semimetálicas con **máxima potencia de frenado**. Compuesto de alto coeficiente de fricción que garantiza una respuesta **inmediata** en cualquier condición de manejo.",
        subtitulo: "POTENCIA MÁXIMA",
        badge: "Alto coeficiente de fricción para frenado potente",
        tip: "** Ideales para conductores que buscan respuesta de frenado agresiva.",
        presentaciones: ["Juego x4 delanteras", "Juego x4 posteriores"],
      },
    ],
  },
  {
    nombre: "Zapatas",
    slug: "zapatas",
    imagen: "/assets/images/linea-productos/zapatas.png",
    categoriaLabel: "Sistema de frenado",
    descripcion:
      "Las zapatas King Brake ofrecen un **rendimiento confiable** en sistemas de freno de tambor. Fabricadas con materiales de fricción de alta calidad que aseguran una **larga vida útil** y frenado consistente.",
    subtitulo: "DURABILIDAD GARANTIZADA",
    badge: "Ideales para vehículos con sistema de freno de tambor posterior",
    tip: "** Inspecciona las zapatas cada 30,000 km para mantener un frenado óptimo.",
    presentaciones: ["Juego x4"],
    categorias: [],
  },
  {
    nombre: "Discos y tambores",
    slug: "discos-y-tambores",
    imagen: "/assets/images/linea-productos/disco-tambores.png",
    categoriaLabel: "Sistema de frenado",
    descripcion:
      "Discos ventilados y tambores King Brake fabricados en **fundición de alta resistencia**. Diseñados para soportar altas temperaturas y ofrecer una **disipación de calor superior**, reduciendo el riesgo de fatiga de frenado.",
    subtitulo: "RESISTENCIA TÉRMICA",
    badge: "Fabricados bajo estándares internacionales de calidad",
    tip: "** Reemplaza los discos cuando presenten un desgaste mayor a 2mm o rayaduras profundas.",
    presentaciones: ["Disco ventilado", "Disco sólido", "Tambor"],
    categorias: [
      {
        nombre: "Discos",
        slug: "discos",
        imagen: "/assets/images/linea-productos/disco-tambores.png",
        descripcion: "Discos de freno King Brake fabricados en **fundición gris de alta resistencia**. Diseño ventilado que permite una **disipación de calor óptima**, reduciendo la fatiga térmica y manteniendo un frenado estable.",
        subtitulo: "DISIPACIÓN DE CALOR",
        badge: "Disponibles en ventilado y sólido",
        tip: "** Reemplaza cuando el grosor sea menor al mínimo indicado por el fabricante.",
        presentaciones: ["Disco ventilado", "Disco sólido"],
      },
      {
        nombre: "Tambores",
        slug: "tambores",
        imagen: "/assets/images/linea-productos/disco-tambores.png",
        descripcion: "Tambores de freno King Brake de **fundición balanceada** para un frenado uniforme y sin vibraciones. Compatibles con los principales modelos del mercado peruano.",
        subtitulo: "FRENADO UNIFORME",
        badge: "Fundición balanceada de alta calidad",
        tip: "** Inspecciona el diámetro interior del tambor cada 30,000 km.",
        presentaciones: ["Tambor"],
      },
    ],
  },
  {
    nombre: "Sistema hidráulico",
    slug: "sistema-hidraulico",
    imagen: "/assets/images/linea-productos/sistema-hidraulico.png",
    categoriaLabel: "Componentes hidráulicos",
    descripcion:
      "Componentes del sistema hidráulico de frenos King Brake: **cilindros maestros, cilindros de rueda y kits de reparación**. Cada pieza es sometida a pruebas de presión para garantizar un funcionamiento **libre de fugas**.",
    subtitulo: "PRECISIÓN HIDRÁULICA",
    badge: "Pruebas de presión en cada unidad antes de salir de fábrica",
    tip: "** Revisa el nivel de líquido de frenos y el estado de los cilindros cada 15,000 km.",
    presentaciones: ["Cilindro maestro", "Cilindro de rueda", "Kit de reparación"],
    categorias: [
      {
        nombre: "Master",
        slug: "master",
        imagen: "/assets/images/linea-productos/sistema-hidraulico.png",
        descripcion: "Cilindro maestro de freno King Brake con **precisión de sellado** y materiales resistentes a la corrosión. Convierte la fuerza del pedal en presión hidráulica para un frenado **seguro y proporcional**.",
        subtitulo: "CONTROL PRECISO",
        badge: "Probado a alta presión antes de salir de fábrica",
        tip: "** Reemplaza si notas que el pedal de freno se siente esponjoso.",
        presentaciones: ["Unidad"],
      },
      {
        nombre: "Servo",
        slug: "servo",
        imagen: "/assets/images/linea-productos/sistema-hidraulico.png",
        descripcion: "Servofreno King Brake que **amplifica la fuerza de frenado** mediante vacío del motor. Reduce el esfuerzo necesario en el pedal para una conducción más cómoda y segura.",
        subtitulo: "ASISTENCIA DE FRENADO",
        badge: "Mayor confort y seguridad al frenar",
        tip: "** Si el pedal se endurece con el motor encendido, revisa el servo.",
        presentaciones: ["Unidad"],
      },
      {
        nombre: "Bomba de Freno",
        slug: "bomba-de-freno",
        imagen: "/assets/images/linea-productos/sistema-hidraulico.png",
        descripcion: "Bomba de freno King Brake con **sellos de alta durabilidad** y cuerpo resistente a la presión. Distribuye el líquido de frenos hacia las ruedas de forma **equilibrada y sin fugas**.",
        subtitulo: "DISTRIBUCIÓN EQUILIBRADA",
        badge: "Sellado hermético garantizado",
        tip: "** Inspecciona periódicamente en busca de fugas de líquido.",
        presentaciones: ["Unidad"],
      },
      {
        nombre: "Bomba de Embrague",
        slug: "bomba-de-embrague",
        imagen: "/assets/images/linea-productos/sistema-hidraulico.png",
        descripcion: "Bomba de embrague King Brake diseñada para una **operación suave y precisa** del sistema de embrague hidráulico. Materiales anticorrosivos para mayor durabilidad.",
        subtitulo: "EMBRAGUE SUAVE",
        badge: "Compatible con los principales modelos del mercado",
        tip: "** Si el pedal de embrague no regresa correctamente, revisa la bomba.",
        presentaciones: ["Unidad"],
      },
      {
        nombre: "Bombín de Rueda",
        slug: "bombin-de-rueda",
        imagen: "/assets/images/linea-productos/sistema-hidraulico.png",
        descripcion: "Bombín de rueda King Brake con **pistones de precisión** que accionan las zapatas contra el tambor. Sellado hermético para evitar fugas y mantener la presión de frenado.",
        subtitulo: "ACCIÓN DIRECTA",
        badge: "Pistones de precisión con sellado hermético",
        tip: "** Revisa si hay humedad o fugas cerca de los tambores traseros.",
        presentaciones: ["Unidad"],
      },
      {
        nombre: "Bombín auxiliar de Embrague",
        slug: "bombin-auxiliar-de-embrague",
        imagen: "/assets/images/linea-productos/sistema-hidraulico.png",
        descripcion: "Bombín auxiliar (cilindro receptor) de embrague King Brake. Recibe la presión hidráulica y **acciona la horquilla del embrague** con precisión para un cambio de marcha suave.",
        subtitulo: "CAMBIO PRECISO",
        badge: "Para un desembrague suave y sin esfuerzo",
        tip: "** Si notas dificultad al cambiar marchas, revisa el bombín auxiliar.",
        presentaciones: ["Unidad"],
      },
      {
        nombre: "Kit de reparación de Embrague",
        slug: "kit-de-reparacion-de-embrague",
        imagen: "/assets/images/linea-productos/sistema-hidraulico.png",
        descripcion: "Kit completo de reparación King Brake con **retenes, resortes y pistones** para restaurar el funcionamiento del sistema hidráulico de embrague sin reemplazar la unidad completa.",
        subtitulo: "RESTAURACIÓN COMPLETA",
        badge: "Incluye todos los componentes para la reparación",
        tip: "** Opción económica para restaurar el sistema sin cambiar la bomba.",
        presentaciones: ["Kit completo"],
      },
    ],
  },
  {
    nombre: "Líquido para freno",
    slug: "liquido-para-freno",
    imagen: "/assets/images/linea-productos/lubricantes.png",
    categoriaLabel: "Fluidos y lubricantes",
    descripcion:
      "Líquido de frenos King Brake formulado con **aditivos anticorrosivos** que protegen el sistema hidráulico. Cumple con especificaciones **DOT 3 y DOT 4**, garantizando un punto de ebullición alto para un frenado seguro.",
    subtitulo: "PROTECCIÓN DEL SISTEMA",
    badge: "Ideal para todo tipo de vehículos livianos y pesados",
    tip: "** Analiza y cambia el líquido para frenos cada 10,000 km o 01 vez al año.",
    presentaciones: ["118 ml (4 onzas)", "250 ml", "500 ml", "1 litro"],
    categorias: [
      {
        nombre: "Limpiador de frenos",
        slug: "limpiador-de-frenos",
        imagen: "/assets/images/linea-productos/lubricantes.png",
        descripcion: "Limpiador de frenos King Brake que **elimina grasa, aceite y residuos** de las superficies de frenado. Fórmula de evaporación rápida que no deja residuos.",
        subtitulo: "LIMPIEZA PROFUNDA",
        badge: "Evaporación rápida, sin residuos",
        tip: "** Usa antes de instalar pastillas o zapatas nuevas.",
        presentaciones: ["300 ml", "500 ml"],
      },
      {
        nombre: "Líquidos de frenos",
        slug: "liquidos-de-frenos",
        imagen: "/assets/images/linea-productos/lubricantes.png",
        descripcion: "Líquido de frenos King Brake con **alto punto de ebullición** y aditivos anticorrosivos. Cumple especificaciones **DOT 3 y DOT 4** para un frenado seguro en todas las condiciones.",
        subtitulo: "PROTECCIÓN HIDRÁULICA",
        badge: "Especificaciones DOT 3 y DOT 4",
        tip: "** Cambia el líquido de frenos cada 10,000 km o 1 vez al año.",
        presentaciones: ["118 ml (4 onzas)", "250 ml", "500 ml", "1 litro"],
      },
      {
        nombre: "Grasas para frenos",
        slug: "grasas-para-frenos",
        imagen: "/assets/images/linea-productos/lubricantes.png",
        descripcion: "Grasa especial King Brake para **lubricación de componentes de freno**. Resistente a altas temperaturas, previene ruidos y desgaste prematuro de guías y pines.",
        subtitulo: "LUBRICACIÓN TÉRMICA",
        badge: "Resistente a temperaturas extremas",
        tip: "** Aplica en guías y pines cada vez que cambies pastillas.",
        presentaciones: ["50 g", "100 g"],
      },
    ],
  },
];
