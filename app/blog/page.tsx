import { Suspense } from "react";
import { Metadata } from "next";
import { db } from "@/lib/db";
import BlogList from "./BlogList";

// ISR: Regenerar cada 5 minutos - reduce Function Invocations ~90%
// El blog no necesita datos en tiempo real
export const revalidate = 300; // 5 minutos

// Metadata para SEO del blog
export const metadata: Metadata = {
  title: "Blog - Consejos sobre Frenos y Mantenimiento Automotriz",
  description:
    "Tips de mantenimiento, guías de compra y todo lo que necesitas saber sobre componentes de frenado para tu vehículo.",
  keywords: [
    "pastillas de freno",
    "mantenimiento frenos",
    "cambiar pastillas de freno",
    "frenos automotrices",
    "componentes de frenado",
  ],
  openGraph: {
    title: "Blog King Brake - Guías y Consejos de Frenado",
    description:
      "Tips de expertos sobre mantenimiento de frenos, guías de compra y todo lo que necesitas saber sobre componentes de frenado.",
    type: "website",
    url: "https://kingbrake.com/blog",
  },
  alternates: {
    canonical: "/blog",
  },
};

interface SearchParams {
  search?: string;
  page?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

async function getCategories() {
  return db.blogCategory.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { posts: { where: { published: true } } },
      },
    },
  });
}

async function getPosts(search?: string, page: number = 1) {
  const limit = 9;
  const skip = (page - 1) * limit;

  const where = {
    published: true,
    ...(search && {
      OR: [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ],
    }),
  };

  const [posts, total] = await Promise.all([
    db.blogPost.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.blogPost.count({ where }),
  ]);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1");

  const [categories, { posts, pagination }] = await Promise.all([
    getCategories(),
    getPosts(search, page),
  ]);

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <BlogList
        posts={posts}
        categories={categories}
        pagination={pagination}
        search={search}
      />
    </Suspense>
  );
}
