import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["800"],
  subsets: ["latin"],
});

/**
 * "OUTRANK" in white bold text inside a neon pill on black bg.
 * Ref frames 079-108 (30 ref frames = ~45 output frames)
 *
 * Pill: ~58% frame width, ~18% frame height (thin horizontal).
 * Interior very dark gray (#0A0A0A), slightly lighter than pure black bg.
 * Unlit edges faintly visible on right side.
 *
 * Neon border: 1-2px core, ~55% lit segment rotating CLOCKWISE.
 * Colors along lit segment: cyan (tail) → magenta (middle/curve) → cyan (head tip).
 * The brightest part is magenta on the left curve.
 *
 * Diffuse purple glow follows the lit segment (strongest on left side).
 *
 * Text "OUTRANK" types quickly — all 7 letters visible by frame ~8.
 * Latest letter starts gray (#6B7280) then turns white.
 * Text stays full white throughout rest of scene.
 *
 * ref 086 (frame ~10 in scene): lit segment on left curve + partial top/bottom,
 *   all letters visible, "K" still gray.
 */

const W = 1280;
const H = 720;
const PILL_W = 740;
const PILL_H = 130;
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

  const straightLen = (PILL_W - 2 * PILL_R) * 2;
  const curveLen = 2 * Math.PI * PILL_R;
  const perimeter = straightLen + curveLen;

  // Lit segment: ~55% of perimeter
  const litLength = perimeter * 0.55;
  const gapLength = perimeter - litLength;

  // Rotating neon clockwise, ~1.2 full loops over scene
  const startOffset = -perimeter * 0.15;
  const endOffset = startOffset - perimeter * 1.2;
  const dashOffset = interpolate(
    frame,
    [0, durationInFrames],
    [startOffset, endOffset],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Glow follows lit segment center
  const rotationProgress = interpolate(
    frame,
    [0, durationInFrames],
    [0, 1.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const glowAngle = 225 + rotationProgress * 360;
  const glowRad = (glowAngle * Math.PI) / 180;
  const glowCenterX = CX + Math.cos(glowRad) * (PILL_W * 0.3);
  const glowCenterY = CY + Math.sin(glowRad) * (PILL_H * 0.6);

  // Text reveal: FAST — all 7 letters by frame ~8
  const lettersVisible = Math.min(
    LETTERS.length,
    Math.floor(
      interpolate(frame, [1, 8], [0, LETTERS.length], {
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
      {/* Diffuse purple glow following lit segment */}
      <div
        style={{
          position: "absolute",
          left: glowCenterX - 220,
          top: glowCenterY - 140,
          width: 440,
          height: 280,
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(180, 60, 230, 0.45) 0%, rgba(139, 92, 246, 0.15) 40%, transparent 75%)",
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
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft glow layer */}
        <path
          d={getPillPath()}
          fill="none"
          stroke="url(#outrankNeon)"
          strokeWidth={8}
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
          strokeWidth={1.5}
          strokeDasharray={`${litLength} ${gapLength}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Faint pill interior — very dark gray, slightly lighter than bg */}
      <div
        style={{
          position: "absolute",
          left: PILL_X,
          top: PILL_Y,
          width: PILL_W,
          height: PILL_H,
          borderRadius: PILL_R,
          backgroundColor: "rgba(255, 255, 255, 0.02)",
        }}
      />

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
            fontSize: 48,
            letterSpacing: "0.12em",
            display: "flex",
          }}
        >
          {LETTERS.split("").map((letter, i) => {
            const isVisible = i < lettersVisible;
            const isLatest = i === lettersVisible - 1 && frame < 10;
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
