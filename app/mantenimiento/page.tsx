import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function MantenimientoPage() {
  const record = await db.pageContent.findUnique({ where: { key: "maintenance" } });
  const data = (record?.data as { enabled?: boolean; message?: string }) || {};

  if (!data.enabled) redirect("/");

  const message = data.message || "Estamos realizando mejoras en nuestro sitio. Volveremos pronto.";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0e1469 0%, #1a1f7a 50%, #0e1469 100%)",
        color: "#fff",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "var(--font-barlow), sans-serif",
      }}
    >
      <Image
        src="/assets/images/logo-principal.webp"
        alt="King Brake"
        width={120}
        height={120}
        style={{ marginBottom: "2rem", filter: "brightness(0) invert(1)" }}
        priority
      />

      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔧</div>

      <h1
        style={{
          fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
          fontWeight: 700,
          marginBottom: "1rem",
          lineHeight: 1.2,
        }}
      >
        Sitio en mantenimiento
      </h1>

      <p
        style={{
          fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
          maxWidth: "500px",
          lineHeight: 1.6,
          opacity: 0.9,
          marginBottom: "2.5rem",
        }}
      >
        {message}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          opacity: 0.7,
          fontSize: "0.9rem",
        }}
      >
        <span>¿Necesitas ayuda urgente?</span>
        <a
          href="https://api.whatsapp.com/send?phone=51999999999&text=Hola%20King%20Brake"
          style={{ color: "#4ade80", textDecoration: "none", fontWeight: 600 }}
        >
          Escríbenos por WhatsApp
        </a>
      </div>
    </div>
  );
}
