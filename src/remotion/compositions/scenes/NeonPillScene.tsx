import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

/**
 * Neon pill shape drawing on black background, no text inside.
 * Same pill dimensions and neon style as OutrankScene.
 * Neon line draws clockwise from bottom-left, ~45% drawn by end.
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

  const glowProgress = drawProgress / 2;
  const glowAngle = 180 + glowProgress * 360;
  const glowRad = (glowAngle * Math.PI) / 180;
  const glowCenterX = CX + Math.cos(glowRad) * (PILL_W * 0.32);
  const glowCenterY = CY + Math.sin(glowRad) * (PILL_H * 0.55);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      {/* Large diffuse magenta glow */}
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
          opacity: glowOpacity,
        }}
      />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="neonPillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06d6a0" />
            <stop offset="15%" stopColor="#22d3ee" />
            <stop offset="35%" stopColor="#c026d3" />
            <stop offset="55%" stopColor="#ec4899" />
            <stop offset="75%" stopColor="#c026d3" />
            <stop offset="90%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#06d6a0" />
          </linearGradient>
          <filter id="neonPillGlowHeavy">
            <feGaussianBlur stdDeviation="18" result="blur1" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="neonPillGlowMed">
            <feGaussianBlur stdDeviation="6" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="neonPillGlowCore">
            <feGaussianBlur stdDeviation="2" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Heavy outer glow */}
        <path
          d={getPillPath()}
          fill="none"
          stroke="url(#neonPillGrad)"
          strokeWidth={16}
          strokeDasharray={`${dashLen} ${dashGap}`}
          strokeLinecap="round"
          filter="url(#neonPillGlowHeavy)"
          opacity={0.5}
        />

        {/* Medium glow */}
        <path
          d={getPillPath()}
          fill="none"
          stroke="url(#neonPillGrad)"
          strokeWidth={6}
          strokeDasharray={`${dashLen} ${dashGap}`}
          strokeLinecap="round"
          filter="url(#neonPillGlowMed)"
          opacity={0.7}
        />

        {/* Thin hot-white core */}
        <path
          d={getPillPath()}
          fill="none"
          stroke="#fff"
          strokeWidth={1.5}
          strokeDasharray={`${dashLen} ${dashGap}`}
          strokeLinecap="round"
          filter="url(#neonPillGlowCore)"
          opacity={0.9}
        />
      </svg>
    </div>
  );
};
