import React from "react";
import { useCurrentFrame, interpolate, Easing, Img } from "remotion";

const PURPLE = "#7C3AED";

/* Same integrations as IntegrationIconsScene - scatter away */
const INTEGRATIONS = [
  {
    name: "feather",
    label: "feather",
    iconUrl:
      "https://api.iconify.design/lucide/feather.svg?color=%23000000&width=28",
    startX: -320,
    startY: -155,
    exitX: -800,
    exitY: -400,
    rot: -6,
    delay: 0,
  },
  {
    name: "notion",
    label: "Notion",
    iconUrl:
      "https://api.iconify.design/simple-icons/notion.svg?color=%23000000&width=32",
    startX: 320,
    startY: -155,
    exitX: 800,
    exitY: -400,
    rot: 5,
    delay: 2,
  },
  {
    name: "wordpress",
    label: "WORDPRESS",
    iconUrl:
      "https://api.iconify.design/mdi/wordpress.svg?color=%23000000&width=30",
    startX: -370,
    startY: 30,
    exitX: -800,
    exitY: 200,
    rot: -4,
    delay: 1,
  },
  {
    name: "webflow",
    label: "Webflow",
    iconUrl:
      "https://api.iconify.design/simple-icons/webflow.svg?color=%23146EF5&width=24",
    startX: 370,
    startY: 30,
    exitX: 800,
    exitY: 400,
    rot: 4,
    delay: 3,
  },
  {
    name: "webhook",
    label: "Webhook",
    iconUrl:
      "https://api.iconify.design/material-symbols/webhook.svg?color=%23E53E3E&width=28",
    startX: 0,
    startY: 185,
    exitX: 0,
    exitY: 500,
    rot: 2,
    delay: 1,
  },
];

const TILE_W = 169;
const TILE_H = 72;

export const IconsScatterScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Text fades out first
  const textOp = interpolate(frame, [0, 8], [1, 0], {
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  // Icons scatter/blur out
  // After scatter, show purple crosshair marks in center

  // Crosshair marks appear
  const crossOp = interpolate(frame, [15, 22], [0, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
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
      {/* Center text fading out */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          zIndex: 1,
          opacity: textOp,
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

      {/* Scattering icon tiles */}
      {INTEGRATIONS.map((item) => {
        const scatterProgress = interpolate(
          frame,
          [item.delay, item.delay + 12],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.cubic),
          }
        );
        const x = interpolate(
          scatterProgress,
          [0, 1],
          [item.startX, item.exitX]
        );
        const y = interpolate(
          scatterProgress,
          [0, 1],
          [item.startY, item.exitY]
        );
        const tileOp = interpolate(scatterProgress, [0.5, 1], [1, 0], {
          extrapolateLeft: "clamp",
        });
        const tileScale = interpolate(
          scatterProgress,
          [0, 1],
          [1, 0.4]
        );

        return (
          <div
            key={item.name}
            style={{
              position: "absolute",
              top: `calc(50% + ${y}px)`,
              left: `calc(50% + ${x}px)`,
              width: TILE_W,
              height: TILE_H,
              borderRadius: 18,
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
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

      {/* Purple crosshair/corner marks */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: crossOp,
        }}
      >
        {/* 4 corner L-shaped marks */}
        {[
          { tx: -30, ty: -30, r: 0 },
          { tx: 30, ty: -30, r: 90 },
          { tx: 30, ty: 30, r: 180 },
          { tx: -30, ty: 30, r: 270 },
        ].map((mark, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: mark.ty,
              left: mark.tx,
              width: 12,
              height: 12,
              borderTop: `2px solid ${PURPLE}`,
              borderLeft: `2px solid ${PURPLE}`,
              transform: `rotate(${mark.r}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
