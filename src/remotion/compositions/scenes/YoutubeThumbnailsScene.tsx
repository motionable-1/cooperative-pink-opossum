import React from "react";
import { useCurrentFrame, interpolate, Easing, Img } from "remotion";

const THUMB_YES =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-promo/1775224923480_7cnuzlgq8do_youtube_thumb_yes.png";
const THUMB_YEP =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-promo/1775224925464_tvdh8oo893r_youtube_thumb_yep.png";

const PURPLE = "#7C3AED";

export const YoutubeThumbnailsScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Two YouTube-style thumbnails fly in from opposite sides
  // Card 1 (left) - slides in from left with slight rotation
  const card1X = interpolate(frame, [0, 12], [-600, 40], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });
  const card1Rot = interpolate(frame, [0, 12], [-15, -6], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const card1Scale = interpolate(frame, [0, 12], [0.7, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.1)),
  });

  // Card 2 (right) - slides in from right, slightly delayed
  const card2X = interpolate(frame, [4, 16], [600, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });
  const card2Rot = interpolate(frame, [4, 16], [15, 5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const card2Scale = interpolate(frame, [4, 16], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.1)),
  });

  // Subtle float after landing
  const float1 = Math.sin(frame * 0.12) * 3;
  const float2 = Math.cos(frame * 0.1) * 4;

  // Shadow pulse
  const shadowSpread = interpolate(frame, [12, 45], [15, 25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Overall opacity
  const opacity = interpolate(frame, [0, 3], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        overflow: "hidden",
        opacity,
      }}
    >
      {/* Subtle purple radial glow behind cards */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 800,
          height: 500,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse, ${PURPLE}15 0%, transparent 70%)`,
        }}
      />

      {/* Card 1: YES thumbnail - upper left */}
      <div
        style={{
          position: "absolute",
          top: 100 + float1,
          left: card1X,
          width: 520,
          height: 292,
          borderRadius: 16,
          overflow: "hidden",
          transform: `rotate(${card1Rot}deg) scale(${card1Scale})`,
          boxShadow: `0 ${shadowSpread}px ${shadowSpread * 2}px rgba(124, 58, 237, 0.3)`,
        }}
      >
        <Img
          src={THUMB_YES}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Card 2: YEP thumbnail - lower right */}
      <div
        style={{
          position: "absolute",
          top: 320 + float2,
          left: 640 + card2X,
          width: 520,
          height: 292,
          borderRadius: 16,
          overflow: "hidden",
          transform: `rotate(${card2Rot}deg) scale(${card2Scale})`,
          boxShadow: `0 ${shadowSpread}px ${shadowSpread * 2}px rgba(124, 58, 237, 0.3)`,
        }}
      >
        <Img
          src={THUMB_YEP}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
};
