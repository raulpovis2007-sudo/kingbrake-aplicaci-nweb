# 📋 AUDITORÍA Y REGISTRO DE CONTROL DE ERRORES — KING BRAKE PERÚ
> **Dominio:** `kingbrake-aplicaci-nweb.vercel.app`  
> **Fecha de Auditoría:** 28 de septiembre de 2026  
> **Fuente de Auditoría:** Navegación en vivo + Análisis exhaustivo del código fuente (GitHub)  
> **Total de Hallazgos:** 49 hallazgos (38 tareas de corrección / mejora + 10 fortalezas identificadas + 1 síntesis general)  
> **Archivo de Control y Memoria:** `doc/errores.md` / `docs/errores.md`

---

## 📌 GUÍA DE USO Y PROTOCOLO PARA DESARROLLADORES Y AGENTES DE IA

Este documento actúa como la **memoria central y única fuente de verdad** del proyecto para el saneamiento, corrección y optimización del código. El objetivo principal es **evitar la duplicidad de esfuerzos y asegurar que los desarrolladores y agentes de IA colaboren sin pisarse las responsabilidades**.

### 🤖 Instrucciones para el Agente de IA y el Desarrollador

#### 1. 🔍 ANTES de empezar a trabajar (Lectura Obligatoria de Memoria)
* **Instrucción para el usuario:** Siempre dile a tu agente:  
  > *"Lee el archivo `doc/errores.md` (o `docs/errores.md`), revisa cuáles tareas ya están marcadas con `[x]` y cuáles están pendientes con `[ ]`. Selecciona la tarea prioritaria asignada para no duplicar responsabilidades."*
* **Regla para el agente:**
  - El agente **NO** debe intentar resolver tareas que ya tengan su casilla marcada con `[x]`.
  - El agente debe respetar el orden de criticidad:
    1. 🔴 **Fase 1:** Críticos de Seguridad
    2. 🟠 **Fase 2:** Críticos de Producción
    3. 🟡 **Fase 3:** Mejoras de UX y Funcionalidad
    4. 🔵 **Fase 4:** Limpieza y Detalles

#### 2. 🛠️ DURANTE la ejecución
* Trabajar únicamente en la tarea seleccionada o acordada.
* Verificar que no se rompan funcionalidades existentes ni el build de Next.js (`npm run build` o `npm run lint`).

#### 3. ✅ AL TERMINAR una tarea (Actualización Obligatoria del Check)
* **Instrucción para el usuario:** Una vez que el agente confirme que la corrección fue implementada y testeada, ordénale:  
  > *"Marca con un check `[x]` la tarea número X en `doc/errores.md` e indica brevemente la solución aplicada."*
* **Regla para el agente:**
  - Cambiar `- [ ]` a `- [x]`.
  - Agregar una línea de nota bajo el ítem (opcional pero recomendada) con formato:  
    `_Resuelto:_ [Breve explicación de la solución o commit]`.

---

## 🔴 FASE 1 — CRÍTICOS DE SEGURIDAD
_(Corregir de inmediato, riesgo de hackeo y vulnerabilidad crítica)_

- [x] **01. `Math.random()` inseguro para generar códigos OTP y contraseñas**  
  * **Problema:** Generación predecible de números pseudoaleatorios. Un atacante puede predecir códigos OTP de verificación o contraseñas temporales.  
  * **Solución requerida:** Reemplazar por `crypto.randomInt()` nativo de Node.js o `crypto.getRandomValues()`.  
  * **Ubicación:** `lib/password.ts` y `services/auth/auth.server.ts`  
  * _Resuelto:_ Reemplazado por `crypto.randomInt()` en generación de contraseñas seguras y códigos OTP de 6 dígitos (PR #2, commit `c350881`).

- [x] **02. Tokens de reset de contraseña guardados en TEXTO PLANO en la BD**  
  * **Problema:** Si la base de datos se filtra o se expone por una brecha, todos los tokens de restablecimiento activos quedan expuestos, comprometiendo cuentas de usuarios.  
  * **Solución requerida:** Hashear los tokens con SHA-256 antes de guardarlos en la BD y comparar hashes al validar la solicitud.  
  * **Ubicación:** `app/api/auth/forgot-password/route.ts`  
  * _Resuelto:_ Tokens hasheados con SHA-256 antes de persistir en la BD; el token en texto plano solo viaja por email y se valida por hash (PR #3, commit `af140b9`).

- [x] **03. Rate limiting en memoria (`Map`) inefectivo en Vercel Serverless**  
  * **Problema:** `Map` en memoria local NO funciona en entornos serverless multi-instancia de Vercel (cada invocación/lambda tiene su propia memoria aislada). Además, la IP se puede falsificar fácilmente manipulando `X-Forwarded-For`.  
  * **Solución requerida:** Migrar la capa de rate limiting a Redis distribuido (ej. Upstash Redis `@upstash/ratelimit`) y sanitizar la obtención de la IP real.  
  * **Ubicación:** `lib/rate-limit.ts`  
  * _Resuelto:_ Migrado a Upstash Redis con ventana deslizante, sanitización estricta de IP con `net.isIP` y fallback en memoria (PR #4, commit `9bb798a`).

- [x] **04. Vulnerabilidad XSS en Blog**  
  * **Problema:** `DOMPurify` solo sanitiza en el navegador del cliente. El servidor renderiza el HTML crudo sin sanitización previa en SSR / hydration inicial. Un atacante con acceso a la creación de posts puede inyectar scripts maliciosos.  
  * **Solución requerida:** Implementar sanitización server-side (usando `isomorphic-dompurify` o `sanitize-html`) antes de inyectar el HTML en el DOM.  
  * **Ubicación:** `app/blog/[slug]/BlogContent.tsx`  
  * _Resuelto:_ Implementada sanitización estricta server-side con `sanitize-html` más whitelist de iframes/tags, manteniendo DOMPurify en el cliente (PR #5, commit `2950ef6`).

---

## 🟠 FASE 2 — CRÍTICOS DE PRODUCCIÓN
_(Errores visibles y roturas que afectan directamente a los usuarios en vivo)_

- [x] **05. Contadores en "Quiénes Somos" muestran `+ 0 + AÑOS DE EXPERIENCIA`**  
  * **Problema:** Bug doble: el signo `+` está duplicado en el renderizado y la animación de conteo no se dispara porque el viewport observer / trigger está mal calculado o fuera del alcance de scroll.  
  * **Solución requerida:** Eliminar el signo `+` redundante y calibrar el observer de Framer Motion / Intersection Observer para que dispare la animación correctamente.  
  * **Ubicación:** `app/nosotros/Nosotros.tsx` (Línea 42)  
  * _Resuelto:_ Eliminado prefijo/sufijo redundante `+` en datos y componente, y calibrado IntersectionObserver a `amount: 0.2` para disparo inmediato de animación.

- [ ] **06. Video con título "sadfasdf" visible en la Home**  
  * **Problema:** Registro de prueba (mock) sin limpiar en la base de datos de producción.  
  * **Solución requerida:** Eliminar o editar el registro desde la base de datos o el panel de administración.  
  * **Ubicación:** Panel admin → `/admin/reels`

- [ ] **07. Imágenes placeholder de `placehold.co` visibles en el Blog**  
  * **Problema:** Contenido de prueba visible públicamente en artículos reales del blog.  
  * **Solución requerida:** Reemplazar las imágenes temporales por imágenes reales optimizadas en Cloudinary o assets del proyecto.  
  * **Ubicación:** Panel admin → `/admin/blog`

- [x] **08. CSP bloquea embeds de Instagram y TikTok**  
  * **Problema:** Los videos Reels incrustados se rompen en producción debido a que la Content Security Policy (CSP) no tiene los dominios de iframe autorizados.  
  * **Solución requerida:** Agregar los dominios permitidos (`instagram.com`, `www.instagram.com`, `tiktok.com`, `www.tiktok.com`, etc.) a la directiva `frame-src` en la configuración de cabeceras de seguridad.  
  * **Ubicación:** `next.config.mjs` (Línea 187)  
  * _Resuelto:_ Se ampliaron los orígenes de `frame-src` en la directiva CSP de `next.config.mjs` para autorizar Instagram (`instagram.com`, `www.instagram.com`, `*.instagram.com`), TikTok (`tiktok.com`, `www.tiktok.com`, `*.tiktok.com`), YouTube (`youtube.com`, `www.youtube-nocookie.com`), Google Maps (`maps.google.com`) y Libro de Reclamaciones (`app.reclamovirtual.pe`).

- [ ] **09. Cron `/api/cron/cleanup` configurado en `vercel.json` pero la ruta NO EXISTE**  
  * **Problema:** Vercel ejecuta una tarea programada diaria que devuelve error HTTP 404 continuo en los logs del servidor.  
  * **Solución requerida:** Crear el route handler `app/api/cron/cleanup/route.ts` con autenticación por `CRON_SECRET` para limpiar tokens expirados y carritos abandonados, o remover la regla de `vercel.json` si no aplica.  
  * **Ubicación:** `vercel.json` y crear `app/api/cron/cleanup/route.ts`

- [ ] **10. Imagen OG para redes sociales no existe**  
  * **Problema:** El archivo `og-kingbrake.png` está referenciado en la metadata SEO pero no existe físicamente en el repositorio. Provoca previsualizaciones rotas en WhatsApp, Facebook, LinkedIn y Twitter.  
  * **Solución requerida:** Crear/subir la imagen Open Graph oficial (`1200x630px`) en la carpeta pública.  
  * **Ubicación:** `public/assets/images/og-kingbrake.png`

- [ ] **11. Endpoint del Blog expone borradores (drafts) sin autenticación**  
  * **Problema:** `GET /api/blog/posts?published=false` responde con todos los artículos en borrador sin verificar sesión ni rol de administrador.  
  * **Solución requerida:** Validar sesión de NextAuth en el endpoint; solo permitir filtrar por `published=false` si el usuario tiene rol `ADMIN`.  
  * **Ubicación:** `app/api/blog/posts/route.ts`

- [ ] **12. Footer enlaza "Distribuidores" a ancla inexistente `/#distribuidores`**  
  * **Problema:** El enlace del Footer apunta a un ancla que no existe en la Home en vez de navegar a la página dedicada.  
  * **Solución requerida:** Cambiar el `href` a `/distribuidores`.  
  * **Ubicación:** `app/layout/footer/Footer.tsx` (Línea 104)

- [ ] **13. Ícono de LinkedIn en el Header apunta a Facebook**  
  * **Problema:** El enlace con el logo de LinkedIn redirige erróneamente a la página de Facebook de la marca.  
  * **Solución requerida:** Corregir la URL al perfil oficial de LinkedIn de King Brake Perú.  
  * **Ubicación:** `app/layout/navBar/NavBar.tsx` (Línea 507)

---

## 🟡 FASE 3 — MEJORAS DE UX Y FUNCIONALIDAD
_(Funcionalidades incompletas, experiencia de usuario y arquitectura pendiente)_

- [ ] **14. Catálogo vacío por defecto**  
  * **Problema:** Al entrar a `/catalogo`, la vista está en blanco hasta que el usuario selecciona obligatoriamente Marca → Modelo → Generación. El endpoint para listar todos los productos ya existe pero no se consume al montar el componente.  
  * **Solución requerida:** Cargar y mostrar un listado inicial paginado de productos destacados o recientes, y permitir filtrar sobre ellos.  
  * **Ubicación:** `app/catalogo/BuscadorRepuestos.tsx`

- [ ] **15. 4 secciones del Landing NO se renderizan en `page.tsx`**  
  * **Problema:** Existen componentes ya creados para FAQ, Testimonios/Google Reviews, Mapa de Distribuidores y "Por qué King Brake", pero están comentados o no importados en el Landing principal.  
  * **Solución requerida:** Integrar, estilizar e importar estos 4 componentes en el layout de `app/page.tsx`.  
  * **Ubicación:** `app/page.tsx`

- [ ] **16. Libro de Reclamaciones (`ComplaintBookButton`) importado pero no renderizado**  
  * **Problema:** Es un requisito obligatorio por ley en el comercio digital en Perú (normativa Indecopi). El componente existe pero nunca se muestra en el Footer.  
  * **Solución requerida:** Montar el componente `ComplaintBookButton` en el Footer con su respectivo modal y formulario de reclamaciones conforme a ley.  
  * **Ubicación:** `app/layout/footer/Footer.tsx` (Línea 176)

- [ ] **17. Página de carrito es un stub incompleto**  
  * **Problema:** `/carrito` solo contiene `<h1>Tu Carrito</h1>` con un TODO. El store de Zustand existe en el código pero ningún componente lo conecta ni gestiona items.  
  * **Solución requerida:** Implementar la vista del carrito conectada a la store de Zustand (o redirigir a cotización por WhatsApp si no hay pasarela de pago activa).  
  * **Ubicación:** `app/carrito/page.tsx`

- [ ] **18. Sección de Soporte muestra "Próximamente"**  
  * **Problema:** El código frontend (carrusel + lightbox + reproductor de video) está terminado, pero la base de datos no tiene registros de categoría `SOPORTE`.  
  * **Solución requerida:** Sembrar o cargar registros de soporte técnico/manuales desde el panel admin.  
  * **Ubicación:** Panel admin → `/admin/banners` y `/admin/reels`

- [ ] **19. Sesiones JWT de usuarios suspendidos siguen activas**  
  * **Problema:** Los tokens JWT de NextAuth tienen validez de hasta 7 días (web) o 30 días (mobile). Si un administrador suspende a un usuario en la BD, este puede seguir navegando hasta que expire el token.  
  * **Solución requerida:** Validar el estado del usuario (`isSuspended` / `isActive`) en la base de datos dentro del callback `jwt()` o en el middleware/endpoint sensible.  
  * **Ubicación:** `lib/auth.ts`

- [ ] **20. Política de contraseñas inconsistente**  
  * **Problema:** La función `validatePasswordStrength()` solo se evalúa en el cambio voluntario de contraseña, pero no en el registro de nuevos usuarios ni en el restablecimiento por token. Se pueden crear contraseñas débiles como "12345678".  
  * **Solución requerida:** Unificar la validación de fortaleza de contraseñas en los endpoints de registro y reseteo.  
  * **Ubicación:** `app/api/register` y `app/api/auth/reset-password`

- [ ] **21. Enumeración de emails en endpoint de reenvío de código**  
  * **Problema:** `/api/auth/resend-code` responde con "Usuario no encontrado" si el correo no existe, permitiendo a atacantes deducir qué correos están registrados en el sistema.  
  * **Solución requerida:** Responder siempre con un mensaje genérico ("Si el correo está registrado, se ha enviado un nuevo código").  
  * **Ubicación:** `app/api/auth/resend-code/route.ts`

- [ ] **22. Sin rate-limiting en cambio de contraseña ni en login**  
  * **Problema:** No existe restricción de intentos en `/api/user/change-password` ni en las credenciales de NextAuth, exponiéndolos a ataques de fuerza bruta.  
  * **Solución requerida:** Implementar middleware de rate limit estricto por IP y por identificador de cuenta en estos endpoints.  
  * **Ubicación:** `app/api/user/change-password` y `app/api/auth/[...nextauth]/route.ts`

- [ ] **23. Admin quote status acepta cualquier string sin validar enum**  
  * **Problema:** El endpoint de actualización de cotizaciones no valida el payload contra el enum `QuoteStatus`, provocando excepciones 500 no controladas de Prisma al recibir valores no definidos.  
  * **Solución requerida:** Validar con Zod o verificar explícitamente `Object.values(QuoteStatus).includes(status)` antes de la mutación.  
  * **Ubicación:** `app/api/admin/quotes/[id]/route.ts`

- [ ] **24. Newsletter eliminado completamente (código residual)**  
  * **Problema:** Se removió el modelo de Prisma para suscriptores pero quedan clases CSS y archivos de estilos huérfanos.  
  * **Solución requerida:** Limpiar el CSS residual o reinstaurar la funcionalidad si el negocio requiere captación de leads.  
  * **Ubicación:** Hojas de estilos y componentes de footer

- [ ] **25. Sin campo de precios en productos**  
  * **Problema:** El campo `price` fue retirado del modelo de Prisma, dejando en ambigüedad si el flujo de venta es e-commerce directo o por cotización personalizada.  
  * **Solución requerida:** Definir la regla de negocio: si es catálogo consultivo/cotizador, estandarizar los botones a "Cotizar por WhatsApp"; si es e-commerce, restituir el campo en el schema.  
  * **Ubicación:** `prisma/schema.prisma` y componentes de catálogo

- [ ] **26. Google OAuth no configurado**  
  * **Problema:** El botón "Continuar con Google" arroja error en runtime si no se definen las variables de entorno de Google Cloud Console.  
  * **Solución requerida:** Configurar `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` en Vercel/.env, o deshabilitar condicionalmente el botón en la UI si las keys no están presentes.  
  * **Ubicación:** `.env` y `lib/auth.ts`

- [ ] **27. Resend API Key no configurada**  
  * **Problema:** Los correos de bienvenida, verificación de email y reseteo de contraseña no se despachan por falta de la variable de entorno `RESEND_API_KEY`.  
  * **Solución requerida:** Configurar la API key de Resend en el entorno y verificar el dominio remitente autorizado.  
  * **Ubicación:** `.env` y servicios de mailing

- [ ] **28. Falta enlace `/nosotros` en el menú del Footer**  
  * **Problema:** La navegación del footer omite la página institucional de la empresa.  
  * **Solución requerida:** Agregar el enlace a `/nosotros` en la sección de navegación institucional del Footer.  
  * **Ubicación:** `app/layout/footer/Footer.tsx`

---

## 🔵 FASE 4 — LIMPIEZA Y DETALLES
_(Calidad de código, consistencia y optimizaciones no bloqueantes)_

- [ ] **29. Código muerto: `vehicle.client.ts`**  
  * **Problema:** El archivo existe pero no tiene ningún `import` en todo el proyecto.  
  * **Solución requerida:** Eliminar el archivo o reutilizarlo si contiene lógica útil.  
  * **Ubicación:** `services/vehicle.client.ts`

- [ ] **30. Salt rounds inconsistentes en bcrypt**  
  * **Problema:** El registro de usuarios utiliza 10 salt rounds mientras que el cambio de contraseña utiliza 12.  
  * **Solución requerida:** Estandarizar a 12 salt rounds en todas las operaciones de hashing de contraseñas.  
  * **Ubicación:** `app/api/register/route.ts` y utilidades de auth

- [ ] **31. URLs de WhatsApp inconsistentes**  
  * **Problema:** Algunas secciones usan enlaces con formato `wa.me/` y otras usan `api.whatsapp.com/send?phone=`.  
  * **Solución requerida:** Estandarizar mediante una constante o función utilitaria común (ej. `getWhatsAppUrl(phone, message)`).  
  * **Ubicación:** Componentes globales de contacto y botones flotantes

- [ ] **32. Metadata de la página `/eventos` incorrecta**  
  * **Problema:** El título y descripción SEO dicen "Soporte Técnico" en lugar de "Eventos".  
  * **Solución requerida:** Actualizar el objeto `metadata` exportado en la página.  
  * **Ubicación:** `app/eventos/page.tsx`

- [ ] **33. Google Fonts cargado vía `<link>` en lugar de `next/font`**  
  * **Problema:** La carga manual de fuentes en el HTML bloquea el render inicial y degrada las métricas Core Web Vitals (FCP/LCP).  
  * **Solución requerida:** Migrar a `next/font/google` para autoservir las fuentes sin peticiones de red externas bloqueantes.  
  * **Ubicación:** `app/layout.tsx`

- [ ] **34. Schema.org SearchAction apunta a ruta 404**  
  * **Problema:** Los datos estructurados de búsqueda de Google apuntan a `/productos?q={search_term_string}` pero esa ruta no existe (es `/catalogo`).  
  * **Solución requerida:** Actualizar la URL del `target` del `SearchAction` JSON-LD a `/catalogo?q={search_term_string}`.  
  * **Ubicación:** `app/layout.tsx` o componente SEO principal

- [ ] **35. Configuración muerta de `@react-pdf/renderer` en `next.config`**  
  * **Problema:** Existen configuraciones de webpack para un paquete PDF que ya no se utiliza o está deprecado en esa sección.  
  * **Solución requerida:** Limpiar las reglas de webpack huérfanas en la configuración de Next.js.  
  * **Ubicación:** `next.config.mjs`

- [ ] **36. Variables de entorno declaradas sin usar**  
  * **Problema:** `EXTERNAL_API_KEY` y `GOOGLE_MAPS_API_KEY` están definidas en ejemplos o esquemas pero no se consumen en el código.  
  * **Solución requerida:** Documentar su propósito si son para integraciones futuras o removerlas de `.env.example`.  
  * **Ubicación:** `.env.example` y configuraciones

- [ ] **37. Uso de `require()` en módulo ESM en `rate-limit.ts`**  
  * **Problema:** Mezcla de sintaxis CommonJS (`require`) dentro de un entorno configurado como ES Modules.  
  * **Solución requerida:** Migrar a sintaxis estándar `import` de ESM.  
  * **Ubicación:** `lib/rate-limit.ts`

- [ ] **38. Variables no usadas en `Nosotros.tsx`**  
  * **Problema:** Declaraciones de variantes de animación (`scaleIn`, `TIMELINE`) importadas o declaradas pero nunca referenciadas.  
  * **Solución requerida:** Remover las variables no utilizadas para mantener el código limpio.  
  * **Ubicación:** `app/nosotros/Nosotros.tsx`

---

## ✅ LO QUE ESTÁ BIEN (FORTALEZAS DEL PROYECTO)
Aspectos positivos validados durante la auditoría que deben preservarse:

1. **Compilación sin errores:** El build compila perfectamente en Next.js 14 con App Router y Prisma ORM.
2. **Higiene de secretos:** No existen API keys ni secretos hardcodeados en el repositorio de código.
3. **Protección SQLi:** Consultas parametrizadas mediante Prisma ORM protegidas contra inyecciones SQL.
4. **Cabeceras HTTP de seguridad:** Implementación activa de HSTS, X-Frame-Options, X-Content-Type-Options y CSP.
5. **Mitigación CVE-2025-29927:** Prevención y parches aplicados ante vulnerabilidades conocidas de Next.js.
6. **Middleware de filtrado:** Bloqueo perimetral contra bots maliciosos y patrones de escaneo de vulnerabilidades.
7. **Módulo de Distribuidores:** Excelente implementación del mapa interactivo con filtros por departamento y provincia.
8. **Panel de Administración:** Funcionalidades completas de gestión de banners, reels y contenido.
9. **Accesibilidad y Semántica:** Estructura HTML5 correcta, navegación accesible y soporte para lectores de pantalla.
10. **Optimización multimedia:** Uso consistente de `next/image` con tamaños adaptativos y lazy loading.

---

## 📊 RESUMEN FINAL DE LA AUDITORÍA
| Categoría | Total Hallazgos | Estado |
| :--- | :---: | :---: |
| 🔴 **Fase 1 — Críticos de Seguridad** | 4 | **4 / 4 Completadas `[x]`** |
| 🟠 **Fase 2 — Críticos de Producción** | 9 | **2 / 9 Completadas** (7 pendientes) |
| 🟡 **Fase 3 — Mejoras de UX y Funcionalidad** | 15 | Pendientes `[ ]` |
| 🔵 **Fase 4 — Limpieza y Detalles** | 10 | Pendientes `[ ]` |
| ✅ **Fortalezas y Buenas Prácticas** | 10 | Validadas |
| **TOTAL TAREAS ACCIONABLES** | **38** | **6 / 38 completadas** |

> ⏱️ **Tiempo estimado total para resolución completa:** ~2 horas de desarrollo enfocado.  
> 💡 *Recuerda: Cada vez que un agente o desarrollador resuelva un ítem, debe marcar el check `- [x]` correspondiente en este archivo para mantener la sincronización.*
