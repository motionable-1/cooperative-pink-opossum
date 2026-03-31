import { useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

/**
 * "Let Outrank automatically" — typewriter on white background.
 *
 * Ref frames 135-150 (16 frames at 50ms = 800ms).
 *
 * White background, black text centered.
 * Letters appear one at a time (typewriter effect).
 * "Outrank" turns purple (#7C3AED) once fully typed.
 * Text is bold, large (~48px), centered vertically and horizontally.
 *
 * Frame 136: "L" appearing
 * Frame 137: "Let"
 * Frame 138: "Let Outrank aut"
 * Frame 139: "Let Outrank automatica"
 * Frame 140: "Let Outrank automatically" (Outrank still black)
 * Frame 145: "Outrank" turns purple, holds
 */

const FULL_TEXT = "Let Outrank automatically";
const OUTRANK_START = 4; // index of "O" in "Let Outrank automatically"
const OUTRANK_END = 11; // index after "k" in "Outrank"

export const LetOutrankScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Typewriter: reveal characters over frames 0-14
  const totalChars = FULL_TEXT.length;
  const charsVisible = Math.floor(
    interpolate(frame, [0, 14], [0, totalChars], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // "Outrank" color transition: black → purple after all text is typed
  const outrankPurple = interpolate(frame, [15, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Build character spans with individual styling
  const characters = [];
  for (let i = 0; i < charsVisible; i++) {
    const char = FULL_TEXT[i];
    const isOutrank = i >= OUTRANK_START && i < OUTRANK_END;

    // Each new character fades from gray to full color
    const charAge = frame - (i / totalChars) * 14;
    const charOpacity = interpolate(charAge, [0, 2], [0.4, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    let color: string;
    if (isOutrank) {
      // Interpolate between black and purple
      const r = Math.round(interpolate(outrankPurple, [0, 1], [0, 124]));
      const g = Math.round(interpolate(outrankPurple, [0, 1], [0, 58]));
      const b = Math.round(interpolate(outrankPurple, [0, 1], [0, 237]));
      color = `rgb(${r}, ${g}, ${b})`;
    } else {
      color = "#111111";
    }

    characters.push(
      <span
        key={i}
        style={{
          color,
          opacity: charOpacity,
          fontWeight: isOutrank ? 800 : 700,
        }}
      >
        {char}
      </span>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 52,
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
        }}
      >
        {characters}
      </div>
    </div>
  );
};
