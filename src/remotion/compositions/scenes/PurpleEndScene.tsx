import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface Dot {
  x: number;
  y: number;
  size: number;
  delay: number;
  opacity: number;
}

// Pre-defined dot positions (scattered around the center square)
const dots: Dot[] = [
  { x: 12, y: 38, size: 5, delay: 1, opacity: 0.6 },
  { x: 45, y: 8, size: 4, delay: 2, opacity: 0.5 },
  { x: 75, y: 18, size: 8, delay: 0, opacity: 0.7 },
  { x: 82, y: 58, size: 4, delay: 3, opacity: 0.5 },
  { x: 35, y: 78, size: 6, delay: 1, opacity: 0.6 },
  { x: 15, y: 68, size: 5, delay: 0, opacity: 0.7 },
];

export const PurpleEndScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background appears immediately (hard cut from previous scene)
  const bgOpacity = interpolate(frame, [0, 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Center square appears with quick spring
  const squareScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 200, mass: 0.7 },
  });

  const squareOpacity = interpolate(frame, [0, 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle float for the square
  const floatY = Math.sin((frame / fps) * 1.5) * 3;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity: bgOpacity,
      }}
    >
      {/* Soft radial gradient background - white center fading to lavender */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, #FFFFFF 0%, #F3E8FF 40%, #E9D5FF 70%, #DDD6FE 100%)",
        }}
      />

      {/* Scattered purple dots */}
      {dots.map((dot, i) => {
        const dotOpacity = interpolate(
          frame,
          [dot.delay, dot.delay + 10],
          [0, dot.opacity],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );

        const dotScale = spring({
          frame: frame - dot.delay,
          fps,
          config: { damping: 15, stiffness: 200 },
        });

        // Subtle floating motion for each dot
        const dotFloatX =
          Math.sin((frame / fps) * (1 + i * 0.3) + i) * 2;
        const dotFloatY =
          Math.cos((frame / fps) * (0.8 + i * 0.2) + i * 2) * 2;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size * 2,
              height: dot.size * 2,
              borderRadius: "50%",
              backgroundColor: "#A855F7",
              opacity: dotOpacity,
              transform: `scale(${dotScale}) translate(${dotFloatX}px, ${dotFloatY}px)`,
            }}
          />
        );
      })}

      {/* Center purple square */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 60,
          height: 60,
          backgroundColor: "#A855F7",
          borderRadius: 6,
          opacity: squareOpacity,
          transform: `translate(-50%, -50%) scale(${squareScale}) translateY(${floatY}px)`,
        }}
      />
    </div>
  );
};
