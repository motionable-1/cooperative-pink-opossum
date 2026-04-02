import { useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

/**
 * EveryDayScene — Purple bg, white text morphing sequence → diagonal card flow.
 *
 * Text phases with subtle breathing room between each:
 *   "Every day" → "Outrank scours the web," → "uncovers hidden" → "data sources."
 * Then cards flow diagonally from top-right to bottom-left, tilted, larger.
 */

const PURPLE = "#9D62F0";

// Tool cards data — NO external URLs, all text-based logos
const TOOLS = [
  { name: "ahrefs", bg: "#2D5BE3", accentChar: "a", accentColor: "#FF6B35", restText: "hrefs", restColor: "#FFFFFF" },
  { name: "Google Ads", bg: "#FFFFFF", text: "Google Ads", textColor: "#5F6368", hasGoogleIcon: true },
  { name: "SEMrush", bg: "#FF622D", text: "SEMrush", textColor: "#FFFFFF" },
  { name: "Google Analytics", bg: "#FFFFFF", text: "Google Analytics", textColor: "#5F6368", hasGAIcon: true },
];

const CARD_W = 520;
const CARD_H = 280;

// Simple Google Ads icon as SVG
const GoogleAdsIcon = () => (
  <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
    <rect x="18" y="4" width="8" height="24" rx="4" fill="#4285F4" transform="rotate(15 22 16)" />
    <rect x="6" y="4" width="8" height="24" rx="4" fill="#FBBC04" transform="rotate(15 10 16)" />
    <circle cx="10" cy="26" r="4" fill="#34A853" />
  </svg>
);

// Simple Google Analytics icon as SVG
const GAIcon = () => (
  <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
    <rect x="22" y="4" width="6" height="24" rx="3" fill="#F9AB00" />
    <rect x="13" y="10" width="6" height="18" rx="3" fill="#E37400" />
    <circle cx="7" cy="25" r="3.5" fill="#E37400" />
  </svg>
);

export const EveryDayScene: React.FC = () => {
  const frame = useCurrentFrame();

  // ═══════════════════════════════════════════════════════════════
  // TEXT PHASE 1: "Every day"  (f0–22)  — added ~4f breathing room
  // ═══════════════════════════════════════════════════════════════
  const edFadeIn = interpolate(frame, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const edFadeOut = interpolate(frame, [16, 22], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const edOp = Math.min(edFadeIn, edFadeOut);
  const edBlurIn = interpolate(frame, [0, 7], [4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const edBlurOut = interpolate(frame, [16, 22], [0, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const edBlur = frame < 16 ? edBlurIn : edBlurOut;
  const edScale = frame >= 16 ? interpolate(frame, [16, 22], [1, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

  // ═══════════════════════════════════════════════════════════════
  // TEXT PHASE 2: "Outrank scours the web,"  (f22–50)  — +4f gap before, +4f hold
  // ═══════════════════════════════════════════════════════════════
  const osFadeIn = interpolate(frame, [20, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const osBlurIn = interpolate(frame, [20, 26], [8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const osFadeOut = interpolate(frame, [42, 50], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const osOp = Math.min(osFadeIn, osFadeOut);
  const osMotionBlur = frame >= 42 ? interpolate(frame, [42, 50], [0, 22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : osBlurIn;
  const osXShift = frame >= 42 ? interpolate(frame, [42, 50], [0, -90], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }) : 0;

  // ═══════════════════════════════════════════════════════════════
  // TEXT PHASE 3: "uncovers hidden"  (f50–92)  — +6f gap, wider hold
  // "hidden" appears first, then "uncovers" fades in
  // ═══════════════════════════════════════════════════════════════
  const hiddenOp = interpolate(frame, [50, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const hiddenBlur = interpolate(frame, [50, 55], [6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const uncoversOp = interpolate(frame, [57, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const uhFadeOut = interpolate(frame, [86, 94], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });

  // ═══════════════════════════════════════════════════════════════
  // TEXT PHASE 4: "data sources."  (f80–128)  — overlaps with uh exit, then alone
  // Positioned BELOW center when "uncovers hidden" is still visible, then moves to center
  // ═══════════════════════════════════════════════════════════════
  const dsFadeIn = interpolate(frame, [80, 88], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const dsVerticalShift = interpolate(frame, [80, 88], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const dsFadeOut = interpolate(frame, [120, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const dsOp = Math.min(dsFadeIn, dsFadeOut);
  const dsBlur = frame >= 120 ? interpolate(frame, [120, 128], [0, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const dsExitX = frame >= 120 ? interpolate(frame, [120, 130], [0, -120], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }) : 0;
  const dsExitY = frame >= 120 ? interpolate(frame, [120, 130], [0, -80], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }) : 0;
  // When "uncovers hidden" is still visible (before f94), push "data sources." down
  const dsBelow = frame < 94 ? 110 : 0;

  // ═══════════════════════════════════════════════════════════════
  // CARDS PHASE: Cinematic faux-3D flowing cards
  // Simulated perspective using skewY + asymmetric scale so cards
  // look like we're watching them glide past from the side.
  // Tighter stagger = multiple cards visible & overlapping at once.
  // ═══════════════════════════════════════════════════════════════
  const CARDS_START = 124;
  const CARD_STAGGER = 14;  // tighter so cards overlap on screen
  const CARD_TRAVEL = 65;   // slower, more cinematic travel

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: PURPLE, fontFamily, overflow: "hidden" }}>

      {/* ── "Every day" ── */}
      {edOp > 0.01 && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: edOp, transform: `scale(${edScale})`, filter: `blur(${edBlur}px)`,
        }}>
          <span style={{ fontSize: 70, fontWeight: 700, color: "#FFFFFF" }}>Every day</span>
        </div>
      )}

      {/* ── "Outrank scours the web," ── */}
      {osOp > 0.01 && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: osOp,
          filter: `blur(${osMotionBlur}px)`,
          transform: `translateX(${osXShift}px)`,
        }}>
          <span style={{ fontSize: 55, fontWeight: 700, color: "#FFFFFF" }}>Outrank scours the web,</span>
        </div>
      )}

      {/* ── "uncovers hidden" — "hidden" appears first, then "uncovers" fades in ── */}
      {(hiddenOp > 0.01 && uhFadeOut > 0.01) && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 18,
          opacity: uhFadeOut,
        }}>
          <span style={{
            fontSize: 70, fontWeight: 700, color: "#FFFFFF",
            opacity: uncoversOp,
          }}>
            uncovers
          </span>
          <span style={{
            fontSize: 70, fontWeight: 700, color: "#FFFFFF",
            opacity: hiddenOp, filter: `blur(${hiddenBlur}px)`,
          }}>
            hidden
          </span>
        </div>
      )}

      {/* ── "data sources." — sits below center when "uncovers hidden" visible, then centers ── */}
      {dsOp > 0.01 && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          paddingTop: dsBelow,
          opacity: dsOp,
          filter: `blur(${dsBlur}px)`,
          transform: `translate(${dsExitX}px, ${dsVerticalShift + dsExitY}px)`,
        }}>
          <span style={{ fontSize: 70, fontWeight: 700, color: "#FFFFFF" }}>data sources.</span>
        </div>
      )}

      {/* ── CINEMATIC 3D CARD FLOW: right → left, tilted perspective ── */}
      {TOOLS.map((tool, i) => {
        const cardStart = CARDS_START + i * CARD_STAGGER;
        const cardEnd = cardStart + CARD_TRAVEL;

        // Progress: 0 = off-screen right, 0.5 = center, 1 = off-screen left
        const prog = interpolate(frame, [cardStart, cardEnd], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        if (prog <= 0) return null;

        // Horizontal flow: smooth glide right → center → left
        const x = interpolate(prog, [0, 0.5, 1], [1450, (1280 - CARD_W) / 2, -CARD_W - 400], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        // Gentle vertical arc: slight rise to center, descend on exit
        const y = interpolate(prog, [0, 0.35, 0.65, 1], [380, (720 - CARD_H) / 2 - 30, (720 - CARD_H) / 2 - 30, 260], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        // 3D rotateY: strong perspective tilt — angled on entry, face-on at center, angled on exit
        const rotY = interpolate(prog, [0, 0.4, 0.6, 1], [55, -3, -3, -50], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        // Z-axis tilt for that cinematic sideways lean
        const rotZ = interpolate(prog, [0, 0.5, 1], [-8, -2, 4], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        // Opacity: fade in, full at center, fade out
        const cardOp = interpolate(prog, [0, 0.12, 0.85, 1], [0, 1, 1, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        // Scale: smaller at edges, full at center
        const cardScale = interpolate(prog, [0, 0.5, 1], [0.82, 1.04, 0.82], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        // Depth-of-field: blurred at edges, crisp at center
        const cardBlur = interpolate(prog, [0, 0.25, 0.75, 1], [6, 0, 0, 6], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        // z-index: highest when closest to center
        const zi = 100 - Math.abs(Math.round((prog - 0.5) * 100));

        return (
          <div
            key={tool.name}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: CARD_W,
              height: CARD_H,
              perspective: 900,
              zIndex: zi,
            }}
          >
            {renderCard(tool, {
              position: "relative",
              width: CARD_W,
              height: CARD_H,
              opacity: cardOp,
              transform: `rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${cardScale})`,
              filter: cardBlur > 0.3 ? `blur(${cardBlur}px)` : "none",
              left: 0,
              top: 0,
            })}
          </div>
        );
      })}
    </div>
  );
};
