import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LayoutShell } from "./layout/LayoutShell";
import { Providers } from "./providers";
import {
  LocalBusinessSchema,
  WebSiteSchema,
} from "./components/SEO/JsonLd";
//* REMOVED: getServerSession - bloqueaba el render de toda la página

// ===================== FONTS LOCALES =====================
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// ===================== METADATA PARA SEO =====================
const baseUrl = "https://kingbrake.com";

export const metadata: Metadata = {
  title: {
    default: "King Brake Peru — Seguridad en cada frenada",
    template: "%s | King Brake",
  },
  description:
    "Pastillas de freno, discos, zapatas y tambores para las marcas más populares en Perú. Calidad garantizada, compatibilidad verificada.",
  keywords: [
    "pastillas de freno Lima",
    "repuestos de freno Peru",
    "autopartes de freno",
    "King Brake",
    "pastillas ceramicadas",
    "pastillas semimetalicas",
    "discos de freno",
    "zapatas de freno",
    "tambores de freno",
    "frenos para Toyota",
    "frenos para Hyundai",
    "frenos para Kia",
    "componentes de frenado Lima",
  ],
  authors: [{ name: "King Brake Peru", url: baseUrl }],
  creator: "King Brake Peru",
  publisher: "King Brake Peru",

  metadataBase: new URL(baseUrl),
  alternates: { canonical: "/" },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "King Brake Peru",
    title: "King Brake Peru — Componentes de Frenado Automotriz",
    description:
      "Pastillas, discos, zapatas y tambores de freno. Compatibles con +200 modelos. Envíos a todo Lima.",
    url: baseUrl,
    images: [
      {
        url: `${baseUrl}/assets/images/og-kingbrake.png`,
        width: 1200,
        height: 630,
        alt: "King Brake Peru — Seguridad en cada frenada",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@kingbrakeperu",
    creator: "@kingbrakeperu",
    title: "King Brake Peru — Componentes de Frenado",
    description:
      "Pastillas, discos, zapatas y tambores de freno. Calidad garantizada para tu vehículo.",
    images: [`${baseUrl}/assets/images/og-kingbrake.png`],
  },

  category: "automotive",
  applicationName: "King Brake Peru",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

// ===================== ROOTLAYOUT =====================
// OPTIMIZADO: Ya no es async - no bloquea el render esperando la sesión
// La sesión se obtiene en el cliente via SessionProvider (refetch automático)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-PE"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        {/* Viewport optimizado para móvil - previene zoom y comportamientos no deseados */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />

        {/* Preconnect para recursos externos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />

        {/* Inter - Fuente principal del proyecto */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Splide CSS loaded via npm import in components */}

        {/* Favicon */}
        <link rel="shortcut icon" href="/assets/images/image0.png" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/assets/images/image0.png" />

        {/* JSON-LD Schemas para SEO */}
        <LocalBusinessSchema />
        <WebSiteSchema />
      </head>
      <body>
        {/*
          Analytics pixels (GTM, Meta, TikTok, Clarity) disabled until real IDs are configured.
          Replace the TODO_ values in .env and uncomment when ready for production.
        */}

        {/* ================= APP CONTENT ================= */}
        {/* OPTIMIZADO: Providers sin session - se obtiene en cliente */}
        <Providers>
          <LayoutShell>
            {children}
          </LayoutShell>
        </Providers>
        {/* Splide JS loaded via npm import in components */}
      </body>
    </html>
  );
}
