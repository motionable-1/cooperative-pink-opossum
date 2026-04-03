import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["800"],
  subsets: ["latin"],
});

/**
 * "meet!" bounces in purple, then morphs to white and straightens.
 * Single continuous scene — no scene cut for the color change.
 */

const LETTERS = ["m", "e", "e", "t", "!"];
const LETTER_ROTATIONS = [-15, 12, 8, -10, -12];
const LETTER_Y_OFFSETS = [8, -14, -8, 10, 12];

const MORPH_START = 11;
const MORPH_END = 16;

export const MeetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Color morph: purple → white
  const morphProg = interpolate(frame, [MORPH_START, MORPH_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const r = Math.round(167 + (255 - 167) * morphProg);
  const g = Math.round(139 + (255 - 139) * morphProg);
  const b = Math.round(250 + (255 - 250) * morphProg);
  const textColor = `rgb(${r},${g},${b})`;

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

            // Rotation: scattered → straighten as morph progresses
            const settledRot = LETTER_ROTATIONS[i];
            const startRot = settledRot * 4;
            const bouncedRot = interpolate(prog, [0, 1], [startRot, settledRot]);
            const finalRot = interpolate(morphProg, [0, 1], [bouncedRot, 0]);

            // Y offset: scattered → center as morph progresses
            const settledY = LETTER_Y_OFFSETS[i];
            const startY = settledY * 3;
            const bouncedY = interpolate(prog, [0, 1], [startY, settledY]);
            const finalY = interpolate(morphProg, [0, 1], [bouncedY, 0]);

            const scl = interpolate(prog, [0, 1], [0.4, 1]);

            return (
              <div
                key={i}
                style={{
                  fontFamily,
                  fontWeight: 800,
                  fontSize: 120,
                  color: textColor,
                  opacity,
                  transform: `translateY(${finalY}px) rotate(${finalRot}deg) scale(${scl})`,
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
