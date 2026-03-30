import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

/**
 * Neon pill shape drawing on black background, no text inside.
 * Ref frames 070-078 (9 ref frames = ~14 output frames)
 *
 * A pill/capsule shape (rounded rectangle) draws itself with a neon-colored
 * stroke that has a gradient: orange → magenta → cyan/blue.
 * Strong magenta/purple glow emanates from behind the shape.
 *
 * The line starts drawing from the bottom-left, traces the left curve,
 * goes along the top, and partially down the right side.
 * By the end, roughly 60-70% of the outline is drawn.
 *
 * Interior is black (matches background).
 * Some frames show faint interior elements (magnifying glass icon hint).
 */

const W = 1280;
const H = 720;
const PILL_W = 520;
const PILL_H = 72;
const PILL_R = PILL_H / 2; // 36 — full rounding
const PILL_X = (W - PILL_W) / 2;
const PILL_Y = (H - PILL_H) / 2;

// Build the pill path clockwise from bottom-center
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

export const NeonPillScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Draw progress 0 → 0.7 (not full outline)
  const drawProgress = interpolate(frame, [0, durationInFrames], [0, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Glow intensity ramps up
  const glowOpacity = interpolate(frame, [0, 6], [0, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Approximate perimeter of the pill
  const perimeter = 2 * Math.PI * PILL_R + 2 * (PILL_W - 2 * PILL_R);
  const dashLen = perimeter * drawProgress;
  const dashGap = perimeter - dashLen;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      {/* Purple/magenta glow behind the pill */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 600,
          height: 200,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(ellipse 100% 100% at 30% 50%, rgba(180, 60, 230, 0.5) 0%, rgba(168, 85, 247, 0.2) 40%, transparent 70%)",
          filter: "blur(30px)",
          opacity: glowOpacity,
        }}
      />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <defs>
          {/* Neon gradient: orange → magenta → cyan */}
          <linearGradient id="neonGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="30%" stopColor="#EC4899" />
            <stop offset="60%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow layer */}
        <path
          d={getPillPath()}
          fill="none"
          stroke="url(#neonGrad)"
          strokeWidth={6}
          strokeDasharray={`${dashLen} ${dashGap}`}
          strokeLinecap="round"
          filter="url(#neonGlow)"
          opacity={0.6}
        />

        {/* Core neon line */}
        <path
          d={getPillPath()}
          fill="none"
          stroke="url(#neonGrad)"
          strokeWidth={2.5}
          strokeDasharray={`${dashLen} ${dashGap}`}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
