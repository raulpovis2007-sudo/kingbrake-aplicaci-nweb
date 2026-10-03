import { ImageResponse } from "next/og";

export const alt = "King Brake Peru — Seguridad en cada frenada";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0e1469 0%, #0a0f4a 60%, #060930 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent stripe */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "8px",
            background: "#fe0008",
          }}
        />

        {/* Brand name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: "82px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            KING BRAKE
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#fe0008",
              letterSpacing: "8px",
              textTransform: "uppercase",
            }}
          >
            PERU
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "24px",
            color: "rgba(255,255,255,0.85)",
            marginTop: "32px",
            letterSpacing: "1px",
          }}
        >
          Seguridad en cada frenada
        </div>

        {/* Product line */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            marginTop: "40px",
            fontSize: "16px",
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "1px",
          }}
        >
          <span>PASTILLAS</span>
          <span>•</span>
          <span>DISCOS</span>
          <span>•</span>
          <span>ZAPATAS</span>
          <span>•</span>
          <span>TAMBORES</span>
        </div>

        {/* Bottom stripe */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "8px",
            background: "#fe0008",
          }}
        />

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            right: "40px",
            fontSize: "16px",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          kingbrake.com
        </div>
      </div>
    ),
    { ...size }
  );
}
