import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * "Meet !" in white text centered on black background.
 * Ref frames 064-069 (6 ref frames = ~9 output frames)
 *
 * Clean, straight, white bold text. "Meet" with a space then "!".
 * This is the "settled" version after the purple bouncy scene.
 * The text transitions from purple bouncy → clean white centered.
 *
 * Spring entrance, slight scale settle.
 */

export const MeetWhiteScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Quick scale-in from the purple bouncy text
  const scaleIn = interpolate(frame, [0, 4], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle continuous zoom
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.04], {
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
        }}
      >
        <div
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 72,
            color: "#FFFFFF",
            letterSpacing: "0.01em",
            transform: `scale(${scaleIn * zoom})`,
          }}
        >
          Meet !
        </div>
      </div>
    </div>
  );
};
