import { useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

/**
 * CalendarScene — 30-day content calendar with zoom-out/in cycle.
 *
 * Ref frames 151–200 (~50 ref frames ≈ 75 output frames at 30fps).
 *
 * Phase 1 (frames  0–38): Zoom-in → settle on day 29 (purple) → pan right
 *                          through content cards (days 30, 31, 32)
 * Phase 2 (frames 38–62): Fast zoom-OUT → full FEBRUARY month calendar holds
 * Phase 3 (frames 62–75): Zoom back IN → targeting Sunday "5" (purple, gray bg)
 *                          with adjacent content card "how to get retweeted more"
 */

const CELL_W = 260;
const CELL_H = 200;
const GRID_TOP = 60; // day row-1 center at y=360

interface CardData {
  day?: number;
  isPurple?: boolean;
  title?: string;
  volume?: number;
  difficulty?: number;
}

// ── Phase 1: Content cards — days 27–33 ─────────────────────────────────────

const ROW_0: CardData[] = [
  { title: "twitter thread\nhook writing", volume: 3200, difficulty: 9 },
  { title: "best twitter\ncontent ideas", volume: 4100, difficulty: 10 },
  { title: "how to use\ntwitter lists", volume: 2800, difficulty: 7 },
  { title: "twitter profile\noptimization", volume: 4400, difficulty: 11 },
  { title: "build twitter\ncommunity guide", volume: 5100, difficulty: 13 },
  { title: "twitter spaces\nhow to host", volume: 3700, difficulty: 8 },
  { title: "advanced twitter\nanalytics tips", volume: 2600, difficulty: 7 },
];

const ROW_1: CardData[] = [
  { day: 27, title: "twitter DM\nautomation tips", volume: 1100, difficulty: 6 },
  { day: 28, title: "create viral\ntwitter polls", volume: 890, difficulty: 4 },
  { day: 29, isPurple: true },
  { day: 30, title: "how to write\nengaging tweets", volume: 210, difficulty: 3 },
  { day: 31, title: "how to block\nsensitive content\non twitter", volume: 210, difficulty: 7 },
  { day: 32, title: "how to get\nretweeted more", volume: 390, difficulty: 5 },
  { day: 33, title: "twitter growth\nhacks 2024", volume: 2200, difficulty: 9 },
];

// ── Phase 3: Content cards — Feb week 2 (days 5–11) ─────────────────────────

const ROW_3_0: CardData[] = [
  { }, // empty — no week before Feb 5 in upper row
  { }, // empty
  { }, // empty
  { day: 1, title: "twitter basics\nfor beginners", volume: 3400, difficulty: 5 },
  { day: 2, title: "set up twitter\nprofile guide", volume: 2700, difficulty: 4 },
  { day: 3, title: "first tweet\nbest practices", volume: 1900, difficulty: 3 },
  { day: 4, title: "find your\ntwitter niche", volume: 2100, difficulty: 5 },
];

const ROW_3_1: CardData[] = [
  { day: 5, isPurple: true }, // Sunday — highlighted
  { day: 6, title: "how to get\nretweeted more", volume: 390, difficulty: 2 },
  { day: 7, title: "write tweets\nthat get replies", volume: 1600, difficulty: 6 },
  { day: 8, title: "twitter hashtag\nstrategy guide", volume: 2900, difficulty: 7 },
  { day: 9, title: "grow followers\nwithout ads", volume: 4800, difficulty: 10 },
  { day: 10, title: "best twitter\ncontent formats", volume: 3300, difficulty: 8 },
  { day: 11, title: "schedule tweets\nfor max reach", volume: 1500, difficulty: 4 },
];

// ── Shared GridCell component ────────────────────────────────────────────────

const GridCell: React.FC<{ card: CardData; col: number; row: number }> = ({ card, col, row }) => {
  const x = col * CELL_W;
  const y = GRID_TOP + row * CELL_H;

  if (!card.isPurple && !card.title && !card.day) {
    // Empty cell — just render borders
    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: CELL_W,
          height: CELL_H,
          boxSizing: "border-box",
          borderRight: "1px solid #E2E2E2",
          borderBottom: "1px solid #E2E2E2",
          backgroundColor: "#FFFFFF",
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: CELL_W,
        height: CELL_H,
        boxSizing: "border-box",
        borderRight: "1px solid #E2E2E2",
        borderBottom: "1px solid #E2E2E2",
        backgroundColor: "#FFFFFF",
        fontFamily,
      }}
    >
      {card.isPurple ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 130,
              height: 130,
              borderRadius: 18,
              backgroundColor: "#F0F0F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 80,
                fontWeight: 700,
                color: "#7C3AED",
                lineHeight: 1,
                fontFamily,
              }}
            >
              {card.day}
            </span>
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            inset: "12px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: 1, paddingTop: 8 }}>
            <span
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#111111",
                lineHeight: 1.35,
                fontFamily,
                whiteSpace: "pre-wrap",
              }}
            >
              {card.title}
            </span>
          </div>
          {card.day && (
            <div
              style={{
                position: "absolute",
                right: 10,
                bottom: 50,
                fontSize: 34,
                fontWeight: 400,
                color: "#AAAAAA",
                fontFamily,
                lineHeight: 1,
              }}
            >
              {card.day}
            </div>
          )}
          <div style={{ height: 1, backgroundColor: "#E2E2E2", marginBottom: 8 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingBottom: 6 }}>
            <span style={{ fontSize: 13, color: "#888888", fontFamily }}>
              Volume: {card.volume?.toLocaleString()}
            </span>
            <span style={{ fontSize: 13, color: "#888888", fontFamily }}>
              Difficulty: {card.difficulty}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const ContentGrid: React.FC<{ row0: CardData[]; row1: CardData[] }> = ({ row0, row1 }) => {
  const GRID_W = CELL_W * 7;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: GRID_TOP,
          width: GRID_W,
          height: 1,
          backgroundColor: "#E2E2E2",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: GRID_TOP,
          width: 1,
          height: CELL_H * 2,
          backgroundColor: "#E2E2E2",
        }}
      />
      {row0.map((card, col) => (
        <GridCell key={`r0-${col}`} card={card} col={col} row={0} />
      ))}
      {row1.map((card, col) => (
        <GridCell key={`r1-${col}`} card={card} col={col} row={1} />
      ))}
    </>
  );
};

// ── Phase 2: Full FEBRUARY Calendar ─────────────────────────────────────────
// February 2023: starts Wednesday → Sundays = 5, 12, 19, 26

const FEB_DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const FEB_ROWS = [
  [0, 0, 0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 0, 0, 0, 0],
];
const FEB_WEEK_LABELS = ["", "7", "14", "21", "28"];

const CAL_PADDING_X = 80;
const CAL_PADDING_TOP = 60;
const WEEK_LABEL_W = 48;
const DAY_COL_W = Math.floor((1280 - CAL_PADDING_X * 2 - WEEK_LABEL_W) / 7);
const DAY_ROW_H = 88;
const HEADER_H = 52;
const DOW_ROW_H = 44;

const FullCalendar: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#FFFFFF",
        fontFamily,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: CAL_PADDING_TOP,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 38,
          fontWeight: 700,
          color: "#111111",
          letterSpacing: "0.12em",
          fontFamily,
        }}
      >
        FEBRUARY
      </div>

      <div
        style={{
          position: "absolute",
          top: CAL_PADDING_TOP + HEADER_H,
          left: CAL_PADDING_X + WEEK_LABEL_W,
          display: "flex",
          width: DAY_COL_W * 7,
        }}
      >
        {FEB_DAYS_OF_WEEK.map((d, i) => (
          <div
            key={d}
            style={{
              width: DAY_COL_W,
              textAlign: "center",
              fontSize: 14,
              fontWeight: 700,
              color: i === 0 ? "#7C3AED" : "#AAAAAA",
              letterSpacing: "0.06em",
              fontFamily,
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: CAL_PADDING_TOP + HEADER_H + DOW_ROW_H,
          left: CAL_PADDING_X,
          width: 1280 - CAL_PADDING_X * 2,
          height: 1,
          backgroundColor: "#E5E5E5",
        }}
      />

      {FEB_ROWS.map((row, r) => (
        <div key={r}>
          <div
            style={{
              position: "absolute",
              top: CAL_PADDING_TOP + HEADER_H + DOW_ROW_H + r * DAY_ROW_H + DAY_ROW_H / 2 - 10,
              left: CAL_PADDING_X,
              width: WEEK_LABEL_W,
              textAlign: "right",
              paddingRight: 12,
              fontSize: 14,
              color: "#CCCCCC",
              fontFamily,
              fontWeight: 400,
            }}
          >
            {FEB_WEEK_LABELS[r]}
          </div>

          {row.map((date, c) => {
            const isSunday = c === 0;
            const isEmpty = date === 0;
            return (
              <div
                key={c}
                style={{
                  position: "absolute",
                  top: CAL_PADDING_TOP + HEADER_H + DOW_ROW_H + r * DAY_ROW_H,
                  left: CAL_PADDING_X + WEEK_LABEL_W + c * DAY_COL_W,
                  width: DAY_COL_W,
                  height: DAY_ROW_H,
                  boxSizing: "border-box",
                  borderBottom: r < FEB_ROWS.length - 1 ? "1px solid #F0F0F0" : "none",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  paddingTop: 14,
                }}
              >
                {!isEmpty && (
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: isSunday ? 700 : 400,
                      color: isSunday ? "#7C3AED" : "#333333",
                      fontFamily,
                      lineHeight: 1,
                    }}
                  >
                    {date}
                  </span>
                )}
              </div>
            );
          })}

          {r === 0 &&
            [1, 2, 3, 4, 5, 6].map((c) => (
              <div
                key={c}
                style={{
                  position: "absolute",
                  top: CAL_PADDING_TOP + HEADER_H + DOW_ROW_H,
                  left: CAL_PADDING_X + WEEK_LABEL_W + c * DAY_COL_W,
                  width: 1,
                  height: DAY_ROW_H * FEB_ROWS.length,
                  backgroundColor: "#F4F4F4",
                }}
              />
            ))}
        </div>
      ))}
    </div>
  );
};

// ── Timing constants ──────────────────────────────────────────────────────────

const PHASE2_START = 38;
const PHASE2_SETTLE = 54;
const PHASE3_START = 62;
const SCENE_DURATION = 75;

// ── Main Scene ────────────────────────────────────────────────────────────────

export const CalendarScene: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Phase 1 camera ───────────────────────────────────────────────────────
  const motionBlur1 = interpolate(frame, [0, 10], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scaleSettle = interpolate(frame, [0, 14], [3.8, 2.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const scale1 = frame < 18 ? scaleSettle : 2.4;

  const translateX1 = interpolate(frame, [18, PHASE2_START], [-10, -530], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const contentOpacity1 = interpolate(frame, [PHASE2_START, PHASE2_START + 8], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Day 29 origin: col=2, x=650; row=1 center y=360
  const origin1X = 650;
  const origin1Y = 360;

  // ── Phase 2 calendar ─────────────────────────────────────────────────────
  const calendarOpacity = interpolate(
    frame,
    [PHASE2_START + 8, PHASE2_SETTLE, PHASE3_START + 2, PHASE3_START + 8],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Blur: appears at start of zoom-out then clears; reappears at start of zoom-in
  const blur2 = interpolate(
    frame,
    [PHASE2_START, PHASE2_START + 6, PHASE2_SETTLE, PHASE3_START, PHASE3_START + 5],
    [0, 14, 0, 0, 14],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Phase 3 camera ───────────────────────────────────────────────────────
  // Day 5 at col=0: center x=130, y=360 (GRID_TOP + 200 + 100)
  const origin3X = 130;
  const origin3Y = 360;

  const scale3 = interpolate(frame, [PHASE3_START, SCENE_DURATION], [0.8, 2.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  // At full zoom-in (scale=2.5), translateX to center day 5 at screen x=640:
  // 640 = 130 + tx * 2.5  →  tx = (640-130)/2.5 = 204
  // At zoom-out (scale=0.8), wide view centered
  const translateX3 = interpolate(frame, [PHASE3_START, SCENE_DURATION], [0, 204], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const contentOpacity3 = interpolate(frame, [PHASE3_START + 4, PHASE3_START + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const blur3 = interpolate(frame, [PHASE3_START + 5, PHASE3_START + 12], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* Phase 1: Content card grid — days 27–33, zoomed in + pan right */}
      {frame < PHASE2_START + 8 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: contentOpacity1,
            filter: `blur(${motionBlur1}px)`,
            transform: `scale(${scale1}) translateX(${translateX1 / scale1}px)`,
            transformOrigin: `${origin1X}px ${origin1Y}px`,
          }}
        >
          <ContentGrid row0={ROW_0} row1={ROW_1} />
        </div>
      )}

      {/* Phase 2: Full FEBRUARY calendar — appears then fades for phase 3 */}
      {frame >= PHASE2_START && frame < PHASE3_START + 8 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: calendarOpacity,
            filter: `blur(${blur2}px)`,
          }}
        >
          <FullCalendar />
        </div>
      )}

      {/* Phase 3: Content card grid — week 2 (days 5–11), zoom in on Sunday 5 */}
      {frame >= PHASE3_START + 4 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: contentOpacity3,
            filter: `blur(${blur3}px)`,
            transform: `scale(${scale3}) translateX(${translateX3 / scale3}px)`,
            transformOrigin: `${origin3X}px ${origin3Y}px`,
          }}
        >
          <ContentGrid row0={ROW_3_0} row1={ROW_3_1} />
        </div>
      )}
    </div>
  );
};
