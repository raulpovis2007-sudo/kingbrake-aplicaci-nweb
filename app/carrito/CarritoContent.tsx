"use client";

import { useCartStore } from "@/app/stores/cart";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function CarritoContent() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <p style={{ fontSize: "1.125rem", marginBottom: "1rem" }}>
          Tu carrito está vacío
        </p>
        <Link
          href="/catalogo"
          style={{
            color: "#0e1469",
            textDecoration: "underline",
            fontWeight: 600,
          }}
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  const message = [
    "Hola King Brake! Quiero cotizar:",
    ...items.map(
      (i) => `• ${i.quantity}x ${i.name} (${i.sku})`
    ),
  ].join("\n");

  const whatsappUrl = getWhatsAppUrl(message);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                position: "relative",
                flexShrink: 0,
                borderRadius: 6,
                overflow: "hidden",
                background: "#f3f4f6",
              }}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="64px"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9ca3af",
                    fontSize: 12,
                  }}
                >
                  Sin img
                </div>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, margin: 0 }}>{item.name}</p>
              <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
                SKU: {item.sku}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                aria-label="Reducir cantidad"
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                <Minus size={14} />
              </button>
              <span style={{ minWidth: 20, textAlign: "center" }}>
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                aria-label="Aumentar cantidad"
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              aria-label="Eliminar producto"
              style={{
                color: "#ef4444",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "0.75rem 1.5rem",
            background: "#25d366",
            color: "white",
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: "none",
            fontSize: 15,
          }}
        >
          Cotizar por WhatsApp
        </a>
        <button
          onClick={clearCart}
          style={{
            padding: "0.75rem 1.5rem",
            background: "none",
            border: "1px solid #d1d5db",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 15,
          }}
        >
          Vaciar carrito
        </button>
      </div>
    </div>
  );
}
