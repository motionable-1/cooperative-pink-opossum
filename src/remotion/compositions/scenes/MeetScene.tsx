import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["800"],
  subsets: ["latin"],
});

/**
 * "meet!" in purple bouncy text on black background.
 */

const LETTERS = ["m", "e", "e", "t", "!"];
const LETTER_ROTATIONS = [-15, 12, 8, -10, -12];
const LETTER_Y_OFFSETS = [8, -14, -8, 10, 12];

export const MeetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${zoom})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {LETTERS.map((letter, i) => {
            const delay = i * 2;
            const prog = spring({
              frame: frame - delay,
              fps,
              config: { damping: 10, stiffness: 200, mass: 0.8 },
            });

            const opacity = interpolate(frame, [delay, delay + 2], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const startRot = LETTER_ROTATIONS[i] * 4;
            const rot = interpolate(prog, [0, 1], [startRot, LETTER_ROTATIONS[i]]);

            const startY = LETTER_Y_OFFSETS[i] * 3;
            const yOff = interpolate(prog, [0, 1], [startY, LETTER_Y_OFFSETS[i]]);

            const scl = interpolate(prog, [0, 1], [0.4, 1]);

            return (
              <div
                key={i}
                style={{
                  fontFamily,
                  fontWeight: 800,
                  fontSize: 120,
                  color: "#A78BFA",
                  opacity,
                  transform: `translateY(${yOff}px) rotate(${rot}deg) scale(${scl})`,
                  display: "inline-block",
                }}
              >
                {letter}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
