import { motion } from "framer-motion";
import { Compass, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrientationData } from "@/hooks/use-sensor-detection";

interface OrientationVizProps {
  data: OrientationData;
  isActive: boolean;
}

export function OrientationViz({ data, isActive }: OrientationVizProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Compass className="h-4 w-4 text-primary" />
          Orientation
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
          {isActive ? "Tilt or rotate your device to see orientation changes" : "Sensor not available on this device"}
        </p>

        {/* 3D Device visualization */}
        <div className="flex items-center justify-center mb-4" style={{ perspective: "300px" }}>
          <motion.div
            className="w-20 h-28 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
            animate={{
              rotateX: isActive ? data.beta * 0.5 : 0,
              rotateY: isActive ? data.gamma * 0.5 : 0,
              rotateZ: isActive ? data.alpha * 0.1 : 0,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <Smartphone className="h-8 w-8 text-primary-foreground" />
          </motion.div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-muted/30">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Alpha</div>
            <div className="text-sm font-mono font-medium">
              {isActive ? `${data.alpha.toFixed(0)}°` : "--"}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-muted/30">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Beta</div>
            <div className="text-sm font-mono font-medium">
              {isActive ? `${data.beta.toFixed(0)}°` : "--"}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-muted/30">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Gamma</div>
            <div className="text-sm font-mono font-medium">
              {isActive ? `${data.gamma.toFixed(0)}°` : "--"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
