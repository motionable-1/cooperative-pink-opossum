import { useCurrentFrame, interpolate, Easing, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const PURPLE = "#A855F7";

const DAYS = [
  { day: 12, weekday: "Tue", keyword: "twitter trends worldwide", volume: "600", difficulty: "15", published: true },
  { day: 13, weekday: "Wed", keyword: "how to view sensitive content on twitter", volume: "4,400", difficulty: "11", published: false },
  { day: 14, weekday: "Thu", keyword: "how to get more twitter followers", volume: "2,800", difficulty: "22", published: false },
];

export const CalendarZoomScene: React.FC = () => {
  const frame = useCurrentFrame();

  // 3D perspective tilt — zoomed into the calendar cards
  const perspX = interpolate(frame, [0, 90], [8, 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const perspZ = interpolate(frame, [0, 90], [-3, -1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Scale and position — zoomed in on the cards
  const zoomScale = interpolate(frame, [0, 90], [1.6, 1.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Pan slightly right
  const panX = interpolate(frame, [0, 90], [-100, -200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // "November 2024" header
  const headerOp = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#F8F8F8",
        fontFamily,
        overflow: "hidden",
      }}
    >
      {/* 3D tilted container */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translateX(${panX}px) perspective(1000px) rotateX(${perspX}deg) rotateZ(${perspZ}deg) scale(${zoomScale})`,
          transformOrigin: "30% 50%",
        }}
      >
        {/* Month header */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#333",
            marginBottom: 16,
            opacity: headerOp,
          }}
        >
          November 2024
        </div>

        {/* Calendar cards row */}
        <div style={{ display: "flex", gap: 14 }}>
          {DAYS.map((day, i) => {
            const cardSpring = spring({
              frame: Math.max(0, frame - i * 4),
              fps: 30,
              config: { damping: 14, stiffness: 120, mass: 0.5 },
            });
            const cardOp = interpolate(cardSpring, [0, 0.3], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const cardY = interpolate(cardSpring, [0, 1], [15, 0]);

            const isActive = day.day === 12;

            return (
              <div
                key={i}
                style={{
                  width: 200,
                  backgroundColor: isActive ? "#F8F0FF" : "#FFFFFF",
                  borderRadius: 14,
                  padding: 16,
                  opacity: cardOp,
                  transform: `translateY(${cardY}px)`,
                  border: isActive ? `2px solid ${PURPLE}` : "1px solid #E8E8E8",
                  boxShadow: isActive
                    ? `0 8px 32px rgba(168, 85, 247, 0.15)`
                    : "0 4px 16px rgba(0,0,0,0.04)",
                }}
              >
                {/* Day header */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 24, fontWeight: 700, color: "#111" }}>{day.day}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: isActive ? PURPLE : "#888" }}>{day.weekday}</span>
                </div>

                {/* Published badge */}
                {day.published && (
                  <div
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      backgroundColor: "#E8F5E9",
                      color: "#2E7D32",
                      fontSize: 11,
                      fontWeight: 600,
                      borderRadius: 6,
                      marginBottom: 10,
                    }}
                  >
                    Published
                  </div>
                )}

                {/* Keyword */}
                <div style={{ fontSize: 13, fontWeight: 600, color: "#222", lineHeight: 1.4, marginBottom: 12 }}>
                  {day.keyword}
                </div>

                {/* Divider */}
                <div style={{ height: 1, backgroundColor: "#ECECEC", marginBottom: 10 }} />

                {/* Metrics */}
                <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Volume: {day.volume}</div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 12 }}>Difficulty: {day.difficulty}</div>

                {/* Visit Article button for published */}
                {day.published && (
                  <div
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#333",
                      color: "#FFF",
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 8,
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
  );
};
