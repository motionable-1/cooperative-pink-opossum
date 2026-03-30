import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * "spot" in white lowercase centered on black background.
 * 4 hand-drawn purple arrows from near-corners pointing inward toward text.
 * Text is large (~45-50% of frame width), instantly visible.
 * Arrows animate in with spring-based stagger (draw-in from corners).
 */

/** Hand-drawn arrow that animates in via spring */
const HandDrawnArrow: React.FC<{
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  delay: number;
  fps: number;
  frame: number;
  seed: number;
}> = ({ fromX, fromY, toX, toY, delay, fps, frame, seed }) => {
  // Spring-based draw-in
  const drawProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
  });

  const opacity = interpolate(frame, [delay, delay + 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Current tip position (arrow draws from corner toward text)
  const tipX = fromX + (toX - fromX) * drawProgress;
  const tipY = fromY + (toY - fromY) * drawProgress;

  // Arrow angle (always points toward final target)
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const headLen = 20;
  const headAngle = 0.45;

  // Open chevron arrowhead
  const head1X = tipX - headLen * Math.cos(angle - headAngle);
  const head1Y = tipY - headLen * Math.sin(angle - headAngle);
  const head2X = tipX - headLen * Math.cos(angle + headAngle);
  const head2Y = tipY - headLen * Math.sin(angle + headAngle);

  // Hand-drawn wobble via curved control point
  const midX = (fromX + tipX) / 2 + Math.sin(seed * 3.7) * 5;
  const midY = (fromY + tipY) / 2 + Math.cos(seed * 2.3) * 5;

  return (
    <g opacity={opacity}>
      {/* Arrow shaft */}
      <path
        d={`M ${fromX} ${fromY} Q ${midX} ${midY} ${tipX} ${tipY}`}
        stroke="#A855F7"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Open chevron head */}
      <path
        d={`M ${head1X} ${head1Y} L ${tipX} ${tipY} L ${head2X} ${head2Y}`}
        stroke="#A855F7"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
};

/** Faint purple specks */
const specks = [
  { x: 890, y: 155 },
  { x: 210, y: 520 },
  { x: 1050, y: 580 },
  { x: 640, y: 620 },
  { x: 400, y: 115 },
];

export const SpotScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Specks fade in subtly
  const specksOpacity = interpolate(frame, [2, 10], [0, 0.35], {
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
      {/* Faint purple specks */}
      {specks.map((speck, i) => {
        const speckFloat = Math.sin((frame / fps) * (1 + i * 0.2) + i) * 1.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: speck.x,
              top: speck.y + speckFloat,
              width: 3,
              height: 3,
              borderRadius: "50%",
              backgroundColor: "#8B5CF6",
              opacity: specksOpacity,
            }}
          />
        );
      })}

      {/* 4 hand-drawn arrows — spring animated draw-in from corners */}
      <svg
        viewBox="0 0 1280 720"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 5,
        }}
      >
        {/* Top-left → down-right */}
        <HandDrawnArrow
          fromX={150} fromY={120}
          toX={440} toY={300}
          delay={3} fps={fps} frame={frame} seed={1}
        />
        {/* Top-right → down-left */}
        <HandDrawnArrow
          fromX={1130} fromY={120}
          toX={840} toY={300}
          delay={5} fps={fps} frame={frame} seed={2}
        />
        {/* Bottom-left → up-right */}
        <HandDrawnArrow
          fromX={150} fromY={600}
          toX={440} toY={420}
          delay={7} fps={fps} frame={frame} seed={3}
        />
        {/* Bottom-right → up-left */}
        <HandDrawnArrow
          fromX={1130} fromY={600}
          toX={840} toY={420}
          delay={9} fps={fps} frame={frame} seed={4}
        />
      </svg>

      {/* Center text: "spot" — large, instant visibility */}
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
            fontSize: 240,
            color: "white",
            letterSpacing: "0.01em",
          }}
        >
          spot
        </div>
      </div>
    </div>
  );
};
