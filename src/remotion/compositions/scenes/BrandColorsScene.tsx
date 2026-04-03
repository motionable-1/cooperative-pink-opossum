import { useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

const PURPLE = "#9D62F0";

export const BrandColorsScene: React.FC = () => {
  const frame = useCurrentFrame();

  // ─── LINE 1: "With your brand colors," ───
  // "With" appears with a small image thumbnail next to it first (frame 40 ref)
  // Then the full line reveals

  // Phase 1: "With" + small thumbnail (frames 0-20)
  const withOp = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const withY = interpolate(frame, [0, 8], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Small thumbnail that accompanies "With"
  const thumbOp = interpolate(frame, [4, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const thumbScale = interpolate(frame, [4, 12], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Phase 2: "your" appears (frame ~14)
  const yourOp = interpolate(frame, [14, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Phase 3: "brand colors," appears in purple (frame ~20)
  const brandOp = interpolate(frame, [20, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const brandY = interpolate(frame, [20, 28], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ─── LINE 2: "No useless stock images." ───
  // Words appear one by one with motion blur reveal

  const LINE2_START = 30;

  // "No" with motion blur
  const noOp = interpolate(frame, [LINE2_START, LINE2_START + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const noBlur = interpolate(frame, [LINE2_START, LINE2_START + 6], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const noX = interpolate(frame, [LINE2_START, LINE2_START + 6], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // "useless" with motion blur
  const uselessOp = interpolate(frame, [LINE2_START + 6, LINE2_START + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const uselessBlur = interpolate(frame, [LINE2_START + 6, LINE2_START + 14], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const uselessX = interpolate(frame, [LINE2_START + 6, LINE2_START + 14], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // "stock" with motion blur
  const stockOp = interpolate(frame, [LINE2_START + 14, LINE2_START + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const stockBlur = interpolate(frame, [LINE2_START + 14, LINE2_START + 22], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stockX = interpolate(frame, [LINE2_START + 14, LINE2_START + 22], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // "images." with motion blur
  const imagesOp = interpolate(frame, [LINE2_START + 22, LINE2_START + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const imagesBlur = interpolate(frame, [LINE2_START + 22, LINE2_START + 30], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const imagesX = interpolate(frame, [LINE2_START + 22, LINE2_START + 30], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Hold full text, then fade out
  const HOLD_END = LINE2_START + 50;
  const fadeOut = interpolate(frame, [HOLD_END, HOLD_END + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

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
          gap: 8,
          opacity: fadeOut,
        }}
      >
        {/* Line 1: "With your brand colors," */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 56,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              opacity: withOp,
              transform: `translateY(${withY}px)`,
            }}
          >
            With
          </span>

          {/* Small thumbnail image */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 10,
              overflow: "hidden",
              opacity: thumbOp,
              transform: `scale(${thumbScale})`,
              flexShrink: 0,
            }}
          >
            <img
              src="https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215139377_zvhyucy9v8r_grid_four_women.png"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          <span
            style={{
              color: "#FFFFFF",
              opacity: yourOp,
            }}
          >
            your
          </span>

          <span
            style={{
              color: PURPLE,
              opacity: brandOp,
              transform: `translateY(${brandY}px)`,
            }}
          >
            brand colors,
          </span>
        </div>

        {/* Line 2: "No useless stock images." */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 56,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              opacity: noOp,
              filter: `blur(${noBlur}px)`,
              transform: `translateX(${noX}px)`,
            }}
          >
            No
          </span>
          <span
            style={{
              color: "#FFFFFF",
              opacity: uselessOp,
              filter: `blur(${uselessBlur}px)`,
              transform: `translateX(${uselessX}px)`,
            }}
          >
            useless
          </span>
          <span
            style={{
              color: "#FFFFFF",
              opacity: stockOp,
              filter: `blur(${stockBlur}px)`,
              transform: `translateX(${stockX}px)`,
            }}
          >
            stock
          </span>
          <span
            style={{
              color: "#FFFFFF",
              opacity: imagesOp,
              filter: `blur(${imagesBlur}px)`,
              transform: `translateX(${imagesX}px)`,
            }}
          >
            images.
          </span>
        </div>
      </div>
    </div>
  );
};
