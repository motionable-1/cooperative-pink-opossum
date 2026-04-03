import { useCurrentFrame, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

const PURPLE = "#AE62EE";

export const PublishedScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Quick pop-in: scale from 1.4 → 1 with a snappy spring
  const pop = spring({
    frame,
    fps: 30,
    config: { damping: 12, stiffness: 200, mass: 0.4 },
  });

  const scale = interpolate(pop, [0, 1], [1.4, 1]);
  const opacity = interpolate(pop, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        fontFamily,
        backgroundColor: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: 130,
          fontWeight: 900,
          color: PURPLE,
          letterSpacing: 8,
          whiteSpace: "nowrap",
          opacity,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        PUBLISHED
      </span>
    </div>
  );
};
