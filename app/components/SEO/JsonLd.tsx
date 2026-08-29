const BASE_URL = "https://kingbrake.com";

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: "King Brake Peru",
    description:
      "Componentes de frenado automotriz: pastillas ceramicadas, semimetálicas, zapatas, discos y tambores para las marcas más populares en Perú.",
    url: BASE_URL,
    logo: `${BASE_URL}/assets/images/logo-principal.webp`,
    telephone: "+51999888777",
    email: "contacto@kingbrake.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lima",
      addressRegion: "Lima",
      postalCode: "15000",
      addressCountry: "PE",
    },
    areaServed: { "@type": "City", name: "Lima" },
    priceRange: "S/45 - S/250",
    currenciesAccepted: "PEN",
    sameAs: [
      "https://www.instagram.com/kingbrakeperu",
      "https://www.facebook.com/KingBrakePeru",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "King Brake Peru",
    url: BASE_URL,
    description:
      "Pastillas de freno, discos, zapatas y tambores. Calidad garantizada para tu vehículo.",
    publisher: {
      "@type": "Organization",
      name: "King Brake Peru",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/assets/images/logo-principal.webp` },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/productos?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQItem { question: string; answer: string }

export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BlogPostSchemaProps {
  title: string;
  description: string;
  slug: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  modifiedAt?: string;
}

export function BlogPostSchema(props: BlogPostSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: props.title,
    description: props.description,
    image: props.coverImage,
    url: `${BASE_URL}/blog/${props.slug}`,
    datePublished: props.publishedAt,
    dateModified: props.modifiedAt || props.publishedAt,
    author: { "@type": "Person", name: props.author },
    publisher: {
      "@type": "Organization",
      name: "King Brake Peru",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/assets/images/logo-principal.webp` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${props.slug}` },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem { name: string; url: string }

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
