import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

/**
 * SEO Graph Scene — purple circle morphs into an upward-trend graph.
 *
 * Ref frames 059–120 (61 ref frames at 50ms = 3.05s ≈ 91 output frames at 30fps).
 *
 * Phases:
 *   Frames  0–22: Purple circle (3 rings) springs in at center-left
 *   Frames 14–45: Grid fades in, graph line draws, 6 nodes pop in one by one
 *   Frames 38–60: "21" badge (bottom-left) and "1200" badge (top-right) fade in
 *   Frames 42–72: "From no visit to high SEO traffic." fades in below
 *   Frames 55–91: Slow scale zoom-out (1 → 0.82)
 */

// Graph node positions in 1280×720 canvas
const NODES = [
  { x: 230, y: 460 }, // origin — bottom left
  { x: 350, y: 400 },
  { x: 470, y: 335 },
  { x: 575, y: 275 },
  { x: 680, y: 225 },
  { x: 790, y: 178 }, // top right
];

// Grid bounds
const GRID = { x1: 165, y1: 95, x2: 855, y2: 490, cols: 5, rows: 5 };

export const SEOGraphScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // === Phase 1: Circle springs in ===
  const circleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 140, mass: 0.9 } });
  const circleScale = interpolate(circleSpring, [0, 1], [0, 1]);
  const circleOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Circle center (origin node position)
  const cx = NODES[0].x;
  const cy = NODES[0].y;

  // === Phase 2: Grid fades in ===
  const gridOpacity = interpolate(frame, [14, 28], [0, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // === Phase 2: Graph nodes pop in one by one ===
  const nodeDelays = [14, 19, 24, 29, 34, 39]; // output frames each node appears
  const nodeScales = NODES.map((_, i) => {
    const s = spring({
      frame: frame - nodeDelays[i],
      fps,
      config: { damping: 12, stiffness: 200, mass: 0.6 },
    });
    return frame < nodeDelays[i] ? 0 : interpolate(s, [0, 1], [0, 1]);
  });

  // Line draw progress: each segment reveals after its start node
  const lineSegmentProgress = NODES.slice(1).map((_, i) => {
    return interpolate(frame, [nodeDelays[i] + 2, nodeDelays[i + 1] ?? nodeDelays[i] + 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  });

  // === Phase 3: Badges ===
  const badge21Opacity = interpolate(frame, [38, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badge1200Opacity = interpolate(frame, [43, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // === Phase 3: Bottom text ===
  const textOpacity = interpolate(frame, [42, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // === Phase 4: Slow zoom out ===
  const zoomOut = interpolate(frame, [55, durationInFrames], [1, 0.82], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Build SVG path for the line (partially drawn per segment)
  const buildLinePath = () => {
    let d = `M ${NODES[0].x} ${NODES[0].y}`;
    for (let i = 0; i < NODES.length - 1; i++) {
      const prog = lineSegmentProgress[i];
      const x = NODES[i].x + (NODES[i + 1].x - NODES[i].x) * prog;
      const y = NODES[i].y + (NODES[i + 1].y - NODES[i].y) * prog;
      d += ` L ${x} ${y}`;
    }
    return d;
  };

  // Grid lines
  const gridLines = [];
  const colStep = (GRID.x2 - GRID.x1) / GRID.cols;
  const rowStep = (GRID.y2 - GRID.y1) / GRID.rows;
  for (let c = 0; c <= GRID.cols; c++) {
    const x = GRID.x1 + c * colStep;
    gridLines.push(<line key={`v${c}`} x1={x} y1={GRID.y1} x2={x} y2={GRID.y2} stroke="#BBBBBB" strokeWidth="1" />);
  }
  for (let r = 0; r <= GRID.rows; r++) {
    const y = GRID.y1 + r * rowStep;
    gridLines.push(<line key={`h${r}`} x1={GRID.x1} y1={y} x2={GRID.x2} y2={y} stroke="#BBBBBB" strokeWidth="1" />);
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        fontFamily,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoomOut})`,
          transformOrigin: "50% 48%",
        }}
      >
        <svg
          width="1280"
          height="720"
          style={{ position: "absolute", inset: 0 }}
        >
          {/* Grid */}
          <g opacity={gridOpacity}>{gridLines}</g>

          {/* Graph line */}
          <path
            d={buildLinePath()}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Nodes */}
          {NODES.map((node, i) => {
            const s = nodeScales[i];
            const isOrigin = i === 0;
            return (
              <g key={i} transform={`translate(${node.x}, ${node.y}) scale(${s})`}>
                {/* Origin has dashed outer ring */}
                {isOrigin && (
                  <>
                    {/* Dashed outer ring */}
                    <circle
                      r={72}
                      fill="none"
                      stroke="#CCCCCC"
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                    />
                    {/* Light purple mid ring */}
                    <circle r={50} fill="#EDE9FE" />
                  </>
                )}
                {/* Inner dot — origin is bigger */}
                <circle
                  r={isOrigin ? 28 : i === NODES.length - 1 ? 14 : 12}
                  fill="#8B5CF6"
                />
                {/* Glow on last node */}
                {i === NODES.length - 1 && (
                  <circle r={24} fill="#C4B5FD" opacity={0.4} />
                )}
              </g>
            );
          })}

          {/* Badge "21" — bottom-left of origin node */}
          <g opacity={badge21Opacity} transform={`translate(${NODES[0].x - 18}, ${NODES[0].y + 42})`}>
            <rect x={0} y={0} width={44} height={24} rx={12} fill="#8B5CF6" />
            <text
              x={22}
              y={16}
              textAnchor="middle"
              fill="white"
              fontSize="13"
              fontWeight="700"
              fontFamily={fontFamily}
            >
              21
            </text>
          </g>

          {/* Badge "1200" — top-right of last node */}
          <g opacity={badge1200Opacity} transform={`translate(${NODES[5].x + 10}, ${NODES[5].y - 36})`}>
            <rect x={0} y={0} width={60} height={24} rx={12} fill="#8B5CF6" />
            <text
              x={30}
              y={16}
              textAnchor="middle"
              fill="white"
              fontSize="13"
              fontWeight="700"
              fontFamily={fontFamily}
            >
              1200
            </text>
          </g>

          {/* Phase 1 only: large circle rings before graph appears */}
          {frame < 18 && (
            <g transform={`translate(${cx}, ${cy}) scale(${circleScale})`} opacity={circleOpacity}>
              {/* Outer dashed */}
              <circle r={115} fill="none" stroke="#CCCCCC" strokeWidth="1.5" strokeDasharray="7 5" />
              {/* Mid lavender */}
              <circle r={88} fill="#EDE9FE" />
              {/* Inner purple */}
              <circle r={58} fill="#8B5CF6" />
            </g>
          )}
        </svg>

        {/* "From no visit to high SEO traffic." */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: textOpacity,
            fontWeight: 700,
            fontSize: 46,
            color: "#111111",
            letterSpacing: "-0.02em",
            fontFamily,
          }}
        >
          From no visit to high{" "}
          <span style={{ fontWeight: 400, color: "#555555" }}>SEO</span>{" "}
          traffic.
        </div>
      </div>
    </div>
  );
};
