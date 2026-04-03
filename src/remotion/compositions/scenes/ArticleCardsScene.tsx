import { useCurrentFrame, interpolate, Easing, spring, Img } from "remotion";

const ARTICLES = [
  {
    src: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215220442_quuru6926h_article_trends.png",
    x: -80, y: 20, w: 280, h: 400, z: 1,
  },
  {
    src: "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-assets/1775215219407_71mqv45iyin_article_influencer.png",
    x: 380, y: -20, w: 340, h: 480, z: 3, // center, largest
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

export const ArticleCardsScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Background: dark purple gradient with center glow
  const bgGlow = interpolate(frame, [0, 40], [0.3, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Slow ambient float for all cards
  const floatY = Math.sin(frame * 0.04) * 6;
  const floatX = Math.cos(frame * 0.03) * 4;

  // Overall scale: starts zoomed out, slowly zooms in
  const zoomScale = interpolate(frame, [0, 120], [0.92, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: `radial-gradient(ellipse at 50% 50%, rgba(120, 40, 200, ${bgGlow}) 0%, rgba(30, 5, 60, 0.95) 55%, #0a0014 100%)`,
      }}
    >
      {/* Subtle purple ambient glow spots */}
      <div
        style={{
          position: "absolute",
          left: "30%",
          top: "40%",
          width: 500,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(157, 98, 240, 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
          transform: `translate(${floatX * 2}px, ${floatY * 1.5}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "60%",
          top: "30%",
          width: 400,
          height: 250,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(168, 85, 247, 0.12) 0%, transparent 70%)",
          filter: "blur(50px)",
          transform: `translate(${-floatX * 1.5}px, ${-floatY}px)`,
        }}
      />

      {/* Article cards */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoomScale})`,
          transformOrigin: "50% 50%",
        }}
      >
        {ARTICLES.map((article, idx) => {
          const stagger = idx * 5;
          const cardSpring = spring({
            frame: Math.max(0, frame - stagger),
            fps: 30,
            config: { damping: 16, stiffness: 100, mass: 0.7 },
          });

          const startY = article.y + 120;
          const y = interpolate(cardSpring, [0, 1], [startY, article.y]);
          const opacity = interpolate(cardSpring, [0, 0.4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const scale = interpolate(cardSpring, [0, 1], [0.88, 1]);

          // Individual float offsets for organic feel
          const individualFloat = Math.sin(frame * 0.035 + idx * 1.8) * 5;
          const individualFloatX = Math.cos(frame * 0.028 + idx * 2.2) * 3;

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: article.x + floatX + individualFloatX,
                top: y + floatY + individualFloat,
                width: article.w,
                height: article.h,
                borderRadius: 12,
                overflow: "hidden",
                opacity,
                transform: `scale(${scale})`,
                boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)",
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
    </div>
  );
};
