import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["800"],
  subsets: ["latin"],
});

/**
 * "OUTRANK" in white bold text inside a neon pill on black bg.
 * Ref frames 079-108
 *
 * Pill: ~58% width, ~29% height. Text fills ~45-50% of pill height.
 * Generous padding above/below text (~25% each side).
 * Black opaque fill inside pill.
 *
 * Neon border: thin 1.5px white-hot core + thick soft magenta/cyan glow.
 * Primary color: vibrant magenta/hot pink.
 * Tips: bright cyan.
 * ~55% lit segment rotating CLOCKWISE.
 * Massive soft diffuse glow behind lit portion.
 *
 * Text "OUTRANK" types quickly — all 7 letters visible by frame ~8.
 */

const W = 1280;
const H = 720;
const PILL_W = 740;
const PILL_H = 210;
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

  const litLength = perimeter * 0.55;
  const gapLength = perimeter - litLength;

  const startOffset = -perimeter * 0.15;
  const endOffset = startOffset - perimeter * 0.85;
  const dashOffset = interpolate(
    frame,
    [0, durationInFrames],
    [startOffset, endOffset],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const rotationProgress = interpolate(
    frame,
    [0, durationInFrames],
    [0, 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const glowAngle = 225 + rotationProgress * 360;
  const glowRad = (glowAngle * Math.PI) / 180;
  const glowCenterX = CX + Math.cos(glowRad) * (PILL_W * 0.32);
  const glowCenterY = CY + Math.sin(glowRad) * (PILL_H * 0.55);

  const lettersVisible = Math.min(
    LETTERS.length,
    Math.floor(
      interpolate(frame, [1, 8], [0, LETTERS.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );

  // Text: ~47% of pill height
  const fontSize = Math.round(PILL_H * 0.47);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      {/* Large diffuse magenta/purple glow following lit segment */}
      <div
        style={{
          position: "absolute",
          left: glowCenterX - 320,
          top: glowCenterY - 220,
          width: 640,
          height: 440,
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(236, 72, 153, 0.55) 0%, rgba(168, 85, 247, 0.25) 35%, rgba(139, 92, 246, 0.08) 60%, transparent 80%)",
          filter: "blur(60px)",
        }}
      />

      {/* Neon pill border */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <defs>
          {/* Rich magenta-dominant gradient with cyan tips */}
          <linearGradient id="outrankNeon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06d6a0" />
            <stop offset="15%" stopColor="#22d3ee" />
            <stop offset="35%" stopColor="#c026d3" />
            <stop offset="55%" stopColor="#ec4899" />
            <stop offset="75%" stopColor="#c026d3" />
            <stop offset="90%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#06d6a0" />
          </linearGradient>

          {/* Outer heavy glow */}
          <filter id="outrankGlowHeavy">
            <feGaussianBlur stdDeviation="18" result="blur1" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Medium glow */}
          <filter id="outrankGlowMed">
            <feGaussianBlur stdDeviation="6" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Inner core glow — hot white */}
          <filter id="outrankGlowCore">
            <feGaussianBlur stdDeviation="2" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Layer 1: Heavy outer glow — thick, soft, vibrant */}
        <path
          d={getPillPath()}
          fill="none"
          stroke="url(#outrankNeon)"
          strokeWidth={16}
          strokeDasharray={`${litLength} ${gapLength}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          filter="url(#outrankGlowHeavy)"
          opacity={0.5}
        />

        {/* Layer 2: Medium glow */}
        <path
          d={getPillPath()}
          fill="none"
          stroke="url(#outrankNeon)"
          strokeWidth={6}
          strokeDasharray={`${litLength} ${gapLength}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          filter="url(#outrankGlowMed)"
          opacity={0.7}
        />

        {/* Layer 3: Thin hot-white core */}
        <path
          d={getPillPath()}
          fill="none"
          stroke="#fff"
          strokeWidth={1.5}
          strokeDasharray={`${litLength} ${gapLength}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          filter="url(#outrankGlowCore)"
          opacity={0.9}
        />
      </svg>

      {/* Opaque black pill interior */}
      <div
        style={{
          position: "absolute",
          left: PILL_X + 2,
          top: PILL_Y + 2,
          width: PILL_W - 4,
          height: PILL_H - 4,
          borderRadius: PILL_R,
          backgroundColor: "#050505",
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
            fontSize,
            letterSpacing: "0.18em",
            display: "flex",
            lineHeight: 1,
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
