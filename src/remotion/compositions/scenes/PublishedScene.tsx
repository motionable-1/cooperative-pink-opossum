import { useCurrentFrame, interpolate, Easing, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

const PURPLE = "#AE62EE";
const BG_GREY = "#F2F2F4";

export const PublishedScene: React.FC = () => {
  const frame = useCurrentFrame();

  // ═══════════════════════════════════════════════════════════════
  // PHASE 1 (0-40): Massive "PUBLISHED" zooms in from right
  //   - Text is HUGE (fills screen), only partial letters visible at start
  //   - Outline echo trails follow behind (hollow stroke-only copies)
  //   - Text oscillates/bounces before settling centered
  //   - Glitch offset lines remain briefly
  //
  // PHASE 2 (40-58): Snaps to white text on solid purple bg
  //
  // PHASE 3 (58-80): Inverts to purple text on white bg
  // ═══════════════════════════════════════════════════════════════

  const PHASE2_START = 40;
  const PHASE3_START = 58;

  // ─── PHASE 1: Massive zoom-in with outline trails ───
  const phase1Active = frame < PHASE2_START;
  const phase1Op = phase1Active
    ? 1
    : interpolate(frame, [PHASE2_START, PHASE2_START + 3], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  // Text slides in from far right — spring with overshoot for bounce
  const slideSpring = spring({
    frame,
    fps: 30,
    config: { damping: 10, stiffness: 60, mass: 1.2 },
  });

  // X position: starts way off to the right, bounces past center, settles
  const mainX = interpolate(slideSpring, [0, 1], [1400, 0]);

  // Scale: starts massive (only partial letters visible), shrinks to fit
  const textScale = interpolate(slideSpring, [0, 1], [4.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Number of outline echo trails
  const NUM_ECHOES = 4;

  // Glitch offset that appears as text settles (horizontal stroke duplication)
  const glitchAmount = phase1Active
    ? interpolate(frame, [18, 28, 35, 40], [0, 6, 3, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // ─── PHASE 2: White on Purple ───
  const phase2Active = frame >= PHASE2_START && frame < PHASE3_START;
  const phase2Op = phase2Active
    ? interpolate(frame, [PHASE2_START, PHASE2_START + 3], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Subtle vertical trail on phase 2 (frames 37 ref — drip effect)
  const drip = phase2Active
    ? interpolate(frame, [PHASE2_START + 4, PHASE2_START + 12], [8, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
      })
    : 0;

  // ─── PHASE 3: Purple on White ───
  const phase3Op = frame >= PHASE3_START
    ? interpolate(frame, [PHASE3_START, PHASE3_START + 3], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const FONT_SIZE = 130;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", fontFamily }}>
      {/* ═══ PHASE 1: Massive zoom with outline echoes ═══ */}
      {phase1Op > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: BG_GREY,
            opacity: phase1Op,
          }}
        >
          {/* Outline echo trails — hollow stroke-only copies that lag behind */}
          {Array.from({ length: NUM_ECHOES }).map((_, echoIdx) => {
            const delay = (echoIdx + 1) * 3;
            const echoSpring = spring({
              frame: Math.max(0, frame - delay),
              fps: 30,
              config: { damping: 10, stiffness: 60, mass: 1.2 },
            });
            const echoX = interpolate(echoSpring, [0, 1], [1400, 0]);
            const echoScale = interpolate(echoSpring, [0, 1], [4.5, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            // Echoes fade as they catch up to main text
            const echoOp = interpolate(
              frame,
              [delay, delay + 8, 30, 38],
              [0, 0.7, 0.4, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            if (echoOp <= 0.01) return null;

            return (
              <div
                key={echoIdx}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: echoOp,
                }}
              >
                <span
                  style={{
                    fontSize: FONT_SIZE,
                    fontWeight: 900,
                    letterSpacing: 8,
                    whiteSpace: "nowrap",
                    WebkitTextStroke: `2px ${PURPLE}`,
                    WebkitTextFillColor: "transparent",
                    transform: `translateX(${echoX}px) scale(${echoScale})`,
                    transformOrigin: "center center",
                  }}
                >
                  PUBLISHED
                </span>
              </div>
            );
          })}

          {/* Main solid text */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Glitch offset copy — horizontal stroke duplicate */}
            {glitchAmount > 0.5 && (
              <span
                style={{
                  position: "absolute",
                  fontSize: FONT_SIZE,
                  fontWeight: 900,
                  letterSpacing: 8,
                  whiteSpace: "nowrap",
                  WebkitTextStroke: `1.5px ${PURPLE}`,
                  WebkitTextFillColor: "transparent",
                  transform: `translateX(${mainX + glitchAmount}px) scale(${textScale})`,
                  transformOrigin: "center center",
                  opacity: 0.6,
                }}
              >
                PUBLISHED
              </span>
            )}
            {glitchAmount > 0.5 && (
              <span
                style={{
                  position: "absolute",
                  fontSize: FONT_SIZE,
                  fontWeight: 900,
                  letterSpacing: 8,
                  whiteSpace: "nowrap",
                  WebkitTextStroke: `1.5px ${PURPLE}`,
                  WebkitTextFillColor: "transparent",
                  transform: `translateX(${mainX - glitchAmount}px) scale(${textScale})`,
                  transformOrigin: "center center",
                  opacity: 0.6,
                }}
              >
                PUBLISHED
              </span>
            )}

            {/* Solid main text */}
            <span
              style={{
                fontSize: FONT_SIZE,
                fontWeight: 900,
                color: PURPLE,
                letterSpacing: 8,
                whiteSpace: "nowrap",
                transform: `translateX(${mainX}px) scale(${textScale})`,
                transformOrigin: "center center",
              }}
            >
              PUBLISHED
            </span>
          </div>
        </div>
      )}

      {/* ═══ PHASE 2: White on Purple ═══ */}
      {phase2Op > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: PURPLE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: phase2Op,
          }}
        >
          {/* Subtle vertical trail/drip */}
          {drip > 0.5 && (
            <span
              style={{
                position: "absolute",
                fontSize: FONT_SIZE,
                fontWeight: 900,
                color: "rgba(255,255,255,0.15)",
                letterSpacing: 8,
                whiteSpace: "nowrap",
                transform: `translateY(${drip}px)`,
              }}
            >
              PUBLISHED
            </span>
          )}
          <span
            style={{
              fontSize: FONT_SIZE,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 8,
              whiteSpace: "nowrap",
            }}
          >
            PUBLISHED
          </span>
        </div>
      )}

      {/* ═══ PHASE 3: Purple on White ═══ */}
      {phase3Op > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: phase3Op,
          }}
        >
          <span
            style={{
              fontSize: FONT_SIZE,
              fontWeight: 900,
              color: PURPLE,
              letterSpacing: 8,
              whiteSpace: "nowrap",
            }}
          >
            PUBLISHED
          </span>
        </div>
      )}
    </div>
  );
};
