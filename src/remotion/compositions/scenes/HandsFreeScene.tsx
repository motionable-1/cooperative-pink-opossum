import { useCurrentFrame, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

const PURPLE = "#A855F7";
const OFF_WHITE = "#F0F0F0";

export const HandsFreeScene: React.FC = () => {
  const frame = useCurrentFrame();

  /*
   * 3 sharp rectangles stacked flush (zero gap), centered vertically.
   * Top & Bottom: purple bg, white text, same width, aligned.
   * Middle: off-white bg, purple text, WIDER, offset slightly right.
   * Bottom = base (appears instantly), middle & top fall from above.
   */

  const RECT_H = 95;
  const FONT_SIZE = 65;
  const PX_NARROW = 55;   // horizontal padding for top & bottom
  const PX_WIDE = 100;    // horizontal padding for middle (wider)

  // Stack of 3 rects, flush, centered vertically
  const totalH = RECT_H * 3;
  const startY = (720 - totalH) / 2;

  const bottomY = startY + RECT_H * 2;
  const middleY = startY + RECT_H;
  const topY = startY;

  // ── BOTTOM: base, appears instantly ──
  const baseOp = interpolate(frame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── MIDDLE: falls from above, lands flush on bottom ──
  const MID_DELAY = 6;
  const midSpring = spring({
    frame: Math.max(0, frame - MID_DELAY),
    fps: 30,
    config: { damping: 9, stiffness: 140, mass: 0.7 },
  });
  const midRawY = interpolate(midSpring, [0, 1], [-500, middleY]);
  const midFinalY = Math.min(midRawY, middleY + 6);
  const midOp = interpolate(midSpring, [0, 0.05], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── TOP: falls last, lands flush on middle ──
  const TOP_DELAY = 14;
  const topSpring = spring({
    frame: Math.max(0, frame - TOP_DELAY),
    fps: 30,
    config: { damping: 9, stiffness: 140, mass: 0.7 },
  });
  const topRawY = interpolate(topSpring, [0, 1], [-500, topY]);
  const topFinalY = Math.min(topRawY, topY + 6);
  const topOp = interpolate(topSpring, [0, 0.05], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rects = [
    // Bottom: purple bg, white text, offset left
    {
      y: bottomY, op: baseOp, bg: PURPLE, color: "#FFFFFF",
      px: PX_NARROW, xOff: -40, zIndex: 1,
    },
    // Middle: off-white bg, purple text, wider, offset right
    {
      y: midFinalY, op: midOp, bg: OFF_WHITE, color: PURPLE,
      px: PX_WIDE, xOff: 60, zIndex: 2,
    },
    // Top: purple bg, white text, offset slight left
    {
      y: topFinalY, op: topOp, bg: PURPLE, color: "#FFFFFF",
      px: PX_NARROW, xOff: -15, zIndex: 3,
    },
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
      {rects.map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: r.y,
            transform: `translateX(-50%) translateX(${r.xOff}px)`,
            height: RECT_H,
            display: "flex",
            alignItems: "center",
            paddingLeft: r.px,
            paddingRight: r.px,
            borderRadius: 0,
            backgroundColor: r.bg,
            opacity: r.op,
            whiteSpace: "nowrap",
            zIndex: r.zIndex,
          }}
        >
          <span
            style={{
              fontSize: FONT_SIZE,
              fontWeight: 700,
              color: r.color,
              letterSpacing: -0.5,
            }}
          >
            hands-free.
          </span>
        </div>
      ))}
    </div>
  );
};
