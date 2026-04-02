import { useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * "find the relevant KEYWORDS for you,"
 *
 * Ref frames 023–058 (35 ref frames at 50ms = 1.75s ≈ 52 output frames at 30fps).
 *
 * White background.
 * Text positioned lower-left (~9% from left, ~60% from top).
 * Font: Inter 700, 54px, black.
 * KEYWORDS is all-caps, same style (bold black).
 *
 * Animation:
 *   Frames  0–5 : Fade in
 *   Frames  4–28: Typewriter — full text appears character by character
 *   Frames 22–45: Mouse cursor springs in from below-center, moves to near "KEYWORDS"
 *   Frames 45–52: Hold
 */

const FULL_TEXT = "find the relevant KEYWORDS for you,";

export const FindKeywordsScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in
  const fadeIn = interpolate(frame, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Typewriter
  const charCount = Math.floor(
    interpolate(frame, [4, 28], [0, FULL_TEXT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const typedText = FULL_TEXT.slice(0, charCount);

  // Cursor: enters from bottom-center (640, 640) → moves to ~(700, 440)
  const cursorProgress = interpolate(frame, [22, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const cursorX = interpolate(cursorProgress, [0, 1], [540, 720]);
  const cursorY = interpolate(cursorProgress, [0, 1], [600, 380]);
  const cursorOpacity = interpolate(frame, [22, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#FFFFFF",
        opacity: fadeIn,
        overflow: "hidden",
        fontFamily,
      }}
    >
      {/* Text — centered */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 54,
          color: "#111111",
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        {typedText.split("").map((char, i) => {
          const isTyping = i === charCount - 1;
          return (
            <span
              key={i}
              style={{
                opacity: isTyping ? 0.6 : 1,
                whiteSpace: "pre",
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* Mouse cursor SVG */}
      {frame >= 22 && (
        <svg
          style={{
            position: "absolute",
            left: cursorX,
            top: cursorY,
            width: 28,
            height: 34,
            opacity: cursorOpacity,
            pointerEvents: "none",
          }}
          viewBox="0 0 28 34"
          fill="none"
        >
          <path
            d="M4 2L4 26L10 20L14 30L17 29L13 19L22 19L4 2Z"
            fill="#111111"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        </svg>
      )}
    </div>
  );
};
