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

const CARD_W = 580;
const CARD_H = 320;

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
  // CARDS PHASE
  // ═══════════════════════════════════════════════════════════════
  const CARDS_START = 124;
  const CARD_STAGGER = 10;
  const CARD_TRAVEL = 50;

  const diagStartX = 1280 + CARD_W * 0.2;
  const diagStartY = -CARD_H - 60;
  const diagEndX = -CARD_W - 60;
  const diagEndY = 720 + CARD_H * 0.2;

  // ── Last card: simple timeline ──
  // Flies in → hits corner → ONE bounce via spring → splash to white
  const lastCardStart = CARDS_START + 3 * CARD_STAGGER; // f154
  const HIT_FRAME = lastCardStart + 28;                 // f182 — hits corner
  const SPLASH_START = HIT_FRAME + 18;                  // f200 — spring settles, splash begins
  const SPLASH_END = SPLASH_START + 12;                 // f212 — full white

  // Spring for the bounce — starts at HIT_FRAME, overshoots then settles
  const bounceSpring = frame >= HIT_FRAME
    ? spring({ frame: frame - HIT_FRAME, fps: 30, config: { damping: 8, stiffness: 120, mass: 0.6 } })
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
          opacity: osOp,
          filter: `blur(${osMotionBlur}px)`,
          transform: `translateX(${osXShift}px)`,
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
            opacity: uncoversOp,
            position: "relative",
            borderRadius: 12,
            overflow: "hidden",
            padding: "8px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
          <span style={{ fontSize: 70, fontWeight: 700, color: "#FFFFFF", opacity: hiddenOp, filter: `blur(${hiddenBlur}px)` }}>
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
          transform: `translate(${dsExitX}px, ${dsVerticalShift + dsExitY}px)`,
        }}>
          <span style={{ fontSize: 70, fontWeight: 700, color: "#FFFFFF" }}>data sources.</span>
        </div>
      )}

      {/* ── DIAGONAL CARD FLOW ── */}
      {TOOLS.map((tool, i) => {
        const isLast = i === TOOLS.length - 1;
        const cardStart = CARDS_START + i * CARD_STAGGER;
        const cardEnd = cardStart + CARD_TRAVEL;
        const tilt = -18 + i * 1.5;

        let x: number, y: number, cardOp: number, cardScale: number, cardBlur: number;
        let cardRotation = tilt;

        if (isLast) {
          // ══════════════════════════════════════════════════════
          // LAST CARD — fly in, one spring bounce, then splash
          // ══════════════════════════════════════════════════════
          const cornerX = 0;
          const cornerY = 720 - CARD_H;

          // Overshoot position — where the card goes BEFORE spring pulls it back
          // Card overshoots past the corner diagonally (further bottom-left)
          const overshootX = -60;
          const overshootY = cornerY + 40;

          if (frame < cardStart) {
            x = diagStartX;
            y = diagStartY;
            cardOp = 0;
            cardScale = 0.92;
            cardBlur = 3;
          } else if (frame < HIT_FRAME) {
            // Fly toward corner — accelerating
            const flowProg = interpolate(frame, [cardStart, HIT_FRAME], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
              easing: Easing.in(Easing.quad),
            });
            x = interpolate(flowProg, [0, 1], [diagStartX, overshootX]);
            y = interpolate(flowProg, [0, 1], [diagStartY, overshootY]);
            cardRotation = interpolate(flowProg, [0, 0.7, 1], [tilt, tilt * 0.3, -3]);
            cardOp = interpolate(flowProg, [0, 0.06], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            cardScale = interpolate(flowProg, [0.8, 1], [1, 1.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            cardBlur = interpolate(flowProg, [0, 0.2], [3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          } else {
            // Spring bounce: overshoots past corner, spring pulls back to corner
            // bounceSpring goes 0→1 with overshoot (damping=8 gives nice single bounce)
            x = interpolate(bounceSpring, [0, 1], [overshootX, cornerX]);
            y = interpolate(bounceSpring, [0, 1], [overshootY, cornerY]);
            cardRotation = interpolate(bounceSpring, [0, 1], [-3, 0]);
            cardScale = interpolate(bounceSpring, [0, 0.3, 1], [1.04, 0.96, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            cardOp = 1;
            cardBlur = 0;
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
                borderRadius: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                opacity: cardOp,
                transform: `rotate(${cardRotation}deg) scale(${cardScale})`,
                filter: cardBlur > 0.3 ? `blur(${cardBlur}px)` : "none",
                boxShadow: "0 24px 48px rgba(0,0,0,0.25)",
                zIndex: 10 + i,
                overflow: "hidden",
              }}
            >
              {tool.hasGAIcon && <GAIcon />}
              <span style={{ fontSize: 34, fontWeight: 700, color: tool.textColor, fontFamily }}>{tool.text}</span>
            </div>
          );
        }

        // ── Normal cards ──
        const prog = interpolate(frame, [cardStart, cardEnd], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        if (prog <= 0) return null;

        x = interpolate(prog, [0, 1], [diagStartX, diagEndX]);
        y = interpolate(prog, [0, 1], [diagStartY, diagEndY]);
        cardOp = interpolate(prog, [0, 0.06, 0.88, 1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        cardScale = 1;
        cardBlur = interpolate(prog, [0, 0.1, 0.9, 1], [2, 0, 0, 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const shadowSize = interpolate(prog, [0, 0.5, 1], [14, 24, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <div
            key={tool.name}
            style={{
              position: "absolute",
              left: x, top: y, width: CARD_W, height: CARD_H,
              backgroundColor: tool.bg,
              borderRadius: 28,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
              opacity: cardOp,
              transform: `rotate(${tilt}deg) scale(${cardScale}) translateZ(0)`,
              filter: cardBlur > 0.3 ? `blur(${cardBlur}px)` : "none",
              boxShadow: `0 ${shadowSize}px ${shadowSize * 2}px rgba(0,0,0,0.2)`,
              zIndex: 10 + i,
              backfaceVisibility: "hidden" as const,
            }}
          >
            {tool.hasGoogleIcon && <GoogleAdsIcon />}
            {tool.hasGAIcon && <GAIcon />}
            {tool.accentChar ? (
              <span style={{ fontSize: 56, fontWeight: 800, fontFamily }}>
                <span style={{ color: tool.accentColor }}>{tool.accentChar}</span>
                <span style={{ color: tool.restColor }}>{tool.restText}</span>
              </span>
            ) : (
              <span style={{ fontSize: tool.name.length > 10 ? 34 : 46, fontWeight: 700, color: tool.textColor, fontFamily }}>{tool.text}</span>
            )}
          </div>
        );
      })}

      {/* ── WHITE SPLASH: card expands to fill the frame ── */}
      {frame >= SPLASH_START && (() => {
        const wipeProg = interpolate(frame, [SPLASH_START, SPLASH_END], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const cardTop = 720 - CARD_H;
        const cardRight = 1280 - CARD_W;
        const top = interpolate(wipeProg, [0, 1], [cardTop, 0]);
        const right = interpolate(wipeProg, [0, 1], [cardRight, 0]);
        const br = interpolate(wipeProg, [0, 1], [28, 0]);

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
