import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * "Getting traffic" centered white text on black bg.
 * Purple glowing line graph passes BEHIND the text.
 * Graph: starts bottom-left, small peak, valley, big peak, dips under text,
 *   rises to peak3, dip, then shoots up to top-right corner.
 * Two white glowing nodes on peak1 and peak3.
 * Purple glow from top edge fading to black by ~40% down.
 * Light streak/flare from top-right corner merging into ascending line.
 */

const W = 1280;
const H = 720;

// Graph path points (x%, y% from top-left)
// Matches reference: bottom-left → peak1 → valley → peak2 → dip under text → peak3 → dip → shoot up to top-right
const GRAPH_POINTS = [
  { x: 0, y: 0.85 },     // Start: bottom-left edge
  { x: 0.08, y: 0.72 },  // Peak 1 (small, node here)
  { x: 0.14, y: 0.85 },  // Valley 1 (drops back down)
  { x: 0.31, y: 0.40 },  // Peak 2 (big rise)
  { x: 0.45, y: 0.62 },  // Valley 2 (dips under text center)
  { x: 0.65, y: 0.31 },  // Peak 3 (node here)
  { x: 0.74, y: 0.42 },  // Valley 3 (shallow dip)
  { x: 0.93, y: 0.0 },   // Exit: shoots up to top-right edge
];

const buildSmoothPath = (points: { x: number; y: number }[]) => {
  if (points.length < 2) return "";
  const sx = (x: number) => x * W;
  const sy = (y: number) => y * H;

  let d = `M ${sx(points[0].x)} ${sy(points[0].y)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    // Smooth bezier: control points at midpoint x, matching prev/curr y
    const cpx = sx(prev.x + (curr.x - prev.x) * 0.5);
    d += ` C ${cpx} ${sy(prev.y)}, ${cpx} ${sy(curr.y)}, ${sx(curr.x)} ${sy(curr.y)}`;
  }
  return d;
};

const GRAPH_PATH = buildSmoothPath(GRAPH_POINTS);

// Node positions (on peak1 and peak3)
const NODE_1 = { x: 0.08 * W, y: 0.72 * H };
const NODE_2 = { x: 0.65 * W, y: 0.31 * H };

const AnimatedGraph: React.FC<{ progress: number }> = ({ progress }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.8 + Math.sin((frame / fps) * 3) * 0.2;

  const dashOffset = interpolate(progress, [0, 1], [5000, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const node1Opacity = interpolate(progress, [0.05, 0.15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const node2Opacity = interpolate(progress, [0.55, 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6B21A8" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#A855F7" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#C084FC" stopOpacity="0.9" />
        </linearGradient>
        <filter id="bigGlow">
          <feGaussianBlur stdDeviation="30" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="medGlow">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="nodeGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Thick outer purple glow band (~12-15% frame height feel) */}
      <path
        d={GRAPH_PATH}
        fill="none"
        stroke="#7C3AED"
        strokeWidth="80"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.12}
        filter="url(#bigGlow)"
        strokeDasharray="5000"
        strokeDashoffset={dashOffset}
      />

      {/* Medium glow band */}
      <path
        d={GRAPH_PATH}
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="30"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.25}
        filter="url(#medGlow)"
        strokeDasharray="5000"
        strokeDashoffset={dashOffset}
      />

      {/* Core bright line */}
      <path
        d={GRAPH_PATH}
        fill="none"
        stroke="url(#lineGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#medGlow)"
        strokeDasharray="5000"
        strokeDashoffset={dashOffset}
      />

      {/* Inner bright core */}
      <path
        d={GRAPH_PATH}
        fill="none"
        stroke="#DDD6FE"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="5000"
        strokeDashoffset={dashOffset}
      />

      {/* Node 1 - Peak 1 (small peak, left side) */}
      <g opacity={node1Opacity}>
        <circle
          cx={NODE_1.x}
          cy={NODE_1.y}
          r={14 * pulse}
          fill="#A855F7"
          opacity={0.35}
          filter="url(#nodeGlow)"
        />
        <circle cx={NODE_1.x} cy={NODE_1.y} r={7} fill="white" />
        <circle cx={NODE_1.x} cy={NODE_1.y} r={4} fill="white" opacity={0.9} />
      </g>

      {/* Node 2 - Peak 3 (upper right) */}
      <g opacity={node2Opacity}>
        <circle
          cx={NODE_2.x}
          cy={NODE_2.y}
          r={14 * pulse}
          fill="#A855F7"
          opacity={0.35}
          filter="url(#nodeGlow)"
        />
        <circle cx={NODE_2.x} cy={NODE_2.y} r={7} fill="white" />
        <circle cx={NODE_2.x} cy={NODE_2.y} r={4} fill="white" opacity={0.9} />
      </g>
    </svg>
  );
};

export const GettingTrafficScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Text fade in
  const textOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Continuous slow zoom-in on text
  const textScale = interpolate(frame, [0, durationInFrames], [0.95, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Text glow pulse
  const textGlow = interpolate(
    Math.sin((frame / fps) * 2),
    [-1, 1],
    [0, 8],
  );

  // Graph draw progress
  const graphProgress = interpolate(frame, [3, durationInFrames - 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Purple glow at top
  const gradientOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      {/* Purple glow from top edge — fades to black by ~40% down */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "45%",
          background:
            "linear-gradient(180deg, rgba(100, 40, 160, 0.5) 0%, rgba(80, 20, 140, 0.25) 30%, transparent 100%)",
          opacity: gradientOpacity,
        }}
      />

      {/* Light streak from top-right corner */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "50%",
          height: "50%",
          background:
            "radial-gradient(ellipse 80% 60% at 90% 10%, rgba(139, 92, 246, 0.3) 0%, rgba(124, 58, 237, 0.1) 40%, transparent 70%)",
          opacity: gradientOpacity,
        }}
      />

      {/* Animated graph — behind text */}
      <AnimatedGraph progress={graphProgress} />

      {/* Center text — IN FRONT of graph */}
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
            color: "white",
            opacity: textOpacity,
            transform: `scale(${textScale})`,
            textShadow: `0 0 ${textGlow}px rgba(168, 85, 247, 0.4), 0 0 ${textGlow * 2}px rgba(168, 85, 247, 0.2)`,
            letterSpacing: "-0.02em",
          }}
        >
          Getting traffic
        </div>
      </div>
    </div>
  );
};
