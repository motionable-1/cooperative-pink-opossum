import { useCurrentFrame, interpolate, Easing, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

/**
 * "find the relevant KEYWORDS for you,"
 *
 * Typewriter text, centered on white bg.
 * "KEYWORDS" gets a highlight animation once fully typed:
 *   - Purple underline draws in from left → right
 *   - Word lifts up slightly with spring
 *   - Color shifts from black → vibrant purple
 *   - Subtle glow pulse behind the word
 */

// Split into segments so we can target KEYWORDS specially
const SEGMENTS = [
  { text: "find the relevant ", highlight: false },
  { text: "KEYWORDS", highlight: true },
  { text: " for you,", highlight: false },
];
const FULL_TEXT = SEGMENTS.map((s) => s.text).join("");

// Character index where KEYWORDS starts and ends
const KEYWORD_START = SEGMENTS[0].text.length; // 18
const KEYWORD_END = KEYWORD_START + SEGMENTS[1].text.length; // 26

export const FindKeywordsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in
  const fadeIn = interpolate(frame, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Typewriter — full text by frame 28
  const charCount = Math.floor(
    interpolate(frame, [4, 28], [0, FULL_TEXT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // KEYWORDS is fully typed once charCount >= KEYWORD_END
  const keywordFullyTyped = charCount >= KEYWORD_END;

  // Frame when KEYWORDS finishes typing (~frame 20-22)
  const keywordDoneFrame = 22;

  // Highlight animation triggers after KEYWORDS is fully typed
  const highlightDelay = keywordDoneFrame + 4; // slight pause before highlight kicks in

  // Underline draw-in: left → right
  const underlineProgress = interpolate(
    frame,
    [highlightDelay, highlightDelay + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Word lift (spring-based)
  const liftSpring = spring({
    frame: Math.max(0, frame - highlightDelay),
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.8 },
  });
  const keywordLift = liftSpring * -8;

  // Color shift: black → purple
  const colorProgress = interpolate(
    frame,
    [highlightDelay, highlightDelay + 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );

  // Scale pop
  const scalePop = spring({
    frame: Math.max(0, frame - highlightDelay),
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.6 },
  });
  const keywordScale = 1 + scalePop * 0.06;

  // Glow pulse behind KEYWORDS
  const glowOpacity = keywordFullyTyped
    ? interpolate(
        frame,
        [highlightDelay, highlightDelay + 6, highlightDelay + 18, highlightDelay + 24],
        [0, 0.6, 0.35, 0.25],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  // Mouse cursor
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

  // Build rendered characters grouped by segment
  let charIndex = 0;

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
        {SEGMENTS.map((segment, segIdx) => {
          const segmentChars = segment.text.split("").map((char, ci) => {
            const globalIdx = charIndex;
            charIndex++;
            const isVisible = globalIdx < charCount;
            const isTyping = globalIdx === charCount - 1;
            return { char, globalIdx, isVisible, isTyping, ci };
          });

          if (segment.highlight) {
            // KEYWORDS word — with highlight animation
            const purpleColor = `rgb(${Math.round(interpolate(colorProgress, [0, 1], [17, 147]))}, ${Math.round(interpolate(colorProgress, [0, 1], [17, 51]))}, ${Math.round(interpolate(colorProgress, [0, 1], [17, 234]))})`;

            return (
              <span
                key={segIdx}
                style={{
                  position: "relative",
                  display: "inline-block",
                  transform: `translateY(${keywordLift}px) scale(${keywordScale})`,
                  fontWeight: 800,
                }}
              >
                {/* Glow behind KEYWORDS */}
                <span
                  style={{
                    position: "absolute",
                    inset: "-12px -16px",
                    borderRadius: 12,
                    background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(147, 51, 234, 0.4) 0%, transparent 70%)",
                    filter: "blur(14px)",
                    opacity: glowOpacity,
                    pointerEvents: "none",
                  }}
                />
                {/* Purple underline */}
                <span
                  style={{
                    position: "absolute",
                    bottom: -4,
                    left: 0,
                    height: 4,
                    width: `${underlineProgress * 100}%`,
                    borderRadius: 2,
                    background: "linear-gradient(90deg, #9333ea, #c084fc, #9333ea)",
                    opacity: underlineProgress > 0 ? 1 : 0,
                  }}
                />
                {/* Characters */}
                {segmentChars.map(({ char, isVisible, isTyping, ci }) => (
                  <span
                    key={ci}
                    style={{
                      opacity: isVisible ? (isTyping ? 0.6 : 1) : 0,
                      whiteSpace: "pre",
                      color: keywordFullyTyped ? purpleColor : "#111111",
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            );
          }

          // Normal text segments
          return (
            <span key={segIdx}>
              {segmentChars.map(({ char, isVisible, isTyping, ci }) => (
                <span
                  key={ci}
                  style={{
                    opacity: isVisible ? (isTyping ? 0.6 : 1) : 0,
                    whiteSpace: "pre",
                  }}
                >
                  {char}
                </span>
              ))}
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
