import { useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const PURPLE = "#A855F7";

/* ── Same 19-day data as PlannerDashScene ── */
const DAYS = [
  { day: 12, weekday: "Tue", keyword: "twitter trends worldwide", volume: "600", difficulty: "15", published: true },
  { day: 13, weekday: "Wed", keyword: "how to view sensitive content on twitter", volume: "4,400", difficulty: "11" },
  { day: 14, weekday: "Thu", keyword: "how to get more twitter likes", volume: "110", difficulty: "5" },
  { day: 15, weekday: "Fri", keyword: "how long can videos be on twitter", volume: "1,300", difficulty: "9" },
  { day: 16, weekday: "Sat", keyword: "how to go viral on twitter", volume: "320", difficulty: "3" },
  { day: 17, weekday: "Sun", keyword: "how many twitter followers to get paid", volume: "70", difficulty: "2" },
  { day: 18, weekday: "Mon", keyword: "understanding social media algorithms", volume: "40", difficulty: "1" },
  { day: 19, weekday: "Tue", keyword: "social media marketing strategies", volume: "4,400", difficulty: "33" },
  { day: 20, weekday: "Wed", keyword: "how to improve engagement on twitter", volume: "500", difficulty: "25" },
  { day: 21, weekday: "Thu", keyword: "best time to post on twitter", volume: "450", difficulty: "22" },
  { day: 22, weekday: "Fri", keyword: "how to block sensitive content on twitter", volume: "210", difficulty: "7" },
  { day: 23, weekday: "Sat", keyword: "how to schedule tweets with tweetdeck", volume: "50", difficulty: "4" },
  { day: 24, weekday: "Sun", keyword: "how to use hashtags effectively", volume: "50", difficulty: "22" },
  { day: 25, weekday: "Mon", keyword: "why use twitter analytics", volume: "480", difficulty: "6" },
  { day: 26, weekday: "Tue", keyword: "how to get retweeted more", volume: "390", difficulty: "2" },
  { day: 27, weekday: "Wed", keyword: "tips for twitter engagement", volume: "320", difficulty: "5" },
  { day: 28, weekday: "Thu", keyword: "twitter growth strategies", volume: "260", difficulty: "8" },
  { day: 29, weekday: "Fri", keyword: "how to write engaging tweets", volume: "210", difficulty: "3" },
  { day: 30, weekday: "Sat", keyword: "how to grow on twitter organically", volume: "140", difficulty: "9" },
];

const SIDEBAR_ITEMS = ["Content Planner", "Content History", "Settings", "Integrations"];

const CARD_W = 155;
const CARD_GAP = 8;
const ROW_GAP = 8;

/* ── Card component (identical to PlannerDashScene) ── */
const DayCard: React.FC<{
  day: typeof DAYS[0];
  isActive: boolean;
}> = ({ day, isActive }) => (
  <div
    style={{
      width: CARD_W,
      backgroundColor: isActive ? "#F3E8FF" : "#FAFAFA",
      borderRadius: 10,
      padding: "10px 10px 12px",
      border: isActive ? `2px solid ${PURPLE}` : "1px solid #ECECEC",
      boxShadow: isActive ? "0 4px 16px rgba(168,85,247,0.15)" : "none",
      flexShrink: 0,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      <span style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>{day.day}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? PURPLE : "#888" }}>{day.weekday}</span>
    </div>
    {day.published && (
      <div
        style={{
          display: "inline-block",
          padding: "2px 8px",
          backgroundColor: "#E8F5E9",
          color: "#2E7D32",
          fontSize: 9,
          fontWeight: 600,
          borderRadius: 5,
          marginBottom: 6,
        }}
      >
        Published
      </div>
    )}
    <div style={{ fontSize: 10, fontWeight: 600, color: "#222", lineHeight: 1.3, marginBottom: 8 }}>
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
          borderRadius: 5,
          textAlign: "center",
        }}
      >
        Visit Article
      </div>
    )}
  </div>
);

export const CalendarZoomScene: React.FC = () => {
  const frame = useCurrentFrame();

  const row1 = DAYS.slice(0, 6);
  const row2 = DAYS.slice(6, 13);
  const row3 = DAYS.slice(13, 19);

  /*
   * Seamless continuation from PlannerDashScene's final state:
   * PlannerDash ends: translateX(-50%) scale(0.78), top=60, NO perspective/tilt
   * We continue from that exact state → zoom deeper toward card 12
   */

  // Scale: continue from 0.78 → zoom to 1.8 (same transform style as PlannerDash)
  const zoomScale = interpolate(frame, [0, 25], [0.78, 1.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Top position: start at 60 (where PlannerDash ended), drift up slightly
  const panY = interpolate(frame, [0, 25], [60, 20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
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
      {/* Same dashboard card — same transform style as PlannerDash (no perspective) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: panY,
          transform: `translateX(-50%) scale(${zoomScale})`,
          transformOrigin: "top center",
          width: 1300,
          backgroundColor: "#FFFFFF",
          borderRadius: 14,
          boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
          display: "flex",
          overflow: "hidden",
          minHeight: 640,
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: 180,
            backgroundColor: "#FAFAFA",
            borderRight: "1px solid #ECECEC",
            padding: "20px 0",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          <div style={{ padding: "0 16px 22px", fontSize: 16, fontWeight: 700, color: "#111" }}>
            Outrank
          </div>
          {SIDEBAR_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                padding: "8px 16px",
                fontSize: 12,
                fontWeight: i === 0 ? 600 : 400,
                color: i === 0 ? "#111" : "#888",
                backgroundColor: i === 0 ? "#F0F0F0" : "transparent",
              }}
            >
              {item}
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ padding: "8px 16px", fontSize: 11, color: "#AAA" }}>Support</div>
          <div style={{ padding: "4px 16px", fontSize: 10, color: "#BBB" }}>ahmedhatata.ah@gmail.com</div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: "20px 24px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>Content Planner</div>
              <div style={{ fontSize: 10, color: "#999", marginTop: 3 }}>
                Schedule and manage your articles for upcoming dates. Articles are sent to your blog at 7AM-8AM UTC.
              </div>
            </div>
            <div
              style={{
                padding: "6px 14px",
                backgroundColor: "#F5F5F5",
                color: "#111",
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 7,
                border: "1px solid #E0E0E0",
              }}
            >
              Add Keyword
            </div>
          </div>

          {/* Month */}
          <div style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 10 }}>November 2024</div>

          {/* Calendar grid — 3 rows */}
          {[row1, row2, row3].map((row, ri) => (
            <div key={ri} style={{ display: "flex", gap: CARD_GAP, marginBottom: ROW_GAP }}>
              {ri === 0 && <div style={{ width: CARD_W, flexShrink: 0 }} />}
              {row.map((day) => (
                <DayCard key={day.day} day={day} isActive={day.day === 12} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* White flash at end */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#FFFFFF",
          opacity: interpolate(frame, [25, 29], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          zIndex: 50,
        }}
      />
    </div>
  );
};
