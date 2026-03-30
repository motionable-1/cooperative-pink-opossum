import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * Search bar typing animation on white background.
 *
 * Reference (36 frames at 50ms each = 54 output frames at 30fps):
 *
 * The bar is ALREADY partially zoomed from the very first frame — it's NOT small
 * and centered. It fills ~80% width, ~30% height, left-aligned with rounded left
 * edge visible, right edge extends off screen.
 *
 * Strong purple/magenta glow behind bar (top and bottom edges).
 * Thin purple border lines on top and bottom.
 * Black bold text types character by character: "and appear at the top automatically?"
 *
 * As text types, the "camera" slowly zooms into the bar, so by the end
 * only "at the top automatically?" is visible and the bar fills most of the frame.
 *
 * Timing:
 *   Ref 006 (frame 0):  "and app" — bar already large
 *   Ref 012 (frame ~9):  "and appear at t"
 *   Ref 014 (frame ~12): "and appear at the"
 *   Ref 017 (frame ~17): "and appear at the top"
 *   Ref 020 (frame ~21): "and appear at the top autom"
 *   Ref 024 (frame ~27): "and appear at the top automatically?"
 *   Ref 025-041 (frame 28-54): text done, zoom continues deeper
 */

const FULL_TEXT = "and appear at the top automatically?";

// Character reveal timing (output frame when each char appears)
// ~1.5 chars per frame to complete by frame ~27
const getVisibleChars = (frame: number): number => {
  if (frame < 0) return 0;
  // Typing speed: roughly finishes at frame 27
  const charsPerFrame = FULL_TEXT.length / 27;
  return Math.min(FULL_TEXT.length, Math.floor(frame * charsPerFrame + 3));
};

export const SearchBarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const visibleCount = getVisibleChars(frame);
  const visibleText = FULL_TEXT.substring(0, visibleCount);

  // Continuous zoom throughout the entire scene
  // Starts already "zoomed in" (scale ~1.8) and goes to ~5.5
  const zoomScale = interpolate(frame, [0, durationInFrames], [1.8, 5.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Translate to keep text area centered as zoom increases
  // Shifts left and up slightly as we zoom deeper
  const translateX = interpolate(frame, [0, durationInFrames], [10, -15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const translateY = interpolate(frame, [0, durationInFrames], [0, -2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Purple glow intensity
  const glowIntensity = interpolate(frame, [0, 5], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
      {/* Zoom container — everything inside scales up together */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${zoomScale}) translate(${translateX}%, ${translateY}%)`,
          transformOrigin: "50% 50%",
          willChange: "transform",
        }}
      >
        {/* Purple glow behind bar — top */}
        <div
          style={{
            position: "absolute",
            width: 900,
            height: 60,
            top: "calc(50% - 55px)",
            left: "calc(50% - 350px)",
            background:
              "radial-gradient(ellipse 100% 200% at 65% 100%, rgba(180, 60, 230, 0.35) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 80%)",
            opacity: glowIntensity,
            filter: "blur(15px)",
          }}
        />

        {/* Purple glow behind bar — bottom (stronger) */}
        <div
          style={{
            position: "absolute",
            width: 900,
            height: 80,
            top: "calc(50% + 15px)",
            left: "calc(50% - 350px)",
            background:
              "radial-gradient(ellipse 100% 200% at 65% 0%, rgba(180, 60, 230, 0.4) 0%, rgba(168, 85, 247, 0.18) 50%, transparent 80%)",
            opacity: glowIntensity,
            filter: "blur(18px)",
          }}
        />

        {/* Search bar — pill shape */}
        <div
          style={{
            position: "relative",
            width: 780,
            height: 68,
            backgroundColor: "rgba(255, 255, 255, 0.97)",
            borderRadius: 38,
            borderTop: "1.5px solid rgba(160, 100, 240, 0.3)",
            borderBottom: "1.5px solid rgba(160, 100, 240, 0.3)",
            borderLeft: "1.5px solid rgba(160, 100, 240, 0.15)",
            borderRight: "1.5px solid rgba(160, 100, 240, 0.15)",
            display: "flex",
            alignItems: "center",
            paddingLeft: 30,
            paddingRight: 30,
            overflow: "hidden",
          }}
        >
          {/* Typed text */}
          <div
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 26,
              color: "#000000",
              whiteSpace: "nowrap",
              letterSpacing: "-0.01em",
            }}
          >
            {visibleText}
          </div>
        </div>
      </div>
    </div>
  );
};
