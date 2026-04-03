import React from "react";
import { useCurrentFrame, interpolate, Easing, Img } from "remotion";

const PURPLE = "#7C3AED";

const TILE_W = 169;
const TILE_H = 72;

/*
 * Integration tiles arranged in a balanced halo around center text.
 * x/y offsets are from the CENTER of the viewport.
 * Each tile is centered on its (x, y) point via translate(-50%, -50%).
 *
 * Layout (roughly symmetric):
 *   feather (top-left)          Notion (top-right)
 *                  [ TEXT ]
 *   Webflow (bottom-left)   WORDPRESS (mid-right)
 *               Webhook (bottom-center-right)
 */
const INTEGRATIONS = [
  {
    name: "feather",
    label: "feather",
    iconUrl:
      "https://api.iconify.design/lucide/feather.svg?color=%23000000&width=28",
    x: -320,
    y: -155,
    rot: -6,
    delay: 0,
  },
  {
    name: "notion",
    label: "Notion",
    iconUrl:
      "https://api.iconify.design/simple-icons/notion.svg?color=%23000000&width=32",
    x: 320,
    y: -155,
    rot: 5,
    delay: 3,
  },
  {
    name: "wordpress",
    label: "WORDPRESS",
    iconUrl:
      "https://api.iconify.design/mdi/wordpress.svg?color=%23000000&width=30",
    x: -370,
    y: 30,
    rot: -4,
    delay: 6,
  },
  {
    name: "webflow",
    label: "Webflow",
    iconUrl:
      "https://api.iconify.design/simple-icons/webflow.svg?color=%23146EF5&width=24",
    x: 370,
    y: 30,
    rot: 4,
    delay: 9,
  },
  {
    name: "webhook",
    label: "Webhook",
    iconUrl:
      "https://api.iconify.design/material-symbols/webhook.svg?color=%23E53E3E&width=28",
    x: 0,
    y: 185,
    rot: 2,
    delay: 12,
  },
];

export const IntegrationIconsScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle purple glow behind text
  const glowOp = interpolate(frame, [0, 30], [0, 0.15], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      {/* Purple glow behind text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 500,
          height: 300,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse, ${PURPLE}${Math.round(glowOp * 255)
            .toString(16)
            .padStart(2, "0")} 0%, transparent 70%)`,
        }}
      />

      {/* Center text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
            fontSize: 62,
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.15,
          }}
        >
          Auto-published
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          <span style={{ color: "#FFFFFF" }}>on your </span>
          <span style={{ color: PURPLE }}>BLOG</span>
          <span style={{ color: "#FFFFFF" }}> with</span>
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          <span style={{ color: "#FFFFFF" }}>easy </span>
          <span style={{ color: PURPLE }}>integrations.</span>
        </div>
      </div>

      {/* Integration icon tiles — centered on their position */}
      {INTEGRATIONS.map((item) => {
        const progress = interpolate(
          frame,
          [item.delay, item.delay + 10],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.back(1.4)),
          }
        );
        const tileScale = interpolate(progress, [0, 1], [0.3, 1]);
        const tileOp = interpolate(progress, [0, 0.3], [0, 1], {
          extrapolateRight: "clamp",
        });

        // Subtle float
        const floatY =
          Math.sin((frame + item.delay * 10) * 0.08) * 4;
        const floatX =
          Math.cos((frame + item.delay * 7) * 0.06) * 3;

        return (
          <div
            key={item.name}
            style={{
              position: "absolute",
              top: `calc(50% + ${item.y + floatY}px)`,
              left: `calc(50% + ${item.x + floatX}px)`,
              width: TILE_W,
              height: TILE_H,
              borderRadius: 18,
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              /* Center the tile on its anchor point, then rotate + scale */
              transform: `translate(-50%, -50%) rotate(${item.rot}deg) scale(${tileScale})`,
              opacity: tileOp,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              zIndex: 2,
            }}
          >
            <Img
              src={item.iconUrl}
              style={{ width: 31, height: 31 }}
            />
            <span
              style={{
                fontFamily:
                  "Inter, system-ui, -apple-system, sans-serif",
                fontSize: 17,
                fontWeight: 600,
                color: "#000000",
              }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
