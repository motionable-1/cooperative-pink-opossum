import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * Search bar typing animation on white background.
 *
 * Reference frames 006-041 at 50ms each = 54 output frames at 30fps.
 *
 * Start (006): bar fills ~80% width, left rounded edge visible, right off-screen.
 *   Purple glow above/below. Text "and app" typing.
 *
 * End (041): VERY zoomed. Bar ~30% of frame height. Only "at the top automatically?"
 *   visible with "a" in "at" slightly cut off at left edge.
 *   No rounded edges — just straight horizontal purple border lines edge to edge.
 *   Purple glow band below bar.
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

  // Zoom: 1.5 → 2.8
  const zoomScale = interpolate(frame, [0, durationInFrames], [1.5, 2.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Transform origin shifts from center-left to center-right area
  // to keep the later text ("at the top automatically?") centered at end.
  // The bar is 780px wide at base. "at the top" starts ~40% from left of bar text.
  // At start: origin at ~35% x (left side of bar, showing rounded edge)
  // At end: origin at ~60% x (focusing on the "at the top" portion)
  const originX = interpolate(frame, [0, durationInFrames], [35, 60], {
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
