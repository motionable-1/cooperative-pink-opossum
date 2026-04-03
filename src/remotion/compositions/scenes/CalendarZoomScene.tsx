import { useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const PURPLE = "#A855F7";

// Exact same data as PlannerDashScene
const DAYS = [
  { day: 12, weekday: "Tue", keyword: "twitter trends worldwide", volume: "600", difficulty: "15", published: true },
  { day: 13, weekday: "Wed", keyword: "how to view sensitive content on twitter", volume: "4,400", difficulty: "11", published: false },
  { day: 14, weekday: "Thu", keyword: "how to get more twitter followers", volume: "2,800", difficulty: "22", published: false },
  { day: 15, weekday: "Fri", keyword: "how long can videos be on twitter", volume: "1,200", difficulty: "8", published: false },
  { day: 16, weekday: "Sat", keyword: "how to go viral on twitter", volume: "3,100", difficulty: "18", published: false },
  { day: 17, weekday: "Sun", keyword: "how many twitter followers to get verified", volume: "900", difficulty: "14", published: false },
];

const SIDEBAR_ITEMS = ["Content Planner", "Content History", "Settings", "Integrations"];

export const CalendarZoomScene: React.FC = () => {
  const frame = useCurrentFrame();

  // This is the SAME dashboard as PlannerDashScene but we continue
  // zooming in from where that scene left off, focusing on the calendar cards.
  // PlannerDashScene ended at: dashY=80, zoomIn=0.82
  // We start there and zoom further into the calendar grid area.

  // Continue zoom from 0.82 → 1.4+ (focusing on calendar area)
  const zoomIn = interpolate(frame, [0, 90], [0.82, 1.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Pan: shift the dashboard left+up to center the calendar cards
  // The calendar grid is roughly in the bottom-right of the main content area
  const panX = interpolate(frame, [0, 90], [0, -180], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const panY = interpolate(frame, [0, 90], [80, -60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Subtle 3D tilt as we zoom
  const tiltX = interpolate(frame, [0, 90], [0, 6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const tiltZ = interpolate(frame, [0, 90], [0, -2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
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
      {/* Same dashboard card, just zoomed + panned */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: panY,
          transform: `translateX(-50%) translateX(${panX}px) perspective(1200px) rotateX(${tiltX}deg) rotateZ(${tiltZ}deg) scale(${zoomIn})`,
          transformOrigin: "50% 60%",
          width: 1400,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
          display: "flex",
          overflow: "hidden",
          minHeight: 700,
        }}
      >
        {/* Sidebar — same as PlannerDashScene */}
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

        {/* Main content — same as PlannerDashScene */}
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

          {/* Calendar grid — same cards, all visible from start */}
          <div style={{ display: "flex", gap: 12 }}>
            {DAYS.map((day, i) => {
              const isActive = day.day === 12;

              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    minWidth: 160,
                    backgroundColor: isActive ? "#F8F0FF" : "#FAFAFA",
                    borderRadius: 12,
                    padding: 14,
                    border: isActive ? `2px solid ${PURPLE}` : "1px solid #ECECEC",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: "#111" }}>{day.day}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? PURPLE : "#888" }}>{day.weekday}</span>
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
                        marginBottom: 8,
                      }}
                    >
                      Published
                    </div>
                  )}

                  <div style={{ fontSize: 12, fontWeight: 600, color: "#222", lineHeight: 1.3, marginBottom: 10 }}>
                    {day.keyword}
                  </div>

                  <div style={{ fontSize: 10, color: "#888", marginBottom: 3 }}>Volume: {day.volume}</div>
                  <div style={{ fontSize: 10, color: "#888", marginBottom: 10 }}>Difficulty: {day.difficulty}</div>

                  {day.published && (
                    <div
                      style={{
                        padding: "6px 14px",
                        backgroundColor: "#333",
                        color: "#FFF",
                        fontSize: 11,
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
        </div>
      </div>
    </div>
  );
};
