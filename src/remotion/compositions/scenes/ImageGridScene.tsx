import { useCurrentFrame, interpolate, spring, Img } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

const IMAGES = [
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215135238_4kr3h3cmuz3_grid_city_billboard.png",
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215136057_h4p69n7sqcv_grid_hand_phone_birds.png",
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215137269_apzkmjzlnhm_grid_tablet_devices.png",
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215138388_ooqktbprz0p_grid_watercolor_woman.png",
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215139377_zvhyucy9v8r_grid_four_women.png",
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215140448_c3wpzhbi1ns_grid_monitors_desk.png",
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215141333_dy1w80f9k4d_grid_clock_birds.png",
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215142682_crsidmd909_grid_excited_man.png",
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215144004_s80vc8iq_grid_blue_bird_phone.png",
];

// 3x3 grid positions
const COLS = 3;
const ROWS = 3;
const GAP = 18;
const GRID_W = 980;
const GRID_H = 560;
const CELL_W = (GRID_W - GAP * (COLS - 1)) / COLS;
const CELL_H = (GRID_H - GAP * (ROWS - 1)) / ROWS;
const GRID_LEFT = (1280 - GRID_W) / 2;
const GRID_TOP = (720 - GRID_H) / 2;

export const ImageGridScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Cursor still visible, fading
  const cursorOp = interpolate(frame, [0, 6], [0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Images appear in staggered fashion: first scattered small, then snap to grid
  // Phase 1: tiny thumbnails scatter in (frames 0-15)
  // Phase 2: grow into 2x3 grid (frames 10-30)
  // Phase 3: fill 3x3 grid (frames 25-50)

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#FFFFFF",
        fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Image grid */}
      {IMAGES.map((src, idx) => {
        const row = Math.floor(idx / COLS);
        const col = idx % COLS;
        const stagger = idx * 3;

        // Each image springs in
        const appear = spring({
          frame: Math.max(0, frame - stagger - 4),
          fps: 30,
          config: { damping: 14, stiffness: 140, mass: 0.5 },
        });

        const targetX = GRID_LEFT + col * (CELL_W + GAP);
        const targetY = GRID_TOP + row * (CELL_H + GAP);

        const x = interpolate(appear, [0, 1], [640 - CELL_W / 2, targetX]);
        const y = interpolate(appear, [0, 1], [360 - CELL_H / 2, targetY]);
        const scale = interpolate(appear, [0, 1], [0.15, 1]);
        const opacity = interpolate(appear, [0, 0.3], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const borderRadius = interpolate(appear, [0, 1], [20, 14]);

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: CELL_W,
              height: CELL_H,
              borderRadius,
              overflow: "hidden",
              opacity,
              transform: `scale(${scale})`,
              transformOrigin: "center center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            }}
          >
            <Img
              src={src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        );
      })}

      {/* Cursor remnant */}
      {cursorOp > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: 780,
            top: 480,
            opacity: cursorOp,
            zIndex: 100,
          }}
        >
          <svg width="28" height="36" viewBox="0 0 24 32" fill="none">
            <path
              d="M2 2L2 26L8 20L14 30L18 28L12 18L20 18L2 2Z"
              fill="#000000"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
