# CLAUDE.md — King Brake Peru

## Project Overview

King Brake es una plataforma web de catálogo de productos y e-commerce para una empresa de autopartes de frenos en Lima, Peru. El proyecto está basado en la arquitectura de VerifiCARLO (Next.js 14 App Router) pero adaptado para venta de productos fisicos en lugar de servicios de inspeccion vehicular.

**Empresa:** King Brake Peru
**Slogan:** "Seguridad en cada frenada"
**Rubro:** Componentes de frenado automotriz (pastillas ceramicadas/semimetalicas, zapatas, discos, tambores, componentes del sistema hidraulico)
**Ubicacion:** Lima, Peru
**Redes:** Instagram @kingbrakeperu (1,460 seg.) | Facebook /KingBrakePeru
**Web actual:** kingbrake.com (en construccion)

## Branding

- Primary: `#0e1469` (navy profundo)
- Secondary: `#fe0008` (rojo)
- White: `#ffffff`
- Toda la UI es en espanol (es-PE)
- Fuente: Inter (misma que VerifiCARLO)

## Architecture

### Stack

- **Next.js 14** (App Router) — SSR + RSC
- **Prisma** + **PostgreSQL** — ORM y base de datos
- **NextAuth v4** — Auth con Google OAuth + credentials (roles: ADMIN, CLIENT)
- **Zustand** — Estado del carrito de compras
- **Cloudinary** — Upload de imagenes de productos y blog
- **Resend** — Emails transaccionales y newsletter
- **Google Maps API** — Mapa de distribuidores/puntos de venta
- **Tailwind CSS** + **CSS Modules** — Estilos (co-located con componentes)
- **Framer Motion** — Animaciones del landing
- **Splide.js** — Carruseles
- **react-quill-new** — Editor rich text para blog (CMS)
- **Zod** — Validacion de inputs
- **date-fns** + **date-fns-tz** — Fechas (timezone America/Lima)

### Route Groups

```
app/
  page.tsx                          # Landing page publica
  (auth)/                           # Login, registro, forgot password
  productos/                        # Catalogo publico
    page.tsx                        # Grid de productos + filtros
    [slug]/page.tsx                 # Ficha de producto individual
  carrito/page.tsx                  # Resumen del carrito + boton WhatsApp
  blog/                             # Blog publico con categorias
    [slug]/page.tsx
    categoria/[slug]/page.tsx
  (legal)/                          # Terminos, privacidad, devoluciones
  (dashboard)/
    admin/                          # Panel admin (CRUD productos, blog, usuarios)
      productos/                    # Gestion de productos
      categorias/                   # Gestion de categorias
      compatibilidad/               # Marcas/modelos de vehiculos
      blog/                         # Editor de blog posts
      distribuidores/               # Gestion de puntos de venta
  api/
    products/                       # CRUD productos
    categories/                     # CRUD categorias
    vehicles/                       # Marcas y modelos
    admin/                          # Endpoints admin-only
    auth/[...nextauth]/             # NextAuth
    blog/                           # CRUD blog
    newsletter/                     # Suscripcion newsletter
```

### Data Models (Prisma)

```prisma
model User {
  id            String   @id @default(cuid())
  name          String?
  email         String   @unique
  password      String?
  image         String?
  role          Role     @default(CLIENT)
  emailVerified DateTime?
  createdAt     DateTime @default(now())
}

enum Role {
  ADMIN
  CLIENT
}

model Product {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  description   String
  price         Float
  sku           String   @unique
  images        String[] // Cloudinary URLs
  stock         Int      @default(0)
  featured      Boolean  @default(false)
  isActive      Boolean  @default(true)
  categoryId    String
  category      Category @relation(fields: [categoryId], references: [id])
  compatibility ProductCompatibility[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  icon        String?   // Icon identifier or Cloudinary URL
  order       Int       @default(0)
  products    Product[]
}

model VehicleBrand {
  id     String         @id @default(cuid())
  name   String         @unique
  slug   String         @unique
  logo   String?
  models VehicleModel[]
}

model VehicleModel {
  id            String   @id @default(cuid())
  name          String
  yearFrom      Int
  yearTo        Int
  brandId       String
  brand         VehicleBrand @relation(fields: [brandId], references: [id])
  compatibility ProductCompatibility[]
}

model ProductCompatibility {
  id             String       @id @default(cuid())
  productId      String
  product        Product      @relation(fields: [productId], references: [id], onDelete: Cascade)
  vehicleModelId String
  vehicleModel   VehicleModel @relation(fields: [vehicleModelId], references: [id], onDelete: Cascade)

  @@unique([productId, vehicleModelId])
}

model Distributor {
  id       String  @id @default(cuid())
  name     String
  address  String
  lat      Float
  lng      Float
  phone    String?
  isActive Boolean @default(true)
}

model BlogPost {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   // HTML from rich text editor
  excerpt     String?
  coverImage  String?  // Cloudinary URL
  category    String?
  published   Boolean  @default(false)
  authorId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model NewsletterSubscriber {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
}
```

### Seed Data

Usar datos mockup para desarrollo. Categorias reales:
- Pastillas ceramicadas
- Pastillas semimetalicas
- Zapatas
- Discos de freno
- Tambores

Marcas de vehiculos comunes en Peru: Toyota, Hyundai, Kia, Nissan, Chevrolet, Suzuki, Mitsubishi, Honda, Mazda, Volkswagen.

Generar 15-20 productos de ejemplo con SKUs tipo "KB-PC-001", precios entre S/45 y S/250, y compatibilidad cruzada con los modelos populares.

## Core Flows

### Carrito + WhatsApp Checkout

1. Usuario navega catalogo, filtra por vehiculo o categoria
2. Click "Agregar al carrito" en ficha de producto (Zustand store, persistido en localStorage)
3. Icono de carrito en NavBar muestra cantidad de items
4. Pagina /carrito muestra resumen: productos, cantidades editables, subtotales, total
5. Boton "Completar pedido" genera mensaje formateado y abre `https://api.whatsapp.com/send?phone=NUMERO&text=MENSAJE`

Formato del mensaje WhatsApp:
```
Hola King Brake! Quiero cotizar:
• {cantidad}x {nombre} ({sku}) — S/{precio} c/u
• ...
Total estimado: S/{total}
Mi vehiculo: {marca} {modelo} {año} (si seleccionaron)
```

### Buscador por Vehiculo

Selector cascada en el Hero del landing:
1. Select: Marca (Toyota, Hyundai, etc.)
2. Select: Modelo (filtrado por marca seleccionada)
3. Select: Año (rango del modelo)
4. Boton "Buscar" → redirige a /productos?marca=X&modelo=Y&anio=Z

### Blog CMS

Admin escribe posts con react-quill-new (editor WYSIWYG). Mismo patron que VerifiCARLO:
- CRUD en /admin/blog
- Upload de imagen de portada a Cloudinary
- Publicar/despublicar
- Categorias de blog

## Landing Page Sections (en orden)

1. **Hero** — Imagen/video de frenos + buscador por vehiculo + CTA "Ver catalogo"
2. **Categorias** — Grid 5 categorias con imagen, nombre, count de productos
3. **Por que King Brake** — 4 cards: Calidad, Durabilidad, Compatibilidad, Soporte
4. **Metricas** — "+15 anos", "+200 modelos", "+50 puntos de venta" (datos mockup)
5. **Testimonios** — Carrusel infinito de resenas de talleres/mecanicos
6. **Reels** — Videos educativos de Instagram de King Brake
7. **Puntos de venta** — Mapa Google Maps con distribuidores
8. **Blog** — Ultimos posts + newsletter signup
9. **FAQ** — Acordeon con preguntas sobre compatibilidad, garantia, envios
10. **Footer** — Datos de contacto, redes sociales, keywords SEO

## Component Organization

Componentes en `app/components/NombreComponente/` con CSS Modules co-located (`.module.css`).
Secciones del landing en `app/landing/`.
Layout shell en `app/layout/` (NavBar, Footer, WhatsApp flotante, Banner).

## Layout System

`LayoutShell.tsx` decide que chrome mostrar segun la ruta:
- Admin routes → layout propio del dashboard
- Catalogo/producto → NavBar + Footer (publico)
- Legal routes → layout simple sin nav
- Visitante → Banner + NavBar + children + Footer + WhatsApp flotante

## API Conventions

- Auth check via `getServerSession(authOptions)` — no middleware auth
- Admin endpoints en `app/api/admin/` verifican role === 'ADMIN'
- Rate limiting con in-memory store para endpoints sensibles
- Validacion de inputs con Zod
- Respuestas JSON estandar

## SEO

- Metadata completa en layout.tsx (OpenGraph, Twitter Cards, keywords)
- JSON-LD schemas: LocalBusiness, WebSite, Product (nuevo)
- Blog para posicionamiento con keywords de frenos/autopartes
- Keywords target: "pastillas de freno Lima", "repuestos de freno Peru", "autopartes de freno", "King Brake"

## Analytics

- Google Tag Manager
- Meta Pixel (Facebook)
- TikTok Pixel
- Microsoft Clarity

## Commands

```bash
npm run dev              # Dev server http://localhost:3000
npm run build            # prisma generate && next build
npm run lint             # ESLint
npx prisma migrate dev   # Run pending migrations
npx prisma studio        # Visual DB browser
npx tsx prisma/seed.ts   # Seed database with mockup data
```

## What NOT to include (removed from VerifiCARLO)

- Sistema de booking/agendamiento
- Rol de Inspector
- Culqi (gateway de pagos)
- Firebase (push notifications)
- @react-pdf/renderer (reportes PDF)
- VehicleInspection, InspectionReport, Booking models
- lib/scheduling/, lib/vehicle-inspection/, lib/pdf/
- app/(booking)/, app/(dashboard)/inspector/
