import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * Unified scene: Purple square appears → grows & rotates with concave edges →
 * fills frame → "What if you could" text fades in while morph is still finishing.
 *
 * Reference frames 073-093 (21 ref frames × 1.5 = ~32 output frames):
 *   073-075: Small purple square on lavender bg with dots
 *   076-080: Square slowly growing, no rotation yet
 *   081-085: Square rotates, edges become concave/curved
 *   086-088: Star/diamond shape, concave sides, growing
 *   089-090: Diamond still expanding, white corners visible
 *   091: "What if you could" text appears! Morph ~85-90% complete
 *   092-093: Text visible, wing shapes, tiny white corner slivers
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

export const PurpleMorphTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Square appears instantly
  const squareOpacity = interpolate(progress, [0, 0.05], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scale: small square → fills entire frame
  const scale = interpolate(progress, [0, 0.15, 0.5, 0.85, 1.0], [1, 1.3, 5, 14, 22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Rotation: starts after initial hold, reaches ~45deg
  const rotation = interpolate(progress, [0.15, 0.85], [0, 45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Border radius shrinks as shape fills frame
  const borderRadius = interpolate(progress, [0, 0.15, 0.5, 0.85], [6, 6, 2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dots fade out as square starts growing
  const dotsOpacity = interpolate(progress, [0.15, 0.35], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle float (diminishes as shape fills frame)
  const floatY = Math.sin((frame / fps) * 1.5) * 3 * (1 - progress);

  // "What if you could" text appears late (progress 0.75+)
  const textOpacity = interpolate(progress, [0.75, 0.88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const textScale = interpolate(progress, [0.75, 1.0], [0.92, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Wing shapes appear as morph nears completion
  const wingOpacity = interpolate(progress, [0.8, 0.95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wingBreath = interpolate(
    Math.sin((frame / fps) * 1.2),
    [-1, 1],
    [0.98, 1.02],
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      {/* Lavender/white gradient background (visible through corners) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, #FFFFFF 0%, #F3E8FF 40%, #E9D5FF 70%, #DDD6FE 100%)",
        }}
      />

      {/* Scattered purple dots (fade out as morph begins) */}
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

      {/* Purple morphing shape */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 60,
          height: 60,
          backgroundColor: "#8B5CF6",
          borderRadius,
          opacity: squareOpacity,
          transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale}) translateY(${floatY}px)`,
          willChange: "transform",
        }}
      />

      {/* Wing gradient shapes (appear late in the morph) */}
      {wingOpacity > 0 && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 55% 70% at 0% 50%, rgba(196, 181, 253, 0.5) 0%, rgba(196, 181, 253, 0.2) 50%, transparent 100%)",
              opacity: wingOpacity,
              transform: `scaleX(${wingBreath})`,
              transformOrigin: "left center",
              zIndex: 5,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 55% 70% at 100% 50%, rgba(196, 181, 253, 0.5) 0%, rgba(196, 181, 253, 0.2) 50%, transparent 100%)",
              opacity: wingOpacity,
              transform: `scaleX(${wingBreath})`,
              transformOrigin: "right center",
              zIndex: 5,
            }}
          />
        </>
      )}

      {/* "What if you could" text — appears while morph is still finishing */}
      {textOpacity > 0 && (
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
              letterSpacing: "-0.01em",
              textAlign: "center",
            }}
          >
            What if you could
          </div>
        </div>
      )}
    </div>
  );
};
