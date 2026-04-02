import { useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

/**
 * ApproveItScene — Matches reference frames captured at 300ms intervals:
 *
 * Ref 04 (0ms   → f0-8):   "Approve it" — "Approve" solid, "it" fading in with blur
 * Ref 05 (300ms → f9-17):  "Approve it" fully solid, hold
 * Ref 06 (600ms → f18-26): "Approve it" still visible + secondary text ALL appears at ~10-15% opacity. Cursor appears near "touch."
 * Ref 07 (900ms → f27-35): "Approve it" GONE. Secondary lines solidify top→bottom (line1=100%, line2=60%, line3=25%)
 * Ref 08 (1200ms→ f36-44): All text solid black. Light GRAY selection box + handles + rotation handle appear. Cursor at bottom-right of text.
 * Ref 09 (1500ms→ f45-53): Box border darkens to BLACK. Vertical dashed center guideline (light gray) appears full height.
 * Ref 10 (1800ms→ f54-72): Guideline GONE. Cursor drifts OUTSIDE box to lower-right. Hold.
 */

const SECONDARY_LINES = ["or add your", "personal", "touch."];

export const ApproveItScene: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1: "Approve it" entrance (f0-8) ─────────────────────
  const approveOp = interpolate(frame, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const itOp = interpolate(frame, [3, 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const itBlur = interpolate(frame, [3, 9], [8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // "Approve it" fades OUT as secondary text takes over (f24-30)
  const approveGroupOp = interpolate(frame, [24, 30], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });

  // ── Phase 2: Secondary text appears ALL AT ONCE at very low opacity (f18), then lines solidify top→bottom ──
  // f18: all lines appear at ~12% opacity simultaneously
  // f27-35: line 1 → 100%, line 2 → 60%, line 3 → 25% (top-down cascade)
  // f35+: all lines reach 100%
  const secondaryGlobalAppear = interpolate(frame, [18, 22], [0, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineOpacities = SECONDARY_LINES.map((_, i) => {
    // Phase A: all appear at ~12% together (f18-22)
    const ghostOp = secondaryGlobalAppear;
    // Phase B: each line solidifies with stagger (line0 at f27, line1 at f29, line2 at f31)
    const solidifyStart = 27 + i * 2;
    const solidOp = interpolate(frame, [solidifyStart, solidifyStart + 8], [0.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    // Use whichever is higher
    return frame < 27 ? ghostOp : solidOp;
  });

  // Slight upward shift as each line solidifies
  const lineYShifts = SECONDARY_LINES.map((_, i) => {
    const solidifyStart = 27 + i * 2;
    return interpolate(frame, [solidifyStart, solidifyStart + 8], [6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  });

  // ── Phase 3: Cursor ────────────────────────────────────────────
  // Appears at f18 (same time as ghost text), positioned near "touch." bottom-right
  const CURSOR_APPEAR = 18;
  const cursorOp = interpolate(frame, [CURSOR_APPEAR, CURSOR_APPEAR + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Cursor starts near "touch." text, stays there during box phase, then drifts outside box in final phase
  const DRIFT_START = 54;
  const cursorX = interpolate(frame, [CURSOR_APPEAR, DRIFT_START, 68], [700, 700, 780], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cursorY = interpolate(frame, [CURSOR_APPEAR, DRIFT_START, 68], [460, 465, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  // ── Phase 4: Selection bounding box (f36) ──────────────────────
  const BOX_APPEAR = 36;
  const boxOp = interpolate(frame, [BOX_APPEAR, BOX_APPEAR + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // Box border: light gray first (f36-44), then transitions to black (f45+)
  const borderDarken = interpolate(frame, [44, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const borderGray = Math.round(interpolate(borderDarken, [0, 1], [190, 34]));
  const boxStrokeColor = `rgb(${borderGray},${borderGray},${borderGray})`;

  // ── Phase 5: Center guide dashed line (f45-53 only, disappears at f54) ──
  const GUIDE_START = 45;
  const GUIDE_END = 54;
  const guideOp = frame < GUIDE_START ? 0
    : frame < GUIDE_START + 5 ? interpolate(frame, [GUIDE_START, GUIDE_START + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : frame < GUIDE_END ? 1
    : interpolate(frame, [GUIDE_END, GUIDE_END + 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Bounding box dimensions (around secondary text block) ──────
  // Text block is centered. 3 lines at ~44px font, ~1.15 line height
  // "or add your" ≈ 310px wide, "personal" ≈ 240px, "touch." ≈ 160px
  // Box should tightly frame all 3 lines
  const BOX_W = 360;
  const BOX_H = 170;
  const BOX_X = (1280 - BOX_W) / 2;
  const BOX_Y = 290;
  const HANDLE_SIZE = 8;
  const ROTATION_HANDLE_LEN = 22;

  // 8 resize handles: 4 corners + 4 midpoints
  const handles = [
    { x: BOX_X, y: BOX_Y },
    { x: BOX_X + BOX_W / 2, y: BOX_Y },
    { x: BOX_X + BOX_W, y: BOX_Y },
    { x: BOX_X + BOX_W, y: BOX_Y + BOX_H / 2 },
    { x: BOX_X + BOX_W, y: BOX_Y + BOX_H },
    { x: BOX_X + BOX_W / 2, y: BOX_Y + BOX_H },
    { x: BOX_X, y: BOX_Y + BOX_H },
    { x: BOX_X, y: BOX_Y + BOX_H / 2 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#FFFFFF",
        fontFamily,
      }}
    >
      {/* ── "Approve it" — fades out when secondary text solidifies ── */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: approveGroupOp,
        }}
      >
        <span
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#000000",
            opacity: approveOp,
          }}
        >
          Approve{" "}
        </span>
        <span
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#000000",
            opacity: itOp,
            filter: `blur(${itBlur}px)`,
          }}
        >
          it
        </span>
      </div>

      {/* ── "or add your / personal / touch." — centered in frame ── */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {SECONDARY_LINES.map((line, i) => (
          <span
            key={i}
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#000000",
              opacity: lineOpacities[i],
              transform: `translateY(${lineYShifts[i]}px)`,
              lineHeight: 1.2,
            }}
          >
            {line}
          </span>
        ))}
      </div>

      {/* ── Selection bounding box ── */}
      {frame >= BOX_APPEAR && (
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
            }}
          />

          {/* Rotation handle — vertical line + circle from top-center */}
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

      {/* ── Center guide dashed line — appears briefly then disappears ── */}
      {guideOp > 0 && (
        <svg
          style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: guideOp }}
          width="1280"
          height="720"
        >
          <line
            x1="640" y1="0" x2="640" y2="720"
            stroke="#AAAAAA" strokeWidth="1" strokeDasharray="6,4"
          />
        </svg>
      )}

      {/* ── Mouse cursor ── */}
      {frame >= CURSOR_APPEAR && (
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
