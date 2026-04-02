import { useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

/**
 * EveryDayScene — Purple bg, white text morphing sequence → tool logo cards fan.
 *
 * 16 ref frames at 300ms = 9 output frames each:
 *
 * 01 (f0-8):     "Every day" sharp white on purple
 * 02 (f9-17):    "Every day" slightly blurred (still fading in)
 * 03 (f18-26):   "Outrank scours the web," fully solid (Every day gone)
 * 04 (f27-35):   "Outrank scours the web," hold
 * 05 (f36-44):   "Outrank scours the web," heavy horizontal motion blur exit
 * 06 (f45-53):   "hidden" solid center-right, ghost of "uncovers" fading in left
 * 07 (f54-62):   "uncovers hidden" — "uncovers" lower opacity, "hidden" full white
 * 08 (f63-71):   "uncovers hidden" both fully solid
 * 09 (f72-80):   "uncovers hidden" + "data sources." appearing below
 * 10 (f81-89):   "data sources." only (uncovers hidden gone)
 * 11 (f90-98):   "data sources." hold
 * 12 (f99-107):  "data sources." hold
 * 13 (f108-116): "data sources." blurred fading. Ahrefs card enters from bottom.
 * 14 (f117-125): Ahrefs card centered
 * 15 (f126-134): Ahrefs slides LEFT, Google Ads enters from right
 * 16 (f135-148): All 4 cards fanned/stacked at angles
 */

const PURPLE = "#9D62F0";

// Tool cards data — NO external URLs, all text-based logos
const TOOLS = [
  { name: "ahrefs", bg: "#2D5BE3", accentChar: "a", accentColor: "#FF6B35", restText: "hrefs", restColor: "#FFFFFF" },
  { name: "Google Ads", bg: "#FFFFFF", text: "Google Ads", textColor: "#5F6368", hasGoogleIcon: true },
  { name: "SEMrush", bg: "#FF622D", text: "SEMrush", textColor: "#FFFFFF" },
  { name: "Google Analytics", bg: "#FFFFFF", text: "Google Analytics", textColor: "#5F6368", hasGAIcon: true },
];

const CARD_W = 380;
const CARD_H = 200;

// Simple Google Ads icon as SVG
const GoogleAdsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
    <rect x="18" y="4" width="8" height="24" rx="4" fill="#4285F4" transform="rotate(15 22 16)" />
    <rect x="6" y="4" width="8" height="24" rx="4" fill="#FBBC04" transform="rotate(15 10 16)" />
    <circle cx="10" cy="26" r="4" fill="#34A853" />
  </svg>
);

// Simple Google Analytics icon as SVG
const GAIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
    <rect x="22" y="4" width="6" height="24" rx="3" fill="#F9AB00" />
    <rect x="13" y="10" width="6" height="18" rx="3" fill="#E37400" />
    <circle cx="7" cy="25" r="3.5" fill="#E37400" />
  </svg>
);

export const EveryDayScene: React.FC = () => {
  const frame = useCurrentFrame();

  // ═══════════════════════════════════════════════════════════════
  // TEXT PHASE: "Every day"  (f0–17)
  // ═══════════════════════════════════════════════════════════════
  // f0: sharp, f9-17: slightly blurred (ref says still blurring in on frame 2)
  const edFadeIn = interpolate(frame, [0, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const edFadeOut = interpolate(frame, [14, 18], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const edOp = Math.min(edFadeIn, edFadeOut);
  // Slight blur on entrance that clears, then blurs again on exit
  const edBlurIn = interpolate(frame, [0, 6], [4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const edBlurOut = interpolate(frame, [14, 18], [0, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const edBlur = frame < 14 ? edBlurIn : edBlurOut;
  const edScale = frame >= 14 ? interpolate(frame, [14, 18], [1, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

  // ═══════════════════════════════════════════════════════════════
  // TEXT PHASE: "Outrank scours the web,"  (f18–44)
  // ═══════════════════════════════════════════════════════════════
  const osFadeIn = interpolate(frame, [16, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const osBlurIn = interpolate(frame, [16, 20], [8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const osFadeOut = interpolate(frame, [36, 42], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const osOp = Math.min(osFadeIn, osFadeOut);
  // Horizontal motion blur on exit (ref frame 5)
  const osMotionBlur = frame >= 36 ? interpolate(frame, [36, 42], [0, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : osBlurIn;
  const osXShift = frame >= 36 ? interpolate(frame, [36, 42], [0, -80], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }) : 0;

  // ═══════════════════════════════════════════════════════════════
  // TEXT PHASE: "hidden" appears first, then "uncovers" fades in  (f44–80)
  // ═══════════════════════════════════════════════════════════════
  // "hidden" appears solid first (f44)
  const hiddenOp = interpolate(frame, [44, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const hiddenBlur = interpolate(frame, [44, 48], [6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // "uncovers" fades in later at lower opacity, then solidifies
  const uncoversOp = interpolate(frame, [50, 64], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  // Both fade out together
  const uhFadeOut = interpolate(frame, [78, 84], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });

  // ═══════════════════════════════════════════════════════════════
  // TEXT PHASE: "data sources."  (f72–116)
  // ═══════════════════════════════════════════════════════════════
  // Appears as 2nd line under "uncovers hidden" first (f72-80), then alone (f81+)
  const dsFadeIn = interpolate(frame, [72, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const dsYShift = interpolate(frame, [72, 78], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const dsFadeOut = interpolate(frame, [108, 114], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const dsOp = Math.min(dsFadeIn, dsFadeOut);
  const dsBlur = frame >= 108 ? interpolate(frame, [108, 114], [0, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  // Text shifts up-left as it fades (ref frame 13)
  const dsExitX = frame >= 108 ? interpolate(frame, [108, 116], [0, -120], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }) : 0;
  const dsExitY = frame >= 108 ? interpolate(frame, [108, 116], [0, -80], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }) : 0;

  // ═══════════════════════════════════════════════════════════════
  // CARDS PHASE: Ahrefs enters from bottom → centered → slides left
  //              Google Ads enters from right → all 4 fan out
  // ═══════════════════════════════════════════════════════════════
  const CARDS_ENTER = 110;
  const AHREFS_CENTER = 117;
  const SLIDE_START = 126;
  const FAN_START = 135;

  // Ahrefs card: enter from bottom (f110), center (f117), slide left (f126)
  const ahrefsY = frame < AHREFS_CENTER
    ? interpolate(frame, [CARDS_ENTER, AHREFS_CENTER], [500, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.1)) })
    : 0;
  const ahrefsX = frame >= SLIDE_START
    ? interpolate(frame, [SLIDE_START, SLIDE_START + 6], [0, -300], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) })
    : 0;
  const ahrefsOp = frame < CARDS_ENTER ? 0 
    : frame < SLIDE_START ? interpolate(frame, [CARDS_ENTER, CARDS_ENTER + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : interpolate(frame, [SLIDE_START, SLIDE_START + 6], [1, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ahrefsBlur = frame >= SLIDE_START ? interpolate(frame, [SLIDE_START, SLIDE_START + 6], [0, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  // Google Ads: enter from right (f126)
  const gadsX = frame >= SLIDE_START
    ? interpolate(frame, [SLIDE_START, SLIDE_START + 6], [400, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
    : 400;
  const gadsOp = frame >= SLIDE_START
    ? interpolate(frame, [SLIDE_START, SLIDE_START + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Final fan: all 4 cards visible stacked at angles (f135+)
  const fanProg = interpolate(frame, [FAN_START, FAN_START + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // Card rendering helper
  const renderCard = (tool: typeof TOOLS[0], style: React.CSSProperties) => (
    <div
      key={tool.name}
      style={{
        position: "absolute",
        width: CARD_W,
        height: CARD_H,
        backgroundColor: tool.bg,
        borderRadius: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        ...style,
      }}
    >
      {tool.hasGoogleIcon && <GoogleAdsIcon />}
      {tool.hasGAIcon && <GAIcon />}
      {tool.accentChar ? (
        <span style={{ fontSize: 38, fontWeight: 800, fontFamily }}>
          <span style={{ color: tool.accentColor }}>{tool.accentChar}</span>
          <span style={{ color: tool.restColor }}>{tool.restText}</span>
        </span>
      ) : (
        <span style={{ fontSize: tool.name.length > 10 ? 24 : 32, fontWeight: 700, color: tool.textColor, fontFamily }}>
          {tool.text}
        </span>
      )}
    </div>
  );

  const cx = (1280 - CARD_W) / 2;
  const cy = (720 - CARD_H) / 2;

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: PURPLE, fontFamily, overflow: "hidden" }}>

      {/* ── "Every day" ── */}
      {edOp > 0.01 && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: edOp, transform: `scale(${edScale})`, filter: `blur(${edBlur}px)`,
        }}>
          <span style={{ fontSize: 58, fontWeight: 700, color: "#FFFFFF" }}>Every day</span>
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
          <span style={{ fontSize: 46, fontWeight: 700, color: "#FFFFFF" }}>Outrank scours the web,</span>
        </div>
      )}

      {/* ── "uncovers hidden" — "hidden" appears first, then "uncovers" fades in ── */}
      {(hiddenOp > 0.01 && uhFadeOut > 0.01) && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
          opacity: uhFadeOut,
        }}>
          <span style={{
            fontSize: 58, fontWeight: 700, color: "#FFFFFF",
            opacity: uncoversOp,
          }}>
            uncovers
          </span>
          <span style={{
            fontSize: 58, fontWeight: 700, color: "#FFFFFF",
            opacity: hiddenOp, filter: `blur(${hiddenBlur}px)`,
          }}>
            hidden
          </span>
        </div>
      )}

      {/* ── "data sources." ── */}
      {dsOp > 0.01 && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: dsOp,
          filter: `blur(${dsBlur}px)`,
          transform: `translate(${dsExitX}px, ${dsYShift + dsExitY}px)`,
        }}>
          <span style={{ fontSize: 58, fontWeight: 700, color: "#FFFFFF" }}>data sources.</span>
        </div>
      )}

      {/* ── TOOL CARDS ── */}

      {/* Card 0: Ahrefs — enters from bottom, centers, then slides left */}
      {frame >= CARDS_ENTER && frame < FAN_START && (
        renderCard(TOOLS[0], {
          left: cx + ahrefsX,
          top: cy + ahrefsY,
          opacity: ahrefsOp,
          filter: `blur(${ahrefsBlur}px)`,
        })
      )}

      {/* Card 1: Google Ads — enters from right during slide phase */}
      {frame >= SLIDE_START && frame < FAN_START && (
        renderCard(TOOLS[1], {
          left: cx + gadsX,
          top: cy,
          opacity: gadsOp,
        })
      )}

      {/* Final fan: all 4 cards stacked at angles */}
      {frame >= FAN_START && (
        <>
          {TOOLS.slice().reverse().map((tool, i) => {
            // i=0 is Google Analytics (back), i=3 is Ahrefs (front)
            const ri = 3 - i; // reverse index: 0=ahrefs, 1=gads, 2=sem, 3=ga
            const angle = interpolate(fanProg, [0, 1], [0, -6 + ri * 4]);
            const xOff = interpolate(fanProg, [0, 1], [0, -30 + ri * 20]);
            const yOff = interpolate(fanProg, [0, 1], [0, -10 + ri * 7]);
            const cardOp = ri < 2
              ? interpolate(fanProg, [0, 1], [ri === 0 ? 1 : 0, 1])
              : interpolate(fanProg, [0, 1], [0, 0.95]);
            return renderCard(tool, {
              left: cx + xOff,
              top: cy + yOff,
              opacity: cardOp,
              transform: `rotate(${angle}deg)`,
              zIndex: 10 + ri,
            });
          })}
        </>
      )}
    </div>
  );
};
