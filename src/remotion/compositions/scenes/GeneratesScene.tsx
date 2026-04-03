import { useCurrentFrame, interpolate, Easing, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

const PURPLE = "#A855F7";
const FULL_TEXT = "Generates stunning images...";

export const GeneratesScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Typewriter: reveal characters over time
  const TYPING_START = 8;
  const CHARS_PER_FRAME = 0.7;
  const visibleChars = Math.floor(
    Math.max(0, (frame - TYPING_START) * CHARS_PER_FRAME)
  );
  const displayText = FULL_TEXT.slice(0, Math.min(visibleChars, FULL_TEXT.length));
  const typingDone = visibleChars >= FULL_TEXT.length;

  // Bar slides in from right
  const barSlide = spring({
    frame,
    fps: 30,
    config: { damping: 18, stiffness: 120, mass: 0.6 },
  });
  const barX = interpolate(barSlide, [0, 1], [1400, 0]);

  // Cursor appears and clicks after typing
  const CURSOR_APPEAR = 10;
  const cursorOp = interpolate(frame, [CURSOR_APPEAR, CURSOR_APPEAR + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cursor position: starts at right-center, moves to bottom of bar
  const cursorStartX = 900;
  const cursorStartY = 420;
  const cursorEndX = 640;
  const cursorEndY = 390;
  const cursorMove = frame >= CURSOR_APPEAR + 10
    ? interpolate(frame, [CURSOR_APPEAR + 10, CURSOR_APPEAR + 22], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
      })
    : 0;
  const cursorX = interpolate(cursorMove, [0, 1], [cursorStartX, cursorEndX]);
  const cursorY = interpolate(cursorMove, [0, 1], [cursorStartY, cursorEndY]);

  // Cursor click animation (scale pulse)
  const CLICK_FRAME = CURSOR_APPEAR + 24;
  const clickPulse = frame >= CLICK_FRAME && frame < CLICK_FRAME + 6
    ? interpolate(frame, [CLICK_FRAME, CLICK_FRAME + 3, CLICK_FRAME + 6], [1, 0.8, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // "EXPLORE NOW!" text that appears with the bar  
  const exploreOp = interpolate(barSlide, [0.5, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Typing cursor blink
  const cursorBlink = Math.sin(frame * 0.4) > 0 ? 1 : 0;
  const showTypingCursor = !typingDone || (frame % 20 < 10);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: PURPLE,
        fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Search/Input bar */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: -20,
          top: "50%",
          transform: `translateY(-50%) translateX(${barX}px)`,
          height: 120,
          backgroundColor: "#FFFFFF",
          borderRadius: "28px 0 0 28px",
          display: "flex",
          alignItems: "center",
          paddingLeft: 40,
          boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* Typed text */}
        <span
          style={{
            fontSize: 46,
            fontWeight: 700,
            color: "#000000",
            letterSpacing: -0.5,
          }}
        >
          {displayText}
          {showTypingCursor && (
            <span
              style={{
                display: "inline-block",
                width: 3,
                height: 42,
                backgroundColor: "#000000",
                marginLeft: 2,
                verticalAlign: "middle",
                opacity: typingDone ? cursorBlink : 1,
              }}
            />
          )}
        </span>
      </div>

      {/* "EXPLORE NOW!" ghost text above bar — faint */}
      <div
        style={{
          position: "absolute",
          top: "28%",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: exploreOp * 0.08,
          fontSize: 52,
          fontWeight: 800,
          color: "#FFFFFF",
          letterSpacing: 4,
          textTransform: "uppercase" as const,
        }}
      >
        EXPLORE NOW!
      </div>

      {/* Mouse cursor */}
      <div
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          opacity: cursorOp,
          transform: `scale(${clickPulse})`,
          transformOrigin: "top left",
          zIndex: 100,
        }}
      >
        <svg
          width="28"
          height="36"
          viewBox="0 0 24 32"
          fill="none"
        >
          <path
            d="M2 2L2 26L8 20L14 30L18 28L12 18L20 18L2 2Z"
            fill="#000000"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
