import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * "exactly what your customers" — kinetic word-by-word reveal on purple gradient.
 *
 * Background: Soft blurred purple gradient with bright white/lavender glow from bottom-left.
 * Words appear one at a time with horizontal motion blur + opacity fade-in (~3 frames each).
 * Text block stays centered as it grows (shifts left to accommodate new words).
 * All text: white, bold, lowercase, Inter 700.
 *
 * Timing (50ms per reference frame ≈ 1.5 output frames at 30fps):
 *   Ref frames 137-138 (output 0-2): empty gradient
 *   Ref frame 139 (output ~3): "exactly" appears
 *   Ref frame 144 (output ~10): "what" appears
 *   Ref frame 150 (output ~19): "your" appears
 *   Ref frame 155 (output ~27): "customers" appears
 *   Holds until end of scene
 */

const WORDS = ["exactly", "what", "your", "customers"];

// Frame at which each word starts appearing (at 30fps)
const WORD_ENTRY_FRAMES = [3, 10, 19, 27];
// Frames for each word to go from blurry to crisp
const BLUR_DURATION = 4;

export const ExactlyWhatScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Continuous slow zoom-in on text block
  const textZoom = interpolate(frame, [0, durationInFrames], [1.0, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Subtle background glow drift
  const glowX = interpolate(frame, [0, 60], [-5, 5], {
    extrapolateRight: "clamp",
  });
  const glowY = interpolate(frame, [0, 60], [0, -3], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      {/* Base purple background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#A855F7",
        }}
      />

      {/* Soft gradient overlay — white glow from bottom-left */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 90% 90% at ${25 + glowX}% ${75 + glowY}%, rgba(255,255,255,0.85) 0%, rgba(220,180,255,0.4) 35%, rgba(168,85,247,0.1) 60%, transparent 80%)`,
        }}
      />

      {/* Secondary purple tint top-right for depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 85% 15%, rgba(120,50,200,0.3) 0%, transparent 70%)",
        }}
      />

      {/* Word-by-word kinetic text */}
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
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            transform: `scale(${textZoom})`,
          }}
        >
          {WORDS.map((word, i) => {
            const entryFrame = WORD_ENTRY_FRAMES[i];
            const isVisible = frame >= entryFrame;

            if (!isVisible) return null;

            const localFrame = frame - entryFrame;

            // Opacity: fade in over BLUR_DURATION frames
            const opacity = interpolate(
              localFrame,
              [0, BLUR_DURATION],
              [0.3, 1],
              {
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.quad),
              }
            );

            // Blur: starts blurry, becomes crisp
            const blur = interpolate(
              localFrame,
              [0, BLUR_DURATION],
              [8, 0],
              {
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.quad),
              }
            );

            // Slight horizontal slide (like motion blur direction)
            const translateX = interpolate(
              localFrame,
              [0, BLUR_DURATION],
              [12, 0],
              {
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.quad),
              }
            );

            return (
              <span
                key={word}
                style={{
                  fontFamily,
                  fontWeight: 700,
                  fontSize: 72,
                  color: "white",
                  letterSpacing: "0.01em",
                  opacity,
                  filter: `blur(${blur}px)`,
                  transform: `translateX(${translateX}px)`,
                  whiteSpace: "nowrap",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
