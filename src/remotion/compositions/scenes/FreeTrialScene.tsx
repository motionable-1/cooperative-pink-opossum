import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

const PURPLE = "#7C3AED";

export const FreeTrialScene: React.FC = () => {
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

  /* ── "FREE" pop emphasis ── */
  const freeScale = interpolate(frame, [6, 14], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(2)),
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
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          fontSize: 64,
          fontWeight: 700,
          color: "#FFFFFF",
        }}
      >
        Start your{" "}
        <span
          style={{
            color: PURPLE,
            display: "inline-block",
            transform: `scale(${freeScale})`,
          }}
        >
          FREE
        </span>{" "}
        trial now.
      </div>
    </div>
  );
};
