import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * Search bar typing + zoom animation on white background.
 *
 * Reference frames 006-041 at 50ms each = 54 output frames at 30fps.
 *
 * KEY INSIGHT: The bar height is ~30% of frame throughout (barely changes).
 * The main animation is HORIZONTAL PANNING from left to right while
 * typing happens. Zoom is nearly constant (~3.2x).
 *
 * Start (006): left rounded edge visible ~23% from left, right edge off-screen.
 *   Bar ~77% of frame width. Text "and app".
 * End (041): bar extends fully edge-to-edge. No rounded edges visible.
 *   Text "at the top automatically?" with "a" flush against left edge.
 *   Purple glow below, thin purple border lines.
 */

const FULL_TEXT = "and appear at the top automatically?";

const getVisibleChars = (frame: number): number => {
  if (frame < 0) return 0;
  const charsPerFrame = FULL_TEXT.length / 27;
  return Math.min(FULL_TEXT.length, Math.floor(frame * charsPerFrame + 3));
};

export const SearchBarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const visibleCount = getVisibleChars(frame);
  const visibleText = FULL_TEXT.substring(0, visibleCount);

  // Zoom barely changes: 3.15 → 3.3
  // Bar is 68px tall. At 3.15x = 214px = ~30% of 720. At 3.3x = 224px = ~31%.
  const zoomScale = interpolate(frame, [0, durationInFrames], [3.15, 3.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // The main animation is the horizontal pan (transformOrigin X shift).
  // Start: origin at ~38% — shows left rounded edge, bar starts ~23% from left
  // End: origin at ~68% — pans right to show "at the top automatically?"
  //   with "at" flush against left edge
  const originX = interpolate(frame, [0, durationInFrames], [38, 68], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
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
      {/* Zoom container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${zoomScale})`,
          transformOrigin: `${originX}% 50%`,
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
