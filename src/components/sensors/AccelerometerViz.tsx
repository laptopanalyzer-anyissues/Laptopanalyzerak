import { motion } from "framer-motion";
import { Move3d } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AccelerometerData } from "@/hooks/use-sensor-detection";

interface AccelerometerVizProps {
  data: AccelerometerData;
  isActive: boolean;
}

export function AccelerometerViz({ data, isActive }: AccelerometerVizProps) {
  const axes = [
    { label: "X", value: data.x, color: "from-red-500 to-rose-500" },
    { label: "Y", value: data.y, color: "from-green-500 to-emerald-500" },
    { label: "Z", value: data.z, color: "from-blue-500 to-cyan-500" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Move3d className="h-4 w-4 text-primary" />
          Accelerometer
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
          {isActive ? "Move your device to see axis values change" : "Sensor not available on this device"}
        </p>
        
        <div className="grid grid-cols-3 gap-3">
          {axes.map((axis) => {
            const normalized = Math.min(Math.abs(axis.value) / 15, 1) * 100;
            return (
              <div key={axis.label} className="text-center">
                <div className="text-xs text-muted-foreground mb-1.5 font-medium">
                  {axis.label}-Axis
                </div>
                <div className="h-24 bg-muted/30 rounded-lg relative overflow-hidden">
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${axis.color} rounded-lg`}
                    animate={{ height: `${normalized}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-mono font-bold">
                      {isActive ? axis.value.toFixed(1) : "--"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">m/s²</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3D Ball visualization */}
        <div className="mt-4 flex justify-center">
          <div className="relative w-32 h-32 bg-muted/20 rounded-xl border border-border/50 overflow-hidden">
            <motion.div
              className="absolute w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full shadow-lg"
              animate={{
                x: 52 + (data.x * 3),
                y: 52 + (data.y * 3),
              }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2 h-2 rounded-full border-2 border-muted-foreground/30" />
            </div>
          </div>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-2">
          Ball position reflects X/Y acceleration
        </p>
      </CardContent>
    </Card>
  );
}
