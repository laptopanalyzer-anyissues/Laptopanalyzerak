import { motion } from "framer-motion";

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
  
  // Use 270 degrees (3/4 of circle) for the gauge
  const arcLength = circumference * 0.75;
  const valuePercent = Math.min(value / maxValue, 1);
  const valueDashOffset = arcLength - (arcLength * valuePercent);
  const progressDashOffset = arcLength - (arcLength * (progress / 100));

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
          strokeDashoffset={progressDashOffset}
          className="text-muted/50"
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: progressDashOffset }}
          transition={{ duration: 0.3, ease: "linear" }}
        />
        
        {/* Value arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#gaugeGradient-${phase})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={valueDashOffset}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: valueDashOffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            filter: phase !== "idle" ? `drop-shadow(0 0 8px ${colors.primary})` : "none",
          }}
        />
        
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
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-bold text-foreground tabular-nums"
          style={{
            textShadow: phase !== "idle" && phase !== "complete" 
              ? `0 0 20px ${colors.primary}40` 
              : "none",
          }}
        >
          {value.toFixed(phase === "ping" ? 0 : 1)}
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
