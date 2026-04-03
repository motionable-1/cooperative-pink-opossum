import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

const PURPLE = "#7C3AED";

/*
 * Animated traffic counter:
 * - Large number counting up from 0 → 968,000
 * - Purple semi-circular arcs behind (radar/broadcast effect)
 * - "Get traffic on auto-pilot." subtext below
 *
 * Arc animation: thick purple arc sweeps around like a progress meter,
 * with thinner concentric guide arcs behind it.
 */

const formatNumber = (n: number): string => {
  return Math.round(n).toLocaleString("en-US");
};

export const TrafficCounterScene: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Number count-up ── */
  // Ease through milestones: 0 → ~75k → ~593k → 968k
  const countProgress = interpolate(frame, [0, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const currentNumber = interpolate(countProgress, [0, 1], [0, 968000]);

  /* ── Number opacity ── */
  const numOp = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const numScale = interpolate(frame, [0, 8], [0.8, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });

  /* ── Subtext: "Get traffic on auto-pilot." ── */
  const subOp = interpolate(frame, [15, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const subY = interpolate(frame, [15, 25], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  /* ── Purple arc sweep ── */
  const arcSweep = interpolate(frame, [0, 70], [0, 280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  /* ── Thin concentric guide arcs ── */
  const guideOp = interpolate(frame, [5, 15], [0, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── Ambient pulse ── */
  const pulse = 1 + Math.sin(frame * 0.08) * 0.01;

  const ARC_CX = 640;
  const ARC_CY = 520;
  const ARC_R = 340;

  const arcPath = (r: number, startDeg: number, endDeg: number) => {
    const startRad = ((startDeg - 90) * Math.PI) / 180;
    const endRad = ((endDeg - 90) * Math.PI) / 180;
    const x1 = ARC_CX + r * Math.cos(startRad);
    const y1 = ARC_CY + r * Math.sin(startRad);
    const x2 = ARC_CX + r * Math.cos(endRad);
    const y2 = ARC_CY + r * Math.sin(endRad);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      {/* Purple arcs SVG */}
      <svg
        width={1280}
        height={720}
        viewBox="0 0 1280 720"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: `scale(${pulse})`,
          transformOrigin: `${ARC_CX}px ${ARC_CY}px`,
        }}
      >
        {/* Thin concentric guide arcs */}
        {[ARC_R - 60, ARC_R - 30, ARC_R, ARC_R + 30].map(
          (r, i) => (
            <path
              key={i}
              d={arcPath(r, -40, 220)}
              fill="none"
              stroke={PURPLE}
              strokeWidth={1.5}
              opacity={guideOp * (0.3 + i * 0.15)}
            />
          )
        )}

        {/* Main thick sweeping arc */}
        {arcSweep > 2 && (
          <path
            d={arcPath(ARC_R, -40, -40 + arcSweep)}
            fill="none"
            stroke={PURPLE}
            strokeWidth={12}
            strokeLinecap="round"
            opacity={0.9}
          />
        )}
      </svg>

      {/* Center number */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${numScale})`,
          opacity: numOp,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
            fontSize: 110,
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          {formatNumber(currentNumber)}
        </div>

        {/* Subtext */}
        <div
          style={{
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
            fontSize: 32,
            fontWeight: 600,
            color: "#FFFFFF",
            marginTop: 20,
            opacity: subOp,
            transform: `translateY(${subY}px)`,
          }}
        >
          Get traffic on auto-pilot.
        </div>
      </div>
    </div>
  );
};
