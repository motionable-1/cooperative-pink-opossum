import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

/**
 * ContentHistoryScene — Dashboard UI with sidebar navigation.
 *
 * Start frame: "Content History" is active in sidebar, main area shows article list.
 * Cursor hovers over "Content Planner" in sidebar, clicks it.
 * Sidebar switches to "Content Planner" active, main area crossfades to calendar view.
 *
 * Layout:
 * - Purple outer background
 * - White rounded app container
 * - Dark sidebar (left ~200px) with nav items + icons
 * - Main content area (right)
 *
 * Sidebar items: Content Planner, Content History, Settings, Integrations
 * Bottom: Support button
 */

// ── Sidebar items ────────────────────────────────────────────────────────────

const SIDEBAR_W = 200;
const SIDEBAR_BG = "#1a1a2e";
const SIDEBAR_ITEM_H = 42;
const SIDEBAR_ITEMS = [
  { label: "Content Planner", icon: "calendar" },
  { label: "Content History", icon: "doc" },
  { label: "Settings", icon: "gear" },
  { label: "Integrations", icon: "plug" },
];

// ── Article data for Content History ────────────────────────────────────────

const ARTICLES = [
  {
    title: "Decoding Influencer Tweets: Strategies for Impact and Measurement",
    color: "#4F7CFF",
  },
  {
    title: "Analyzing Twitter Analytics on Other Accounts: A Comprehensive Guide",
    color: "#34D399",
  },
  {
    title: "Best Time to Tweet: A Data-Driven Guide to Maximizing Your Reach",
    color: "#F59E0B",
  },
];

// ── Calendar data for Content Planner ────────────────────────────────────────

const CALENDAR_ROWS = [
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
    { day: 0, title: "", vol: 0, diff: 0 },
  ],
];

const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ── Icon SVGs (simple inline) ────────────────────────────────────────────────

const SidebarIcon: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  const s = { width: 16, height: 16, fill: "none", stroke: color, strokeWidth: 1.5 };
  if (type === "calendar")
    return (
      <svg viewBox="0 0 16 16" {...s}>
        <rect x="2" y="3" width="12" height="11" rx="1.5" />
        <path d="M2 6.5h12" />
        <path d="M5 1.5v3M11 1.5v3" />
        <path d="M5.5 9l2 2 3-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (type === "doc")
    return (
      <svg viewBox="0 0 16 16" {...s}>
        <rect x="3" y="2" width="10" height="12" rx="1.5" />
        <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" strokeLinecap="round" />
      </svg>
    );
  if (type === "gear")
    return (
      <svg viewBox="0 0 16 16" {...s}>
        <circle cx="8" cy="8" r="2.5" />
        <path d="M8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14M3.8 3.8l1 1M11.2 11.2l1 1M3.8 12.2l1-1M11.2 4.8l1-1" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg viewBox="0 0 16 16" {...s}>
      <rect x="1" y="4" width="6" height="8" rx="1" />
      <rect x="9" y="4" width="6" height="8" rx="1" />
      <path d="M7 7h2M7 9h2" strokeLinecap="round" />
    </svg>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

export const ContentHistoryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Timeline:
  // 0-8: Fade in, Content History active
  // 8-20: Cursor moves to "Content Planner"
  // 20-25: Hover state visible on Content Planner
  // 25-30: Click — active state switches
  // 30-45: Main content crossfades from article list → calendar
  // 45-end: Calendar view holds with subtle zoom

  const CLICK_FRAME = 28;

  // Which sidebar item is active? 1=Content History (start), 0=Content Planner (after click)
  const activeIdx = frame < CLICK_FRAME ? 1 : 0;

  // Hover state on Content Planner before click
  const hoverPlanner = frame >= 16 && frame < CLICK_FRAME;

  // Fade in
  const fadeIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Main content crossfade
  const historyOpacity = interpolate(frame, [CLICK_FRAME, CLICK_FRAME + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const plannerOpacity = interpolate(frame, [CLICK_FRAME + 5, CLICK_FRAME + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cursor position — moves from bottom-center to "Content Planner" sidebar item
  const cursorProgress = interpolate(frame, [8, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const cursorX = interpolate(cursorProgress, [0, 1], [400, 120]);
  const cursorY = interpolate(cursorProgress, [0, 1], [500, 158]);
  const cursorOpacity = interpolate(frame, [8, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Click pulse
  const clickPulse =
    frame >= CLICK_FRAME && frame < CLICK_FRAME + 4
      ? interpolate(frame, [CLICK_FRAME, CLICK_FRAME + 4], [0.85, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  // 3D perspective tilt — matches the style used across the video
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const rotateX = interpolate(frame, [0, durationInFrames], [2, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const rotateY = interpolate(frame, [0, durationInFrames], [-2, -14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const rotateZ = interpolate(frame, [0, durationInFrames], [0, -2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const originX = interpolate(frame, [0, durationInFrames], [50, 40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const originY = interpolate(frame, [0, durationInFrames], [50, 45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#7C3AED",
        overflow: "hidden",
        opacity: fadeIn,
      }}
    >
      {/* App container — white rounded card with 3D perspective */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 28,
          right: 28,
          bottom: 28,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          overflow: "hidden",
          display: "flex",
          perspective: 1200,
          transformOrigin: `${originX}% ${originY}%`,
          transform: `scale(${zoom}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
          transformStyle: "preserve-3d" as const,
        }}
      >
        {/* ── Sidebar ── */}
        <div
          style={{
            width: SIDEBAR_W,
            backgroundColor: SIDEBAR_BG,
            display: "flex",
            flexDirection: "column",
            padding: "20px 12px",
            flexShrink: 0,
          }}
        >
          {/* Logo placeholder */}
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#FFFFFF",
              fontFamily,
              marginBottom: 28,
              paddingLeft: 10,
            }}
          >
            Outrank
          </div>

          {/* Nav items */}
          {SIDEBAR_ITEMS.map((item, i) => {
            const isActive = i === activeIdx;
            const isHover = i === 0 && hoverPlanner && !isActive;
            return (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  height: SIDEBAR_ITEM_H,
                  paddingLeft: 12,
                  paddingRight: 12,
                  borderRadius: 8,
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.15)"
                    : isHover
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",
                  marginBottom: 4,
                  transform: i === 0 && frame >= CLICK_FRAME && frame < CLICK_FRAME + 4 ? `scale(${clickPulse})` : "none",
                }}
              >
                <SidebarIcon type={item.icon} color={isActive ? "#FFFFFF" : "#9CA3AF"} />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#FFFFFF" : "#9CA3AF",
                    fontFamily,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Support button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              height: 36,
              borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.12)",
              fontSize: 12,
              fontWeight: 600,
              color: "#FFFFFF",
              fontFamily,
            }}
          >
            Support
          </div>
        </div>

        {/* ── Main content area ── */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {/* Header bar */}
          <div
            style={{
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              borderBottom: "1px solid #F0F0F0",
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111", fontFamily }}>
              Outrank
            </span>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor: "#E5E7EB",
              }}
            />
          </div>

          {/* Content History view */}
          <div
            style={{
              position: "absolute",
              top: 52,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: historyOpacity,
              padding: "24px 28px",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111", fontFamily, marginBottom: 20 }}>
              Content History
            </div>

            {/* Table header */}
            <div
              style={{
                display: "flex",
                gap: 16,
                paddingBottom: 12,
                borderBottom: "1px solid #F0F0F0",
                marginBottom: 8,
              }}
            >
              <span style={{ width: 60, fontSize: 11, color: "#9CA3AF", fontFamily, fontWeight: 500 }}>Image</span>
              <span style={{ flex: 1, fontSize: 11, color: "#9CA3AF", fontFamily, fontWeight: 500 }}>Title ↓</span>
              <span style={{ width: 60, fontSize: 11, color: "#9CA3AF", fontFamily, fontWeight: 500 }}>Keywords</span>
            </div>

            {/* Articles */}
            {ARTICLES.map((article, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 0",
                  borderBottom: "1px solid #F8F8F8",
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 6,
                    backgroundColor: article.color,
                    flexShrink: 0,
                    opacity: 0.8,
                  }}
                />
                <span style={{ flex: 1, fontSize: 13, color: "#374151", fontFamily, fontWeight: 400 }}>
                  {article.title}
                </span>
              </div>
            ))}
          </div>

          {/* Content Planner view — calendar */}
          <div
            style={{
              position: "absolute",
              top: 52,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: plannerOpacity,
              padding: "16px 16px",
              
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily, marginBottom: 14 }}>
              Content Planner
            </div>

            {/* Day of week headers */}
            <div style={{ display: "flex", marginBottom: 4 }}>
              {DOW.map((d) => (
                <div
                  key={d}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#9CA3AF",
                    fontFamily,
                    paddingBottom: 6,
                    borderBottom: "1px solid #F0F0F0",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar rows */}
            {CALENDAR_ROWS.map((row, r) => (
              <div key={r} style={{ display: "flex" }}>
                {row.map((cell, c) => (
                  <div
                    key={c}
                    style={{
                      flex: 1,
                      height: 130,
                      borderRight: c < 6 ? "1px solid #F5F5F5" : "none",
                      borderBottom: "1px solid #F0F0F0",
                      padding: "4px 5px",
                      position: "relative",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    {cell.day > 0 && (
                      <>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#999", fontFamily }}>
                          {cell.day}
                        </span>
                        {cell.title && (
                          <div
                            style={{
                              marginTop: 4,
                              backgroundColor: "#F3F4F6",
                              borderRadius: 4,
                              padding: "4px 5px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 8.5,
                                fontWeight: 500,
                                color: "#374151",
                                fontFamily,
                                lineHeight: 1.25,
                                display: "block",
                              }}
                            >
                              {cell.title.length > 35 ? cell.title.slice(0, 35) + "..." : cell.title}
                            </span>
                            <div style={{ marginTop: 3, display: "flex", gap: 6 }}>
                              <span style={{ fontSize: 7, color: "#9CA3AF", fontFamily }}>
                                Vol: {cell.vol.toLocaleString()}
                              </span>
                              <span style={{ fontSize: 7, color: "#9CA3AF", fontFamily }}>
                                Diff: {cell.diff}
                              </span>
                            </div>
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

      {/* Mouse cursor */}
      {frame >= 8 && (
        <svg
          style={{
            position: "absolute",
            left: cursorX,
            top: cursorY,
            width: 22,
            height: 28,
            opacity: cursorOpacity,
            pointerEvents: "none",
            zIndex: 100,
          }}
          viewBox="0 0 22 28"
          fill="none"
        >
          <path
            d="M3 2L3 20L7.5 16L11 24L14 23L10.5 15L17 15L3 2Z"
            fill="#111111"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />
        </svg>
      )}
    </div>
  );
};
