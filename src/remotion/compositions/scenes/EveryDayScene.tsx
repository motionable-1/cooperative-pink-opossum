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

// Large cards — fill the frame prominently
const CARD_W = 640;
const CARD_H = 370;

const GoogleAdsIcon = () => (
  <svg width="56" height="56" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
    <rect x="18" y="4" width="8" height="24" rx="4" fill="#4285F4" transform="rotate(15 22 16)" />
    <rect x="6" y="4" width="8" height="24" rx="4" fill="#FBBC04" transform="rotate(15 10 16)" />
    <circle cx="10" cy="26" r="4" fill="#34A853" />
  </svg>
);

const GAIcon = () => (
  <svg width="56" height="56" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
    <rect x="22" y="4" width="6" height="24" rx="3" fill="#F9AB00" />
    <rect x="13" y="10" width="6" height="18" rx="3" fill="#E37400" />
    <circle cx="7" cy="25" r="3.5" fill="#E37400" />
  </svg>
);

export const EveryDayScene: React.FC = () => {
  const frame = useCurrentFrame();

  // ═══════════════════════════════════════════════════════════════
  // TEXT PHASES
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
  // CARDS PHASE: 3D perspective stack, all 4 visible
  //
  // Stack: ahrefs (front/bottom-left) → GA (back/top-right)
  // After hold, the FRONT card (ahrefs, closest to corner) slides
  // into the bottom-left corner and splashes to white.
  // This is continuous — the card is already near the corner,
  // so it just nudges down-left. No flying across the screen.
  // ═══════════════════════════════════════════════════════════════
  const CARDS_START = 126;
  const CARD_STAGGER_IN = 4;

  // Stack: diagonal from bottom-left (front) to top-right (back)
  // Centered on the frame, heavy overlap, clockwise tilt, 3D depth
  const STACK_CENTER_X = 580;    // center of the stack on screen
  const STACK_CENTER_Y = 340;    // slightly below vertical center
  const STEP_X = 120;            // horizontal offset per card (tight overlap)
  const STEP_Y = -80;            // vertical offset per card

  const TILT = 15;               // CLOCKWISE tilt (positive = tops lean right)

  // 3D perspective values
  const PERSPECTIVE = 1200;      // perspective distance
  const ROTATE_X = 8;            // subtle tilt backward
  const ROTATE_Y = -6;           // slight left-side-forward

  // Timeline: hold → front card spring-slides to corner → splash
  const STACK_HOLD_END = CARDS_START + 4 * CARD_STAGGER_IN + 32;
  const SLIDE_START = STACK_HOLD_END;         // front card begins spring slide
  const CARD_WHITE_START = SLIDE_START + 12;  // card starts turning white as it settles
  const SPLASH_START = SLIDE_START + 20;      // splash begins after card is mostly white
  const SPLASH_END = SPLASH_START + 18;       // long expansion for smooth coverage

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
      <div style={{
        position: "absolute", inset: 0,
        perspective: PERSPECTIVE,
        perspectiveOrigin: "50% 45%",
      }}>
        {[...TOOLS].reverse().map((tool, reverseIdx) => {
          const i = TOOLS.length - 1 - reverseIdx;
          const isFront = i === 0; // ahrefs = front card, closest to corner

          const cardAppear = CARDS_START + i * CARD_STAGGER_IN;
          const enterSpring = frame >= cardAppear
            ? spring({ frame: frame - cardAppear, fps: 30, config: { damping: 12, stiffness: 180, mass: 0.5 } })
            : 0;

          if (enterSpring <= 0) return null;

          // Stack position: front card bottom-left, back card top-right
          const stackX = STACK_CENTER_X + (i - 1.5) * STEP_X - CARD_W / 2;
          const stackY = STACK_CENTER_Y + (i - 1.5) * STEP_Y - CARD_H / 2;

          // Each card scales slightly smaller as it goes back for 3D depth
          const depthScale = 1 - i * 0.03;

          // Entrance: fly in from bottom-right
          const clampOpts = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
          let x = interpolate(enterSpring, [0, 1], [stackX + 350, stackX], clampOpts);
          let y = interpolate(enterSpring, [0, 1], [stackY + 200, stackY], clampOpts);
          let opacity = interpolate(enterSpring, [0, 1], [0, 1], clampOpts);
          let scale = interpolate(enterSpring, [0, 1], [0.75 * depthScale, depthScale], clampOpts);
          let rotation = TILT;
          let rx = ROTATE_X;
          let ry = ROTATE_Y;

          // Front card: after hold, nudges to bottom-left corner
          if (isFront && frame >= SLIDE_START) {
            const cornerX = 0;
            const cornerY = 720 - CARD_H;

            const slideSpring = spring({
              frame: frame - SLIDE_START,
              fps: 30,
              config: { damping: 26, stiffness: 90, mass: 0.5 },
            });

            x = interpolate(slideSpring, [0, 1], [stackX, cornerX]);
            y = interpolate(slideSpring, [0, 1], [stackY, cornerY]);
            rotation = interpolate(slideSpring, [0, 1], [TILT, 0]);
            rx = interpolate(slideSpring, [0, 1], [ROTATE_X, 0]);
            ry = interpolate(slideSpring, [0, 1], [ROTATE_Y, 0]);
            scale = depthScale;
            opacity = 1;
          }

          // Other cards fade out when front card starts moving
          if (!isFront && frame >= SLIDE_START) {
            const fadeOutProg = interpolate(frame, [SLIDE_START + 4, SLIDE_START + 14], [1, 0], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
              easing: Easing.in(Easing.quad),
            });
            opacity = fadeOutProg;
          }

          const zIndex = 10 + (TOOLS.length - i);

          return (
            <div
              key={tool.name}
              style={{
                position: "absolute",
                left: x, top: y, width: CARD_W, height: CARD_H,
                backgroundColor: tool.bg,
                borderRadius: 24,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
                opacity,
                transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotate(${rotation}deg) scale(${scale})`,
                boxShadow: "0 20px 50px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.1)",
                zIndex,
                overflow: "hidden",
              }}
            >
              {tool.hasGoogleIcon && <GoogleAdsIcon />}
              {tool.hasGAIcon && <GAIcon />}
              {tool.accentChar ? (
                <span style={{ fontSize: 58, fontWeight: 800, fontFamily }}>
                  <span style={{ color: tool.accentColor }}>{tool.accentChar}</span>
                  <span style={{ color: tool.restColor }}>{tool.restText}</span>
                </span>
              ) : (
                <span style={{ fontSize: tool.name.length > 10 ? 36 : 48, fontWeight: 700, color: tool.textColor, fontFamily }}>{tool.text}</span>
              )}
              {/* White overlay on front card — fades in before splash */}
              {isFront && frame >= CARD_WHITE_START && (() => {
                const whiteOp = interpolate(frame, [CARD_WHITE_START, CARD_WHITE_START + 10], [0, 1], {
                  extrapolateLeft: "clamp", extrapolateRight: "clamp",
                  easing: Easing.inOut(Easing.quad),
                });
                return (
                  <div style={{
                    position: "absolute", inset: 0,
                    backgroundColor: "#FFFFFF",
                    opacity: whiteOp,
                    borderRadius: 24,
                  }} />
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* ── WHITE SPLASH: white rectangle expands from card to fill frame ── */}
      {frame >= SPLASH_START && (() => {
        const wipeProg = interpolate(frame, [SPLASH_START, SPLASH_END], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),  // smooth ease-out curve
        });
        // Card is at bottom-left corner: left=0, top=720-CARD_H
        const cardTop = 720 - CARD_H;
        const cardRight = 1280 - CARD_W;
        // Expand from card bounds to full frame
        const top = interpolate(wipeProg, [0, 1], [cardTop, 0]);
        const right = interpolate(wipeProg, [0, 1], [cardRight, 0]);
        const br = interpolate(wipeProg, [0, 0.6], [24, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        return (
          <div style={{
            position: "absolute",
            top, right, bottom: 0, left: 0,
            backgroundColor: "#FFFFFF",
            borderTopRightRadius: br,
            borderTopLeftRadius: 0,
            zIndex: 200,
          }} />
        );
      })()}
    </div>
  );
};
