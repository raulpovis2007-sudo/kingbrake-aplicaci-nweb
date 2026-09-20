# Perfil de Cliente + Sistema de Cotizaciones

## Contexto

King Brake vende repuestos de freno a través de WhatsApp. El flujo actual es: cliente ve un producto → clic en "Cotizar por WhatsApp" → se abre WhatsApp con mensaje pre-armado. No hay persistencia de cotizaciones ni perfil útil para el cliente.

## Alcance

1. **Perfil del cliente** (`/perfil`) — datos personales, vehículo guardado, distribuidor preferido
2. **Persistencia de cotizaciones** — guardar cada cotización en BD antes de abrir WhatsApp
3. **Mis cotizaciones** (`/mis-cotizaciones`) — historial del cliente con estados
4. **Admin cotizaciones** (`/admin/cotizaciones`) — gestión, cambio de estado, notas
5. **WhatsApp real** — número `51908920221`

No incluye: carrito, checkout con pago, multi-producto por cotización.

## Modelos de datos

### UserVehicle (nuevo)

```prisma
model UserVehicle {
  id             String       @id @default(cuid())
  userId         String
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  vehicleModelId String
  vehicleModel   VehicleModel @relation(fields: [vehicleModelId], references: [id])
  year           Int
  createdAt      DateTime     @default(now())

  @@unique([userId, vehicleModelId, year])
}
```

### Quote (nuevo)

```prisma
model Quote {
  id           String      @id @default(cuid())
  userId       String
  user         User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId    String
  product      Product     @relation(fields: [productId], references: [id])
  productName  String      // snapshot al momento de cotizar
  productSku   String
  productPrice Float
  status       QuoteStatus @default(PENDING)
  adminNote    String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}

enum QuoteStatus {
  PENDING
  CONFIRMED
  DELIVERED
  CANCELLED
}
```

### Cambios en User

```prisma
model User {
  // campos existentes...
  preferredDistributorId String?
  preferredDistributor   Distributor?    @relation(fields: [preferredDistributorId], references: [id])
  vehicles               UserVehicle[]
  quotes                 Quote[]
}
```

### Cambios en Product y Distributor

```prisma
model Product {
  // campos existentes...
  quotes Quote[]
}

model Distributor {
  // campos existentes...
  preferredByUsers User[]
}
```

## Páginas

### /perfil

Tres secciones verticales:

**Datos personales**
- Nombre (input), teléfono (input), email (readonly, gris)
- Botón "Guardar cambios" — PUT `/api/user/profile`
- Reutilizar useProfile.ts existente

**Mi vehículo**
- Si tiene vehículo: mostrar "Toyota Corolla 2020" con botón "Cambiar"
- Si no tiene: selects cascada Marca → Modelo → Año + botón "Guardar"
- Un solo vehículo por usuario (simplicidad)
- API: GET/PUT `/api/user/vehicle`

**Distribuidor preferido**
- Select con distribuidores activos (nombre + dirección)
- Se guarda automáticamente al cambiar
- API: PUT `/api/user/profile` (extender el existente para incluir distributorId)

### /carrito → eliminar

Página actual es solo un TODO placeholder. Se elimina o se deja vacío.

### Botón "Cotizar por WhatsApp" (producto detalle)

Convertir de `<a>` (server) a client component `CotizarButton`:
- Props: productId, productName, productSku, productPrice
- onClick:
  1. Si hay sesión → POST `/api/quotes` { productId, productName, productSku, productPrice }
  2. window.open(whatsappUrl) con mensaje: `Hola King Brake! Quiero cotizar:\n• {nombre} ({sku}) — S/{precio}\n\nPor favor envíenme más información.`
- No bloquea WhatsApp si el POST falla (fire-and-forget)
- Número WhatsApp: 51908920221

### /mis-cotizaciones

- GET `/api/quotes` — cotizaciones del usuario autenticado
- Lista de cards: fecha, producto (nombre + SKU), precio cotizado, badge de estado
- Estados con colores:
  - PENDING: amarillo — "Pendiente"
  - CONFIRMED: azul — "Confirmado"  
  - DELIVERED: verde — "Entregado"
  - CANCELLED: rojo — "Cancelado"
- Si tiene adminNote, mostrarla como texto secundario
- Empty state si no tiene cotizaciones

### /admin/cotizaciones

- GET `/api/admin/quotes` — todas las cotizaciones con datos del usuario
- Tabla: fecha, cliente (nombre + email + teléfono), producto, precio, estado, acciones
- Filtro por estado (select) + búsqueda por nombre/email
- Click en fila → modal con:
  - Info del cliente (nombre, email, teléfono)
  - Producto cotizado (nombre, SKU, precio)
  - Select para cambiar estado
  - Textarea para nota del admin
  - Botón guardar — PUT `/api/admin/quotes/{id}`

## APIs

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/user/vehicle` | Vehículo guardado del usuario |
| PUT | `/api/user/vehicle` | Guardar/actualizar vehículo |
| PUT | `/api/user/profile` | Extender: incluir preferredDistributorId |
| POST | `/api/quotes` | Crear cotización (cliente autenticado) |
| GET | `/api/quotes` | Listar cotizaciones del usuario |
| GET | `/api/admin/quotes` | Listar todas las cotizaciones (admin) |
| PUT | `/api/admin/quotes/[id]` | Actualizar estado/nota (admin) |

## Decisiones de diseño

- **Un vehículo por usuario** — no múltiples. YAGNI.
- **Cotización = 1 producto** — no carrito multi-producto. El flujo real es producto → WhatsApp.
- **Snapshot de precio** — se guarda el precio al momento de cotizar, no referencia al precio actual.
- **Fire-and-forget** — si el POST de cotización falla, WhatsApp se abre igual. No bloquear al cliente.
- **Duplicados permitidos** — cada clic crea cotización nueva. Un cliente puede cotizar el mismo producto varias veces.
- **Sin vehículo en mensaje WhatsApp** — el mensaje solo lleva producto, SKU y precio.
