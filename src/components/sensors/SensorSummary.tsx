import { motion } from "framer-motion";
import { Check, X, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SensorResult } from "@/hooks/use-sensor-detection";

interface SensorSummaryProps {
  sensors: SensorResult[];
}

export function SensorSummary({ sensors }: SensorSummaryProps) {
  const available = sensors.filter(s => s.status === "available").length;
  const limited = sensors.filter(s => s.status === "limited").length;
  const notAvailable = sensors.filter(s => s.status === "not-available").length;
  const notSupported = sensors.filter(s => s.status === "not-supported").length;

  const summaryItems = [
    { 
      label: "Working", 
      count: available, 
      icon: Check, 
      bgClass: "bg-success/10", 
      textClass: "text-success" 
    },
    { 
      label: "Limited", 
      count: limited, 
      icon: AlertTriangle, 
      bgClass: "bg-warning/10", 
      textClass: "text-warning" 
    },
    { 
      label: "Not Present", 
      count: notAvailable, 
      icon: X, 
      bgClass: "bg-muted/30", 
      textClass: "text-muted-foreground" 
    },
    { 
      label: "Not Supported", 
      count: notSupported, 
      icon: X, 
      bgClass: "bg-muted/20", 
      textClass: "text-muted-foreground" 
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Sensor Detection Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {summaryItems.map((item) => (
              <div 
                key={item.label} 
                className={`text-center p-3 rounded-lg ${item.bgClass}`}
              >
                <div className={`text-2xl font-bold ${item.textClass}`}>
                  {item.count}
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <item.icon className="h-3 w-3" />
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Info banner */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Note:</strong> Motion sensors 
              (Accelerometer, Gyroscope, Orientation) are typically found in mobile devices. 
              <strong className="text-primary"> Biometric</strong>, 
              <strong className="text-primary"> Screen Orientation</strong>, and 
              <strong className="text-primary"> Touchscreen</strong> sensors are commonly 
              available on laptops.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
