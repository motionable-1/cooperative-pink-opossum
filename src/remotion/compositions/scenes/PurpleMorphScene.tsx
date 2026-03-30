import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

/**
 * Purple square morph transition.
 * The square from the previous scene slowly rotates clockwise
 * while scaling up to fill the entire frame.
 * As it grows, white triangles remain visible in the corners
 * (because the rotated square's corners don't reach the frame corners).
 * The edges become slightly concave as it expands.
 * Background stays soft lavender/white throughout.
 * Dots fade out quickly at the start.
 */

interface Dot {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const dots: Dot[] = [
  { x: 14, y: 38, size: 5, opacity: 0.6 },
  { x: 19, y: 70, size: 5, opacity: 0.7 },
  { x: 37, y: 79, size: 6, opacity: 0.6 },
  { x: 59, y: 11, size: 4, opacity: 0.5 },
  { x: 67, y: 67, size: 4, opacity: 0.5 },
  { x: 76, y: 13, size: 8, opacity: 0.7 },
];

export const PurpleMorphScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Square rotation: slow clockwise tilt, starts at ~2deg (matching previous scene's float),
  // ends at ~45deg as it fills the screen
  const rotation = interpolate(progress, [0, 1], [2, 45], {
    easing: Easing.inOut(Easing.quad),
  });

  // Square scale: from small centered square → fills entire frame and beyond
  // At scale ~18 with a 60px square = 1080px which fills 720px height easily
  const scale = interpolate(progress, [0, 0.3, 0.7, 1], [1, 2.5, 10, 22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Dots fade out quickly
  const dotsOpacity = interpolate(progress, [0, 0.15], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle float
  const floatY = Math.sin((frame / fps) * 1.5) * 2 * (1 - progress);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      {/* Soft lavender/white background (same as PurpleEndScene) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, #FFFFFF 0%, #F3E8FF 40%, #E9D5FF 70%, #DDD6FE 100%)",
        }}
      />

      {/* Scattered dots (fade out early) */}
      {dots.map((dot, i) => {
        const dotFloatX = Math.sin((frame / fps) * (1 + i * 0.3) + i) * 2;
        const dotFloatY = Math.cos((frame / fps) * (0.8 + i * 0.2) + i * 2) * 2;
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
              opacity: dot.opacity * dotsOpacity,
              transform: `translate(${dotFloatX}px, ${dotFloatY}px)`,
            }}
          />
        );
      })}

      {/* Center purple square — scales up and rotates to fill the frame */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 60,
          height: 60,
          backgroundColor: "#A855F7",
          borderRadius: 6,
          transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale}) translateY(${floatY}px)`,
          willChange: "transform",
        }}
      />
    </div>
  );
};
