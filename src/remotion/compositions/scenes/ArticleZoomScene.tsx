import { useCurrentFrame, interpolate, Easing, Img } from "remotion";

const ARTICLES = [
  {
    src: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215219407_71mqv45iyin_article_influencer.png",
    x: 380, y: -20, w: 340, h: 480, z: 3,
  },
  {
    src: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215220442_quuru6926h_article_trends.png",
    x: -80, y: 20, w: 280, h: 400, z: 1,
  },
  {
    src: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215221559_h18bywwtkt_article_best_time.png",
    x: 820, y: 30, w: 280, h: 400, z: 2,
  },
  {
    src: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215223862_j47lch305o_article_stats.png",
    x: -40, y: 360, w: 260, h: 370, z: 1,
  },
  {
    src: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215224905_7l4c418l8j3_article_engagement.png",
    x: 800, y: 350, w: 260, h: 370, z: 1,
  },
];

export const ArticleZoomScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Rapidly zoom toward center with radial blur effect
  const zoomProg = interpolate(frame, [0, 30], [1.02, 3.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  // Blur increases as we zoom
  const blurAmount = interpolate(frame, [0, 20, 30], [0, 8, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade to white at the end
  const whiteOp = interpolate(frame, [20, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  // Background glow
  const bgGlow = 0.6;
  const floatY = Math.sin(frame * 0.04) * 6;
  const floatX = Math.cos(frame * 0.03) * 4;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: `radial-gradient(ellipse at 50% 50%, rgba(120, 40, 200, ${bgGlow}) 0%, rgba(30, 5, 60, 0.95) 55%, #0a0014 100%)`,
      }}
    >
      {/* Cards zooming in with blur */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoomProg})`,
          transformOrigin: "50% 40%",
          filter: `blur(${blurAmount}px)`,
        }}
      >
        {ARTICLES.map((article, idx) => {
          const individualFloat = Math.sin(frame * 0.035 + idx * 1.8) * 5;
          const individualFloatX = Math.cos(frame * 0.028 + idx * 2.2) * 3;

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: article.x + floatX + individualFloatX,
                top: article.y + floatY + individualFloat,
                width: article.w,
                height: article.h,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                zIndex: article.z * 10,
              }}
            >
              <Img
                src={article.src}
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
