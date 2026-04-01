import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

/**
 * "Tell us what your business is about." — word-by-word reveal on black.
 *
 * Each word fades in from gray to white sequentially.
 * "business" is rendered in italic.
 * Text is positioned left-of-center, ~50% vertical.
 * After all words are in, holds, then fades out at the end.
 *
 * Ref frames 010-048 (50ms each):
 *   011: "Tell" (dim gray)
 *   013: "Tell" (brighter)
 *   014: "Tell" white, "us" starting
 *   015-016: "Tell us"
 *   017: "Tell us what" (what fading in)
 *   019: "Tell us what your" (your fading in)
 *   022-023: "Tell us what your business" (business italic, fading in)
 *   026: "business is" (is fading in)
 *   028: "business is about." (about fading in)
 *   032-042: Full sentence holds
 *   046-048: Text starts fading out
 */

interface WordConfig {
  text: string;
  italic?: boolean;
  /** Frame at which this word starts appearing */
  startFrame: number;
  /** Frames it takes to go from invisible to full white */
  fadeInDuration: number;
}

const WORDS: WordConfig[] = [
  { text: "Tell", startFrame: 2, fadeInDuration: 5 },
  { text: "us", startFrame: 7, fadeInDuration: 5 },
  { text: "what", startFrame: 12, fadeInDuration: 5 },
  { text: "your", startFrame: 17, fadeInDuration: 5 },
  { text: "business", startFrame: 22, fadeInDuration: 6, italic: true },
  { text: "is", startFrame: 28, fadeInDuration: 4 },
  { text: "about.", startFrame: 32, fadeInDuration: 5 },
];

export const TellUsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Scene fade-out at the very end
  const sceneFadeOut = interpolate(
    frame,
    [durationInFrames - 5, durationInFrames - 1],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingLeft: "8%",
        opacity: sceneFadeOut,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0 16px",
          maxWidth: "90%",
          alignItems: "baseline",
        }}
      >
        {WORDS.map((word) => {
          const wordProgress = interpolate(
            frame,
            [word.startFrame, word.startFrame + word.fadeInDuration],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.quad),
            }
          );

          // Word opacity: starts at 0, goes to 1
          const opacity = wordProgress;

          // Color: gray → white (via opacity on white text)
          const colorValue = Math.round(interpolate(wordProgress, [0, 1], [50, 255]));
          const color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

          // Subtle Y translate (comes up slightly during fade-in)
          const fadeInY = interpolate(wordProgress, [0, 1], [8, 0]);

          // "business" shifts up once the full sentence is revealed (all words in by ~frame 37)
          const SENTENCE_COMPLETE_FRAME = 40;
          const businessLift = word.italic
            ? interpolate(
                frame,
                [SENTENCE_COMPLETE_FRAME, SENTENCE_COMPLETE_FRAME + 12],
                [0, -14],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.back(1.4)),
                }
              )
            : 0;

          return (
            <span
              key={word.text}
              style={{
                fontFamily,
                fontWeight: 700,
                fontSize: 62,
                fontStyle: word.italic ? "italic" : "normal",
                color,
                opacity,
                transform: `translateY(${fadeInY + businessLift}px)`,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
