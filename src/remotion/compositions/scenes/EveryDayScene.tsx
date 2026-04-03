import { useCurrentFrame, interpolate, Easing } from "remotion";
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

/**
 * EveryDayScene — Purple bg, white text morphing sequence → diagonal card flow.
 *
 * Text phases with subtle breathing room between each:
 *   "Every day" → "Outrank scours the web," → "uncovers hidden" → "data sources."
 * Then large tilted cards flow diagonally from top-right corner to bottom-left corner.
 */

const PURPLE = "#9D62F0";

// Tool cards data — NO external URLs, all text-based logos
const TOOLS = [
  { name: "ahrefs", bg: "#2D5BE3", accentChar: "a", accentColor: "#FF6B35", restText: "hrefs", restColor: "#FFFFFF" },
  { name: "Google Ads", bg: "#FFFFFF", text: "Google Ads", textColor: "#5F6368", hasGoogleIcon: true },
  { name: "SEMrush", bg: "#FF622D", text: "SEMrush", textColor: "#FFFFFF" },
  { name: "Google Analytics", bg: "#FFFFFF", text: "Google Analytics", textColor: "#5F6368", hasGAIcon: true },
];

// Cards 30%+ bigger than before (was 380×200)
const CARD_W = 580;
const CARD_H = 320;

// Simple Google Ads icon as SVG
const GoogleAdsIcon = () => (
  <svg width="44" height="44" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
    <rect x="18" y="4" width="8" height="24" rx="4" fill="#4285F4" transform="rotate(15 22 16)" />
    <rect x="6" y="4" width="8" height="24" rx="4" fill="#FBBC04" transform="rotate(15 10 16)" />
    <circle cx="10" cy="26" r="4" fill="#34A853" />
  </svg>
);

// Simple Google Analytics icon as SVG
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
  // TEXT PHASE 1: "Every day"  (f0–22)
  // ═══════════════════════════════════════════════════════════════
  const edFadeIn = interpolate(frame, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const edFadeOut = interpolate(frame, [16, 22], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const edOp = Math.min(edFadeIn, edFadeOut);
  const edBlurIn = interpolate(frame, [0, 7], [4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const edBlurOut = interpolate(frame, [16, 22], [0, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const edBlur = frame < 16 ? edBlurIn : edBlurOut;
  const edScale = frame >= 16 ? interpolate(frame, [16, 22], [1, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

  // ═══════════════════════════════════════════════════════════════
  // TEXT PHASE 2: "Outrank scours the web,"  (f22–50)
  // ═══════════════════════════════════════════════════════════════
  const osFadeIn = interpolate(frame, [20, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const osBlurIn = interpolate(frame, [20, 26], [8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const osFadeOut = interpolate(frame, [42, 50], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const osOp = Math.min(osFadeIn, osFadeOut);
  const osMotionBlur = frame >= 42 ? interpolate(frame, [42, 50], [0, 22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : osBlurIn;
  const osXShift = frame >= 42 ? interpolate(frame, [42, 50], [0, -90], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }) : 0;

  // ═══════════════════════════════════════════════════════════════
  // TEXT PHASE 3: "uncovers hidden"  (f50–92)
  // ═══════════════════════════════════════════════════════════════
  const hiddenOp = interpolate(frame, [50, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const hiddenBlur = interpolate(frame, [50, 55], [6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const uncoversOp = interpolate(frame, [57, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const uhFadeOut = interpolate(frame, [76, 82], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });

  // ═══════════════════════════════════════════════════════════════
  // TEXT PHASE 4: "data sources."  (f80–128)
  // ═══════════════════════════════════════════════════════════════
  const dsFadeIn = interpolate(frame, [84, 92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const dsVerticalShift = interpolate(frame, [84, 92], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const dsFadeOut = interpolate(frame, [120, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const dsOp = Math.min(dsFadeIn, dsFadeOut);
  const dsBlur = frame >= 120 ? interpolate(frame, [120, 128], [0, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const dsExitX = frame >= 120 ? interpolate(frame, [120, 130], [0, -120], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }) : 0;
  const dsExitY = frame >= 120 ? interpolate(frame, [120, 130], [0, -80], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }) : 0;
  // No overlap — "uncovers hidden" fully exits before "data sources." enters

  // ═══════════════════════════════════════════════════════════════
  // CARDS PHASE: Large tilted cards flowing diagonally
  // top-right corner → bottom-left corner
  // Cards are rotated ~-20deg (along the diagonal) and flow slowly.
  // Multiple cards visible simultaneously for cinematic overlap.
  // ═══════════════════════════════════════════════════════════════
  const CARDS_START = 124;
  const CARD_STAGGER = 16;
  const CARD_TRAVEL = 70; // slow cinematic glide

  // Diagonal path: top-right off-screen → bottom-left off-screen
  // Start: beyond top-right corner
  const diagStartX = 1280 + CARD_W * 0.3;
  const diagStartY = -CARD_H - 100;
  // End: beyond bottom-left corner
  const diagEndX = -CARD_W - 100;
  const diagEndY = 720 + CARD_H * 0.3;

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
              {/* White bg with text cutout using mask */}
              <defs>
                <mask id="textMask">
                  {/* White = visible, black = hidden */}
                  <rect x="-30" y="-15" width="430" height="110" fill="white" />
                  <text
                    x="185"
                    y="64"
                    textAnchor="middle"
                    fontFamily={monoFont}
                    fontSize="68"
                    fontWeight="700"
                    fill="black"
                    letterSpacing="1"
                  >
                    Uncovers
                  </text>
                </mask>
              </defs>
              {/* White rectangle with text knocked out */}
              <rect x="-30" y="-15" width="430" height="110" rx="12" fill="white" mask="url(#textMask)" />
              {/* Dotted outline on top */}
              <text
                x="185"
                y="64"
                textAnchor="middle"
                fontFamily={monoFont}
                fontSize="68"
                fontWeight="700"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="1.8"
                strokeDasharray="3 2.5"
                letterSpacing="1"
              >
                Uncovers
              </text>
            </svg>
          </div>
          <span style={{
            fontSize: 70, fontWeight: 700, color: "#FFFFFF",
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
          paddingTop: 0,
          opacity: dsOp,
          filter: `blur(${dsBlur}px)`,
          transform: `translate(${dsExitX}px, ${dsVerticalShift + dsExitY}px)`,
        }}>
          <span style={{ fontSize: 70, fontWeight: 700, color: "#FFFFFF" }}>data sources.</span>
        </div>
      )}

      {/* ── DIAGONAL CARD FLOW: top-right → bottom-left, tilted ── */}
      {TOOLS.map((tool, i) => {
        const isLast = i === TOOLS.length - 1;
        const cardStart = CARDS_START + i * CARD_STAGGER;
        const cardEnd = cardStart + CARD_TRAVEL;

        const prog = interpolate(frame, [cardStart, cardEnd], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        if (prog <= 0 && !isLast) return null;
        if (!isLast && prog <= 0) return null;

        // Tilt: ~-20deg along the diagonal direction, slight variation per card
        const tilt = -20 + i * 1.5;

        let x: number, y: number, cardOp: number, cardScale: number, cardBlur: number;

        if (isLast) {
          // ── LAST CARD (Google Analytics): flows down, hits corner, bounces back ──
          const HIT_FRAME = cardStart + 40;     // hits corner
          const BOUNCE_BACK = HIT_FRAME + 5;    // bounces back peak
          const SETTLE = BOUNCE_BACK + 8;        // settles into final pos

          // Corner position — card stays INSIDE the frame boundary
          // Account for rotation: card is tilted ~-15deg so we need some margin
          const cornerX = 10;                    // left edge of card just inside frame
          const cornerY = 720 - CARD_H + 30;    // bottom edge of card just inside frame

          // Bounce-back position (slightly up-right from corner)
          const bounceX = cornerX + 70;
          const bounceY = cornerY - 60;

          // Settled position (between corner and bounce)
          const settleX = cornerX + 30;
          const settleY = cornerY - 20;

          if (frame < cardStart) {
            x = diagStartX;
            y = diagStartY;
            cardOp = 0;
            cardScale = 0.88;
            cardBlur = 5;
          } else if (frame < HIT_FRAME) {
            // Flow toward corner
            const flowProg = interpolate(frame, [cardStart, HIT_FRAME], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
              easing: Easing.in(Easing.quad),
            });
            x = interpolate(flowProg, [0, 1], [diagStartX, cornerX]);
            y = interpolate(flowProg, [0, 1], [diagStartY, cornerY]);
            cardOp = interpolate(flowProg, [0, 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            cardScale = interpolate(flowProg, [0, 0.5, 1], [0.88, 1.04, 1.08], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            cardBlur = interpolate(flowProg, [0, 0.3], [5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          } else if (frame < BOUNCE_BACK) {
            // Bounce back from corner (quick elastic snap)
            const bounceProg = interpolate(frame, [HIT_FRAME, BOUNCE_BACK], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            x = interpolate(bounceProg, [0, 1], [cornerX, bounceX]);
            y = interpolate(bounceProg, [0, 1], [cornerY, bounceY]);
            cardOp = 1;
            cardScale = interpolate(bounceProg, [0, 1], [1.08, 0.97], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            cardBlur = 0;
          } else if (frame < SETTLE) {
            // Settle back toward corner gently
            const settleProg = interpolate(frame, [BOUNCE_BACK, SETTLE], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
              easing: Easing.out(Easing.quad),
            });
            x = interpolate(settleProg, [0, 1], [bounceX, settleX]);
            y = interpolate(settleProg, [0, 1], [bounceY, settleY]);
            cardOp = 1;
            cardScale = interpolate(settleProg, [0, 1], [0.97, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            cardBlur = 0;
          } else {
            // Hold settled position
            x = settleX;
            y = settleY;
            cardOp = 1;
            cardScale = 1.0;
            cardBlur = 0;
          }
        } else {
          // ── Normal cards: flow through diagonally ──
          x = interpolate(prog, [0, 1], [diagStartX, diagEndX]);
          y = interpolate(prog, [0, 1], [diagStartY, diagEndY]);

          cardOp = interpolate(prog, [0, 0.08, 0.88, 1], [0, 1, 1, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          cardScale = interpolate(prog, [0, 0.45, 0.55, 1], [0.88, 1.06, 1.06, 0.88], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          cardBlur = interpolate(prog, [0, 0.2, 0.8, 1], [5, 0, 0, 5], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
        }

        // Shadow
        const shadowSize = isLast ? 24 : interpolate(prog, [0, 0.5, 1], [12, 30, 12], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const shadowOpVal = isLast ? 0.25 : interpolate(prog, [0, 0.5, 1], [0.12, 0.35, 0.12], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

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
              transform: `rotate(${tilt}deg) scale(${cardScale})`,
              filter: cardBlur > 0.3 ? `blur(${cardBlur}px)` : "none",
              boxShadow: `0 ${shadowSize}px ${shadowSize * 2}px rgba(0,0,0,${shadowOpVal})`,
              zIndex: 10 + i,
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
              <span style={{ fontSize: tool.name.length > 10 ? 34 : 46, fontWeight: 700, color: tool.textColor, fontFamily }}>
                {tool.text}
              </span>
            )}
          </div>
        );
      })}

      {/* ── RADIAL WIPE: white circle expands from bottom-left corner ── */}
      {frame >= 225 && (() => {
        // Circle expands from the bottom-left corner (0, 720)
        // Max radius needed to cover full 1280×720 frame from corner = ~1468px
        const maxRadius = 1500;
        const radius = interpolate(frame, [225, 242], [0, maxRadius], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        });
        return (
          <div style={{
            position: "absolute", inset: 0,
            backgroundColor: "#FFFFFF",
            clipPath: `circle(${radius}px at 0px 720px)`,
            zIndex: 200,
          }} />
        );
      })()}
    </div>
  );
};
