import { useCurrentFrame, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin"],
});

const PURPLE = "#A855F7";

export const HandsFreeScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Three staggered "hands-free." pill boxes
  const pills = [
    { bg: PURPLE, color: "#FFFFFF", rotate: -6, xOff: -60, delay: 0 },
    { bg: "#F5F5F5", color: PURPLE, rotate: 0, xOff: 20, delay: 5 },
    { bg: PURPLE, color: "#FFFFFF", rotate: 0, xOff: -30, delay: 10 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        fontFamily,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {pills.map((pill, i) => {
          const pillSpring = spring({
            frame: Math.max(0, frame - pill.delay),
            fps: 30,
            config: { damping: 12, stiffness: 160, mass: 0.5 },
          });
          const scale = interpolate(pillSpring, [0, 1], [0.5, 1]);
          const op = interpolate(pillSpring, [0, 0.3], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const y = interpolate(pillSpring, [0, 1], [30, 0]);

          return (
            <div
              key={i}
              style={{
                padding: "14px 44px",
                borderRadius: 14,
                backgroundColor: pill.bg,
                opacity: op,
                transform: `translateX(${pill.xOff}px) translateY(${y}px) rotate(${pill.rotate}deg) scale(${scale})`,
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
    </div>
  );
};
