import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * "spot" in white lowercase centered on black background.
 * 4 hand-drawn purple arrows from near-corners pointing inward toward text.
 * Arrows are thin, hand-drawn style with open chevron heads.
 * Text is large (~45-50% of frame width).
 * Text appears instantly. Arrows stagger in one by one quickly.
 * A few very faint purple specks scattered on the background.
 */

/** Single hand-drawn arrow with open chevron head */
const HandDrawnArrow: React.FC<{
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  opacity: number;
  seed: number;
}> = ({ startX, startY, endX, endY, opacity, seed }) => {
  // Arrow angle
  const angle = Math.atan2(endY - startY, endX - startX);
  const headLen = 22;
  const headAngle = 0.45;

  // Open chevron arrowhead points
  const head1X = endX - headLen * Math.cos(angle - headAngle);
  const head1Y = endY - headLen * Math.sin(angle - headAngle);
  const head2X = endX - headLen * Math.cos(angle + headAngle);
  const head2Y = endY - headLen * Math.sin(angle + headAngle);

  // Hand-drawn wobble: slight curve via control point offset
  const midX = (startX + endX) / 2 + Math.sin(seed * 3.7) * 6;
  const midY = (startY + endY) / 2 + Math.cos(seed * 2.3) * 6;

  return (
    <g opacity={opacity}>
      {/* Arrow shaft — slightly curved for hand-drawn feel */}
      <path
        d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
        stroke="#A855F7"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Open chevron arrowhead */}
      <path
        d={`M ${head1X} ${head1Y} L ${endX} ${endY} L ${head2X} ${head2Y}`}
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

  // Arrows stagger in quickly — each one appears over ~3 frames
  const arrowOpacity = (delay: number) =>
    interpolate(frame, [delay, delay + 3], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

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

      {/* 4 hand-drawn arrows pointing inward from near-corners */}
      <svg
        viewBox="0 0 1280 720"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 5,
        }}
      >
        {/* Top-left → pointing down-right toward text */}
        <HandDrawnArrow
          startX={150}
          startY={120}
          endX={440}
          endY={300}
          opacity={arrowOpacity(2)}
          seed={1}
        />
        {/* Top-right → pointing down-left toward text */}
        <HandDrawnArrow
          startX={1130}
          startY={120}
          endX={840}
          endY={300}
          opacity={arrowOpacity(4)}
          seed={2}
        />
        {/* Bottom-left → pointing up-right toward text */}
        <HandDrawnArrow
          startX={150}
          startY={600}
          endX={440}
          endY={420}
          opacity={arrowOpacity(6)}
          seed={3}
        />
        {/* Bottom-right → pointing up-left toward text */}
        <HandDrawnArrow
          startX={1130}
          startY={600}
          endX={840}
          endY={420}
          opacity={arrowOpacity(8)}
          seed={4}
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
            fontSize: 130,
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
