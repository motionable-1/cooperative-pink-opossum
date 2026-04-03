import { useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

const PURPLE = "#A855F7";

const WORDS_L1 = ["Come", "back", "tomorrow", "to"];
const WORDS_L2 = ["see", "your", "article"];

export const ComeBackScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Word-by-word reveal with motion blur
  const WORD_DELAY = 4;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: PURPLE,
        fontFamily,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        {/* Line 1: "Come back tomorrow to" */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {WORDS_L1.map((word, i) => {
            const start = i * WORD_DELAY;
            const op = interpolate(frame, [start, start + 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const blur = interpolate(frame, [start, start + 8], [14, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const x = interpolate(frame, [start, start + 8], [-20, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            return (
              <span
                key={i}
                style={{
                  fontSize: 62,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  opacity: op,
                  filter: `blur(${blur}px)`,
                  transform: `translateX(${x}px)`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Line 2: "see your article" */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {WORDS_L2.map((word, i) => {
            const start = (WORDS_L1.length + i) * WORD_DELAY;
            const op = interpolate(frame, [start, start + 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const blur = interpolate(frame, [start, start + 8], [14, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const x = interpolate(frame, [start, start + 8], [-20, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            return (
              <span
                key={i}
                style={{
                  fontSize: 62,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  opacity: op,
                  filter: `blur(${blur}px)`,
                  transform: `translateX(${x}px)`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
