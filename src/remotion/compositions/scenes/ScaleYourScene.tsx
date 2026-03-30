import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * "Scale your" in white bold text on purple gradient background.
 * Ref frame 113+ (beginning of new section)
 *
 * Background: deep indigo → bright violet gradient (top-right dark, bottom-left bright).
 * Two small white 4-pointed sparkle/star shapes in upper-right and lower-left.
 * Text: "Scale your" centered, white, bold.
 *
 * Text fades/scales in. Sparkles shimmer subtly.
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

  // Text spring entrance
  const textProg = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.8 },
  });
  const textOpacity = interpolate(textProg, [0, 1], [0, 1]);
  const textScale = interpolate(textProg, [0, 1], [0.85, 1]);
  const textY = interpolate(textProg, [0, 1], [20, 0]);

  // Continuous subtle zoom
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sparkle shimmer
  const sparkle1Opacity = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [0.4, 0.9]
  );
  const sparkle2Opacity = interpolate(
    Math.sin(frame * 0.15 + 2),
    [-1, 1],
    [0.3, 0.85]
  );
  const sparkle1Rot = frame * 0.8;
  const sparkle2Rot = -frame * 0.6;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #4C1D95 0%, #6D28D9 35%, #7C3AED 60%, #8B5CF6 100%)",
      }}
    >
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
          size={24}
          opacity={sparkle1Opacity}
          rotation={sparkle1Rot}
        />
        <Sparkle
          x={380}
          y={530}
          size={20}
          opacity={sparkle2Opacity}
          rotation={sparkle2Rot}
        />
      </svg>

      {/* Text */}
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
            color: "#FFFFFF",
            letterSpacing: "-0.01em",
            opacity: textOpacity,
            transform: `translateY(${textY}px) scale(${textScale * zoom})`,
          }}
        >
          Scale your
        </div>
      </div>
    </div>
  );
};
