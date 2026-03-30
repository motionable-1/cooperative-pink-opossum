import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * "Scale your traffic on autopilot." — text reveals line by line on dark purple gradient.
 * Ref frames 112-150 (39 ref frames = ~59 output frames)
 *
 * Background: deep dark purple gradient (near-black top → dark violet bottom-left glow).
 * Subtle grain/noise texture throughout.
 *
 * Text progression:
 *   ref 113 (frame ~2):  "Scale your" appears — with 2 sparkles (upper-right, lower-left)
 *   ref 118 (frame ~9):  Sparkles start fading, only upper-right remains
 *   ref 123 (frame ~17): Sparkles gone, glow shifts to bottom-left
 *   ref 126 (frame ~21): "traffic on" appears below (2 lines now)
 *   ref 128 (frame ~24): "autopilot." appears (3rd line / appended to 2nd line)
 *   ref 133-149 (frame ~32-56): Full text holds "Scale your\ntraffic on autopilot."
 *   ref 150 (frame ~57): Fade to black
 *
 * Text: white, bold Inter 700, ~64-72px, centered.
 * Each new line enters with a subtle spring fade+scale.
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

// Text lines and their appearance frames
const LINES = [
  { text: "Scale your", appearFrame: 0 },
  { text: "traffic on autopilot.", appearFrame: 21 },
];

export const ScaleYourScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Sparkle visibility: fade out by frame ~17
  const sparkle1Opacity = interpolate(frame, [0, 3, 14, 18], [0, 0.85, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sparkle2Opacity = interpolate(frame, [0, 3, 10, 15], [0, 0.7, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sparkle1Rot = frame * 0.8;
  const sparkle2Rot = -frame * 0.6;

  // Purple glow: starts centered, shifts to bottom-left over time
  const glowX = interpolate(frame, [0, 30], [50, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowY = interpolate(frame, [0, 30], [50, 65], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowOpacity = interpolate(frame, [0, 10, 30], [0.4, 0.5, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade to black at the very end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 4, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Continuous subtle zoom
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backgroundColor: "#0A0A12",
      }}
    >
      {/* Purple gradient glow */}
      <div
        style={{
          position: "absolute",
          left: `${glowX}%`,
          top: `${glowY}%`,
          width: 700,
          height: 500,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(100, 40, 180, 0.4) 0%, rgba(80, 30, 150, 0.15) 40%, transparent 70%)",
          filter: "blur(60px)",
          opacity: glowOpacity,
        }}
      />

      {/* Sparkles (visible early, fade by frame ~17) */}
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
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          transform: `scale(${zoom})`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          {LINES.map((line, i) => {
            const lineFrame = frame - line.appearFrame;

            // Spring entrance for each line
            const prog = spring({
              frame: lineFrame,
              fps,
              config: { damping: 16, stiffness: 140, mass: 0.8 },
            });

            const lineOpacity = lineFrame < 0 ? 0 : interpolate(prog, [0, 1], [0, 1]);
            const lineY = lineFrame < 0 ? 15 : interpolate(prog, [0, 1], [15, 0]);
            const lineScale = lineFrame < 0 ? 0.92 : interpolate(prog, [0, 1], [0.92, 1]);

            return (
              <div
                key={i}
                style={{
                  fontFamily,
                  fontWeight: 700,
                  fontSize: 68,
                  color: "#FFFFFF",
                  letterSpacing: "-0.01em",
                  opacity: lineOpacity,
                  transform: `translateY(${lineY}px) scale(${lineScale})`,
                  whiteSpace: "nowrap",
                }}
              >
                {line.text}
              </div>
            );
          })}
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
