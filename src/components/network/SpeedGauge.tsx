import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface SpeedGaugeProps {
  value: number;
  maxValue: number;
  unit: string;
  phase: "idle" | "ping" | "download" | "upload" | "complete";
  progress: number;
}

const phaseColors = {
  idle: { primary: "hsl(215, 16%, 47%)", secondary: "hsl(215, 16%, 60%)" },
  ping: { primary: "hsl(38, 92%, 50%)", secondary: "hsl(45, 93%, 58%)" },
  download: { primary: "hsl(142, 76%, 36%)", secondary: "hsl(142, 71%, 45%)" },
  upload: { primary: "hsl(199, 89%, 48%)", secondary: "hsl(172, 66%, 50%)" },
  complete: { primary: "hsl(142, 76%, 36%)", secondary: "hsl(172, 66%, 50%)" },
};

export const SpeedGauge = ({ value, maxValue, unit, phase, progress }: SpeedGaugeProps) => {
  const colors = phaseColors[phase];
  const size = 280;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;

  // Spring animation for smooth value transitions
  const springValue = useSpring(0, {
    stiffness: 220,
    damping: 28,
    mass: 0.5,
  });

  const springProgress = useSpring(0, {
    stiffness: 180,
    damping: 25,
  });

  // Update spring values when props change
  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  useEffect(() => {
    springProgress.set(progress);
  }, [progress, springProgress]);

  // Transform spring value to stroke dash offset
  const valueDashOffset = useTransform(springValue, (v) => {
    const percent = Math.min(v / maxValue, 1);
    return arcLength - (arcLength * percent);
  });

  const progressDashOffset = useTransform(springProgress, (p) => {
    return arcLength - (arcLength * (p / 100));
  });

  // Transform for display value (smooth number) - always return string
  const displayValue = useTransform(springValue, (v) => {
    if (phase === "ping") {
      return Math.round(v).toString();
    }
    return v.toFixed(1);
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform rotate-[135deg]"
      >
        {/* Background arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          className="text-muted/30"
        />
        
        {/* Progress arc (shows time remaining) */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth - 4}
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          style={{ strokeDashoffset: progressDashOffset }}
          className="text-muted/50"
        />
        
        {/* Value arc with smooth spring animation */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#gaugeGradient-${phase})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          style={{ 
            strokeDashoffset: valueDashOffset,
            filter: phase !== "idle" ? `drop-shadow(0 0 10px ${colors.primary})` : "none",
          }}
        />
        
        {/* Removed problematic blur glow - using drop-shadow on main arc instead */}
        
        <defs>
          <linearGradient id={`gaugeGradient-${phase}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-bold text-foreground tabular-nums"
          style={{
            textShadow: phase !== "idle" && phase !== "complete" 
              ? `0 0 20px ${colors.primary}40` 
              : "none",
          }}
        >
          {displayValue}
        </motion.span>
        <span className="text-lg text-muted-foreground font-medium">{unit}</span>
        
        {/* Phase indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${colors.primary}20`,
            color: colors.primary,
          }}
        >
          {phase === "idle" && "Ready"}
          {phase === "ping" && "Ping Test"}
          {phase === "download" && "Download"}
          {phase === "upload" && "Upload"}
          {phase === "complete" && "Complete"}
        </motion.div>
      </div>
    </div>
  );
};
