import React from "react";
import { useCurrentFrame, interpolate, Easing, spring } from "remotion";

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#A78BFA";
const PURPLE_GLOW = "#8B5CF6";

/*
 * Premium traffic counter:
 * - Layered concentric arcs with staggered sweep
 * - Orbiting glow dots on the arc paths
 * - Pulsing radial gradient behind the number
 * - Number counting up with slot-machine energy
 * - "Get traffic on auto-pilot." fades in below
 */

const formatNumber = (n: number): string => {
  return Math.round(n).toLocaleString("en-US");
};

const ARC_CX = 640;
const ARC_CY = 380;

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

const pointOnArc = (r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    x: ARC_CX + r * Math.cos(rad),
    y: ARC_CY + r * Math.sin(rad),
  };
};

/* Arc ring configs: radius, thickness, sweep delay, sweep range, color opacity */
const ARC_RINGS = [
  { r: 140, w: 2, delay: 0, sweep: 260, op: 0.15 },
  { r: 170, w: 3, delay: 3, sweep: 240, op: 0.2 },
  { r: 200, w: 5, delay: 5, sweep: 280, op: 0.35 },
  { r: 230, w: 8, delay: 2, sweep: 260, op: 0.5 },
  { r: 260, w: 12, delay: 0, sweep: 290, op: 0.85 },
  { r: 290, w: 4, delay: 6, sweep: 220, op: 0.25 },
  { r: 320, w: 2, delay: 8, sweep: 200, op: 0.12 },
];

export const TrafficCounterScene: React.FC = () => {
  const frame = useCurrentFrame();

  /* ── Number count-up ── */
  const countProgress = interpolate(frame, [5, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const currentNumber = interpolate(countProgress, [0, 1], [0, 968000]);

  /* ── Number entrance ── */
  const numSpr = spring({
    frame,
    fps: 30,
    config: { damping: 14, stiffness: 120, mass: 0.6 },
  });
  const numScale = interpolate(numSpr, [0, 1], [0.5, 1]);
  const numOp = interpolate(numSpr, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  /* ── Subtext ── */
  const subSpr = spring({
    frame: Math.max(0, frame - 18),
    fps: 30,
    config: { damping: 16, stiffness: 100, mass: 0.5 },
  });
  const subOp = interpolate(subSpr, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });
  const subY = interpolate(subSpr, [0, 1], [30, 0]);

  /* ── Background glow pulse ── */
  const bgPulse = 0.3 + Math.sin(frame * 0.06) * 0.08;
  const bgPulse2 = 0.2 + Math.sin(frame * 0.04 + 1.5) * 0.06;

  /* ── Overall slow zoom ── */
  const sceneScale = interpolate(frame, [0, 90], [0.96, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        overflow: "hidden",
        transform: `scale(${sceneScale})`,
        transformOrigin: "50% 45%",
      }}
    >
      {/* Deep radial glow behind everything */}
      <div
        style={{
          position: "absolute",
          left: ARC_CX - 400,
          top: ARC_CY - 400,
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(124, 58, 237, ${bgPulse}) 0%, rgba(124, 58, 237, 0.05) 50%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
      {/* Secondary offset glow */}
      <div
        style={{
          position: "absolute",
          left: ARC_CX - 250,
          top: ARC_CY - 350,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(139, 92, 246, ${bgPulse2}) 0%, transparent 60%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Arc rings SVG */}
      <svg
        width={1280}
        height={720}
        viewBox="0 0 1280 720"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          {/* Glow filter for the main arcs */}
          <filter id="arcGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="arcGlowStrong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Layered concentric arcs with staggered sweep */}
        {ARC_RINGS.map((ring, i) => {
          const sweepProg = interpolate(
            frame,
            [ring.delay, ring.delay + 55],
            [0, ring.sweep],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );

          // Subtle rotation drift per ring
          const rotDrift = Math.sin(frame * 0.015 + i * 0.9) * 3;
          const startAngle = -50 + rotDrift;

          if (sweepProg < 1) return null;

          return (
            <g key={i}>
              <path
                d={arcPath(ring.r, startAngle, startAngle + sweepProg)}
                fill="none"
                stroke={i === 4 ? PURPLE_GLOW : PURPLE}
                strokeWidth={ring.w}
                strokeLinecap="round"
                opacity={ring.op}
                filter={ring.w >= 8 ? "url(#arcGlow)" : undefined}
              />
            </g>
          );
        })}

        {/* Orbiting glow dots on key arcs */}
        {[200, 230, 260].map((r, di) => {
          const dotAngle = interpolate(
            frame,
            [di * 3, di * 3 + 65],
            [-50, 220],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );
          const dotPos = pointOnArc(r, dotAngle);
          const dotOp = interpolate(frame, [di * 3, di * 3 + 8, 70, 85], [0, 0.9, 0.9, 0.4], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <g key={`dot-${di}`}>
              <circle
                cx={dotPos.x}
                cy={dotPos.y}
                r={di === 1 ? 6 : 4}
                fill={PURPLE_LIGHT}
                opacity={dotOp}
                filter="url(#arcGlowStrong)"
              />
              <circle
                cx={dotPos.x}
                cy={dotPos.y}
                r={di === 1 ? 3 : 2}
                fill="#FFFFFF"
                opacity={dotOp}
              />
            </g>
          );
        })}

        {/* Faint dashed ring for texture */}
        <circle
          cx={ARC_CX}
          cy={ARC_CY}
          r={110}
          fill="none"
          stroke={PURPLE}
          strokeWidth={1}
          strokeDasharray="4 8"
          opacity={interpolate(frame, [10, 20], [0, 0.12], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          style={{
            transformOrigin: `${ARC_CX}px ${ARC_CY}px`,
            transform: `rotate(${frame * 0.3}deg)`,
          }}
        />
        <circle
          cx={ARC_CX}
          cy={ARC_CY}
          r={350}
          fill="none"
          stroke={PURPLE}
          strokeWidth={1}
          strokeDasharray="6 12"
          opacity={interpolate(frame, [12, 22], [0, 0.08], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          style={{
            transformOrigin: `${ARC_CX}px ${ARC_CY}px`,
            transform: `rotate(${-frame * 0.2}deg)`,
          }}
        />
      </svg>

      {/* Center number */}
      <div
        style={{
          position: "absolute",
          top: ARC_CY - 60,
          left: "50%",
          transform: `translate(-50%, -50%) scale(${numScale})`,
          opacity: numOp,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
            fontSize: 120,
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: -3,
            lineHeight: 1,
            textShadow: `0 0 40px rgba(124, 58, 237, 0.4), 0 0 80px rgba(124, 58, 237, 0.2)`,
          }}
        >
          {formatNumber(currentNumber)}
        </div>

        {/* Subtext */}
        <div
          style={{
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
            fontSize: 34,
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
            marginTop: 24,
            opacity: subOp,
            transform: `translateY(${subY}px)`,
            letterSpacing: -0.5,
          }}
        >
          Get traffic on auto-pilot.
        </div>
      </div>
    </div>
  );
};
