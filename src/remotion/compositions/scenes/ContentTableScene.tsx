import { useCurrentFrame, interpolate, Easing, spring, Img } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const ROWS = [
  { img: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215135238_4kr3h3cmuz3_grid_city_billboard.png", title: "Mastering Twitter Bookmarks: A Comprehensive Guide to Saving and Organizing Your Favorite Tweets", keyword: "twitter bookmarks", difficulty: 7, volume: "1.6K", date: "09 Nov 2024" },
  { img: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215137269_apzkmjzlnhm_grid_tablet_devices.png", title: "How to See Worldwide Trends on X (Twitter): Navigating the Shift from Global to Local Trends", keyword: "worldwide trends on twitter", difficulty: 1, volume: "50", date: "08 Nov 2024" },
  { img: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215139377_zvhyucy9v8r_grid_four_women.png", title: "Decoding Influencer Tweets: Strategies for Impact and Measurement", keyword: "influencer tweets", difficulty: 9, volume: "2.1K", date: "07 Nov 2024" },
  { img: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215141333_dy1w80f9k4d_grid_clock_birds.png", title: "Analyzing Twitter Analytics on Other Accounts: A Comprehensive Guide", keyword: "twitter analytics on other accounts", difficulty: 2, volume: "170", date: "06 Nov 2024" },
  { img: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215144004_s80vc8iq_grid_blue_bird_phone.png", title: "Best Time to Tweet: A Data-Driven Guide to Maximize Your Reach", keyword: "best time to tweet", difficulty: 6, volume: "3.4K", date: "05 Nov 2024" },
  { img: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215135238_4kr3h3cmuz3_grid_city_billboard.png", title: "Boost Your Tweets: The Definitive Guide to Twitter Engagement Rate Calculator", keyword: "twitter engagement rate calculator", difficulty: 4, volume: "140", date: "04 Nov 2024" },
  { img: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215137269_apzkmjzlnhm_grid_tablet_devices.png", title: "Decoding Twitter Tweet Stats: A Deep Dive into Analytics and Insights", keyword: "twitter tweet stats", difficulty: 27, volume: "1.9K", date: "03 Nov 2024" },
];

const ROW_H = 76;
const TABLE_W = 920;


export const ContentTableScene: React.FC = () => {
  const frame = useCurrentFrame();

  // 3D perspective tilt entrance
  const enterSpring = spring({
    frame,
    fps: 30,
    config: { damping: 18, stiffness: 80, mass: 0.8 },
  });

  const perspTilt = interpolate(enterSpring, [0, 1], [25, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const perspRotZ = interpolate(enterSpring, [0, 1], [-5, -2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tableScale = interpolate(enterSpring, [0, 1], [0.7, 0.82], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tableOp = interpolate(enterSpring, [0, 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scroll down over time
  const scrollY = interpolate(frame, [30, 140], [0, -120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Slow zoom in
  const zoomIn = interpolate(frame, [0, 140], [1, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 60%, rgba(120, 40, 200, 0.5) 0%, rgba(30, 5, 60, 0.95) 55%, #0a0014 100%)",
      }}
    >
      {/* 3D tilted table */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) perspective(1200px) rotateX(${perspTilt}deg) rotateZ(${perspRotZ}deg) scale(${tableScale * zoomIn})`,
          transformOrigin: "50% 50%",
          opacity: tableOp,
        }}
      >
        {/* White card container */}
        <div
          style={{
            width: TABLE_W,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: "24px 0",
            boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{ padding: "0 28px 16px", fontFamily }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111" }}>Content History</div>
          </div>

          {/* Column headers */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 28px 12px",
              fontSize: 11,
              fontWeight: 500,
              color: "#999",
              fontFamily,
              gap: 0,
            }}
          >
            <div style={{ width: 52 }}>Image</div>
            <div style={{ width: 300, display: "flex", alignItems: "center", gap: 4 }}>Title <span style={{ fontSize: 8 }}>▲</span></div>
            <div style={{ width: 200, display: "flex", alignItems: "center", gap: 4 }}>Keyword <span style={{ fontSize: 8 }}>▼</span></div>
            <div style={{ width: 70 }}>Difficulty</div>
            <div style={{ width: 70 }}>Volume</div>
            <div style={{ width: 100 }}>Date</div>
          </div>

          {/* Rows */}
          <div style={{ transform: `translateY(${scrollY}px)` }}>
            {ROWS.map((row, idx) => {
              const rowDelay = idx * 3;
              const rowSpring = spring({
                frame: Math.max(0, frame - rowDelay - 8),
                fps: 30,
                config: { damping: 14, stiffness: 160, mass: 0.4 },
              });
              const rowOp = interpolate(rowSpring, [0, 0.4], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const rowX = interpolate(rowSpring, [0, 1], [30, 0]);

              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 28px",
                    height: ROW_H,
                    opacity: rowOp,
                    transform: `translateX(${rowX}px)`,
                    fontFamily,
                    borderTop: idx > 0 ? "1px solid #f0f0f0" : "none",
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{ width: 52, flexShrink: 0 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden" }}>
                      <Img src={row.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  </div>

                  {/* Title */}
                  <div style={{ width: 300, fontSize: 11, fontWeight: 600, color: "#222", lineHeight: 1.3, paddingRight: 12 }}>
                    {row.title.length > 70 ? row.title.slice(0, 70) + "..." : row.title}
                  </div>

                  {/* Keyword */}
                  <div style={{ width: 200, fontSize: 11, fontWeight: 400, color: "#666", paddingRight: 8 }}>
                    {row.keyword}
                  </div>

                  {/* Difficulty */}
                  <div style={{ width: 70 }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 12px",
                        borderRadius: 6,
                        backgroundColor: "#E8F5E9",
                        color: "#2E7D32",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {row.difficulty}
                    </span>
                  </div>

                  {/* Volume */}
                  <div style={{ width: 70, fontSize: 12, fontWeight: 500, color: "#333" }}>
                    {row.volume}
                  </div>

                  {/* Date */}
                  <div style={{ width: 100, fontSize: 11, fontWeight: 400, color: "#888" }}>
                    {row.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
