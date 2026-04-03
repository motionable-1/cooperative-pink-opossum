import { useCurrentFrame, interpolate, Easing, Img } from "remotion";

const BURST_IMG =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/outrank-promo/1775219016130_wut2vthofqs_radial_burst_manga.png";

export const RadialBurstScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Burst scales up rapidly from 0 → full
  const scaleUp = interpolate(frame, [0, 10], [0.3, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
  });

  // Settle to 1.05 after overshoot
  const settle = interpolate(frame, [10, 18], [1.15, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const scale = frame < 10 ? scaleUp : settle;

  // Fade in
  const opacity = interpolate(frame, [0, 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle slow rotation for living energy
  const rotation = interpolate(frame, [0, 30], [0, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
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
      <Img
        src={BURST_IMG}
        style={{
          position: "absolute",
          width: "120%",
          height: "120%",
          left: "-10%",
          top: "-10%",
          objectFit: "cover",
          opacity,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          transformOrigin: "center center",
        }}
      />
    </div>
  );
};
