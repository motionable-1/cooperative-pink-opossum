import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

/**
 * Neon pill shape drawing on black background, no text inside.
 * Ref frames 070-078 (9 ref frames = ~14 output frames)
 *
 * Pill: ~58% width, ~29% height — same as OutrankScene.
 * Neon line draws clockwise starting from bottom-left.
 * By end: ~40-50% outline drawn.
 * Line: 2px core, soft glow behind.
 * Gradient: orange (head) → magenta → cyan (tail).
 */

const W = 1280;
const H = 720;
const PILL_W = 740;   // ~58% width — matches OutrankScene
const PILL_H = 210;   // ~29% height — matches OutrankScene
const PILL_R = PILL_H / 2;
const CX = W / 2;
const CY = H / 2;
const PILL_X = CX - PILL_W / 2;
const PILL_Y = CY - PILL_H / 2;

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

export const NeonPillScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const straightLen = (PILL_W - 2 * PILL_R) * 2;
  const curveLen = 2 * Math.PI * PILL_R;
  const perimeter = straightLen + curveLen;

  // Draw progress: 0 → ~0.45 of perimeter
  const drawProgress = interpolate(frame, [0, durationInFrames], [0, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const dashLen = perimeter * drawProgress;
  const dashGap = perimeter - dashLen;

  const glowOpacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow tracks midpoint of drawn segment
  const glowProgress = drawProgress / 2;
  const glowAngle = 180 + glowProgress * 360;
  const glowRad = (glowAngle * Math.PI) / 180;
  const glowCenterX = CX + Math.cos(glowRad) * (PILL_W * 0.3);
  const glowCenterY = CY + Math.sin(glowRad) * (PILL_H * 0.5);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      {/* Diffuse purple glow behind lit segment */}
      <div
        style={{
          position: "absolute",
          left: glowCenterX - 280,
          top: glowCenterY - 180,
          width: 560,
          height: 360,
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(180, 60, 230, 0.5) 0%, rgba(139, 92, 246, 0.15) 50%, transparent 80%)",
          filter: "blur(50px)",
          opacity: glowOpacity,
        }}
      />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="neonPillGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="30%" stopColor="#EC4899" />
            <stop offset="60%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <filter id="neonPillGlow">
            <feGaussianBlur stdDeviation="8" result="blur" />
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
          stroke="url(#neonPillGrad)"
          strokeWidth={10}
          strokeDasharray={`${dashLen} ${dashGap}`}
          strokeLinecap="round"
          filter="url(#neonPillGlow)"
          opacity={0.4}
        />

        {/* Core thin neon line */}
        <path
          d={getPillPath()}
          fill="none"
          stroke="url(#neonPillGrad)"
          strokeWidth={2}
          strokeDasharray={`${dashLen} ${dashGap}`}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
