import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

/**
 * Transition scene: Purple square rotates/tilts → morphs into a diamond →
 * expands into abstract curved wing shapes that fill the screen.
 * The background goes from soft lavender to deep purple.
 */

interface Dot {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const dots: Dot[] = [
  { x: 12, y: 38, size: 5, opacity: 0.6 },
  { x: 45, y: 8, size: 4, opacity: 0.5 },
  { x: 75, y: 18, size: 8, opacity: 0.7 },
  { x: 82, y: 58, size: 4, opacity: 0.5 },
  { x: 35, y: 78, size: 6, opacity: 0.6 },
  { x: 15, y: 68, size: 5, opacity: 0.7 },
];

export const PurpleMorphScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Phase timeline (normalized 0-1)
  // Phase 1 (0-0.2): Square sits, starts rotating
  // Phase 2 (0.2-0.5): Square morphs into diamond, dots fade
  // Phase 3 (0.5-1.0): Diamond expands into abstract wings, bg goes purple

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Square rotation: starts slow, accelerates
  const rotation = interpolate(progress, [0, 0.15, 0.45, 0.6], [0, 5, 45, 90], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Square scale: grows as it morphs
  const squareScale = interpolate(progress, [0, 0.2, 0.5, 0.8, 1.0], [1, 1.1, 2, 6, 18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Square opacity: fully visible then fades as wings take over
  const squareOpacity = interpolate(progress, [0, 0.6, 0.85], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dots fade out as morph begins
  const dotsOpacity = interpolate(progress, [0, 0.15, 0.35], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background transition: lavender → deep purple
  const bgLavenderOpacity = interpolate(progress, [0.3, 0.7], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bgPurpleOpacity = interpolate(progress, [0.3, 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Abstract wing shapes: fade in during phase 3
  const wingsOpacity = interpolate(progress, [0.45, 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wingsScale = interpolate(progress, [0.45, 0.85], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Border radius morph: square → diamond (rounded) → more rounded
  const borderRadius = interpolate(progress, [0, 0.3, 0.6], [6, 4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle float for square
  const floatY = Math.sin((frame / fps) * 2) * 3;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      {/* Lavender background (fades out) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, #FFFFFF 0%, #F3E8FF 40%, #E9D5FF 70%, #DDD6FE 100%)",
          opacity: bgLavenderOpacity,
        }}
      />

      {/* Deep purple background (fades in) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, #7C3AED 0%, #6D28D9 30%, #5B21B6 60%, #4C1D95 100%)",
          opacity: bgPurpleOpacity,
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

      {/* Abstract wing/wave shapes behind center (SVG) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: wingsOpacity,
          transform: `scale(${wingsScale})`,
        }}
      >
        <svg
          viewBox="0 0 1280 720"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Left wing */}
          <path
            d="M 640 360 Q 400 200 100 280 Q 200 360 100 440 Q 400 520 640 360"
            fill="rgba(139, 92, 246, 0.3)"
          />
          <path
            d="M 640 360 Q 420 240 150 310 Q 230 360 150 410 Q 420 480 640 360"
            fill="rgba(167, 139, 250, 0.2)"
          />
          {/* Right wing */}
          <path
            d="M 640 360 Q 880 200 1180 280 Q 1080 360 1180 440 Q 880 520 640 360"
            fill="rgba(139, 92, 246, 0.3)"
          />
          <path
            d="M 640 360 Q 860 240 1130 310 Q 1050 360 1130 410 Q 860 480 640 360"
            fill="rgba(167, 139, 250, 0.2)"
          />
          {/* Top arc */}
          <path
            d="M 300 100 Q 640 200 980 100 Q 640 300 300 100"
            fill="rgba(196, 181, 253, 0.15)"
          />
          {/* Bottom arc */}
          <path
            d="M 300 620 Q 640 520 980 620 Q 640 420 300 620"
            fill="rgba(196, 181, 253, 0.15)"
          />
        </svg>
      </div>

      {/* Center morphing square/diamond */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 60,
          height: 60,
          backgroundColor: "#A855F7",
          borderRadius,
          opacity: squareOpacity,
          transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${squareScale}) translateY(${floatY}px)`,
          willChange: "transform",
        }}
      />
    </div>
  );
};
