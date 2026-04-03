import { useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const PURPLE = "#A855F7";

// Same 3-row data as PlannerDashScene
const ROWS = [
  [
    { day: 12, weekday: "Tue", keyword: "twitter trends worldwide", volume: "600", difficulty: "15", published: true },
    { day: 13, weekday: "Wed", keyword: "how to view sensitive content on twitter", volume: "4,400", difficulty: "11", published: false },
    { day: 14, weekday: "Thu", keyword: "how to get more twitter followers", volume: "2,800", difficulty: "22", published: false },
    { day: 15, weekday: "Fri", keyword: "how long can videos be on twitter", volume: "1,200", difficulty: "8", published: false },
    { day: 16, weekday: "Sat", keyword: "how to go viral on twitter", volume: "3,100", difficulty: "18", published: false },
    { day: 17, weekday: "Sun", keyword: "how many twitter followers to get verified", volume: "900", difficulty: "14", published: false },
  ],
  [
    { day: 18, weekday: "Mon", keyword: "how to get more twitter likes", volume: "1,800", difficulty: "19", published: false },
    { day: 19, weekday: "Tue", keyword: "best time to post on twitter", volume: "5,200", difficulty: "25", published: false },
    { day: 20, weekday: "Wed", keyword: "twitter analytics guide", volume: "2,100", difficulty: "16", published: false },
    { day: 21, weekday: "Thu", keyword: "how to use twitter spaces", volume: "3,400", difficulty: "12", published: false },
    { day: 22, weekday: "Fri", keyword: "twitter thread strategy", volume: "1,600", difficulty: "20", published: false },
    { day: 23, weekday: "Sat", keyword: "twitter engagement tips", volume: "2,900", difficulty: "17", published: false },
  ],
  [
    { day: 24, weekday: "Sun", keyword: "twitter hashtag strategy", volume: "2,400", difficulty: "21", published: false },
    { day: 25, weekday: "Mon", keyword: "twitter marketing tips", volume: "4,100", difficulty: "24", published: false },
    { day: 26, weekday: "Tue", keyword: "how to monetize twitter", volume: "3,700", difficulty: "28", published: false },
    { day: 27, weekday: "Wed", keyword: "twitter content calendar", volume: "1,100", difficulty: "13", published: false },
    { day: 28, weekday: "Thu", keyword: "twitter growth hacks", volume: "2,600", difficulty: "19", published: false },
    { day: 29, weekday: "Fri", keyword: "twitter brand strategy", volume: "1,900", difficulty: "23", published: false },
  ],
];

const SIDEBAR_ITEMS = ["Content Planner", "Content History", "Settings", "Integrations"];

export const CalendarZoomScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Dramatic zoom: start where PlannerDash ended (0.82) → zoom way in (3.2)
  // so we end up seeing only 2-3 calendar cards filling the screen
  const zoomIn = interpolate(frame, [0, 90], [0.82, 3.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Pan to focus on the first row (Nov 12-13 area) — top-left of calendar grid
  // The calendar grid starts ~280px from left (past sidebar) and ~160px from top (past header)
  // At high zoom, we need aggressive pan to bring top-left cards to center
  const panX = interpolate(frame, [0, 90], [0, -700], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const panY = interpolate(frame, [0, 90], [80, -650], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Increasing 3D tilt as we zoom deeper
  const tiltX = interpolate(frame, [0, 90], [0, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const tiltZ = interpolate(frame, [0, 90], [0, -4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: PURPLE,
        fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Same dashboard card, zoomed + panned + tilted */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: panY,
          transform: `translateX(-50%) translateX(${panX}px) perspective(1200px) rotateX(${tiltX}deg) rotateZ(${tiltZ}deg) scale(${zoomIn})`,
          transformOrigin: "50% 40%",
          width: 1400,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
          display: "flex",
          overflow: "hidden",
          minHeight: 700,
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: 200,
            backgroundColor: "#FAFAFA",
            borderRight: "1px solid #ECECEC",
            padding: "24px 0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "0 20px 28px", fontSize: 18, fontWeight: 700, color: "#111" }}>
            Outrank
          </div>
          {SIDEBAR_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                padding: "10px 20px",
                fontSize: 13,
                fontWeight: i === 0 ? 600 : 400,
                color: i === 0 ? "#111" : "#888",
                backgroundColor: i === 0 ? "#F0F0F0" : "transparent",
              }}
            >
              {item}
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ padding: "10px 20px", fontSize: 12, color: "#AAA" }}>Support</div>
          <div style={{ padding: "6px 20px", fontSize: 11, color: "#BBB" }}>ahmedhatata.ah@gmail.com</div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: "24px 32px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#111" }}>Content Planner</div>
              <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                Schedule and manage your articles for upcoming dates. Articles are sent to your blog at 7AM-8AM UTC.
              </div>
            </div>
            <div
              style={{
                padding: "8px 18px",
                backgroundColor: "#111",
                color: "#FFF",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 8,
              }}
            >
              Add Keyword
            </div>
          </div>

          {/* Month */}
          <div style={{ fontSize: 16, fontWeight: 600, color: "#333", marginBottom: 16 }}>November 2024</div>

          {/* Calendar grid — 3 rows (same as PlannerDashScene) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ROWS.map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: 12 }}>
                {row.map((day, ci) => {
                  const isActive = day.day === 12;

                  return (
                    <div
                      key={ci}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        backgroundColor: isActive ? "#F8F0FF" : "#FAFAFA",
                        borderRadius: 12,
                        padding: 14,
                        border: isActive ? `2px solid ${PURPLE}` : "1px solid #ECECEC",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>{day.day}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: isActive ? PURPLE : "#888" }}>{day.weekday}</span>
                      </div>

                      {day.published && (
                        <div
                          style={{
                            display: "inline-block",
                            padding: "3px 10px",
                            backgroundColor: "#E8F5E9",
                            color: "#2E7D32",
                            fontSize: 10,
                            fontWeight: 600,
                            borderRadius: 6,
                            marginBottom: 6,
                          }}
                        >
                          Published
                        </div>
                      )}

                      <div style={{ fontSize: 11, fontWeight: 600, color: "#222", lineHeight: 1.3, marginBottom: 8 }}>
                        {day.keyword}
                      </div>

                      <div style={{ fontSize: 9, color: "#888", marginBottom: 2 }}>Volume: {day.volume}</div>
                      <div style={{ fontSize: 9, color: "#888", marginBottom: 8 }}>Difficulty: {day.difficulty}</div>

                      {day.published && (
                        <div
                          style={{
                            padding: "5px 12px",
                            backgroundColor: "#333",
                            color: "#FFF",
                            fontSize: 10,
                            fontWeight: 600,
                            borderRadius: 6,
                            textAlign: "center",
                          }}
                        >
                          Visit Article
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
