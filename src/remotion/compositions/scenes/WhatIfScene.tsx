import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * "What if you could" — HOLD portion after morph completes.
 * Text is already visible, wings already present.
 * Just continuous slow zoom and subtle wing breathing.
 * Solid purple base with lighter wing gradients from left/right.
 */
export const WhatIfScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Continuous slow zoom
  const textScale = interpolate(frame, [0, durationInFrames], [1.02, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Wing breathing
  const wingBreath = interpolate(
    Math.sin((frame / fps) * 1.2),
    [-1, 1],
    [0.98, 1.02],
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      {/* Solid purple base */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#8B5CF6",
        }}
      />

      {/* Left wing gradient — visible lighter purple sweeping from left */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(216, 200, 255, 0.7) 0%, rgba(196, 181, 253, 0.4) 40%, transparent 80%)",
          transform: `scaleX(${wingBreath})`,
          transformOrigin: "left center",
        }}
      />

      {/* Right wing gradient — mirrored */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(216, 200, 255, 0.7) 0%, rgba(196, 181, 253, 0.4) 40%, transparent 80%)",
          transform: `scaleX(${wingBreath})`,
          transformOrigin: "right center",
        }}
      />

      {/* Center text — already fully visible */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 72,
            color: "white",
            transform: `scale(${textScale})`,
            letterSpacing: "-0.01em",
            textAlign: "center",
          }}
        >
          What if you could
        </div>
      </div>
    </div>
  );
};
