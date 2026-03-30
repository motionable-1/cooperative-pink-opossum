import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["600"],
  subsets: ["latin"],
});

/**
 * "What if you could" - white text centered on deep purple background
 * with symmetrical abstract curved wing/wave shapes in lighter purple.
 */
export const WhatIfScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Text entry with spring
  const textScale = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 160, mass: 0.8 },
  });

  const textOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle text glow pulse
  const glowPulse = interpolate(
    Math.sin((frame / fps) * 2.5),
    [-1, 1],
    [4, 12],
  );

  // Wing shapes subtle breathing animation
  const wingBreath = interpolate(
    Math.sin((frame / fps) * 1.5),
    [-1, 1],
    [0.97, 1.03],
  );

  // Exit: fade to black
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.quad),
    },
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity: exitOpacity,
      }}
    >
      {/* Deep purple background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, #7C3AED 0%, #6D28D9 25%, #5B21B6 50%, #4C1D95 80%, #3B0764 100%)",
        }}
      />

      {/* Abstract wing/wave shapes */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${wingBreath})`,
        }}
      >
        <svg
          viewBox="0 0 1280 720"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Outer wing pair - large sweeping curves */}
          <path
            d="M 640 360 Q 350 140 40 240 Q 180 360 40 480 Q 350 580 640 360"
            fill="rgba(139, 92, 246, 0.25)"
          />
          <path
            d="M 640 360 Q 930 140 1240 240 Q 1100 360 1240 480 Q 930 580 640 360"
            fill="rgba(139, 92, 246, 0.25)"
          />

          {/* Middle wing pair */}
          <path
            d="M 640 360 Q 420 200 120 290 Q 240 360 120 430 Q 420 520 640 360"
            fill="rgba(167, 139, 250, 0.2)"
          />
          <path
            d="M 640 360 Q 860 200 1160 290 Q 1040 360 1160 430 Q 860 520 640 360"
            fill="rgba(167, 139, 250, 0.2)"
          />

          {/* Inner wing pair - tighter */}
          <path
            d="M 640 360 Q 500 260 250 320 Q 350 360 250 400 Q 500 460 640 360"
            fill="rgba(196, 181, 253, 0.15)"
          />
          <path
            d="M 640 360 Q 780 260 1030 320 Q 930 360 1030 400 Q 780 460 640 360"
            fill="rgba(196, 181, 253, 0.15)"
          />

          {/* Top and bottom arcs */}
          <path
            d="M 200 60 Q 640 180 1080 60 Q 640 280 200 60"
            fill="rgba(196, 181, 253, 0.1)"
          />
          <path
            d="M 200 660 Q 640 540 1080 660 Q 640 440 200 660"
            fill="rgba(196, 181, 253, 0.1)"
          />
        </svg>
      </div>

      {/* Center text: "What if you could" */}
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
            fontWeight: 600,
            fontSize: 52,
            color: "white",
            opacity: textOpacity,
            transform: `scale(${textScale})`,
            textShadow: `0 0 ${glowPulse}px rgba(255, 255, 255, 0.3), 0 0 ${glowPulse * 2}px rgba(167, 139, 250, 0.2)`,
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
