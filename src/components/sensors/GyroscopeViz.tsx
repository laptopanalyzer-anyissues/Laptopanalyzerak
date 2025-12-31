import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GyroscopeData } from "@/hooks/use-sensor-detection";

interface GyroscopeVizProps {
  data: GyroscopeData;
  isActive: boolean;
}

export function GyroscopeViz({ data, isActive }: GyroscopeVizProps) {
  const axes = [
    { label: "X (Roll)", value: data.x },
    { label: "Y (Pitch)", value: data.y },
    { label: "Z (Yaw)", value: data.z },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-primary" />
          Gyroscope
          {isActive && (
            <span className="ml-auto text-xs font-normal text-success flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Live
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
          {isActive ? "Rotate your device to see angular velocity" : "Sensor not available on this device"}
        </p>

        {/* Rotation wheels */}
        <div className="flex justify-center gap-6 mb-4">
          {axes.map((axis, i) => (
            <div key={axis.label} className="text-center">
              <motion.div
                className="w-16 h-16 rounded-full border-4 border-primary/30 flex items-center justify-center mb-2"
                animate={{ rotate: isActive ? axis.value * 10 : 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                <div className="w-1 h-6 bg-primary rounded-full origin-bottom" 
                  style={{ transform: "translateY(-3px)" }} 
                />
              </motion.div>
              <div className="text-[10px] text-muted-foreground">{axis.label}</div>
              <div className="text-sm font-mono font-medium">
                {isActive ? axis.value.toFixed(2) : "--"}
              </div>
              <div className="text-[10px] text-muted-foreground">rad/s</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
