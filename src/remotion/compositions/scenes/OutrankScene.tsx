import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["800"],
  subsets: ["latin"],
});

/**
 * "OUTRANK" in white bold text inside a LARGE neon pill on black bg.
 * Ref frames 079-108 (30 ref frames = ~45 output frames)
 *
 * Pill: ~81% frame width, ~39% height. Interior black (blends with bg).
 * Unlit edges are invisible — shape only defined by the lit neon segment.
 *
 * Neon border: very thin (1-2px core) lit segment (~55% of perimeter)
 * that ROTATES CLOCKWISE throughout the scene. Wide soft glow behind it.
 * Gradient: cyan (tail) → purple (middle) → magenta → orange (head).
 *
 * Background glow: diffuse purple/magenta that follows the lit segment.
 *
 * Text "OUTRANK": types letter by letter over first ~12 frames.
 * Latest letter appears gray (#6B7280) briefly before turning white.
 * Text stays visible the entire scene (no fade at end).
 *
 * ref 079: lit on left curve + partial bottom/top, ~3 letters visible
 * ref 085: lit shifted to left+top, ~6 letters
 * ref 090: lit top + partial right, full OUTRANK
 * ref 097: lit left + partial top (continued rotation)
 * ref 108: lit right side (end position)
 */

const W = 1280;
const H = 720;
const PILL_W = 1040;
const PILL_H = 280;
const PILL_R = PILL_H / 2;
const CX = W / 2;
const CY = H / 2;
const PILL_X = CX - PILL_W / 2;
const PILL_Y = CY - PILL_H / 2;

const LETTERS = "OUTRANK";

function getPillPath() {
  const l = PILL_X;
  const r = PILL_X + PILL_W;
  const t = PILL_Y;
  const b = PILL_Y + PILL_H;
  const rad = PILL_R;
  return [
    `M ${l + rad} ${b}`,
    `A ${rad} ${rad} 0 0 1 ${l} ${CY}`,
    `A ${rad} ${rad} 0 0 1 ${l + rad} ${t}`,
    `L ${r - rad} ${t}`,
    `A ${rad} ${rad} 0 0 1 ${r} ${CY}`,
    `A ${rad} ${rad} 0 0 1 ${r - rad} ${b}`,
    `L ${l + rad} ${b}`,
  ].join(" ");
}

export const OutrankScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Perimeter
  const straightLen = (PILL_W - 2 * PILL_R) * 2;
  const curveLen = 2 * Math.PI * PILL_R;
  const perimeter = straightLen + curveLen;

  // Lit segment: ~55% of perimeter
  const litLength = perimeter * 0.55;
  const gapLength = perimeter - litLength;

  // Rotating neon: dashoffset shifts the lit segment clockwise
  // Continue from where NeonPillScene left off (~45% drawn from bottom-left)
  // Over the scene, rotate ~1.2 full loops
  const startOffset = -perimeter * 0.15;
  const endOffset = startOffset - perimeter * 1.2;
  const dashOffset = interpolate(
    frame,
    [0, durationInFrames],
    [startOffset, endOffset],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Glow follows the center of the lit segment
  const rotationProgress = interpolate(
    frame,
    [0, durationInFrames],
    [0, 1.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const glowAngle = 225 + rotationProgress * 360;
  const glowRad = (glowAngle * Math.PI) / 180;
  const glowCenterX = CX + Math.cos(glowRad) * (PILL_W * 0.28);
  const glowCenterY = CY + Math.sin(glowRad) * (PILL_H * 0.35);

  // Text reveal: one letter at a time over ~12 frames
  const lettersVisible = Math.min(
    LETTERS.length,
    Math.floor(
      interpolate(frame, [2, 14], [0, LETTERS.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
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
      {/* Diffuse purple glow that follows the lit segment */}
      <div
        style={{
          position: "absolute",
          left: glowCenterX - 280,
          top: glowCenterY - 180,
          width: 560,
          height: 360,
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(180, 60, 230, 0.4) 0%, rgba(139, 92, 246, 0.15) 40%, transparent 75%)",
          filter: "blur(45px)",
        }}
      />

      {/* Neon pill border */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="outrankNeon" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="20%" stopColor="#EC4899" />
            <stop offset="45%" stopColor="#A855F7" />
            <stop offset="70%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <filter id="outrankGlow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Wide soft glow layer */}
        <path
          d={getPillPath()}
          fill="none"
          stroke="url(#outrankNeon)"
          strokeWidth={10}
          strokeDasharray={`${litLength} ${gapLength}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          filter="url(#outrankGlow)"
          opacity={0.4}
        />

        {/* Core thin neon line */}
        <path
          d={getPillPath()}
          fill="none"
          stroke="url(#outrankNeon)"
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
        }}
      >
        <div
          style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 72,
            letterSpacing: "0.08em",
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
                  color: isLatest ? "#6B7280" : "#FFFFFF",
                  opacity: isVisible ? 1 : 0,
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
