import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

/**
 * UI mockup: "Tell us about your business" form.
 *
 * Ref frames 049-134 (86 frames at 50ms = 4.3s).
 * White/light gray background with a centered form card.
 * Top: tab navigation (Business, Competitors, Blog, Articles, Keywords) with connecting line.
 * Heading: "Tell us about your business"
 * Fields: "Website to Business" input, "Autocomplete With AI" teal button,
 *         "Business Name" input, "Description" textarea.
 *
 * Animation:
 * - Frames 0-5: Fade in from black
 * - Frames 5-20: Static view, URL placeholder visible
 * - Frames 20-30: URL types "https://superx.so/" letter by letter
 * - Frames 10-90: Continuous slow zoom toward the form center
 * - Frames 70-90: Business Name "SuperX" appears, Description text fills in
 * - Entire scene has a subtle cursor near the URL field
 */

const URL_TEXT = "https://superx.so/";
const BUSINESS_NAME = "SuperX";
const DESCRIPTION_TEXT =
  "SuperX is an innovative Chrome extension designed to enhance your experience on X, providing users with advanced analytics and actionable insights to grow their presence on the platform. This tool empowers users — whether they're casual tweeters or influential content creators — to understand their audience better, optimize content, and optimize growth strategies. SuperX offers insightful analytics such as performance metrics, engagement tracking, and follower trends, enabling users to identify what works best for them. It also allows users to analyze any X profile's top tweets and stats, ensuring they stay informed and strategic.";

export const BusinessFormScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // === Fade in from black ===
  const fadeIn = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // === Continuous slow zoom — camera travels from top of form down into description ===
  const zoom = interpolate(frame, [0, durationInFrames], [1, 3.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Zoom origin Y: travels from top of form (tabs/heading) down to description area
  const originY = interpolate(frame, [0, durationInFrames], [20, 75], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Zoom origin X: slightly left of center so left-aligned labels stay visible at high zoom
  const originX = 42;

  // === URL typing (frames 20-38) ===
  const urlCharCount = Math.floor(
    interpolate(frame, [20, 38], [0, URL_TEXT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const typedUrl = urlCharCount > 0 ? URL_TEXT.slice(0, urlCharCount) : "";
  const showPlaceholder = urlCharCount === 0;

  // === Business Name appears (~ref frame 120 = output frame ~107) ===
  const businessNameOpacity = interpolate(frame, [100, 108], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // === Description text typing (starts ~ref frame 120+ = output frame ~108) ===
  const descCharCount = Math.floor(
    interpolate(frame, [110, durationInFrames - 2], [0, Math.min(DESCRIPTION_TEXT.length, 400)], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const typedDesc = descCharCount > 0 ? DESCRIPTION_TEXT.slice(0, descCharCount) : "";

  // === Cursor blink ===
  const cursorVisible = Math.sin(frame * 0.4) > 0;

  // Active tab
  const tabs = ["Business", "Competitors", "Blog", "Articles", "Keywords"];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#f5f5f7",
        opacity: fadeIn,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${originX}% ${originY}%`,
          transform: `scale(${zoom})`,
        }}
      >
        {/* Form container */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 680,
            fontFamily,
          }}
        >
          {/* Tab navigation */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 32,
              marginBottom: 28,
              position: "relative",
            }}
          >
            {/* Connecting line behind tabs */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "10%",
                right: "10%",
                height: 1,
                backgroundColor: "#d1d5db",
                zIndex: 0,
              }}
            />
            {tabs.map((tab, i) => (
              <div
                key={tab}
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: i === 0 ? "#000" : "#d1d5db",
                    border: "2px solid",
                    borderColor: i === 0 ? "#000" : "#d1d5db",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: i === 0 ? 600 : 400,
                    color: i === 0 ? "#000" : "#9ca3af",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab}
                </span>
              </div>
            ))}
          </div>

          {/* Heading */}
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#111",
              textAlign: "center",
              marginBottom: 28,
              letterSpacing: "-0.01em",
            }}
          >
            Tell us about your business
          </h2>

          {/* Website to Business field */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                display: "block",
                marginBottom: 6,
              }}
            >
              Website to Business
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1.5px solid #2dd4bf",
                borderRadius: 8,
                padding: "10px 14px",
                backgroundColor: "#fff",
                position: "relative",
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: showPlaceholder ? "#9ca3af" : "#111",
                  fontWeight: 400,
                  flex: 1,
                }}
              >
                {showPlaceholder ? "https://yourbusinesswebsite.com" : typedUrl}
                {!showPlaceholder && cursorVisible && (
                  <span style={{ color: "#111" }}>|</span>
                )}
              </span>
              {/* Mouse cursor near input */}
              {frame > 18 && frame < 55 && (
                <div
                  style={{
                    position: "absolute",
                    right: -20,
                    bottom: -15,
                    fontSize: 16,
                    transform: "rotate(-10deg)",
                    pointerEvents: "none",
                  }}
                >
                  <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
                    <path
                      d="M1 1L1 15L4.5 11.5L8 18L10.5 17L7 10.5L12 10.5L1 1Z"
                      fill="#000"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Autocomplete With AI button */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                backgroundColor: "#2dd4bf",
                color: "#000",
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 16px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 14 }}>&#x2728;</span>
              Autocomplete With AI
            </div>
          </div>

          {/* Business Name field */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                display: "block",
                marginBottom: 6,
              }}
            >
              Business Name
            </label>
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "10px 14px",
                backgroundColor: "#fff",
                minHeight: 20,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: businessNameOpacity > 0.5 ? "#111" : "#9ca3af",
                  fontWeight: 400,
                  opacity: Math.max(businessNameOpacity, 0.4),
                }}
              >
                {businessNameOpacity > 0.1 ? BUSINESS_NAME : "Your Business Name"}
              </span>
            </div>
          </div>

          {/* Description field */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                display: "block",
                marginBottom: 6,
              }}
            >
              Description
            </label>
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "10px 14px",
                backgroundColor: "#fff",
                minHeight: 80,
              }}
            >
              <span
                style={{
                  fontSize: 12.5,
                  color: descCharCount > 0 ? "#374151" : "#9ca3af",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  display: "block",
                }}
              >
                {descCharCount > 0
                  ? typedDesc
                  : "Describe your business..."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
