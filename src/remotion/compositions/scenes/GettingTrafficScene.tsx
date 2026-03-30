import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * Animated purple line graph with two glowing nodes.
 * The graph draws from bottom-left to top-right over time.
 */
const AnimatedGraph: React.FC<{ progress: number }> = ({ progress }) => {
  // Define the graph path points (normalized 0-1 coordinates)
  // The graph goes: start low-left, small peak, dip, big peak, dip, higher peak, dip, shoot up
  const points = [
    { x: 0, y: 0.85 },
    { x: 0.08, y: 0.62 },
    { x: 0.14, y: 0.78 },
    { x: 0.22, y: 0.42 },
    { x: 0.35, y: 0.55 },
    { x: 0.48, y: 0.38 },
    { x: 0.58, y: 0.52 },
    { x: 0.68, y: 0.3 },
    { x: 0.76, y: 0.45 },
    { x: 0.85, y: 0.2 },
    { x: 0.92, y: 0.35 },
    { x: 1.0, y: 0.05 },
  ];

  const width = 1280;
  const height = 720;
  const padding = 40;

  const toScreenX = (x: number) => padding + x * (width - padding * 2);
  const toScreenY = (y: number) => padding + y * (height - padding * 2);

  // Build the SVG path
  const buildPath = () => {
    if (points.length < 2) return "";
    let d = `M ${toScreenX(points[0].x)} ${toScreenY(points[0].y)}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx1 = toScreenX(prev.x + (curr.x - prev.x) * 0.5);
      const cpy1 = toScreenY(prev.y);
      const cpx2 = toScreenX(prev.x + (curr.x - prev.x) * 0.5);
      const cpy2 = toScreenY(curr.y);
      d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${toScreenX(curr.x)} ${toScreenY(curr.y)}`;
    }
    return d;
  };

  const pathD = buildPath();

  // Node 1 position: first small peak
  const node1 = { x: toScreenX(0.08), y: toScreenY(0.62) };
  // Node 2 position: highest peak
  const node2 = { x: toScreenX(0.68), y: toScreenY(0.3) };

  const node1Opacity = interpolate(progress, [0.05, 0.15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const node2Opacity = interpolate(progress, [0.5, 0.65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow pulse for nodes
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.8 + Math.sin((frame / fps) * 3) * 0.2;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6B21A8" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#A855F7" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C084FC" stopOpacity="0.8" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="bigGlow">
          <feGaussianBlur stdDeviation="20" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="nodeGlow">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Thick outer glow band */}
      <path
        d={pathD}
        fill="none"
        stroke="#7C3AED"
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.15}
        filter="url(#bigGlow)"
        strokeDasharray="5000"
        strokeDashoffset={interpolate(progress, [0, 1], [5000, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />

      {/* Medium glow band */}
      <path
        d={pathD}
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.3}
        filter="url(#glow)"
        strokeDasharray="5000"
        strokeDashoffset={interpolate(progress, [0, 1], [5000, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />

      {/* Core bright line */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#lineGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
        strokeDasharray="5000"
        strokeDashoffset={interpolate(progress, [0, 1], [5000, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />

      {/* Bright inner core */}
      <path
        d={pathD}
        fill="none"
        stroke="#DDD6FE"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="5000"
        strokeDashoffset={interpolate(progress, [0, 1], [5000, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />

      {/* Node 1 - first peak */}
      <g opacity={node1Opacity}>
        <circle
          cx={node1.x}
          cy={node1.y}
          r={12 * pulse}
          fill="#A855F7"
          opacity={0.3}
          filter="url(#nodeGlow)"
        />
        <circle cx={node1.x} cy={node1.y} r={6} fill="white" />
        <circle
          cx={node1.x}
          cy={node1.y}
          r={4}
          fill="white"
          opacity={0.8}
        />
      </g>

      {/* Node 2 - highest peak */}
      <g opacity={node2Opacity}>
        <circle
          cx={node2.x}
          cy={node2.y}
          r={12 * pulse}
          fill="#A855F7"
          opacity={0.3}
          filter="url(#nodeGlow)"
        />
        <circle cx={node2.x} cy={node2.y} r={6} fill="white" />
        <circle
          cx={node2.x}
          cy={node2.y}
          r={4}
          fill="white"
          opacity={0.8}
        />
      </g>
    </svg>
  );
};

export const GettingTrafficScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Text fade in (faster for shorter scene)
  const textOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Continuous slow zoom-in on text throughout scene
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

  // Graph draw progress (starts after text appears, draws over most of the scene)
  const graphProgress = interpolate(frame, [3, durationInFrames - 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Purple gradient at top - fades in
  const gradientOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit: hard cut (no fade to avoid grey bleed)
  const exitOpacity = 1;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        overflow: "hidden",
        opacity: exitOpacity,
      }}
    >
      {/* Purple gradient at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "25%",
          background:
            "linear-gradient(180deg, rgba(88, 28, 135, 0.6) 0%, rgba(88, 28, 135, 0.2) 40%, transparent 100%)",
          opacity: gradientOpacity,
        }}
      />

      {/* Animated graph line behind text */}
      <AnimatedGraph progress={graphProgress} />

      {/* Center text */}
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
