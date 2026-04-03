import { useCurrentFrame, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin"],
});

const PURPLE = "#A855F7";

export const HandsFreeScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Three pills that DROP from above and BOUNCE into place
  // First pill lands first, then second, then third — stacking
  const pills = [
    { bg: PURPLE, color: "#FFFFFF", rotate: -6, xOff: -60, delay: 0 },
    { bg: "#F5F5F5", color: PURPLE, rotate: 0, xOff: 20, delay: 8 },
    { bg: PURPLE, color: "#FFFFFF", rotate: 0, xOff: -30, delay: 16 },
  ];

  // Final stacked positions (centered vertically)
  const PILL_H = 80;
  const GAP = 12;
  const totalH = pills.length * PILL_H + (pills.length - 1) * GAP;
  const startY = (720 - totalH) / 2;

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
        // Bouncy spring — low damping for visible overshoot/bounce
        const fallSpring = spring({
          frame: Math.max(0, frame - pill.delay),
          fps: 30,
          config: { damping: 8, stiffness: 120, mass: 0.8 },
        });

        // Fall from way above (-400px) to final Y position
        const finalY = startY + i * (PILL_H + GAP);
        const y = interpolate(fallSpring, [0, 1], [-500, finalY]);

        // Opacity: instant on as soon as it starts falling
        const op = interpolate(fallSpring, [0, 0.05], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Slight rotation wobble on landing
        const wobble = interpolate(fallSpring, [0, 1], [pill.rotate - 4, pill.rotate]);

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
