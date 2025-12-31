import { useRef } from "react";
import { motion } from "framer-motion";
import { Fingerprint } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TouchPoint } from "@/hooks/use-sensor-detection";

interface TouchTestAreaProps {
  touchPoints: TouchPoint[];
  maxTouchPoints: number;
  isAvailable: boolean;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export function TouchTestArea({
  touchPoints,
  maxTouchPoints,
  isAvailable,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: TouchTestAreaProps) {
  const areaRef = useRef<HTMLDivElement>(null);

  const colors = [
    "bg-primary",
    "bg-accent",
    "bg-success",
    "bg-warning",
    "bg-destructive",
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Fingerprint className="h-4 w-4 text-primary" />
          Touchscreen Test
          {isAvailable && (
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              Max {maxTouchPoints} points
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">
          {isAvailable 
            ? "Touch the area below with multiple fingers to test multi-touch" 
            : "No touchscreen detected on this device"}
        </p>

        <div
          ref={areaRef}
          className="h-48 bg-muted/20 rounded-xl relative overflow-hidden border-2 border-dashed border-muted-foreground/30 touch-none select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        >
          {touchPoints.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <Fingerprint className="h-12 w-12 mb-2 opacity-30" />
              <span className="text-sm">Touch here to test</span>
            </div>
          )}

          {touchPoints.map((point, i) => {
            const rect = areaRef.current?.getBoundingClientRect();
            if (!rect) return null;

            return (
              <motion.div
                key={point.id}
                className={`absolute w-14 h-14 -ml-7 -mt-7 rounded-full ${colors[i % colors.length]} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 0.8,
                  left: point.x - rect.left,
                  top: point.y - rect.top,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {i + 1}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Active touches:</span>
          <span className="font-bold text-foreground text-lg">{touchPoints.length}</span>
        </div>
      </CardContent>
    </Card>
  );
}
