import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same mark as icon.svg, on a full square (iOS rounds the corners itself)
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#121418" }}>
        <svg width="132" height="132" viewBox="0 0 32 32">
          <circle cx="14" cy="14" r="8" fill="none" stroke="#f1f2ee" strokeWidth="2.2" />
          <path d="m19.8 19.8 6 6" stroke="#f1f2ee" strokeWidth="2.6" strokeLinecap="round" />
          <path d="m10.4 14.2 2.6 2.6 4.8-5.2" fill="none" stroke="#ddff3f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  );
}
