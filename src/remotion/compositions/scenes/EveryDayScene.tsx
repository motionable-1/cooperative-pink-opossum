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

const CARD_W = 440;
const CARD_H = 230;

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
  // CARDS PHASE: Diagonal flow from top-right to bottom-left
  // Cards are bigger, tilted ~-15deg, sliding diagonally across screen
  // ═══════════════════════════════════════════════════════════════
  const CARDS_START = 122;
  const TILT = -15; // all cards tilted this angle

  // Diagonal flow positions: top-right → center → bottom-left
  // Start position (off-screen top-right)
  const startX = 1280 + CARD_W;
  const startY = -CARD_H - 100;
  // End position (off-screen bottom-left)
  const endX = -CARD_W - 200;
  const endY = 720 + CARD_H + 100;

  // Stagger: each card enters 10 frames after the previous
  const CARD_STAGGER = 10;
  // Each card takes ~20 frames to cross the visible area
  const CARD_TRAVEL = 28;

  // Card rendering helper
  const renderCard = (tool: typeof TOOLS[0], style: React.CSSProperties) => (
    <div
      key={tool.name}
      style={{
        position: "absolute",
        width: CARD_W,
        height: CARD_H,
        backgroundColor: tool.bg,
        borderRadius: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        boxShadow: "0 12px 40px rgba(0,0,0,0.22)",
        ...style,
      }}
    >
      {tool.hasGoogleIcon && <GoogleAdsIcon />}
      {tool.hasGAIcon && <GAIcon />}
      {tool.accentChar ? (
        <span style={{ fontSize: 44, fontWeight: 800, fontFamily }}>
          <span style={{ color: tool.accentColor }}>{tool.accentChar}</span>
          <span style={{ color: tool.restColor }}>{tool.restText}</span>
        </span>
      ) : (
        <span style={{ fontSize: tool.name.length > 10 ? 28 : 36, fontWeight: 700, color: tool.textColor, fontFamily }}>
          {tool.text}
        </span>
      )}
    </div>
  );

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

      {/* ── DIAGONAL CARD FLOW: top-right → bottom-left, tilted ── */}
      {TOOLS.map((tool, i) => {
        const cardStart = CARDS_START + i * CARD_STAGGER;
        const cardEnd = cardStart + CARD_TRAVEL;

        // Progress through diagonal path: 0 = top-right off-screen, 1 = bottom-left off-screen
        const prog = interpolate(frame, [cardStart, cardEnd], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        });

        if (prog <= 0) return null;

        const x = interpolate(prog, [0, 1], [startX, endX]);
        const y = interpolate(prog, [0, 1], [startY, endY]);

        // Fade in as card enters view, fade out as it exits
        const cardOp = interpolate(prog, [0, 0.1, 0.85, 1], [0, 1, 1, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        // Subtle scale: slightly bigger in middle of travel
        const cardScale = interpolate(prog, [0, 0.5, 1], [0.9, 1.05, 0.9], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        return renderCard(tool, {
          left: x,
          top: y,
          opacity: cardOp,
          transform: `rotate(${TILT}deg) scale(${cardScale})`,
          zIndex: 10 + i,
        });
      })}
    </div>
  );
};
