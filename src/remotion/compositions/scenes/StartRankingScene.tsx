import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

const PURPLE = "#7C3AED";

export const StartRankingScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Text appears with spring-like entrance
  const textOp = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const textScale = interpolate(frame, [0, 10], [0.85, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.3)),
  });

  // "today." color transition: starts grey, becomes white
  const todayBrightness = interpolate(frame, [10, 25], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Purple curved arrow appears
  const arrowOp = interpolate(frame, [8, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const arrowScale = interpolate(frame, [8, 16], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  // Slight diagonal tilt for the whole composition
  const tilt = interpolate(frame, [0, 15], [3, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Subtle float
  const floatY = Math.sin(frame * 0.1) * 2;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          transform: `rotate(${tilt}deg) translateY(${floatY}px)`,
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Purple arrow pointing upward-right above "ranking" */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -20,
            opacity: arrowOp,
            transform: `scale(${arrowScale})`,
          }}
        >
          <svg
            width="120"
            height="80"
            viewBox="0 0 120 80"
            fill="none"
          >
            {/* Curved arrow shaft */}
            <path
              d="M10 70 Q 30 20, 80 15"
              stroke={PURPLE}
              strokeWidth={10}
              strokeLinecap="round"
              fill="none"
            />
            {/* Arrow head */}
            <polygon
              points="75,0 110,18 78,28"
              fill={PURPLE}
            />
          </svg>
          {/* Arrow shadow */}
          <svg
            width="120"
            height="80"
            viewBox="0 0 120 80"
            fill="none"
            style={{
              position: "absolute",
              top: 4,
              left: 4,
              opacity: 0.3,
              filter: "blur(6px)",
            }}
          >
            <path
              d="M10 70 Q 30 20, 80 15"
              stroke="#000"
              strokeWidth={10}
              strokeLinecap="round"
              fill="none"
            />
            <polygon
              points="75,0 110,18 78,28"
              fill="#000"
            />
          </svg>
        </div>

        {/* Main text */}
        <div
          style={{
            fontFamily:
              "Inter, system-ui, -apple-system, sans-serif",
            fontSize: 68,
            fontWeight: 700,
            opacity: textOp,
            transform: `scale(${textScale})`,
            lineHeight: 1.2,
          }}
        >
          <span style={{ color: "#FFFFFF" }}>Start ranking </span>
          <span
            style={{
              color: `rgb(${Math.round(todayBrightness * 255)}, ${Math.round(todayBrightness * 255)}, ${Math.round(todayBrightness * 255)})`,
            }}
          >
            today.
          </span>
        </div>
      </div>
    </div>
  );
};
