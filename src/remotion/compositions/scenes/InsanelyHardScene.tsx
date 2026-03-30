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
  // Delayed start so text has breathing room to be read first
  const perspStart = 18; // Hold flat before zoom kicks in
  const perspEnd = durationInFrames;

  const t = interpolate(frame, [perspStart, perspEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.15, 0, 0.9, 0.4), // Slow start, aggressive acceleration
  });

  // Negative rotateY with right-side origin = right comes toward viewer
  // Push to -85 so the text fully rotates past the camera and exits
  const rotateY = interpolate(t, [0, 1], [0, -85]);

  // Scale dramatically — go to 12x so text blows past the frame entirely
  const scale = interpolate(t, [0, 1], [1, 12]);

  // Dynamic perspective (lower = more extreme foreshortening)
  const perspective = interpolate(t, [0, 1], [1200, 200]);

  // Shift so the right portion stays in frame during mid-animation,
  // then continues past
  const translateX = interpolate(t, [0, 1], [0, 50]);

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
