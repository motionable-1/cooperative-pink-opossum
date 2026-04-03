import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

export const OutrankDomainScene: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Entrance ── */
  const textOp = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const textScale = interpolate(frame, [0, 10], [0.9, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });

  /* ── Subtle pulse on hold ── */
  const pulse = 1 + Math.sin(frame * 0.06) * 0.008;
  const finalScale = textScale * pulse;

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
          transform: `scale(${finalScale})`,
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          fontSize: 72,
          fontWeight: 700,
          color: "#FFFFFF",
          letterSpacing: -1,
        }}
      >
        outrank.so
      </div>
    </div>
  );
};
