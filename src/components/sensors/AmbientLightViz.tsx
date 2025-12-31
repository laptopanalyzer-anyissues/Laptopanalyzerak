import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AmbientLightVizProps {
  lightLevel: number | null;
  isActive: boolean;
}

export function AmbientLightViz({ lightLevel, isActive }: AmbientLightVizProps) {
  const normalizedLevel = lightLevel !== null ? Math.min(lightLevel / 1000, 1) * 100 : 0;
  
  const getLightDescription = (lux: number | null) => {
    if (lux === null) return "No data";
    if (lux < 50) return "Very dark";
    if (lux < 200) return "Dim";
    if (lux < 500) return "Normal indoor";
    if (lux < 1000) return "Bright indoor";
    if (lux < 10000) return "Daylight";
    return "Direct sunlight";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Sun className="h-4 w-4 text-primary" />
          Ambient Light
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
          {isActive 
            ? "Cover and uncover the sensor to see light level changes" 
            : "Ambient light sensor not available (limited browser support)"}
        </p>

        {/* Light indicator */}
        <div className="flex items-center justify-center mb-4">
          <motion.div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            animate={{
              backgroundColor: isActive 
                ? `hsl(48, 96%, ${Math.min(50 + normalizedLevel * 0.4, 90)}%)`
                : "hsl(var(--muted))",
              boxShadow: isActive && lightLevel !== null && lightLevel > 100
                ? `0 0 ${Math.min(lightLevel / 10, 60)}px hsl(48, 96%, 70%)`
                : "none"
            }}
            transition={{ duration: 0.3 }}
          >
            {isActive && lightLevel !== null && lightLevel < 50 ? (
              <Moon className="h-10 w-10 text-foreground/70" />
            ) : (
              <Sun className={`h-10 w-10 ${isActive ? "text-amber-600" : "text-muted-foreground"}`} />
            )}
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <Progress value={normalizedLevel} className="h-3" />
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{getLightDescription(lightLevel)}</span>
            <span className="font-mono font-medium">
              {isActive && lightLevel !== null ? `${lightLevel.toFixed(0)} lux` : "--"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
