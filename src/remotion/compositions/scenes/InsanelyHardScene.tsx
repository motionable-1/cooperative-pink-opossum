import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

export const InsanelyHardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Phase 1: Text appears centered and flat (frames 0-40)
  const entryOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const entryScale = interpolate(frame, [0, 10], [1.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Phase 2: Perspective zoom distortion starts (after frame 40)
  const perspectiveStart = 40;
  
  // The perspective effect: text gets a dramatic 3D perspective tilt
  const perspectiveProgress = interpolate(
    frame,
    [perspectiveStart, durationInFrames - 8],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.quad),
    },
  );

  // RotateY creates the perspective distortion (text swings away)
  const rotateY = interpolate(perspectiveProgress, [0, 1], [0, -65]);
  
  // Scale increases as perspective kicks in
  const perspectiveScale = interpolate(perspectiveProgress, [0, 1], [1, 1.8]);
  
  // Translate to the right as perspective distorts
  const translateX = interpolate(perspectiveProgress, [0, 1], [0, 300]);

  // Overall scale combines entry + perspective
  const totalScale = frame < perspectiveStart ? entryScale : perspectiveScale;

  // Exit opacity
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: exitOpacity,
        perspective: "800px",
      }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 900,
          fontSize: 82,
          color: "#000000",
          letterSpacing: "-0.02em",
          opacity: entryOpacity,
          transform: `scale(${totalScale}) rotateY(${rotateY}deg) translateX(${translateX}px)`,
          transformOrigin: "right center",
          whiteSpace: "nowrap",
        }}
      >
        INSANELY HARD.
      </div>
    </div>
  );
};
