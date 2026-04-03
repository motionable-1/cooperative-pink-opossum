import { useCurrentFrame, interpolate, Easing } from "remotion";

const PURPLE = "#A855F7";
const NUM_RAYS = 24;

export const RadialBurstScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Center glow expands
  const glowScale = interpolate(frame, [0, 20], [0, 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const glowOp = interpolate(frame, [0, 6, 20], [0, 1, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rays shoot outward
  const rayLength = interpolate(frame, [0, 15], [0, 1200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const rayOp = interpolate(frame, [0, 5, 18, 25], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // White flash at the end
  const whiteFlash = interpolate(frame, [15, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* Center glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          transform: `translate(-50%, -50%) scale(${glowScale})`,
          background: `radial-gradient(circle, rgba(255,255,255,1) 0%, ${PURPLE} 40%, transparent 70%)`,
          opacity: glowOp,
        }}
      />

      {/* Radial rays */}
      <svg
        width="1280"
        height="720"
        viewBox="0 0 1280 720"
        style={{ position: "absolute", inset: 0, opacity: rayOp }}
      >
        {Array.from({ length: NUM_RAYS }).map((_, i) => {
          const angle = (i / NUM_RAYS) * Math.PI * 2;
          const thickness = 3 + Math.random() * 6;
          const length = rayLength * (0.6 + Math.random() * 0.4);
          const cx = 640;
          const cy = 360;
          const endX = cx + Math.cos(angle) * length;
          const endY = cy + Math.sin(angle) * length;

          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={endX}
              y2={endY}
              stroke={PURPLE}
              strokeWidth={thickness}
              strokeLinecap="round"
              opacity={0.5 + Math.random() * 0.5}
            />
          );
        })}
      </svg>

      {/* White flash overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#FFFFFF",
          opacity: whiteFlash,
          zIndex: 100,
        }}
      />
    </div>
  );
};
