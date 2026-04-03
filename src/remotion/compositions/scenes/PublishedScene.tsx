import { useCurrentFrame, interpolate, Easing, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "800", "900"],
  subsets: ["latin"],
});

const PURPLE = "#A855F7";
const LIGHT_PURPLE = "#C084FC";

export const PublishedScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase 1 (0-35): "PUBLISHED" with glitch/trail echo animation on light bg
  // Phase 2 (35-55): settles as white text on purple
  // Phase 3 (55-75): purple text on white (inversion)

  const PHASE2_START = 35;
  const PHASE3_START = 55;

  // ─── PHASE 1: Glitch trails on off-white ───
  const phase1Op = frame < PHASE2_START ? 1 : interpolate(frame, [PHASE2_START, PHASE2_START + 6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Main text slides in from right with trailing echoes
  const slideIn = spring({
    frame,
    fps: 30,
    config: { damping: 12, stiffness: 100, mass: 0.5 },
  });
  const mainX = interpolate(slideIn, [0, 1], [300, 0]);

  // Echo trails — multiple offset copies
  const NUM_ECHOES = 5;
  const echoSpacing = 25;

  // Vibration/jitter in phase 1
  const jitterX = frame < PHASE2_START ? Math.sin(frame * 2.5) * 3 : 0;
  const jitterY = frame < PHASE2_START ? Math.cos(frame * 3.2) * 2 : 0;

  // ─── PHASE 2: White on Purple ───
  const phase2Op = frame >= PHASE2_START && frame < PHASE3_START
    ? interpolate(frame, [PHASE2_START, PHASE2_START + 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      })
    : 0;

  // ─── PHASE 3: Purple on White ───
  const phase3Op = frame >= PHASE3_START
    ? interpolate(frame, [PHASE3_START, PHASE3_START + 6], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      })
    : 0;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", fontFamily }}>
      {/* PHASE 1: Glitch/Trail on light bg */}
      {phase1Op > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#F5F5F5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: phase1Op,
          }}
        >
          {/* Echo trails */}
          {Array.from({ length: NUM_ECHOES }).map((_, echoIdx) => {
            const delay = (echoIdx + 1) * 2;
            const echoSlide = spring({
              frame: Math.max(0, frame - delay),
              fps: 30,
              config: { damping: 12, stiffness: 100, mass: 0.5 },
            });
            const echoX = interpolate(echoSlide, [0, 1], [300 + echoIdx * echoSpacing, echoIdx * 4]);
            const echoOp = interpolate(echoSlide, [0, 1], [0, 0.12 - echoIdx * 0.02]);

            return (
              <span
                key={echoIdx}
                style={{
                  position: "absolute",
                  fontSize: 90,
                  fontWeight: 900,
                  color: PURPLE,
                  letterSpacing: 6,
                  opacity: Math.max(0, echoOp),
                  transform: `translateX(${echoX + jitterX}px) translateY(${jitterY}px)`,
                  WebkitTextStroke: `2px ${LIGHT_PURPLE}`,
                  WebkitTextFillColor: "transparent",
                }}
              >
                PUBLISHED
              </span>
            );
          })}

          {/* Main text */}
          <span
            style={{
              position: "absolute",
              fontSize: 90,
              fontWeight: 900,
              color: PURPLE,
              letterSpacing: 6,
              transform: `translateX(${mainX + jitterX}px) translateY(${jitterY}px)`,
            }}
          >
            PUBLISHED
          </span>
        </div>
      )}

      {/* PHASE 2: White on Purple */}
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
          <span
            style={{
              fontSize: 90,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 6,
            }}
          >
            PUBLISHED
          </span>
        </div>
      )}

      {/* PHASE 3: Purple on White */}
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
              fontSize: 90,
              fontWeight: 900,
              color: PURPLE,
              letterSpacing: 6,
            }}
          >
            PUBLISHED
          </span>
        </div>
      )}
    </div>
  );
};
