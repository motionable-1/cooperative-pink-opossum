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
 * Cards nearly touch each other (5-8px gap).
 * Last card hits corner with natural ball-bounce physics, then expands like water.
 */

const PURPLE = "#9D62F0";

// Tool cards data — NO external URLs, all text-based logos
const TOOLS = [
  { name: "ahrefs", bg: "#2D5BE3", accentChar: "a", accentColor: "#FF6B35", restText: "hrefs", restColor: "#FFFFFF" },
  { name: "Google Ads", bg: "#FFFFFF", text: "Google Ads", textColor: "#5F6368", hasGoogleIcon: true },
  { name: "SEMrush", bg: "#FF622D", text: "SEMrush", textColor: "#FFFFFF" },
  { name: "Google Analytics", bg: "#FFFFFF", text: "Google Analytics", textColor: "#5F6368", hasGAIcon: true },
];

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

/**
 * Real ball-bounce physics.
 *
 * Models a ball hitting a wall and bouncing back with gravity.
 * Each bounce is a parabolic arc (like real gravity), and each
 * successive bounce loses energy (coefficient of restitution).
 *
 * @param t - normalized time 0→1 across the full bounce sequence
 * @param restitution - energy kept per bounce (0.45 = loses 55% each time)
 * @returns displacement 0→peak→0→peak→0... settling to 0
 */
const ballBounce = (t: number): number => {
  if (t <= 0 || t >= 1) return 0;

  // Restitution = energy kept per bounce. 0.55 gives 3 clearly visible bounces.
  const restitution = 0.55;

  // Pre-compute bounce heights and durations
  // Height of bounce n = restitution^n (first bounce = 1.0)
  // Duration of bounce n = sqrt(height) = restitution^(n/2) (physics: time ∝ √height)
  const bounceHeights: number[] = [];
  const bounceDurations: number[] = [];
  let totalDur = 0;

  for (let i = 0; i < 4; i++) {
    const h = Math.pow(restitution, i);
    const d = Math.pow(restitution, i / 2);
    bounceHeights.push(h);
    bounceDurations.push(d);
    totalDur += d;
  }

  // Normalize durations so they sum to 1.0
  const normDurations = bounceDurations.map((d) => d / totalDur);

  // Find which bounce arc we're in
  let elapsed = 0;
  for (let i = 0; i < normDurations.length; i++) {
    const start = elapsed;
    const end = elapsed + normDurations[i];
    if (t >= start && t < end) {
      // localT: 0→1 within this bounce arc
      const localT = (t - start) / normDurations[i];
      // Parabolic arc: 4h·t·(1-t) — peaks at h when localT=0.5
      return 4 * bounceHeights[i] * localT * (1 - localT);
    }
    elapsed = end;
  }

  return 0;
};

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

  // ═══════════════════════════════════════════════════════════════
  // CARDS PHASE: Tilted cards flowing diagonally, nearly touching
  //
  // Cards are tilted at ~-18deg. Along the diagonal, consecutive
  // cards should be ~6px apart (nearly touching).
  // The diagonal path length from one card center to the next
  // at 6px gap ≈ CARD_H (rotated) + 6px ≈ ~330px apart on the diagonal.
  //
  // Speed: faster flow — CARD_TRAVEL=50 frames per card.
  // Stagger: tight — 10 frames between each card launch.
  // ═══════════════════════════════════════════════════════════════
  const CARDS_START = 124;
  const CARD_STAGGER = 10;    // tight stagger so cards nearly touch
  const CARD_TRAVEL = 50;     // faster flow, more energetic

  // Diagonal path: top-right off-screen → bottom-left off-screen
  const diagStartX = 1280 + CARD_W * 0.2;
  const diagStartY = -CARD_H - 60;
  const diagEndX = -CARD_W - 60;
  const diagEndY = 720 + CARD_H * 0.2;

  // ── Last card timing ──
  const lastCardStart = CARDS_START + 3 * CARD_STAGGER; // card index 3
  const HIT_FRAME = lastCardStart + 30;      // arrives at corner faster
  const BOUNCE_DURATION = 28;                 // 28 frames ≈ 0.93s of bounce physics
  const BOUNCE_END = HIT_FRAME + BOUNCE_DURATION;
  const HOLD_AFTER_BOUNCE = 6;                // brief hold before wipe
  const WIPE_START = BOUNCE_END + HOLD_AFTER_BOUNCE;
  const WIPE_DURATION = 14;                   // fast wipe
  const WIPE_END = WIPE_START + WIPE_DURATION;

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
              <rect x="-30" y="-15" width="430" height="110" rx="12" fill="white" mask="url(#textMask)" />
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

      {/* ── DIAGONAL CARD FLOW ── */}
      {TOOLS.map((tool, i) => {
        const isLast = i === TOOLS.length - 1;
        const cardStart = CARDS_START + i * CARD_STAGGER;
        const cardEnd = cardStart + CARD_TRAVEL;

        // Tilt: ~-18deg, slight variation per card
        const tilt = -18 + i * 1.5;

        let x: number, y: number, cardOp: number, cardScale: number, cardBlur: number;
        let cardRotation = tilt;

        if (isLast) {
          // ══════════════════════════════════════════════════════════
          // LAST CARD: Google Analytics — flies to corner, BALL BOUNCE
          // Natural damped oscillation like a ball hitting a wall.
          // Card stays inside frame at all times.
          // ══════════════════════════════════════════════════════════

          // Corner position — card sits flush in bottom-left
          const cornerX = 0;
          const cornerY = 720 - CARD_H;

          if (frame < cardStart) {
            // Not yet visible
            x = diagStartX;
            y = diagStartY;
            cardOp = 0;
            cardScale = 0.92;
            cardBlur = 3;
          } else if (frame < HIT_FRAME) {
            // Flying toward corner — accelerating (ease-in for impact feel)
            const flowProg = interpolate(frame, [cardStart, HIT_FRAME], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
              easing: Easing.in(Easing.quad),
            });
            x = interpolate(flowProg, [0, 1], [diagStartX, cornerX]);
            y = interpolate(flowProg, [0, 1], [diagStartY, cornerY]);
            // Rotation straightens as it approaches corner
            cardRotation = interpolate(flowProg, [0, 0.7, 1], [tilt, tilt * 0.3, 0]);
            cardOp = interpolate(flowProg, [0, 0.06], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            cardScale = 1;
            cardBlur = interpolate(flowProg, [0, 0.2], [3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          } else if (frame < BOUNCE_END) {
            // ── REAL BALL BOUNCE PHYSICS ──
            // Parabolic arcs with diminishing height, like a real ball.
            const bounceT = (frame - HIT_FRAME) / BOUNCE_DURATION;
            const bounceAmount = ballBounce(bounceT);

            // Bounce displacement — card rebounds diagonally up-right from corner
            const bounceDistX = 160; // max horizontal rebound on first bounce
            const bounceDistY = 130; // max vertical rebound on first bounce

            x = cornerX + bounceAmount * bounceDistX;
            y = cornerY - bounceAmount * bounceDistY;

            // Rotation follows the bounce — tilts on rebound, levels at contact
            cardRotation = bounceAmount * 10;

            // Squash at contact (bounceAmount near 0), stretch at peak
            if (bounceAmount < 0.1) {
              // Near wall contact — squash horizontally, stretch vertically
              cardScale = 0.92;
            } else {
              // In the air — slight stretch
              cardScale = 1 + bounceAmount * 0.06;
            }

            cardOp = 1;
            cardBlur = 0;
          } else {
            // Settled flush in corner
            x = cornerX;
            y = cornerY;
            cardRotation = 0;
            cardOp = 1;
            cardScale = 1;
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
                boxShadow: `0 24px 48px rgba(0,0,0,0.25)`,
                zIndex: 10 + i,
                overflow: "hidden",
              }}
            >
              {tool.hasGAIcon && <GAIcon />}
              <span style={{ fontSize: 34, fontWeight: 700, color: tool.textColor, fontFamily }}>
                {tool.text}
              </span>
            </div>
          );
        }

        // ── Normal cards: fast diagonal flow ──
        const prog = interpolate(frame, [cardStart, cardEnd], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        if (prog <= 0) return null;

        x = interpolate(prog, [0, 1], [diagStartX, diagEndX]);
        y = interpolate(prog, [0, 1], [diagStartY, diagEndY]);

        // Simple fade in/out at edges
        cardOp = interpolate(prog, [0, 0.06, 0.88, 1], [0, 1, 1, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        cardScale = 1;
        cardBlur = interpolate(prog, [0, 0.1, 0.9, 1], [2, 0, 0, 2], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        const shadowSize = interpolate(prog, [0, 0.5, 1], [14, 24, 14], {
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
              <span style={{ fontSize: tool.name.length > 10 ? 34 : 46, fontWeight: 700, color: tool.textColor, fontFamily }}>
                {tool.text}
              </span>
            )}
          </div>
        );
      })}

      {/* ── WHITE WIPE: card borders expand like water flooding outward ── */}
      {frame >= WIPE_START && (() => {
        // The card sits flush at bottom-left: left=0, top=400, width=580, height=320
        // The white rectangle starts exactly as the card and expands outward
        // using CSS inset values that shrink from the card edges to 0 (full frame)
        const wipeProg = interpolate(frame, [WIPE_START, WIPE_END], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });

        // Card position: top=400, right=700, bottom=0, left=0
        // (inset: top right bottom left)
        // At prog=0: inset matches card exactly
        // At prog=1: inset = 0 0 0 0 (full frame)
        const cardTop = 720 - CARD_H;   // 400
        const cardRight = 1280 - CARD_W; // 700

        const top = interpolate(wipeProg, [0, 1], [cardTop, 0]);
        const right = interpolate(wipeProg, [0, 1], [cardRight, 0]);
        // bottom and left are already 0 (card is flush in corner)

        // Border radius shrinks from card's 28px to 0
        const br = interpolate(wipeProg, [0, 1], [28, 0]);

        return (
          <div style={{
            position: "absolute",
            top,
            right,
            bottom: 0,
            left: 0,
            backgroundColor: "#FFFFFF",
            borderTopRightRadius: br,
            borderTopLeftRadius: interpolate(wipeProg, [0, 1], [28, 0]),
            zIndex: 200,
          }} />
        );
      })()}
    </div>
  );
};
