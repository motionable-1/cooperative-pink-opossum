import { useCurrentFrame, interpolate, Easing, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const { fontFamily: monoFont } = loadMono("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

const PURPLE = "#9D62F0";

const TOOLS = [
  { name: "ahrefs", bg: "#2D5BE3", accentChar: "a", accentColor: "#FF6B35", restText: "hrefs", restColor: "#FFFFFF" },
  { name: "Google Ads", bg: "#FFFFFF", text: "Google Ads", textColor: "#5F6368", hasGoogleIcon: true },
  { name: "SEMrush", bg: "#FF622D", text: "SEMrush", textColor: "#FFFFFF" },
  { name: "Google Analytics", bg: "#FFFFFF", text: "Google Analytics", textColor: "#5F6368", hasGAIcon: true },
];

const CARD_W = 480;
const CARD_H = 280;

const GoogleAdsIcon = () => (
  <svg width="44" height="44" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
    <rect x="18" y="4" width="8" height="24" rx="4" fill="#4285F4" transform="rotate(15 22 16)" />
    <rect x="6" y="4" width="8" height="24" rx="4" fill="#FBBC04" transform="rotate(15 10 16)" />
    <circle cx="10" cy="26" r="4" fill="#34A853" />
  </svg>
);

const GAIcon = () => (
  <svg width="44" height="44" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
    <rect x="22" y="4" width="6" height="24" rx="3" fill="#F9AB00" />
    <rect x="13" y="10" width="6" height="18" rx="3" fill="#E37400" />
    <circle cx="7" cy="25" r="3.5" fill="#E37400" />
  </svg>
);

export const EveryDayScene: React.FC = () => {
  const frame = useCurrentFrame();

  // ═══════════════════════════════════════════════════════════════
  // TEXT PHASES (unchanged)
  // ═══════════════════════════════════════════════════════════════
  const edFadeIn = interpolate(frame, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const edFadeOut = interpolate(frame, [16, 22], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const edOp = Math.min(edFadeIn, edFadeOut);
  const edBlurIn = interpolate(frame, [0, 7], [4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const edBlurOut = interpolate(frame, [16, 22], [0, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const edBlur = frame < 16 ? edBlurIn : edBlurOut;
  const edScale = frame >= 16 ? interpolate(frame, [16, 22], [1, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

  const osFadeIn = interpolate(frame, [20, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const osBlurIn = interpolate(frame, [20, 26], [8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const osFadeOut = interpolate(frame, [42, 50], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const osOp = Math.min(osFadeIn, osFadeOut);
  const osMotionBlur = frame >= 42 ? interpolate(frame, [42, 50], [0, 22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : osBlurIn;
  const osXShift = frame >= 42 ? interpolate(frame, [42, 50], [0, -90], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }) : 0;

  const hiddenOp = interpolate(frame, [50, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const hiddenBlur = interpolate(frame, [50, 55], [6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const uncoversOp = interpolate(frame, [57, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const uhFadeOut = interpolate(frame, [76, 82], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });

  const dsFadeIn = interpolate(frame, [84, 92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const dsVerticalShift = interpolate(frame, [84, 92], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const dsFadeOut = interpolate(frame, [120, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const dsOp = Math.min(dsFadeIn, dsFadeOut);
  const dsBlur = frame >= 120 ? interpolate(frame, [120, 128], [0, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const dsExitX = frame >= 120 ? interpolate(frame, [120, 130], [0, -120], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }) : 0;
  const dsExitY = frame >= 120 ? interpolate(frame, [120, 130], [0, -80], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }) : 0;

  // ═══════════════════════════════════════════════════════════════
  // CARDS PHASE: 3D perspective stack — all 4 visible at once
  //
  // Reference: cards are stacked diagonally bottom-left → top-right
  // with heavy overlap (~40-50%), 3D perspective tilt (viewed from
  // low-left angle). ahrefs (blue) in front, GA at back.
  //
  // Animation: cards stagger in quickly, hold as stack, then
  // GA card (backmost) does spring bounce + white splash.
  // ═══════════════════════════════════════════════════════════════
  const CARDS_START = 126;
  const CARD_STAGGER_IN = 4;     // quick stagger — cards pop in fast

  // Card positions: stacked diagonally, overlapping heavily
  // Front card (ahrefs) at bottom-left, back card (GA) at top-right
  // Each card offset ~130px right and ~90px up from previous
  const STACK_BASE_X = 120;      // leftmost card X
  const STACK_BASE_Y = 340;      // leftmost card Y (centered-ish)
  const STEP_X = 160;            // horizontal offset per card
  const STEP_Y = -100;           // vertical offset per card (negative = up)

  // 3D perspective tilt — all cards share same rotation
  const TILT = -12;              // slight counter-clockwise rotation

  // Hold duration before GA card does its thing
  const STACK_HOLD_END = CARDS_START + 4 * CARD_STAGGER_IN + 30; // stack visible for ~30 frames
  const GA_BOUNCE_START = STACK_HOLD_END;
  const GA_SPLASH_START = GA_BOUNCE_START + 20;
  const GA_SPLASH_END = GA_SPLASH_START + 12;

  // Spring for GA card bounce
  const gaBounceSpring = frame >= GA_BOUNCE_START
    ? spring({ frame: frame - GA_BOUNCE_START, fps: 30, config: { damping: 8, stiffness: 120, mass: 0.6 } })
    : 0;

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
          opacity: osOp, filter: `blur(${osMotionBlur}px)`, transform: `translateX(${osXShift}px)`,
        }}>
          <span style={{ fontSize: 55, fontWeight: 700, color: "#FFFFFF" }}>Outrank scours the web,</span>
        </div>
      )}

      {/* ── "uncovers hidden" ── */}
      {(hiddenOp > 0.01 && uhFadeOut > 0.01) && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 18,
          opacity: uhFadeOut,
        }}>
          <div style={{
            opacity: uncoversOp, position: "relative", borderRadius: 12, overflow: "hidden",
            padding: "8px 22px", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="370" height="80" viewBox="0 0 370 80" style={{ overflow: "visible", position: "relative", zIndex: 2 }}>
              <defs>
                <mask id="textMask">
                  <rect x="-30" y="-15" width="430" height="110" fill="white" />
                  <text x="185" y="64" textAnchor="middle" fontFamily={monoFont} fontSize="68" fontWeight="700" fill="black" letterSpacing="1">Uncovers</text>
                </mask>
              </defs>
              <rect x="-30" y="-15" width="430" height="110" rx="12" fill="white" mask="url(#textMask)" />
              <text x="185" y="64" textAnchor="middle" fontFamily={monoFont} fontSize="68" fontWeight="700" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeDasharray="3 2.5" letterSpacing="1">Uncovers</text>
            </svg>
          </div>
          <span style={{ fontSize: 70, fontWeight: 700, color: "#FFFFFF", opacity: hiddenOp, filter: `blur(${hiddenBlur}px)` }}>hidden</span>
        </div>
      )}

      {/* ── "data sources." ── */}
      {dsOp > 0.01 && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: dsOp, filter: `blur(${dsBlur}px)`,
          transform: `translate(${dsExitX}px, ${dsVerticalShift + dsExitY}px)`,
        }}>
          <span style={{ fontSize: 70, fontWeight: 700, color: "#FFFFFF" }}>data sources.</span>
        </div>
      )}

      {/* ── 3D PERSPECTIVE CARD STACK ── */}
      {/* Render back-to-front: GA (back/top-right) first, ahrefs (front/bottom-left) last */}
      {[...TOOLS].reverse().map((tool, reverseIdx) => {
        const i = TOOLS.length - 1 - reverseIdx; // original index
        const isGA = i === 3; // Google Analytics = last in TOOLS array = backmost card

        // Each card staggers in
        const cardAppear = CARDS_START + i * CARD_STAGGER_IN;

        // Entrance spring for each card
        const enterSpring = frame >= cardAppear
          ? spring({ frame: frame - cardAppear, fps: 30, config: { damping: 12, stiffness: 180, mass: 0.5 } })
          : 0;

        if (enterSpring <= 0) return null;

        // Stack position: card i sits at base + i * step
        const stackX = STACK_BASE_X + i * STEP_X;
        const stackY = STACK_BASE_Y + i * STEP_Y;

        let x = stackX;
        let y = stackY;
        let rotation = TILT;
        let scale = 1;
        let opacity = 1;

        // Entrance: slide in from off-screen right + down
        const enterX = interpolate(enterSpring, [0, 1], [stackX + 400, stackX]);
        const enterY = interpolate(enterSpring, [0, 1], [stackY + 250, stackY]);
        const enterOp = interpolate(enterSpring, [0, 1], [0, 1]);
        const enterScale = interpolate(enterSpring, [0, 1], [0.7, 1]);

        x = enterX;
        y = enterY;
        opacity = enterOp;
        scale = enterScale;

        // GA card special behavior: after hold, flies to corner with spring bounce
        if (isGA && frame >= GA_BOUNCE_START) {
          const cornerX = 0;
          const cornerY = 720 - CARD_H;

          // Spring drives the whole motion: from stack position → overshoots past corner → settles at corner
          // gaBounceSpring: 0 → overshoots past 1 → settles at 1 (damping=8 gives nice overshoot)
          x = interpolate(gaBounceSpring, [0, 1], [stackX, cornerX]);
          y = interpolate(gaBounceSpring, [0, 1], [stackY, cornerY]);
          rotation = interpolate(gaBounceSpring, [0, 1], [TILT, 0]);
          scale = interpolate(gaBounceSpring, [0, 0.5, 1], [1, 1.05, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          opacity = 1;
        }

        // Z-index: front cards (low i) get higher z-index
        // But GA jumps to top when it starts bouncing
        let zIndex = 10 + (TOOLS.length - i);
        if (isGA && frame >= GA_BOUNCE_START) {
          zIndex = 50; // above all other cards
        }

        return (
          <div
            key={tool.name}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: CARD_W,
              height: CARD_H,
              backgroundColor: tool.bg,
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              opacity,
              transform: `rotate(${rotation}deg) scale(${scale})`,
              boxShadow: "0 16px 40px rgba(0,0,0,0.22)",
              zIndex,
              overflow: "hidden",
            }}
          >
            {tool.hasGoogleIcon && <GoogleAdsIcon />}
            {tool.hasGAIcon && <GAIcon />}
            {tool.accentChar ? (
              <span style={{ fontSize: 48, fontWeight: 800, fontFamily }}>
                <span style={{ color: tool.accentColor }}>{tool.accentChar}</span>
                <span style={{ color: tool.restColor }}>{tool.restText}</span>
              </span>
            ) : (
              <span style={{ fontSize: tool.name.length > 10 ? 30 : 40, fontWeight: 700, color: tool.textColor, fontFamily }}>{tool.text}</span>
            )}
          </div>
        );
      })}

      {/* ── WHITE SPLASH: GA card expands to fill frame ── */}
      {frame >= GA_SPLASH_START && (() => {
        const wipeProg = interpolate(frame, [GA_SPLASH_START, GA_SPLASH_END], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const cardTop = 720 - CARD_H;
        const cardRight = 1280 - CARD_W;
        const top = interpolate(wipeProg, [0, 1], [cardTop, 0]);
        const right = interpolate(wipeProg, [0, 1], [cardRight, 0]);
        const br = interpolate(wipeProg, [0, 1], [24, 0]);

        return (
          <div style={{
            position: "absolute",
            top, right, bottom: 0, left: 0,
            backgroundColor: "#FFFFFF",
            borderTopRightRadius: br,
            borderTopLeftRadius: br,
            zIndex: 200,
          }} />
        );
      })()}
    </div>
  );
};
