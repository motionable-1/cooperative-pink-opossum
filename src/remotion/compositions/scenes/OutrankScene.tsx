import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["800"],
  subsets: ["latin"],
});

/**
 * "OUTRANK" in white bold text inside a neon pill shape on black bg.
 * Ref frames 079-108 (30 ref frames = ~45 output frames)
 *
 * The pill shape has a neon-colored border (gradient: magenta → orange → cyan → blue → purple).
 * The neon glow ROTATES clockwise around the pill border throughout the scene.
 * Strong soft purple glow behind the pill.
 *
 * Text "OUTRANK" types in letter by letter in the first ~8 frames,
 * then holds. The last letter revealed may briefly appear gray before turning white.
 *
 * After the text is done, the scene continues with the rotating neon glow.
 * Near the end (frames 109-111), text fades and only outline remains.
 */

const W = 1280;
const H = 720;
const PILL_W = 520;
const PILL_H = 72;
const PILL_R = PILL_H / 2;
const PILL_X = (W - PILL_W) / 2;
const PILL_Y = (H - PILL_H) / 2;

const LETTERS = "OUTRANK";

function getPillPath() {
  const l = PILL_X;
  const r = PILL_X + PILL_W;
  const t = PILL_Y;
  const b = PILL_Y + PILL_H;
  const rad = PILL_R;
  return `
    M ${l + rad} ${b}
    A ${rad} ${rad} 0 0 1 ${l} ${t + rad}
    A ${rad} ${rad} 0 0 1 ${l + rad} ${t}
    L ${r - rad} ${t}
    A ${rad} ${rad} 0 0 1 ${r} ${t + rad}
    A ${rad} ${rad} 0 0 1 ${r - rad} ${b}
    Z
  `;
}

export const OutrankScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Approximate perimeter
  const perimeter = 2 * Math.PI * PILL_R + 2 * (PILL_W - 2 * PILL_R);

  // Rotating glow: the "lit" segment (~40% of perimeter) rotates clockwise
  // We use dashoffset to animate the position of the lit segment
  const litLength = perimeter * 0.4;
  const gapLength = perimeter - litLength;

  // Rotation: offset shifts from 0 to -perimeter over the scene (clockwise)
  const dashOffset = interpolate(
    frame,
    [0, durationInFrames],
    [0, -perimeter * 1.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Glow bloom follows the neon position
  // Map dashOffset to approximate angle for glow positioning
  const glowAngle = interpolate(
    frame,
    [0, durationInFrames],
    [200, 200 + 540],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const glowRad = (glowAngle * Math.PI) / 180;
  const glowX = 50 + Math.cos(glowRad) * 30;
  const glowY = 50 + Math.sin(glowRad) * 20;

  // Text reveal: letters appear one by one
  const lettersVisible = Math.min(
    LETTERS.length,
    Math.floor(
      interpolate(frame, [2, 14], [0, LETTERS.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );

  // Exit: text fades near end
  const textOpacity = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      {/* Rotating purple glow behind pill */}
      <div
        style={{
          position: "absolute",
          left: `${glowX}%`,
          top: `${glowY}%`,
          width: 400,
          height: 200,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(168, 85, 247, 0.5) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 80%)",
          filter: "blur(40px)",
        }}
      />

      {/* Neon pill border */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="outrankNeonGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="20%" stopColor="#EC4899" />
            <stop offset="40%" stopColor="#A855F7" />
            <stop offset="60%" stopColor="#06B6D4" />
            <stop offset="80%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <filter id="outrankGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer glow layer */}
        <path
          d={getPillPath()}
          fill="none"
          stroke="url(#outrankNeonGrad)"
          strokeWidth={8}
          strokeDasharray={`${litLength} ${gapLength}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          filter="url(#outrankGlow)"
          opacity={0.5}
        />

        {/* Core neon line */}
        <path
          d={getPillPath()}
          fill="none"
          stroke="url(#outrankNeonGrad)"
          strokeWidth={2}
          strokeDasharray={`${litLength} ${gapLength}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>

      {/* "OUTRANK" text centered in pill */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: textOpacity,
        }}
      >
        <div
          style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 42,
            letterSpacing: "0.05em",
            display: "flex",
          }}
        >
          {LETTERS.split("").map((letter, i) => {
            const isVisible = i < lettersVisible;
            const isLatest = i === lettersVisible - 1 && frame < 16;
            return (
              <span
                key={i}
                style={{
                  color: isLatest ? "#9CA3AF" : "#FFFFFF",
                  opacity: isVisible ? 1 : 0,
                  transition: "none",
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
