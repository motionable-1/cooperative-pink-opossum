import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

/**
 * ContentHistoryScene — Dashboard with WHITE sidebar.
 *
 * Start: "Content History" active, article list in main area.
 * Cursor moves to "Content Planner", clicks.
 * Sidebar switches active state, main area crossfades to calendar.
 *
 * Key: sidebar bg is WHITE, active item has dark charcoal pill.
 * Top bar: "Outrank" left, sun icon + avatar right.
 */

const SIDEBAR_W = 210;
const SIDEBAR_ITEMS = [
  { label: "Content Planner", icon: "calendar" },
  { label: "Content History", icon: "doc" },
  { label: "Settings", icon: "gear" },
  { label: "Integrations", icon: "plug" },
];

const ARTICLES = [
  { title: "Decoding Influencer Tweets: Strategies for Impact and Measurement", thumb: "#4F7CFF" },
  { title: "Analyzing Twitter Analytics on Other Accounts: A Comprehensive Guide", thumb: "#34D399" },
  { title: "Best Time to Tweet: A Data-Driven Guide to Maximizing Your Reach", thumb: "#60A5FA" },
];

const CAL_ROWS = [
  [
    { day: 4, title: "trending tweets", vol: 2100, diff: 9, hasBtn: true },
    { day: 5, title: "trends on twitter", vol: 50, diff: 1 },
    { day: 6, title: "twitter bookmarks", vol: 1600, diff: 7 },
    { day: 7, title: "hashtags on instagram", vol: 280, diff: 8 },
    { day: 0 },
    { day: 0 },
    { day: 0 },
  ],
  [
    { day: 11, title: "worldwide trends on twitter", vol: 880, diff: 10 },
    { day: 12, title: "twitter trends worldwide", vol: 600, diff: 13 },
    { day: 13, title: "how to view sensitive content on twitter", vol: 4400, diff: 11 },
    { day: 14, title: "historical tweets search", vol: 2400, diff: 15 },
    { day: 15, title: "how long can videos be on twitter", vol: 1100, diff: 9 },
    { day: 16, title: "how to go viral on twitter", vol: 320, diff: 3 },
    { day: 17, title: "how many twitter followers to get paid", vol: 70, diff: 2 },
  ],
  [
    { day: 18, title: "understanding social media algorithms", vol: 40, diff: 1 },
    { day: 19, title: "social media marketing strategies", vol: 4400, diff: 23 },
    { day: 20, title: "how to improve engagement on twitter", vol: 500, diff: 25 },
    { day: 21, title: "best time to post on twitter", vol: 450, diff: 22 },
    { day: 22, title: "how to block sensitive content on twitter", vol: 220, diff: 7 },
    { day: 23, title: "how to schedule tweets with tweetdeck", vol: 30, diff: 3 },
    { day: 24, title: "how to use hashtags effectively", vol: 50, diff: 22 },
  ],
  [
    { day: 25, title: "why use twitter analytics", vol: 400, diff: 6 },
    { day: 26, title: "how to get retweeted more", vol: 300, diff: 4 },
    { day: 27, title: "tips for twitter engagement", vol: 320, diff: 5 },
    { day: 28, title: "twitter growth strategies", vol: 280, diff: 8 },
    { day: 29, title: "how to write engaging tweets", vol: 210, diff: 3 },
    { day: 30, title: "how to grow on twitter organically", vol: 140, diff: 2 },
    { day: 0 },
  ],
];

const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ── Icon components ──────────────────────────────────────────────────────────

const SidebarIcon: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  const s: React.SVGProps<SVGSVGElement> = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", style: { flexShrink: 0 } };
  const ps = { stroke: color, strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (type === "calendar") return (<svg {...s}><rect x="2" y="3" width="12" height="11" rx="1.5" {...ps} fill="none" /><path d="M2 6.5h12" {...ps} /><path d="M5 1.5v3M11 1.5v3" {...ps} /></svg>);
  if (type === "doc") return (<svg {...s}><rect x="3" y="2" width="10" height="12" rx="1.5" {...ps} fill="none" /><path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" {...ps} /></svg>);
  if (type === "gear") return (<svg {...s}><circle cx="8" cy="8" r="2.5" {...ps} fill="none" /><path d="M8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14M3.8 3.8l1 1M11.2 11.2l1 1M3.8 12.2l1-1M11.2 4.8l1-1" {...ps} /></svg>);
  return (<svg {...s}><rect x="1.5" y="4" width="5.5" height="8" rx="1" {...ps} fill="none" /><rect x="9" y="4" width="5.5" height="8" rx="1" {...ps} fill="none" /></svg>);
};

// ── Main component ──────────────────────────────────────────────────────────

export const ContentHistoryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const CLICK_FRAME = 28;
  const activeIdx = frame < CLICK_FRAME ? 1 : 0;
  const hoverPlanner = frame >= 16 && frame < CLICK_FRAME;

  // Fade in
  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Content crossfade
  const historyOpacity = interpolate(frame, [CLICK_FRAME, CLICK_FRAME + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const plannerOpacity = interpolate(frame, [CLICK_FRAME + 5, CLICK_FRAME + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Cursor
  const cursorProg = interpolate(frame, [8, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const cursorX = interpolate(cursorProg, [0, 1], [440, 118]);
  const cursorY = interpolate(cursorProg, [0, 1], [480, 132]);
  const cursorOp = interpolate(frame, [8, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Click pulse
  const clickScale = frame >= CLICK_FRAME && frame < CLICK_FRAME + 4
    ? interpolate(frame, [CLICK_FRAME, CLICK_FRAME + 4], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  // 3D perspective tilt — kicks in AFTER planner view appears, zooms into first calendar block
  const TILT_START = CLICK_FRAME + 15; // after planner fully fades in
  const zoom = interpolate(frame, [TILT_START, durationInFrames], [1, 3.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const rotX = interpolate(frame, [TILT_START, durationInFrames], [0, 18], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const rotY = interpolate(frame, [TILT_START, durationInFrames], [0, -22], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const rotZ = interpolate(frame, [TILT_START, durationInFrames], [0, -4], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  // Origin targets first calendar cell: sidebar ~210px/1232px ≈ 17%, cell is ~first 1/7th of remaining = ~29% total X; top header 50 + title 30 + DOW 20 + half row ≈ 160/672 ≈ 24% Y
  const origX = interpolate(frame, [TILT_START, durationInFrames], [50, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const origY = interpolate(frame, [TILT_START, durationInFrames], [50, 28], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#A358F9", opacity: fadeIn }}>
      {/* 3D perspective wrapper — NO overflow hidden so tilt isn't clipped */}
      <div style={{ position: "absolute", top: 24, left: 24, right: 24, bottom: 24, perspective: 1200 }}>
      {/* App container with 3D tilt */}
      <div
        style={{
          width: "100%", height: "100%",
          backgroundColor: "#FFFFFF", borderRadius: 14, overflow: "hidden",
          display: "flex",
          transformOrigin: `${origX}% ${origY}%`,
          transform: `scale(${zoom}) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
        }}
      >
        {/* ── WHITE Sidebar ── */}
        <div
          style={{
            width: SIDEBAR_W, backgroundColor: "#FFFFFF", borderRight: "1px solid #F0F0F0",
            display: "flex", flexDirection: "column", padding: "18px 14px", flexShrink: 0,
          }}
        >
          {SIDEBAR_ITEMS.map((item, i) => {
            const isActive = i === activeIdx;
            const isHover = i === 0 && hoverPlanner && !isActive;
            return (
              <div
                key={item.label}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  height: 40, paddingLeft: 12, paddingRight: 12, borderRadius: 8, marginBottom: 3,
                  backgroundColor: isActive ? "#212B36" : isHover ? "#F1F3F5" : "transparent",
                  transform: i === 0 && frame >= CLICK_FRAME && frame < CLICK_FRAME + 4 ? `scale(${clickScale})` : "none",
                }}
              >
                <SidebarIcon type={item.icon} color={isActive ? "#FFFFFF" : "#4B5563"} />
                <span style={{
                  fontSize: 13, fontWeight: isActive ? 600 : 400, fontFamily,
                  color: isActive ? "#FFFFFF" : "#4B5563", whiteSpace: "nowrap",
                }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Main content ── */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {/* Top header bar */}
          <div style={{
            height: 50, display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 22px", borderBottom: "1px solid #F0F0F0",
          }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#111827", fontFamily }}>Outrank</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Sun icon */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="4" stroke="#9CA3AF" strokeWidth="1.4" />
                <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.4 3.4l1.4 1.4M13.2 13.2l1.4 1.4M3.4 14.6l1.4-1.4M13.2 4.8l1.4-1.4" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              {/* Avatar */}
              <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "#E5E7EB" }} />
            </div>
          </div>

          {/* ── Content History view ── */}
          <div style={{
            position: "absolute", top: 50, left: 0, right: 0, bottom: 0,
            opacity: historyOpacity, padding: "20px 24px",
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", fontFamily, marginBottom: 18 }}>
              Content History
            </div>

            {/* Table header */}
            <div style={{ display: "flex", gap: 14, paddingBottom: 10, borderBottom: "1px solid #F0F0F0", marginBottom: 4 }}>
              <span style={{ width: 52, fontSize: 12, color: "#6B7280", fontFamily, fontWeight: 500 }}>Image</span>
              <span style={{ flex: 1, fontSize: 12, color: "#6B7280", fontFamily, fontWeight: 500 }}>Title ↓</span>
              <span style={{ width: 70, fontSize: 12, color: "#6B7280", fontFamily, fontWeight: 500 }}>Keywords</span>
            </div>

            {/* Article rows */}
            {ARTICLES.map((a, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "12px 0",
                borderBottom: "1px solid #F8F8F8",
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 6, backgroundColor: a.thumb, flexShrink: 0, opacity: 0.85 }} />
                <span style={{ flex: 1, fontSize: 13, color: "#1F2937", fontFamily, fontWeight: 400, lineHeight: 1.4 }}>
                  {a.title}
                </span>
              </div>
            ))}
          </div>

          {/* ── Content Planner view (calendar) ── */}
          <div style={{
            position: "absolute", top: 50, left: 0, right: 0, bottom: 0,
            opacity: plannerOpacity, padding: "14px 14px", overflow: "hidden",
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", fontFamily, marginBottom: 10 }}>
              Content Planner
            </div>

            {/* DOW headers */}
            <div style={{ display: "flex", borderBottom: "1px solid #F0F0F0", paddingBottom: 6, marginBottom: 2 }}>
              {DOW.map((d) => (
                <div key={d} style={{ flex: 1, textAlign: "center", fontSize: 10, fontWeight: 600, color: "#9CA3AF", fontFamily }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            {CAL_ROWS.map((row, r) => (
              <div key={r} style={{ display: "flex" }}>
                {row.map((cell, c) => (
                  <div key={c} style={{
                    flex: 1, height: 118, borderRight: c < 6 ? "1px solid #F5F5F5" : "none",
                    borderBottom: "1px solid #F0F0F0", padding: "4px 4px", position: "relative",
                  }}>
                    {cell.day > 0 && (
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                          <span style={{ fontSize: 9, fontWeight: 600, color: "#AAAAAA", fontFamily }}>{cell.day}</span>
                          <span style={{ fontSize: 7, color: "#CCCCCC", fontFamily }}>{DOW[c]}</span>
                        </div>
                        {cell.title && (
                          <div style={{ backgroundColor: "#F3F4F6", borderRadius: 4, padding: "3px 4px" }}>
                            <span style={{ fontSize: 7.5, fontWeight: 500, color: "#374151", fontFamily, lineHeight: 1.25, display: "block" }}>
                              {cell.title.length > 32 ? cell.title.slice(0, 32) + "..." : cell.title}
                            </span>
                            <div style={{ marginTop: 2, display: "flex", gap: 5 }}>
                              <span style={{ fontSize: 6.5, color: "#9CA3AF", fontFamily }}>Volume: {(cell.vol ?? 0).toLocaleString()}</span>
                              <span style={{ fontSize: 6.5, color: "#9CA3AF", fontFamily }}>Difficulty: {cell.diff}</span>
                            </div>
                            {cell.hasBtn && (
                              <div style={{
                                marginTop: 3, backgroundColor: "#212B36", color: "#FFFFFF",
                                fontSize: 6, fontWeight: 600, fontFamily, padding: "2px 6px",
                                borderRadius: 3, display: "inline-block",
                              }}>
                                Visit Article
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* Mouse cursor */}
      {frame >= 8 && (
        <svg
          style={{ position: "absolute", left: cursorX, top: cursorY, width: 20, height: 26, opacity: cursorOp, pointerEvents: "none", zIndex: 100 }}
          viewBox="0 0 20 26" fill="none"
        >
          <path d="M2 2L2 18L5.5 14.5L9 22L12 21L8.5 13.5L14 13.5L2 2Z" fill="#111" stroke="#FFF" strokeWidth="1" />
        </svg>
      )}
    </div>
  );
};
