import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

/**
 * Search bar typing animation on white background.
 *
 * White bg, rounded search bar with thin purple border + purple glow behind it.
 * Black bold text types word-by-word: "and appear at the top automatically?"
 * After text completes, slow zoom INTO the bar (text gets cut off on sides).
 * Subtle text zoom throughout.
 *
 * Timing (54 output frames at 30fps):
 *   Frame 0-2:   Bar slides in, "and" starts typing
 *   Frame 3-6:   "appear" types in
 *   Frame 7-9:   "at" types
 *   Frame 10-12: "the" types
 *   Frame 13-17: "top" types and holds
 *   Frame 18-25: "automatically?" types
 *   Frame 26-54: Slow zoom into bar, text getting cut off
 */

const FULL_TEXT = "and appear at the top automatically?";

// Character-by-character typing with word-based timing
const WORDS = ["and", " ", "appear", " ", "at", " ", "the", " ", "top", " ", "automatically?"];
const WORD_FRAME_STARTS = [0, 2, 3, 6, 7, 9, 10, 12, 13, 16, 18];

const getVisibleText = (frame: number): string => {
  let text = "";
  for (let i = 0; i < WORDS.length; i++) {
    const wordStart = WORD_FRAME_STARTS[i];
    if (frame < wordStart) break;

    const word = WORDS[i];
    if (word === " ") {
      text += " ";
      continue;
    }

    // Each character in the word takes ~0.5 frames
    const wordLocalFrame = frame - wordStart;
    const charsVisible = Math.min(
      word.length,
      Math.floor(wordLocalFrame * 2.5) + 1
    );
    text += word.substring(0, charsVisible);

    if (charsVisible < word.length) break;
  }
  return text;
};

export const SearchBarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const visibleText = getVisibleText(frame);

  // Bar entrance: slides in from right
  const barTranslateX = interpolate(frame, [0, 4], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const barOpacity = interpolate(frame, [0, 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Zoom into bar after typing is complete (~frame 26+)
  const zoomStart = 26;
  const zoomProgress = interpolate(frame, [zoomStart, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Scale: 1 → 3.5 (zooms into the bar)
  const zoomScale = interpolate(zoomProgress, [0, 1], [1, 3.5]);

  // Subtle continuous text zoom before the big zoom kicks in
  const preZoomScale = interpolate(frame, [0, zoomStart], [1.0, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const totalScale = frame < zoomStart ? preZoomScale : zoomScale;

  // Purple glow intensity
  const glowIntensity = interpolate(frame, [0, 8, durationInFrames - 5], [0, 1, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // The last character fading in (typewriter effect)
  const lastCharOpacity = interpolate(
    (frame * 3) % 2,
    [0, 1],
    [0.4, 1],
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* Centered container that zooms */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${totalScale})`,
          willChange: "transform",
        }}
      >
        {/* Purple glow behind bar */}
        <div
          style={{
            position: "absolute",
            width: 820,
            height: 120,
            background:
              "radial-gradient(ellipse 100% 180% at 60% 50%, rgba(139, 92, 246, 0.25) 0%, rgba(168, 85, 247, 0.1) 40%, transparent 70%)",
            opacity: glowIntensity,
            filter: "blur(20px)",
          }}
        />

        {/* Search bar */}
        <div
          style={{
            position: "relative",
            width: 780,
            height: 72,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 40,
            border: "1.5px solid rgba(139, 92, 246, 0.35)",
            display: "flex",
            alignItems: "center",
            paddingLeft: 32,
            paddingRight: 32,
            opacity: barOpacity,
            transform: `translateX(${barTranslateX}px)`,
            boxShadow: `0 4px 30px rgba(139, 92, 246, ${0.12 * glowIntensity}), 0 0 60px rgba(168, 85, 247, ${0.08 * glowIntensity})`,
            overflow: "hidden",
          }}
        >
          {/* Typed text */}
          <div
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 28,
              color: "#000000",
              whiteSpace: "nowrap",
              letterSpacing: "-0.01em",
            }}
          >
            {visibleText.length > 0 && (
              <>
                <span>{visibleText.slice(0, -1)}</span>
                <span style={{ opacity: visibleText.length === FULL_TEXT.length ? 1 : lastCharOpacity }}>
                  {visibleText.slice(-1)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
