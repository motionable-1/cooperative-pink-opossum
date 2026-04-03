import { useCurrentFrame, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin"],
});

const PURPLE = "#A855F7";

export const HandsFreeScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Bottom pill sits tight from the start.
  // Middle pill falls and bounces on top of it.
  // Top pill falls last and bounces on top of middle.
  // Order in array: top (index 0) → middle (1) → bottom (2)
  const pills = [
    { bg: PURPLE, color: "#FFFFFF", rotate: -6, xOff: -60, falls: true, delay: 14 },
    { bg: "#F5F5F5", color: PURPLE, rotate: 0, xOff: 20, falls: true, delay: 6 },
    { bg: PURPLE, color: "#FFFFFF", rotate: 0, xOff: -30, falls: false, delay: 0 },
  ];

  const PILL_H = 80;
  const GAP = 12;
  const totalH = pills.length * PILL_H + (pills.length - 1) * GAP;
  const baseY = (720 - totalH) / 2;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        fontFamily,
        overflow: "hidden",
      }}
    >
      {pills.map((pill, i) => {
        const finalY = baseY + i * (PILL_H + GAP);

        let y: number;
        let op: number;
        let wobble: number;

        if (!pill.falls) {
          // Bottom pill: already sitting, just fade in instantly
          const fadeIn = interpolate(frame, [0, 4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          y = finalY;
          op = fadeIn;
          wobble = pill.rotate;
        } else {
          // Falling pills: drop from above with bouncy spring
          const fallSpring = spring({
            frame: Math.max(0, frame - pill.delay),
            fps: 30,
            config: { damping: 8, stiffness: 120, mass: 0.8 },
          });

          y = interpolate(fallSpring, [0, 1], [-450, finalY]);
          op = interpolate(fallSpring, [0, 0.05], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          // Wobble rotation on landing
          wobble = interpolate(fallSpring, [0, 1], [pill.rotate + 8, pill.rotate]);
        }

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: y,
              transform: `translateX(-50%) translateX(${pill.xOff}px) rotate(${wobble}deg)`,
              padding: "14px 44px",
              borderRadius: 14,
              backgroundColor: pill.bg,
              opacity: op,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontSize: 52,
                fontWeight: 800,
                color: pill.color,
                letterSpacing: -1,
              }}
            >
              hands-free.
            </span>
          </div>
        );
      })}
    </div>
  );
};
