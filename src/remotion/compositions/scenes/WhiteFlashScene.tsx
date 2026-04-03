import { useCurrentFrame, interpolate } from "remotion";

export const WhiteFlashScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Cursor fades out
  const cursorOp = interpolate(frame, [2, 8], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#FFFFFF", overflow: "hidden" }}>
      {/* Cursor remnant */}
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 420,
          opacity: cursorOp,
          zIndex: 100,
        }}
      >
        <svg width="28" height="36" viewBox="0 0 24 32" fill="none">
          <path
            d="M2 2L2 26L8 20L14 30L18 28L12 18L20 18L2 2Z"
            fill="#000000"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
