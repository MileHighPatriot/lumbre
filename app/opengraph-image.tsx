import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Lumbre, a Mexican kitchen on Santa Fe Drive in Denver";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1a3358",
          color: "#f4efe8",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, color: "#e2b15a" }}>SANTA FE DRIVE · DENVER</div>
        <div style={{ display: "flex", fontSize: 120, lineHeight: 0.9 }}>Lumbre</div>
        <div style={{ display: "flex", fontSize: 36 }}>Fire, masa, and a long table.</div>
      </div>
    ),
    { ...size },
  );
}
