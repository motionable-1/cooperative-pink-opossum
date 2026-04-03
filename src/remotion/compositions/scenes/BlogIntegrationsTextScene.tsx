import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

const PURPLE = "#7C3AED";

export const BlogIntegrationsTextScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Line 1: "Auto-published" - appears first
  const line1Op = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const line1Y = interpolate(frame, [0, 8], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Line 2: "on your BLOG with" - appears second
  const line2Op = interpolate(frame, [6, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const line2Y = interpolate(frame, [6, 14], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Line 3: "easy integrations." - appears third
  const line3Op = interpolate(frame, [12, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const line3Y = interpolate(frame, [12, 20], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Radiating burst lines around text (appear after text)
  const burstOp = interpolate(frame, [18, 25], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const burstScale = interpolate(frame, [18, 30], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const BURST_ANGLES = [0, 60, 120, 180, 240, 300];
  const BURST_R_INNER = 160;
  const BURST_R_OUTER = 200;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Radiating purple burst lines */}
      <svg
        width={600}
        height={600}
        viewBox="-300 -300 600 600"
        style={{
          position: "absolute",
          opacity: burstOp,
          transform: `scale(${burstScale})`,
        }}
      >
        {BURST_ANGLES.map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = Math.cos(rad) * BURST_R_INNER;
          const y1 = Math.sin(rad) * BURST_R_INNER;
          const x2 = Math.cos(rad) * BURST_R_OUTER;
          const y2 = Math.sin(rad) * BURST_R_OUTER;
          return (
            <line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={PURPLE}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Text block */}
      <div
        style={{
          position: "relative",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        {/* Line 1 */}
        <div
          style={{
            fontFamily:
              "Inter, system-ui, -apple-system, sans-serif",
            fontSize: 62,
            fontWeight: 700,
            color: "#FFFFFF",
            opacity: line1Op,
            transform: `translateY(${line1Y}px)`,
            lineHeight: 1.15,
          }}
        >
          Auto-published
        </div>

        {/* Line 2 */}
        <div
          style={{
            fontFamily:
              "Inter, system-ui, -apple-system, sans-serif",
            fontSize: 62,
            fontWeight: 700,
            opacity: line2Op,
            transform: `translateY(${line2Y}px)`,
            lineHeight: 1.15,
          }}
        >
          <span style={{ color: "#FFFFFF" }}>on your </span>
          <span style={{ color: PURPLE }}>BLOG</span>
          <span style={{ color: "#FFFFFF" }}> with</span>
        </div>

        {/* Line 3 */}
        <div
          style={{
            fontFamily:
              "Inter, system-ui, -apple-system, sans-serif",
            fontSize: 62,
            fontWeight: 700,
            opacity: line3Op,
            transform: `translateY(${line3Y}px)`,
            lineHeight: 1.15,
          }}
        >
          <span style={{ color: "#FFFFFF" }}>easy </span>
          <span style={{ color: PURPLE }}>integrations.</span>
        </div>
      </div>
    </div>
  );
};
