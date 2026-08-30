export const LINEAS_PRODUCTO = [
  {
    nombre: "Pastillas de freno",
    slug: "pastillas-de-freno",
    imagen: "/assets/images/linea-productos/pastilla-freno.webp",
    categorias: [
      { nombre: "Pastillas Ceramicadas", slug: "pastillas-ceramicadas" },
      { nombre: "Pastillas Semimetálicas", slug: "pastillas-semimetalicas" },
    ],
  },
  {
    nombre: "Zapatas",
    slug: "zapatas",
    imagen: "/assets/images/linea-productos/zapatas.png",
    categorias: [
      { nombre: "Zapatas", slug: "zapatas" },
    ],
  },
  {
    nombre: "Discos y tambores",
    slug: "discos-y-tambores",
    imagen: "/assets/images/linea-productos/disco-tambores.png",
    categorias: [
      { nombre: "Discos de Freno", slug: "discos-de-freno" },
      { nombre: "Tambores", slug: "tambores" },
    ],
  },
  {
    nombre: "Sistema hidráulico",
    slug: "sistema-hidraulico",
    imagen: "/assets/images/linea-productos/sistema-hidraulico.png",
    categorias: [
      { nombre: "Componentes Hidráulicos", slug: "componentes-hidraulicos" },
    ],
  },
  {
    nombre: "Lubricantes",
    slug: "lubricantes",
    imagen: "/assets/images/linea-productos/lubricantes.png",
    categorias: [
      { nombre: "Líquido de Frenos", slug: "liquido-de-frenos" },
    ],
  },
] as const;

export type LineaProducto = (typeof LINEAS_PRODUCTO)[number];
