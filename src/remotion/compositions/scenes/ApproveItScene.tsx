import { useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

/**
 * ApproveItScene — "Approve it" appears, then "or add your personal touch." fades in
 * line-by-line, then a design-tool selection box with handles + center guide appears.
 *
 * Timeline (30fps, reference frames at 300ms = 9 output frames):
 *   0-9:   "Approve it" types in word-by-word (Approve solid, "it" fading in)
 *   9-18:  "Approve it" fully solid, hold
 *  18-27:  "or add your / personal / touch." fades in top-to-bottom + cursor appears
 *  27-36:  text lines solidify top→bottom, cursor rests
 *  36-45:  selection bounding box with handles appears around secondary text
 *  45-54:  center guide dashed line appears, box outline darkens
 *  54-72:  hold / subtle cursor drift
 */

const SECONDARY_LINES = ["or add your", "personal", "touch."];

export const ApproveItScene: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1: "Approve it" entrance ─────────────────────────────
  const approveOp = interpolate(frame, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const itOp = interpolate(frame, [3, 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const itBlur = interpolate(frame, [3, 9], [8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // ── Phase 2: Secondary text line-by-line fade ──────────────────
  // Each line fades in with stagger: line 0 at frame 18, line 1 at 22, line 2 at 26
  const lineOpacities = SECONDARY_LINES.map((_, i) => {
    const start = 18 + i * 4;
    return interpolate(frame, [start, start + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  });

  const lineYShifts = SECONDARY_LINES.map((_, i) => {
    const start = 18 + i * 4;
    return interpolate(frame, [start, start + 9], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  });

  // ── Phase 3: Cursor ────────────────────────────────────────────
  const cursorAppear = 20;
  const cursorOp = interpolate(frame, [cursorAppear, cursorAppear + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Cursor drifts from right side toward the text block bottom-right
  const cursorX = interpolate(frame, [cursorAppear, 54], [520, 490], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cursorY = interpolate(frame, [cursorAppear, 54], [420, 440], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  // ── Phase 4: Selection bounding box ────────────────────────────
  const boxAppearStart = 36;
  const boxOp = interpolate(frame, [boxAppearStart, boxAppearStart + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  // Box outline darkens over time
  const boxStrokeColor = frame < 45 ? "#CCCCCC" : "#222222";

  // ── Phase 5: Center guide line ─────────────────────────────────
  const guideStart = 45;
  const guideOp = interpolate(frame, [guideStart, guideStart + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // ── Bounding box dimensions (around secondary text block) ──────
  const BOX_W = 340;
  const BOX_H = 160;
  const BOX_X = (1280 - BOX_W) / 2;
  const BOX_Y = 330;
  const HANDLE_SIZE = 8;
  const ROTATION_HANDLE_LEN = 24;

  // Handle positions (8 handles: 4 corners + 4 midpoints)
  const handles = [
    { x: BOX_X, y: BOX_Y }, // top-left
    { x: BOX_X + BOX_W / 2, y: BOX_Y }, // top-center
    { x: BOX_X + BOX_W, y: BOX_Y }, // top-right
    { x: BOX_X + BOX_W, y: BOX_Y + BOX_H / 2 }, // mid-right
    { x: BOX_X + BOX_W, y: BOX_Y + BOX_H }, // bottom-right
    { x: BOX_X + BOX_W / 2, y: BOX_Y + BOX_H }, // bottom-center
    { x: BOX_X, y: BOX_Y + BOX_H }, // bottom-left
    { x: BOX_X, y: BOX_Y + BOX_H / 2 }, // mid-left
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
      }}
    >
      {/* ── "Approve it" ── */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        <span
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#000000",
            opacity: approveOp,
          }}
        >
          Approve
        </span>
        <span
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#000000",
            opacity: itOp,
            filter: `blur(${itBlur}px)`,
          }}
        >
          it
        </span>
      </div>

      {/* ── "or add your personal touch." ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        {SECONDARY_LINES.map((line, i) => (
          <span
            key={i}
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: "#000000",
              opacity: lineOpacities[i],
              transform: `translateY(${lineYShifts[i]}px)`,
              lineHeight: 1.15,
            }}
          >
            {line}
          </span>
        ))}
      </div>

      {/* ── Selection bounding box ── */}
      {frame >= boxAppearStart && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: boxOp }}>
          {/* Box outline */}
          <div
            style={{
              position: "absolute",
              left: BOX_X,
              top: BOX_Y,
              width: BOX_W,
              height: BOX_H,
              border: `1.5px solid ${boxStrokeColor}`,
              borderRadius: 0,
            }}
          />

          {/* Rotation handle — line + circle from top-center */}
          <div
            style={{
              position: "absolute",
              left: BOX_X + BOX_W / 2 - 0.75,
              top: BOX_Y - ROTATION_HANDLE_LEN,
              width: 1.5,
              height: ROTATION_HANDLE_LEN,
              backgroundColor: boxStrokeColor,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: BOX_X + BOX_W / 2 - 5,
              top: BOX_Y - ROTATION_HANDLE_LEN - 10,
              width: 10,
              height: 10,
              borderRadius: "50%",
              border: `1.5px solid ${boxStrokeColor}`,
              backgroundColor: "#FFFFFF",
            }}
          />

          {/* 8 resize handles */}
          {handles.map((h, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: h.x - HANDLE_SIZE / 2,
                top: h.y - HANDLE_SIZE / 2,
                width: HANDLE_SIZE,
                height: HANDLE_SIZE,
                backgroundColor: "#FFFFFF",
                border: `1.5px solid ${boxStrokeColor}`,
                borderRadius: 1,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Center guide dashed line ── */}
      {frame >= guideStart && (
        <svg
          style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: guideOp }}
          width="1280"
          height="720"
        >
          <line
            x1="640"
            y1="0"
            x2="640"
            y2="720"
            stroke="#AAAAAA"
            strokeWidth="1"
            strokeDasharray="6,4"
          />
        </svg>
      )}

      {/* ── Mouse cursor ── */}
      {frame >= cursorAppear && (
        <svg
          style={{
            position: "absolute",
            left: cursorX,
            top: cursorY,
            width: 20,
            height: 26,
            opacity: cursorOp,
            pointerEvents: "none",
            zIndex: 100,
          }}
          viewBox="0 0 20 26"
          fill="none"
        >
          <path
            d="M2 2L2 18L5.5 14.5L9 22L12 21L8.5 13.5L14 13.5L2 2Z"
            fill="#111"
            stroke="#FFF"
            strokeWidth="1"
          />
        </svg>
      )}
    </div>
  );
};
