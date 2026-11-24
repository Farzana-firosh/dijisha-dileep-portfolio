import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

// Share card, drawn at build time. Colours copied from the light tokens in globals.css (the renderer can't read CSS
// variables); the built-in font is used so no font files need shipping.
export const alt = `${profile.name}, ${profile.role}, ${profile.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const paper = "#f1f2ee";
const ink = "#121418";
const soft = "#4b5159";
const accent = "#2a43dc";
const mark = "#ddff3f";
const grid = "rgba(18,20,24,0.06)";

export default function Image() {
  const [first, ...rest] = profile.name.split(" ");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: paper,
          backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          color: ink,
          padding: "64px 72px",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: soft, letterSpacing: 1 }}>
          {profile.currentRole.title} at {profile.currentRole.company} · {profile.city}, {profile.country}
        </div>

        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          {/* Dimension line over the name, like the site's inspect lens */}
          <div style={{ display: "flex", alignItems: "center", color: accent, fontSize: 20, marginBottom: 18 }}>
            <div style={{ width: 1, height: 18, background: accent }} />
            <div style={{ flex: 1, height: 1, background: accent }} />
            <div style={{ display: "flex", padding: "0 12px" }}>h1</div>
            <div style={{ flex: 1, height: 1, background: accent }} />
            <div style={{ width: 1, height: 18, background: accent }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 150, fontWeight: 700, lineHeight: 0.9, letterSpacing: -5 }}>
            <span>{first}</span>
            <span>{rest.join(" ")}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 600 }}>{profile.role}</div>
          <div style={{ display: "flex", background: mark, color: ink, fontSize: 24, padding: "8px 18px" }}>
            Selenium · Playwright · Postman · Agile
          </div>
        </div>
      </div>
    ),
    size,
  );
}
