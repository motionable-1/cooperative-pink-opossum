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
 * Start (006): bar fills ~80% width, left rounded edge visible, right off-screen.
 *   Text "and app" typing. Purple glow above/below.
 *
 * End (041): Very zoomed. Only "at the top automatically?" visible,
 *   "a" in "at" slightly cut off at left. No rounded edges — straight lines.
 *   Purple glow band below.
 */

const FULL_TEXT = "and appear at the top automatically?";

const getVisibleChars = (frame: number): number => {
  if (frame < 0) return 0;
  // Type ~1.3 chars per frame, start with 3 chars visible, finish typing by f27
  const charsPerFrame = FULL_TEXT.length / 27;
  return Math.min(FULL_TEXT.length, Math.round(frame * charsPerFrame + 3));
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

  // TransformOrigin shifts from left to right to pan across the bar.
  // Start: 35% — shows left rounded edge, right off-screen
  // End: 60% — centers on "at the top automatically?" text
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
          transform: `scale(${Math.round(zoomScale * 1000) / 1000}) translateZ(0)`,
          transformOrigin: `${Math.round(originX * 100) / 100}% 50%`,
          willChange: "transform",
          backfaceVisibility: "hidden" as const,
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
