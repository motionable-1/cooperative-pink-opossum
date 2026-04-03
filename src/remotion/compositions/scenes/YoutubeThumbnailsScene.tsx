import React from "react";
import { useCurrentFrame, interpolate, Easing, Img } from "remotion";

/*
 * Full YouTube-thumbnail-style composite image:
 * Man with yellow hoodie + laptop + "YEP!" text + purple speed lines + halftone dots
 * All baked into one image for clean rendering (no transparency issues).
 */
const THUMB_COMPOSITE =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-promo/1775227723208_xni3ewgxcj_yt_thumbnail_v4.png";

export const YoutubeThumbnailsScene: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Punchy entrance: scale up from slightly small with overshoot ── */
  const enterScale = interpolate(frame, [0, 12], [0.6, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.6)),
  });
  const settleScale = interpolate(frame, [12, 20], [1.02, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const scale = frame < 12 ? enterScale : settleScale;

  /* ── Fade in fast ── */
  const opacity = interpolate(frame, [0, 4], [0, 1], {
    extrapolateRight: "clamp",
  });

  /* ── Slight rotation on entrance ── */
  const rotation = interpolate(frame, [0, 12], [-2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  /* ── Slow ambient zoom while holding ── */
  const breathe = interpolate(frame, [20, 50], [1, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const finalScale = scale * breathe;

  /* ── Subtle ambient float ── */
  const floatY = Math.sin(frame * 0.1) * 2;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      <Img
        src={THUMB_COMPOSITE}
        style={{
          position: "absolute",
          width: "105%",
          height: "105%",
          left: "-2.5%",
          top: "-2.5%",
          objectFit: "cover",
          opacity,
          transform: `scale(${finalScale}) rotate(${rotation}deg) translateY(${floatY}px)`,
          transformOrigin: "center center",
        }}
      />
    </div>
  );
};
