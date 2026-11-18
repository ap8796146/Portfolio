import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

// Social share card shown on LinkedIn, WhatsApp, X, Slack, etc.
export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STACK = ["React", "TypeScript", "Next.js", "Node.js", "MySQL"];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#111113",
          color: "#ececee",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#a0a0a8" }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#22a06b" }} />
          Open to new opportunities
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, letterSpacing: -3 }}>{profile.name}</div>
          <div style={{ display: "flex", fontSize: 40, marginTop: 12, color: "#a0a0a8" }}>
            Frontend Developer · React & TypeScript · {profile.location}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, borderTop: "1px solid #2a2a2f", paddingTop: 36 }}>
          {STACK.map((s) => (
            <div
              key={s}
              style={{
                display: "flex",
                fontSize: 26,
                padding: "8px 20px",
                borderRadius: 8,
                border: "1px solid #2a2a2f",
                background: "#17171a",
                color: "#ececee",
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
