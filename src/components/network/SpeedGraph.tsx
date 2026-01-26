import { motion, useSpring, useTransform } from "framer-motion";
import { forwardRef, useEffect, useMemo } from "react";

interface SpeedGraphProps {
  data: number[];
  maxDataPoints?: number;
  color: string;
  label: string;
}

export const SpeedGraph = forwardRef<HTMLDivElement, SpeedGraphProps>(({ data, maxDataPoints = 50, color, label }, ref) => {
  // Pad data with zeros at the start to always fill the graph from left
  const paddedData = useMemo(() => {
    if (data.length >= maxDataPoints) {
      return data.slice(-maxDataPoints);
    }
    // Pad with zeros at the beginning so new data appears from the right
    const padding = new Array(maxDataPoints - data.length).fill(0);
    return [...padding, ...data];
  }, [data, maxDataPoints]);

  const maxValue = Math.max(...paddedData.filter(v => v > 0), 1) * 1.1; // Add 10% headroom
  const graphHeight = 80;
  const graphWidth = 100;

  // Spring for smooth current value display
  const currentValueSpring = useSpring(0, { stiffness: 100, damping: 20 });
  
  useEffect(() => {
    if (data.length > 0) {
      currentValueSpring.set(data[data.length - 1]);
    }
  }, [data, currentValueSpring]);

  const displayCurrentValue = useTransform(currentValueSpring, v => v.toFixed(1));

  // Memoize path calculations for performance
  const { linePath, areaPath, currentPoint } = useMemo(() => {
    if (paddedData.length < 2) {
      return { linePath: "", areaPath: "", currentPoint: null };
    }
    
    const stepX = graphWidth / (maxDataPoints - 1);
    
    const points = paddedData.map((value, index) => {
      const x = index * stepX;
      const y = graphHeight - (value / maxValue) * graphHeight;
      return { x, y };
    });

    // Generate smooth bezier curve path
    let linePath = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      linePath += ` C ${cpX},${prev.y} ${cpX},${curr.y} ${curr.x},${curr.y}`;
    }

    const firstX = points[0].x;
    const lastPoint = points[points.length - 1];
    const areaPath = `${linePath} L ${lastPoint.x},${graphHeight} L ${firstX},${graphHeight} Z`;

    return { 
      linePath, 
      areaPath, 
      currentPoint: lastPoint 
    };
  }, [paddedData, maxDataPoints, maxValue, graphHeight, graphWidth]);

  return (
    <div ref={ref} className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <motion.span className="text-xs font-medium text-foreground tabular-nums">
          {displayCurrentValue}
        </motion.span>
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
          
          {/* Area fill with gradient */}
          <motion.path
            d={areaPath}
            fill={`url(#areaGradient-${color.replace(/[^a-z0-9]/gi, '')})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Smooth bezier curve line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Animated current point indicator */}
          {currentPoint && data.length > 0 && (
            <>
              {/* Outer glow */}
              <motion.circle
                cx={currentPoint.x}
                cy={currentPoint.y}
                r="6"
                fill={color}
                opacity={0.3}
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />
              {/* Inner dot */}
              <motion.circle
                cx={currentPoint.x}
                cy={currentPoint.y}
                r="3"
                fill={color}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </>
          )}
          
          <defs>
            <linearGradient 
              id={`areaGradient-${color.replace(/[^a-z0-9]/gi, '')}`} 
              x1="0" y1="0" x2="0" y2="1"
            >
              <stop offset="0%" stopColor={color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
});

SpeedGraph.displayName = "SpeedGraph";
