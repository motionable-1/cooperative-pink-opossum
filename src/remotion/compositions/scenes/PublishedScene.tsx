import { useCurrentFrame, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

const PURPLE = "#AE62EE";

export const PublishedScene: React.FC = () => {
  const frame = useCurrentFrame();

  /*
   * PHASE 1 (0–25): "PUBLISHED" zooms in from massive scale with 2 outline echoes
   * PHASE 2 (25–45): Snaps to purple text on white — clean hold
   */

  const SNAP = 25;
  const FONT_SIZE = 130;

  const phase1 = frame < SNAP;

  // ── PHASE 1: Zoom-in with echo trails ──
  const zoomSpring = spring({
    frame,
    fps: 30,
    config: { damping: 14, stiffness: 80, mass: 0.8 },
  });

  const textScale = interpolate(zoomSpring, [0, 1], [3.5, 1]);
  const mainX = interpolate(zoomSpring, [0, 1], [600, 0]);
  const phase1Op = phase1
    ? 1
    : interpolate(frame, [SNAP, SNAP + 2], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  // ── PHASE 2: Purple on white ──
  const phase2Op = frame >= SNAP
    ? interpolate(frame, [SNAP, SNAP + 2], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", fontFamily }}>
      {/* PHASE 1 */}
      {phase1Op > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#F2F2F4",
            opacity: phase1Op,
          }}
        >
          {/* 2 outline echo trails */}
          {[1, 2].map((echoIdx) => {
            const delay = echoIdx * 3;
            const echoSpr = spring({
              frame: Math.max(0, frame - delay),
              fps: 30,
              config: { damping: 14, stiffness: 80, mass: 0.8 },
            });
            const eX = interpolate(echoSpr, [0, 1], [600, 0]);
            const eS = interpolate(echoSpr, [0, 1], [3.5, 1]);
            const eOp = interpolate(frame, [delay, delay + 5, 20, 25], [0, 0.6, 0.3, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            if (eOp < 0.01) return null;
            return (
              <div
                key={echoIdx}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: eOp,
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
                    transform: `translateX(${eX}px) scale(${eS})`,
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

      {/* PHASE 2: Purple on white — clean hold */}
      {phase2Op > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: phase2Op,
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
