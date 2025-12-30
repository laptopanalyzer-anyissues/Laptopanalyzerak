import { motion } from "framer-motion";

interface SpeedGraphProps {
  data: number[];
  maxDataPoints?: number;
  color: string;
  label: string;
}

export const SpeedGraph = ({ data, maxDataPoints = 30, color, label }: SpeedGraphProps) => {
  const displayData = data.slice(-maxDataPoints);
  const maxValue = Math.max(...displayData, 1);
  const graphHeight = 80;
  const graphWidth = 100;

  // Generate path for the line
  const generatePath = () => {
    if (displayData.length < 2) return "";
    
    const stepX = graphWidth / (maxDataPoints - 1);
    const startIndex = maxDataPoints - displayData.length;
    
    const points = displayData.map((value, index) => {
      const x = (startIndex + index) * stepX;
      const y = graphHeight - (value / maxValue) * graphHeight;
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  };

  // Generate area fill path
  const generateAreaPath = () => {
    if (displayData.length < 2) return "";
    
    const stepX = graphWidth / (maxDataPoints - 1);
    const startIndex = maxDataPoints - displayData.length;
    
    const points = displayData.map((value, index) => {
      const x = (startIndex + index) * stepX;
      const y = graphHeight - (value / maxValue) * graphHeight;
      return `${x},${y}`;
    });

    const firstX = startIndex * stepX;
    const lastX = (startIndex + displayData.length - 1) * stepX;

    return `M ${firstX},${graphHeight} L ${points.join(" L ")} L ${lastX},${graphHeight} Z`;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-medium text-foreground">
          {displayData.length > 0 ? displayData[displayData.length - 1].toFixed(1) : "0"}
        </span>
      </div>
      <div className="relative h-20 bg-muted/30 rounded-lg overflow-hidden">
        <svg
          viewBox={`0 0 ${graphWidth} ${graphHeight}`}
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <line
              key={percent}
              x1="0"
              y1={graphHeight - (percent / 100) * graphHeight}
              x2={graphWidth}
              y2={graphHeight - (percent / 100) * graphHeight}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Area fill */}
          <motion.path
            d={generateAreaPath()}
            fill={`url(#areaGradient-${color})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
          />
          
          {/* Line */}
          <motion.path
            d={generatePath()}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Current point indicator */}
          {displayData.length > 0 && (
            <motion.circle
              cx={(maxDataPoints - 1) * (graphWidth / (maxDataPoints - 1))}
              cy={graphHeight - (displayData[displayData.length - 1] / maxValue) * graphHeight}
              r="3"
              fill={color}
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          )}
          
          <defs>
            <linearGradient id={`areaGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
