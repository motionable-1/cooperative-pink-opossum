import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

export const IsHaardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Text slides/reveals in from the right quickly (reference shows "IS H" mid-reveal)
  const revealProgress = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 200, mass: 0.7 },
  });

  // Translate from right: text slides left into position
  const translateX = interpolate(revealProgress, [0, 1], [60, 0]);
  const mainOpacity = interpolate(frame, [0, 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Slight shake on settle
  const shakePhase = interpolate(frame, [6, 12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = Math.sin(frame * 2.8) * 3 * shakePhase;
  const shakeY = Math.cos(frame * 3.4) * 1.5 * shakePhase;

  // Continuous slow zoom-in throughout scene
  const zoomScale = interpolate(frame, [0, durationInFrames], [1.0, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Exit: hard cut
  const exitOpacity = 1;

  // Letter rotations for the bouncy/jittery hand-lettered feel visible in reference
  const letterData = [
    { char: "I", rot: -1.2, yOff: 1 },
    { char: "S", rot: 0.8, yOff: -1 },
    { char: " ", rot: 0, yOff: 0 },
    { char: "H", rot: -0.6, yOff: 2 },
    { char: "A", rot: 1.0, yOff: -1 },
    { char: "A", rot: -0.4, yOff: 1.5 },
    { char: "A", rot: 0.7, yOff: -0.5 },
    { char: "R", rot: -0.9, yOff: 1 },
    { char: "D", rot: 0.5, yOff: -1.5 },
    { char: "!", rot: 1.3, yOff: 2 },
  ];

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
          transform: `translate(${translateX + shakeX}px, ${shakeY}px) scale(${zoomScale})`,
          display: "inline-flex",
          alignItems: "baseline",
          fontFamily,
          fontWeight: 900,
          opacity: mainOpacity,
        }}
      >
        {letterData.map((item, i) => {
          // Stagger each letter's entry slightly
          const letterDelay = i * 0.3;
          const letterSpring = spring({
            frame: frame - letterDelay,
            fps,
            config: { damping: 14, stiffness: 220, mass: 0.6 },
          });

          return (
            <span
              key={i}
              style={{
                fontSize: 88,
                color: "white",
                display: "inline-block",
                transform: `rotate(${item.rot * letterSpring}deg) translateY(${item.yOff * letterSpring}px)`,
                marginRight: item.char === " " ? 18 : 0,
              }}
            >
              {item.char === " " ? "\u00A0" : item.char}
            </span>
          );
        })}
      </div>
    </div>
  );
};
