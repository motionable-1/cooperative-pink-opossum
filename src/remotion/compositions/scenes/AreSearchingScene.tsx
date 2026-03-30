import { useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * "are searching for," — white bold text centered on a slightly different purple gradient.
 *
 * Background: Radial purple gradient — lighter/luminous center, deeper purple edges.
 * More uniform than the ExactlyWhatScene gradient (no strong white glow from corner).
 * Text appears with a subtle fade/blur-in from nothing, then holds.
 */

export const AreSearchingScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Text entrance: quick fade + blur-in over first 4 frames
  const opacity = interpolate(frame, [0, 4], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const blur = interpolate(frame, [0, 4], [6, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const scale = interpolate(frame, [0, 4], [0.96, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      {/* Base purple */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#9333EA",
        }}
      />

      {/* Radial lighter center glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 65% at 50% 50%, rgba(180,130,255,0.5) 0%, rgba(147,51,234,0.2) 50%, transparent 80%)",
        }}
      />

      {/* Subtle edge darkening */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(80,20,160,0.25) 100%)",
        }}
      />

      {/* Centered text */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 52,
            color: "white",
            letterSpacing: "0.01em",
            opacity,
            filter: `blur(${blur}px)`,
            transform: `scale(${scale})`,
          }}
        >
          are searching for,
        </div>
      </div>
    </div>
  );
};
