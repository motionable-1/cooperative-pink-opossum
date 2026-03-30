import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

/**
 * Purple exclamation mark "!" on black background.
 * Ref frames 043-054 (12 ref frames = ~18 output frames)
 *
 * The "!" starts small and heavily rotated (~170-175 deg, nearly horizontal pointing left).
 * Over the scene it spins/unwinds toward upright while scaling up.
 * By the end, it's a centered, upright, medium-sized purple "!".
 *
 * The "!" is composed of a tapered wedge (top) and a circle (dot).
 * Color: solid light purple/lavender (#A78BFA).
 */

export const ExclamationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Spring-based rotation unwind: starts at ~170deg, settles to 0
  const rotateProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120, mass: 1.2 },
  });
  const rotation = interpolate(rotateProgress, [0, 1], [170, 0]);

  // Scale up from small to medium
  const scaleProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 1 },
  });
  const scale = interpolate(scaleProgress, [0, 1], [0.3, 1]);

  // Subtle continuous zoom after settle
  const settleZoom = interpolate(
    frame,
    [8, durationInFrames],
    [1, 1.06],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
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
            transform: `rotate(${rotation}deg) scale(${scale * settleZoom})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Tapered wedge (top part of !) */}
          <div
            style={{
              width: 28,
              height: 90,
              borderRadius: "6px 6px 10px 10px",
              background: "#A78BFA",
              clipPath: "polygon(15% 0%, 85% 0%, 65% 100%, 35% 100%)",
            }}
          />
          {/* Dot */}
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              backgroundColor: "#A78BFA",
            }}
          />
        </div>
      </div>
    </div>
  );
};
