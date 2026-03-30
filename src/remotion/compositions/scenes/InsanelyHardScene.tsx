import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

export const InsanelyHardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Phase 1: Text fades in centered and flat
  const entryOpacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2: Extreme perspective - RIGHT side ("HARD.") comes toward viewer
  // In CSS 3D:
  //   rotateY(negative) with transform-origin on right side = right comes forward
  const perspStart = 15;
  const perspEnd = durationInFrames - 4;

  const t = interpolate(frame, [perspStart, perspEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0, 0.85, 0.5),
  });

  // Negative rotateY with right-side origin = right comes toward viewer
  const rotateY = interpolate(t, [0, 1], [0, -65]);

  // Scale dramatically so HARD fills the frame
  const scale = interpolate(t, [0, 1], [1, 5]);

  // Dynamic perspective (lower = more extreme foreshortening)
  const perspective = interpolate(t, [0, 1], [1200, 280]);

  // Shift so the right portion stays in frame as it zooms
  const translateX = interpolate(t, [0, 1], [0, 30]);

  // No fade-out: hard cut to next scene (avoids grey bleed from parent bg)
  const exitOpacity = 1;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        opacity: exitOpacity,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: `${perspective}px`,
          perspectiveOrigin: "70% 50%",
        }}
      >
        <div
          style={{
            fontFamily,
            fontWeight: 900,
            fontSize: 80,
            color: "#000000",
            letterSpacing: "-0.02em",
            opacity: entryOpacity,
            transform: `translateX(${translateX}%) rotateY(${rotateY}deg) scale(${scale})`,
            transformOrigin: "85% 50%",
            whiteSpace: "nowrap",
            willChange: "transform",
          }}
        >
          INSANELY HARD.
        </div>
      </div>
    </div>
  );
};
