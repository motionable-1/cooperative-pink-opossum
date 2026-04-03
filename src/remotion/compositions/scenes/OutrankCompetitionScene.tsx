import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

export const OutrankCompetitionScene: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Text entrance ── */
  const textOp = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const textScale = interpolate(frame, [0, 10], [0.85, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.3)),
  });

  /* ── Subtle float ── */
  const floatY = Math.sin(frame * 0.1) * 2;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          opacity: textOp,
          transform: `scale(${textScale}) translateY(${floatY}px)`,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
            fontSize: 68,
            fontWeight: 700,
            background: "linear-gradient(90deg, #C4B5FD, #7C3AED)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Outrank
        </span>
        <span
          style={{
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
            fontSize: 68,
            fontWeight: 700,
            color: "#FFFFFF",
          }}
        >
          {" "}the competition.
        </span>
      </div>
    </div>
  );
};
