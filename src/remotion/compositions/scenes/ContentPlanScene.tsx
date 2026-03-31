import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * "Get a 30-day content plan."
 *
 * Ref frames 122–143+ (partial, continues after; estimated ~55 output frames).
 *
 * White background, text centered (~40% from left, ~43% from top).
 * Font: Inter 700, 54px.
 * "plan." renders in purple (#7C3AED) when typed.
 *
 * Animation:
 *   Frames  0–5 : Fade in
 *   Frames  3–26: Typewriter — "Get a 30-day content "
 *   Frames 26–32: "plan." types in purple
 *   Frames 32–55: Hold
 */

const TEXT_BLACK = "Get a 30-day content ";
const TEXT_PURPLE = "plan.";
const FULL_TEXT = TEXT_BLACK + TEXT_PURPLE;

export const ContentPlanScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in
  const fadeIn = interpolate(frame, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Total chars to show
  const charCount = Math.floor(
    interpolate(frame, [3, 32], [0, FULL_TEXT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const blackChars = Math.min(charCount, TEXT_BLACK.length);
  const purpleChars = Math.max(0, charCount - TEXT_BLACK.length);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#FFFFFF",
        opacity: fadeIn,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 54,
          letterSpacing: "-0.02em",
          color: "#111111",
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        {/* Black portion */}
        <span>{TEXT_BLACK.slice(0, blackChars)}</span>
        {/* Purple "plan." */}
        {purpleChars > 0 && (
          <span style={{ color: "#7C3AED" }}>
            {TEXT_PURPLE.slice(0, purpleChars)}
          </span>
        )}
      </div>
    </div>
  );
};
