import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * "What if you could" — white text centered on solid medium purple background.
 * Two soft lighter-purple gradient "wing" shapes sweep in from left and right sides,
 * widest at the edges and tapering toward center, creating a subtle hourglass effect.
 * The text sits in the slightly darker central channel between the wings.
 * No dots, no particles, no SVG paths — pure CSS gradients.
 */
export const WhatIfScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Text fade in — quick
  const textOpacity = interpolate(frame, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Continuous slow zoom-in throughout scene
  const textScale = interpolate(frame, [0, durationInFrames], [0.96, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Wing shapes subtle breathing
  const wingBreath = interpolate(
    Math.sin((frame / fps) * 1.2),
    [-1, 1],
    [0.98, 1.02],
  );

  // Exit: hard cut (no fade)
  const exitOpacity = 1;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity: exitOpacity,
      }}
    >
      {/* Solid medium purple base */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#8B5CF6",
        }}
      />

      {/* Left wing gradient — lighter purple sweeping from left edge, tapering to center */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 55% 70% at 0% 50%, rgba(196, 181, 253, 0.5) 0%, rgba(196, 181, 253, 0.2) 50%, transparent 100%)",
          transform: `scaleX(${wingBreath})`,
          transformOrigin: "left center",
        }}
      />

      {/* Right wing gradient — mirrored from right edge */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 55% 70% at 100% 50%, rgba(196, 181, 253, 0.5) 0%, rgba(196, 181, 253, 0.2) 50%, transparent 100%)",
          transform: `scaleX(${wingBreath})`,
          transformOrigin: "right center",
        }}
      />

      {/* Center text */}
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
            fontSize: 52,
            color: "white",
            opacity: textOpacity,
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
