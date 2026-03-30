import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

export const IsHaardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // "IS" appears first with a pop
  const isScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.8 },
  });

  const isOpacity = interpolate(frame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "HAAARD!" slams in slightly after
  const haardDelay = 4;
  const haardScale = spring({
    frame: frame - haardDelay,
    fps,
    config: { damping: 10, stiffness: 250, mass: 0.9 },
  });

  const haardOpacity = interpolate(frame, [haardDelay, haardDelay + 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Slight shake on impact
  const shakeIntensity = interpolate(
    frame,
    [haardDelay, haardDelay + 3, haardDelay + 8],
    [0, 4, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const shakeX = Math.sin(frame * 2.5) * shakeIntensity;
  const shakeY = Math.cos(frame * 3.1) * shakeIntensity * 0.5;

  // Subtle scale pulse throughout
  const pulse = interpolate(
    Math.sin((frame / fps) * 4),
    [-1, 1],
    [0.98, 1.02],
  );

  // Exit
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 6, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Individual letter rotations for the "bouncy" hand-lettered feel
  const letterRotations = [-1.5, 0.8, -0.5, 1.2, -0.8, 0.6, -1.0, 1.5];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: exitOpacity,
      }}
    >
      <div
        style={{
          transform: `translate(${shakeX}px, ${shakeY}px) scale(${pulse})`,
          display: "flex",
          alignItems: "baseline",
          gap: "18px",
          fontFamily,
          fontWeight: 900,
        }}
      >
        {/* IS */}
        <span
          style={{
            fontSize: 88,
            color: "white",
            opacity: isOpacity,
            transform: `scale(${isScale})`,
            display: "inline-block",
            letterSpacing: "0.02em",
          }}
        >
          IS
        </span>

        {/* HAAARD! with individual letter rotations */}
        <span
          style={{
            display: "inline-flex",
            opacity: haardOpacity,
            transform: `scale(${haardScale})`,
          }}
        >
          {"HAAARD!".split("").map((char, i) => (
            <span
              key={i}
              style={{
                fontSize: 88,
                color: "white",
                display: "inline-block",
                transform: `rotate(${letterRotations[i] || 0}deg) translateY(${Math.sin(i * 1.2) * 2}px)`,
              }}
            >
              {char}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
};
