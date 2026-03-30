import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * "spot" in white lowercase centered on black background
 * with 4 hand-drawn style purple arrows pointing inward from corners.
 * Small purple specks scattered on black bg.
 */

/** Hand-drawn arrow pointing from a corner toward center */
const Arrow: React.FC<{
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number;
  delay: number;
  fps: number;
  frame: number;
}> = ({ fromX, fromY, toX, toY, progress, delay, fps, frame }) => {
  const arrowProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
  });

  const opacity = interpolate(frame, [delay, delay + 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Current position based on progress
  const cx = fromX + (toX - fromX) * arrowProgress;
  const cy = fromY + (toY - fromY) * arrowProgress;

  // Arrow angle
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const headLen = 18;

  // Arrow head points
  const head1X = cx - headLen * Math.cos(angle - 0.45);
  const head1Y = cy - headLen * Math.sin(angle - 0.45);
  const head2X = cx - headLen * Math.cos(angle + 0.45);
  const head2Y = cy - headLen * Math.sin(angle + 0.45);

  // Hand-drawn style: add slight waviness to the line
  const midX = (fromX + cx) / 2 + Math.sin(frame * 0.1) * 3;
  const midY = (fromY + cy) / 2 + Math.cos(frame * 0.1) * 3;

  return (
    <g opacity={opacity}>
      {/* Arrow shaft - slightly curved for hand-drawn feel */}
      <path
        d={`M ${fromX} ${fromY} Q ${midX} ${midY} ${cx} ${cy}`}
        stroke="#A855F7"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrow head */}
      <path
        d={`M ${head1X} ${head1Y} L ${cx} ${cy} L ${head2X} ${head2Y}`}
        stroke="#A855F7"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
};

/** Small purple specks */
const specks = [
  { x: 320, y: 180 },
  { x: 900, y: 130 },
  { x: 180, y: 520 },
  { x: 1050, y: 480 },
  { x: 640, y: 90 },
  { x: 500, y: 600 },
  { x: 820, y: 580 },
];

export const SpotScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text entry
  const textScale = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 200, mass: 0.7 },
  });

  const textOpacity = interpolate(frame, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Specks fade in
  const specksOpacity = interpolate(frame, [3, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle pulse on text
  const pulse = interpolate(
    Math.sin((frame / fps) * 3),
    [-1, 1],
    [0.98, 1.02],
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
      {/* Purple specks on background */}
      {specks.map((speck, i) => {
        const speckFloat = Math.sin((frame / fps) * (1 + i * 0.2) + i) * 2;
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
              backgroundColor: "#7C3AED",
              opacity: specksOpacity * 0.4,
            }}
          />
        );
      })}

      {/* 4 arrows pointing inward from corners */}
      <svg
        viewBox="0 0 1280 720"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 5,
        }}
      >
        {/* Top-left arrow */}
        <Arrow
          fromX={180}
          fromY={140}
          toX={520}
          toY={320}
          progress={1}
          delay={6}
          fps={fps}
          frame={frame}
        />
        {/* Top-right arrow */}
        <Arrow
          fromX={1100}
          fromY={140}
          toX={760}
          toY={320}
          progress={1}
          delay={8}
          fps={fps}
          frame={frame}
        />
        {/* Bottom-left arrow */}
        <Arrow
          fromX={180}
          fromY={580}
          toX={520}
          toY={400}
          progress={1}
          delay={10}
          fps={fps}
          frame={frame}
        />
        {/* Bottom-right arrow */}
        <Arrow
          fromX={1100}
          fromY={580}
          toX={760}
          toY={400}
          progress={1}
          delay={12}
          fps={fps}
          frame={frame}
        />
      </svg>

      {/* Center text: "spot" */}
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
            transform: `scale(${textScale * pulse})`,
            letterSpacing: "0.02em",
          }}
        >
          spot
        </div>
      </div>
    </div>
  );
};
