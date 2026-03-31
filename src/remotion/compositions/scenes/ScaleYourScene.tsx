import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * "Scale your" + "traffic on autopilot." scene on purple gradient.
 *
 * Animation flow:
 * - Frames 0-8:   "Scale your" springs in
 * - Frames 10-18: "traffic on autopilot." fades in below
 * - Frames 18-22: Both visible, hold
 * - Frames 22-26: "Scale your" slides up and fades out
 * - Frames 22-30: Gradient darkens to near-black
 * - Frames 26-42: "traffic on autopilot." re-centers vertically, holds on dark bg
 * - Frames 38-42: Fade to black
 */

/** 4-pointed sparkle star */
const Sparkle: React.FC<{
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
}> = ({ x, y, size, opacity, rotation }) => {
  const half = size / 2;
  const points = `
    ${x},${y - half}
    ${x + half * 0.2},${y - half * 0.2}
    ${x + half},${y}
    ${x + half * 0.2},${y + half * 0.2}
    ${x},${y + half}
    ${x - half * 0.2},${y + half * 0.2}
    ${x - half},${y}
    ${x - half * 0.2},${y - half * 0.2}
  `;
  return (
    <polygon
      points={points}
      fill="white"
      opacity={opacity}
      transform={`rotate(${rotation}, ${x}, ${y})`}
    />
  );
};

export const ScaleYourScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // === "Scale your" entrance (spring) ===
  const scaleYourEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.8 },
  });
  const scaleYourEntranceOpacity = interpolate(scaleYourEntrance, [0, 1], [0, 1]);
  const scaleYourEntranceScale = interpolate(scaleYourEntrance, [0, 1], [0.85, 1]);
  const scaleYourEntranceY = interpolate(scaleYourEntrance, [0, 1], [20, 0]);

  // === "Scale your" EXIT (slides up + fades out) at frame 22-26 ===
  const scaleYourExitProgress = interpolate(frame, [22, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const scaleYourExitY = interpolate(scaleYourExitProgress, [0, 1], [0, -80]);
  const scaleYourExitOpacity = interpolate(scaleYourExitProgress, [0, 1], [1, 0]);

  // Combined "Scale your" transforms
  const scaleYourOpacity = scaleYourEntranceOpacity * scaleYourExitOpacity;
  const scaleYourY = scaleYourEntranceY + scaleYourExitY;
  const scaleYourScale = scaleYourEntranceScale;

  // === "traffic on autopilot." entrance (fade in at frame 10-18) ===
  const trafficEntrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });
  const trafficOpacity = frame < 10 ? 0 : interpolate(trafficEntrance, [0, 1], [0, 1]);
  const trafficEntranceY = frame < 10 ? 30 : interpolate(trafficEntrance, [0, 1], [30, 0]);

  // "traffic on autopilot." re-centers after "Scale your" exits
  const trafficBaseY = interpolate(frame, [22, 30], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const trafficY = trafficEntranceY + trafficBaseY;

  // === Gradient darkening (frame 22-30) ===
  const gradientDarken = interpolate(frame, [22, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // === Sparkle fade (disappear as gradient darkens) ===
  const sparkleFade = interpolate(frame, [22, 28], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sparkle shimmer
  const sparkle1Opacity =
    interpolate(Math.sin(frame * 0.15), [-1, 1], [0.4, 0.9]) * sparkleFade;
  const sparkle2Opacity =
    interpolate(Math.sin(frame * 0.15 + 2), [-1, 1], [0.3, 0.85]) * sparkleFade;
  const sparkle1Rot = frame * 0.8;
  const sparkle2Rot = -frame * 0.6;

  // === Fade to black at end ===
  const fadeOut = interpolate(frame, [durationInFrames - 4, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Build gradients
  const purpleGradient =
    "linear-gradient(135deg, #4C1D95 0%, #6D28D9 35%, #7C3AED 60%, #8B5CF6 100%)";
  const darkGradient =
    "linear-gradient(135deg, #0a0a1a 0%, #12112a 35%, #15132e 60%, #1a1735 100%)";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      {/* Purple gradient layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: purpleGradient,
          opacity: 1 - gradientDarken,
        }}
      />
      {/* Dark gradient layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: darkGradient,
          opacity: gradientDarken,
        }}
      />

      {/* Sparkles */}
      <svg
        viewBox="0 0 1280 720"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 5,
        }}
      >
        <Sparkle
          x={920}
          y={180}
          size={22}
          opacity={sparkle1Opacity}
          rotation={sparkle1Rot}
        />
        <Sparkle
          x={380}
          y={530}
          size={18}
          opacity={sparkle2Opacity}
          rotation={sparkle2Rot}
        />
      </svg>

      {/* Text container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        {/* "Scale your" */}
        <div
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 68,
            color: "#FFFFFF",
            letterSpacing: "-0.01em",
            opacity: scaleYourOpacity,
            transform: `translateY(${scaleYourY}px) scale(${scaleYourScale})`,
            marginBottom: 8,
            whiteSpace: "nowrap",
          }}
        >
          Scale your
        </div>

        {/* "traffic on autopilot." */}
        <div
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 68,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            opacity: trafficOpacity,
            transform: `translateY(${trafficY}px)`,
            whiteSpace: "nowrap",
          }}
        >
          traffic on autopilot.
        </div>
      </div>

      {/* Fade to black overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#000000",
          opacity: fadeOut,
          zIndex: 20,
        }}
      />
    </div>
  );
};
