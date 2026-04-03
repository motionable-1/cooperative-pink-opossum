import { useCurrentFrame, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin"],
});

const PURPLE = "#A855F7";

export const HandsFreeScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Layout: 3 pills stacked vertically, centered on screen
  // Bottom pill = BASE (appears instantly, never moves)
  // Middle pill = falls from above, lands ON TOP of bottom pill
  // Top pill = falls last, lands ON TOP of middle pill
  //
  // The base pill acts as a floor — nothing goes below it.

  const PILL_H = 80;
  const GAP = 12;
  const STEP = PILL_H + GAP;

  // Base pill Y position (bottom of the stack)
  const BASE_Y = 360 + STEP; // below center

  // Final resting positions (bottom-up)
  const bottomY = BASE_Y;
  const middleY = BASE_Y - STEP;
  const topY = BASE_Y - STEP * 2;

  // ─── BOTTOM PILL: The base. Appears instantly. ───
  const baseOp = interpolate(frame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── MIDDLE PILL: Falls from above, bounces, settles on base ───
  const MID_DELAY = 6;
  const midSpring = spring({
    frame: Math.max(0, frame - MID_DELAY),
    fps: 30,
    config: { damping: 9, stiffness: 140, mass: 0.7 },
  });
  // Clamp so it never goes BELOW its resting position (can't pass through base)
  const midRawY = interpolate(midSpring, [0, 1], [-400, middleY]);
  const midY = Math.min(midRawY, middleY + 8); // allow tiny overshoot for bounce feel, but not past base
  const midOp = interpolate(midSpring, [0, 0.05], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── TOP PILL: Falls last, bounces, settles on middle ───
  const TOP_DELAY = 14;
  const topSpring = spring({
    frame: Math.max(0, frame - TOP_DELAY),
    fps: 30,
    config: { damping: 9, stiffness: 140, mass: 0.7 },
  });
  const topRawY = interpolate(topSpring, [0, 1], [-400, topY]);
  const topY2 = Math.min(topRawY, topY + 8);
  const topOp = interpolate(topSpring, [0, 0.05], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rotation wobble on landing
  const topWobble = interpolate(topSpring, [0, 0.6, 1], [12, -8, -6]);
  const midWobble = interpolate(midSpring, [0, 0.6, 1], [8, -3, 0]);

  const pills = [
    // Render order: bottom first (behind), then middle, then top (in front)
    { y: bottomY, op: baseOp, rotate: 0, xOff: -30, bg: PURPLE, color: "#FFFFFF", zIndex: 1 },
    { y: midY, op: midOp, rotate: midWobble, xOff: 20, bg: "#F5F5F5", color: PURPLE, zIndex: 2 },
    { y: topY2, op: topOp, rotate: topWobble, xOff: -60, bg: PURPLE, color: "#FFFFFF", zIndex: 3 },
  ];

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
      {pills.map((pill, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: pill.y,
            transform: `translateX(-50%) translateX(${pill.xOff}px) rotate(${pill.rotate}deg)`,
            padding: "14px 44px",
            borderRadius: 14,
            backgroundColor: pill.bg,
            opacity: pill.op,
            whiteSpace: "nowrap",
            zIndex: pill.zIndex,
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
      ))}
    </div>
  );
};
