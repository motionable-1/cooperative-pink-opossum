import { useCurrentFrame, interpolate, Easing, Img } from "remotion";

/*
 * Continues from ArticleCardsScene's final layout.
 * Same card positions/rotations → rapid zoom toward center with blur → white out.
 */

const ARTICLES = [
  {
    src: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215220442_quuru6926h_article_trends.png",
    cx: 220, cy: 200, w: 300, h: 420, rot: -6, z: 2,
  },
  {
    src: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215221559_h18bywwtkt_article_best_time.png",
    cx: 1060, cy: 190, w: 300, h: 420, rot: 5, z: 2,
  },
  {
    src: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215219407_71mqv45iyin_article_influencer.png",
    cx: 640, cy: 360, w: 360, h: 500, rot: 0, z: 5,
  },
  {
    src: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215223862_j47lch305o_article_stats.png",
    cx: 320, cy: 500, w: 280, h: 390, rot: 4, z: 3,
  },
  {
    src: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215224905_7l4c418l8j3_article_engagement.png",
    cx: 960, cy: 510, w: 280, h: 390, rot: -5, z: 3,
  },
];

export const ArticleZoomScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Rapidly zoom toward center — zoom leads, blur follows
  const zoomProg = interpolate(frame, [0, 30], [1.02, 3.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  // Blur only kicks in AFTER zoom is well underway (starts at frame 12)
  const blurAmount = interpolate(frame, [12, 25, 30], [0, 6, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade to white at the very end
  const whiteOp = interpolate(frame, [22, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  // Background glow (match ArticleCardsScene settled state)
  const bgGlow = 0.6;
  const floatY = Math.sin(frame * 0.04) * 5;
  const floatX = Math.cos(frame * 0.03) * 3;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: `radial-gradient(ellipse at 50% 50%, rgba(120, 40, 200, ${bgGlow}) 0%, rgba(30, 5, 60, 0.95) 55%, #0a0014 100%)`,
      }}
    >
      {/* Ambient glow spots (match previous scene) */}
      <div
        style={{
          position: "absolute",
          left: "25%",
          top: "35%",
          width: 500,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(157, 98, 240, 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
          transform: `translate(${floatX * 2}px, ${floatY * 1.5}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "55%",
          top: "25%",
          width: 400,
          height: 250,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(168, 85, 247, 0.12) 0%, transparent 70%)",
          filter: "blur(50px)",
          transform: `translate(${-floatX * 1.5}px, ${-floatY}px)`,
        }}
      />

      {/* Cards zooming in with blur */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoomProg})`,
          transformOrigin: "50% 50%",
          filter: `blur(${blurAmount}px)`,
        }}
      >
        {ARTICLES.map((card, idx) => {
          const iFloatY = Math.sin(frame * 0.035 + idx * 1.8) * 5;
          const iFloatX = Math.cos(frame * 0.028 + idx * 2.2) * 3;
          const rotBreath = Math.sin(frame * 0.02 + idx * 1.5) * 0.8;

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: card.cx - card.w / 2 + floatX + iFloatX,
                top: card.cy - card.h / 2 + floatY + iFloatY,
                width: card.w,
                height: card.h,
                borderRadius: 14,
                overflow: "hidden",
                transform: `rotate(${card.rot + rotBreath}deg)`,
                transformOrigin: "center center",
                boxShadow:
                  "0 24px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3)",
                zIndex: card.z * 10,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Img
                src={card.src}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top center",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* White overlay for transition */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#FFFFFF",
          opacity: whiteOp,
          zIndex: 200,
        }}
      />
    </div>
  );
};
