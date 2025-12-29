import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning, Plug, Zap } from "lucide-react";

interface BatteryInfo {
  level: number;
  charging: boolean;
  chargingTime: number | null;
  dischargingTime: number | null;
}

const BatteryTest = () => {
  const [battery, setBattery] = useState<BatteryInfo | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const getBattery = async () => {
      try {
        const nav = navigator as any;
        if (!nav.getBattery) {
          setSupported(false);
          return;
        }

        const batteryManager = await nav.getBattery();
        
        const updateBattery = () => {
          setBattery({
            level: Math.round(batteryManager.level * 100),
            charging: batteryManager.charging,
            chargingTime: batteryManager.chargingTime,
            dischargingTime: batteryManager.dischargingTime,
          });
        };

        updateBattery();

        batteryManager.addEventListener("levelchange", updateBattery);
        batteryManager.addEventListener("chargingchange", updateBattery);
        batteryManager.addEventListener("chargingtimechange", updateBattery);
        batteryManager.addEventListener("dischargingtimechange", updateBattery);

        return () => {
          batteryManager.removeEventListener("levelchange", updateBattery);
          batteryManager.removeEventListener("chargingchange", updateBattery);
          batteryManager.removeEventListener("chargingtimechange", updateBattery);
          batteryManager.removeEventListener("dischargingtimechange", updateBattery);
        };
      } catch (err) {
        setSupported(false);
      }
    };

    getBattery();
  }, []);

  const getBatteryIcon = () => {
    if (!battery) return Battery;
    if (battery.charging) return BatteryCharging;
    if (battery.level > 80) return BatteryFull;
    if (battery.level > 50) return BatteryMedium;
    if (battery.level > 20) return BatteryLow;
    return BatteryWarning;
  };

  const getBatteryColor = () => {
    if (!battery) return "text-muted-foreground";
    if (battery.charging) return "text-success";
    if (battery.level > 50) return "text-success";
    if (battery.level > 20) return "text-warning";
    return "text-destructive";
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds || !isFinite(seconds)) return "Unknown";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutes`;
  };

  const BatteryIcon = getBatteryIcon();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tests
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Battery & Power Test
            </h1>
            <p className="text-muted-foreground">
              Check your battery status, charge level, and estimated time remaining.
            </p>
          </motion.div>

          {!supported ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <BatteryWarning className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Battery API Not Supported
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your browser doesn't support the Battery Status API. Try using Chrome, Edge, or Opera for full battery information.
              </p>
            </motion.div>
          ) : battery ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Battery Visual */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ scale: battery.charging ? [1, 1.05, 1] : 1 }}
                    transition={{ repeat: battery.charging ? Infinity : 0, duration: 2 }}
                    className={`inline-flex p-6 rounded-full mb-6 ${
                      battery.charging ? "bg-success/10" : "bg-muted"
                    }`}
                  >
                    <BatteryIcon className={`h-20 w-20 ${getBatteryColor()}`} />
                  </motion.div>
                  
                  <div className="mb-6">
                    <p className={`text-6xl font-bold ${getBatteryColor()}`}>
                      {battery.level}%
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      {battery.charging ? (
                        <>
                          <Zap className="h-5 w-5 text-success" />
                          <span className="text-success font-medium">Charging</span>
                        </>
                      ) : (
                        <>
                          <Plug className="h-5 w-5 text-muted-foreground" />
                          <span className="text-muted-foreground">On Battery</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-6 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        battery.charging
                          ? "bg-gradient-to-r from-success to-success/80"
                          : battery.level > 50
                          ? "bg-gradient-to-r from-success to-success/80"
                          : battery.level > 20
                          ? "bg-gradient-to-r from-warning to-warning/80"
                          : "bg-gradient-to-r from-destructive to-destructive/80"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${battery.level}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Battery Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Battery Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-xl bg-muted/50">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`font-semibold ${getBatteryColor()}`}>
                        {battery.charging ? "Charging" : "Discharging"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl bg-muted/50">
                      <span className="text-muted-foreground">Level</span>
                      <span className="font-semibold text-foreground">{battery.level}%</span>
                    </div>
                    {battery.charging && battery.chargingTime && (
                      <div className="flex justify-between items-center p-4 rounded-xl bg-muted/50">
                        <span className="text-muted-foreground">Time to Full</span>
                        <span className="font-semibold text-foreground">
                          {formatTime(battery.chargingTime)}
                        </span>
                      </div>
                    )}
                    {!battery.charging && battery.dischargingTime && (
                      <div className="flex justify-between items-center p-4 rounded-xl bg-muted/50">
                        <span className="text-muted-foreground">Time Remaining</span>
                        <span className="font-semibold text-foreground">
                          {formatTime(battery.dischargingTime)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tips */}
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                  <h3 className="font-semibold text-foreground mb-3">Battery Health Tips</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Keep battery between 20-80% for optimal lifespan</li>
                    <li>• Avoid extreme temperatures</li>
                    <li>• Calibrate monthly by full discharge/charge cycle</li>
                    <li>• Update your system for battery optimizations</li>
                  </ul>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="animate-pulse">
                <Battery className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Loading battery information...</p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BatteryTest;
