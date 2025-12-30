import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  RotateCcw,
  Sun,
  Smartphone,
  Hand,
  Check,
  X,
  AlertTriangle,
  HelpCircle,
  ArrowLeft,
  Shield,
  RefreshCw,
  Compass,
  Move3d,
  Fingerprint,
  ScanLine,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type SensorStatus = "not-tested" | "testing" | "available" | "not-available" | "not-supported";

interface SensorItem {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  status: SensorStatus;
  value?: string;
  data?: any;
}

const statusConfig = {
  "not-tested": { label: "Waiting", color: "bg-muted text-muted-foreground", icon: HelpCircle },
  "testing": { label: "Detecting...", color: "bg-primary/20 text-primary", icon: RefreshCw },
  "available": { label: "Available", color: "bg-success/20 text-success", icon: Check },
  "not-available": { label: "No Data", color: "bg-warning/20 text-warning", icon: AlertTriangle },
  "not-supported": { label: "Not Supported", color: "bg-muted text-muted-foreground", icon: X },
};

const SensorTest = () => {
  const [sensors, setSensors] = useState<SensorItem[]>([
    { id: "accelerometer", name: "Accelerometer", icon: Move3d, description: "Detects device movement and tilt", status: "not-tested" },
    { id: "gyroscope", name: "Gyroscope", icon: RotateCcw, description: "Measures rotation and orientation", status: "not-tested" },
    { id: "orientation", name: "Device Orientation", icon: Compass, description: "Tracks device position in 3D space", status: "not-tested" },
    { id: "ambient-light", name: "Ambient Light", icon: Sun, description: "Measures surrounding light levels", status: "not-tested" },
    { id: "proximity", name: "Proximity Sensor", icon: Hand, description: "Detects nearby objects", status: "not-tested" },
    { id: "screen-orientation", name: "Screen Orientation", icon: Smartphone, description: "Detects portrait/landscape mode", status: "not-tested" },
    { id: "touch", name: "Touchscreen", icon: Fingerprint, description: "Multi-touch capability", status: "not-tested" },
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  // Real-time sensor data
  const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
  const [gyroData, setGyroData] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [orientationData, setOrientationData] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [lightLevel, setLightLevel] = useState<number | null>(null);
  const [proximity, setProximity] = useState<boolean | null>(null);
  const [screenOrientation, setScreenOrientation] = useState("");
  const [touchPoints, setTouchPoints] = useState<{ x: number; y: number; id: number }[]>([]);
  const [maxTouchPoints, setMaxTouchPoints] = useState(0);

  const touchAreaRef = useRef<HTMLDivElement>(null);

  // Update sensor status helper
  const updateSensor = useCallback((id: string, status: SensorStatus, value?: string, data?: any) => {
    setSensors(prev => prev.map(s => s.id === id ? { ...s, status, value, data } : s));
  }, []);

  // Accelerometer detection
  const detectAccelerometer = useCallback(async () => {
    updateSensor("accelerometer", "testing");
    
    if ('Accelerometer' in window) {
      try {
        const accelerometer = new (window as any).Accelerometer({ frequency: 60 });
        accelerometer.addEventListener('reading', () => {
          setAccelData({ x: accelerometer.x, y: accelerometer.y, z: accelerometer.z });
          updateSensor("accelerometer", "available", `X: ${accelerometer.x.toFixed(2)}`);
        });
        accelerometer.addEventListener('error', () => {
          updateSensor("accelerometer", "not-available", "Permission denied");
        });
        accelerometer.start();
        return true;
      } catch (e) {
        updateSensor("accelerometer", "not-supported", "API not available");
        return false;
      }
    }
    
    // Fallback to DeviceMotion
    if ('DeviceMotionEvent' in window) {
      const handleMotion = (e: DeviceMotionEvent) => {
        if (e.accelerationIncludingGravity) {
          const { x, y, z } = e.accelerationIncludingGravity;
          setAccelData({ x: x || 0, y: y || 0, z: z || 0 });
          updateSensor("accelerometer", "available", `Active`);
        }
      };
      
      // iOS 13+ requires permission
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceMotionEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
            return true;
          }
        } catch (e) {
          updateSensor("accelerometer", "not-available", "Permission denied");
          return false;
        }
      } else {
        window.addEventListener('devicemotion', handleMotion);
        // Check if we get any data
        setTimeout(() => {
          if (accelData.x === 0 && accelData.y === 0 && accelData.z === 0) {
            updateSensor("accelerometer", "not-available", "No motion data");
          }
        }, 1000);
        return true;
      }
    }
    
    updateSensor("accelerometer", "not-supported", "Not available");
    return false;
  }, [updateSensor, accelData]);

  // Gyroscope detection
  const detectGyroscope = useCallback(async () => {
    updateSensor("gyroscope", "testing");
    
    if ('Gyroscope' in window) {
      try {
        const gyroscope = new (window as any).Gyroscope({ frequency: 60 });
        gyroscope.addEventListener('reading', () => {
          setGyroData({ alpha: gyroscope.x, beta: gyroscope.y, gamma: gyroscope.z });
          updateSensor("gyroscope", "available", "Active");
        });
        gyroscope.addEventListener('error', () => {
          updateSensor("gyroscope", "not-available", "Permission denied");
        });
        gyroscope.start();
        return true;
      } catch (e) {
        updateSensor("gyroscope", "not-supported", "API not available");
        return false;
      }
    }
    
    updateSensor("gyroscope", "not-supported", "Not available");
    return false;
  }, [updateSensor]);

  // Device Orientation detection
  const detectOrientation = useCallback(async () => {
    updateSensor("orientation", "testing");
    
    if ('DeviceOrientationEvent' in window) {
      const handleOrientation = (e: DeviceOrientationEvent) => {
        if (e.alpha !== null || e.beta !== null || e.gamma !== null) {
          setOrientationData({
            alpha: e.alpha || 0,
            beta: e.beta || 0,
            gamma: e.gamma || 0
          });
          updateSensor("orientation", "available", "Active");
        }
      };
      
      // iOS 13+ requires permission
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            return true;
          }
        } catch (e) {
          updateSensor("orientation", "not-available", "Permission denied");
          return false;
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
        setTimeout(() => {
          if (orientationData.alpha === 0 && orientationData.beta === 0 && orientationData.gamma === 0) {
            updateSensor("orientation", "not-available", "No orientation data");
          }
        }, 1000);
        return true;
      }
    }
    
    updateSensor("orientation", "not-supported", "Not available");
    return false;
  }, [updateSensor, orientationData]);

  // Ambient Light detection
  const detectAmbientLight = useCallback(async () => {
    updateSensor("ambient-light", "testing");
    
    if ('AmbientLightSensor' in window) {
      try {
        const sensor = new (window as any).AmbientLightSensor();
        sensor.addEventListener('reading', () => {
          setLightLevel(sensor.illuminance);
          updateSensor("ambient-light", "available", `${sensor.illuminance.toFixed(0)} lux`);
        });
        sensor.addEventListener('error', () => {
          updateSensor("ambient-light", "not-available", "Permission denied");
        });
        sensor.start();
        return true;
      } catch (e) {
        updateSensor("ambient-light", "not-supported", "API not available");
        return false;
      }
    }
    
    // Check if screen brightness API is available (limited support)
    updateSensor("ambient-light", "not-supported", "Not available in browser");
    return false;
  }, [updateSensor]);

  // Proximity detection
  const detectProximity = useCallback(async () => {
    updateSensor("proximity", "testing");
    
    if ('ProximitySensor' in window) {
      try {
        const sensor = new (window as any).ProximitySensor();
        sensor.addEventListener('reading', () => {
          setProximity(sensor.near);
          updateSensor("proximity", "available", sensor.near ? "Near" : "Far");
        });
        sensor.addEventListener('error', () => {
          updateSensor("proximity", "not-available", "Permission denied");
        });
        sensor.start();
        return true;
      } catch (e) {
        updateSensor("proximity", "not-supported", "API not available");
        return false;
      }
    }
    
    updateSensor("proximity", "not-supported", "Not available in browser");
    return false;
  }, [updateSensor]);

  // Screen Orientation detection
  const detectScreenOrientation = useCallback(() => {
    updateSensor("screen-orientation", "testing");
    
    if (screen.orientation) {
      const updateOrientation = () => {
        const type = screen.orientation.type;
        const angle = screen.orientation.angle;
        setScreenOrientation(type);
        updateSensor("screen-orientation", "available", `${type} (${angle}°)`);
      };
      
      updateOrientation();
      screen.orientation.addEventListener('change', updateOrientation);
      return true;
    }
    
    // Fallback
    const orientation = window.innerHeight > window.innerWidth ? "portrait" : "landscape";
    setScreenOrientation(orientation);
    updateSensor("screen-orientation", "available", orientation);
    return true;
  }, [updateSensor]);

  // Touch detection
  const detectTouch = useCallback(() => {
    updateSensor("touch", "testing");
    
    const maxTouch = navigator.maxTouchPoints || 0;
    setMaxTouchPoints(maxTouch);
    
    if (maxTouch > 0) {
      updateSensor("touch", "available", `${maxTouch} touch points`);
      return true;
    } else if ('ontouchstart' in window) {
      updateSensor("touch", "available", "Touch supported");
      return true;
    }
    
    updateSensor("touch", "not-available", "No touch support detected");
    return false;
  }, [updateSensor]);

  // Handle touch events in test area
  const handleTouchStart = (e: React.TouchEvent) => {
    const touches = Array.from(e.touches).map(t => ({
      x: t.clientX,
      y: t.clientY,
      id: t.identifier
    }));
    setTouchPoints(touches);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touches = Array.from(e.touches).map(t => ({
      x: t.clientX,
      y: t.clientY,
      id: t.identifier
    }));
    setTouchPoints(touches);
  };

  const handleTouchEnd = () => {
    setTouchPoints([]);
  };

  // Run full scan
  const runFullScan = useCallback(async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Reset all sensors
    setSensors(prev => prev.map(s => ({ ...s, status: "testing" as SensorStatus, value: undefined })));

    toast({
      title: "Scanning sensors...",
      description: "Move your device to test motion sensors",
    });

    const steps = [
      { fn: detectAccelerometer, progress: 15 },
      { fn: detectGyroscope, progress: 30 },
      { fn: detectOrientation, progress: 45 },
      { fn: detectAmbientLight, progress: 60 },
      { fn: detectProximity, progress: 75 },
      { fn: detectScreenOrientation, progress: 90 },
      { fn: detectTouch, progress: 100 },
    ];

    for (const step of steps) {
      await step.fn();
      setScanProgress(step.progress);
      await new Promise(r => setTimeout(r, 200));
    }

    setIsScanning(false);
    toast({ title: "Scan complete" });
  }, [detectAccelerometer, detectGyroscope, detectOrientation, detectAmbientLight, detectProximity, detectScreenOrientation, detectTouch]);

  // Auto-scan on mount
  useEffect(() => {
    runFullScan();
  }, []);

  // Calculate summary
  const available = sensors.filter(s => s.status === "available").length;
  const notAvailable = sensors.filter(s => s.status === "not-available").length;
  const notSupported = sensors.filter(s => s.status === "not-supported").length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Sensor Suite Test
                  </h1>
                  <p className="text-muted-foreground">
                    Real-time sensor detection and visualization
                  </p>
                </div>
              </div>
              <Button onClick={runFullScan} disabled={isScanning} size="lg">
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <ScanLine className="h-4 w-4 mr-2" />
                    Scan Sensors
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Scan Progress */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <RefreshCw className="h-5 w-5 text-primary animate-spin" />
                    <span className="font-medium text-foreground">Detecting available sensors...</span>
                  </div>
                  <Progress value={scanProgress} className="h-2" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Privacy Notice */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3">
              <Shield className="h-4 w-4 text-success" />
              <span>Sensor data is processed locally. No data leaves your device.</span>
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Sensor Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-success/10">
                    <div className="text-2xl font-bold text-success">{available}</div>
                    <div className="text-xs text-muted-foreground">Available</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-warning/10">
                    <div className="text-2xl font-bold text-warning">{notAvailable}</div>
                    <div className="text-xs text-muted-foreground">No Data</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-muted-foreground">{notSupported}</div>
                    <div className="text-xs text-muted-foreground">Not Supported</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Sensor List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Available Sensors
                  </CardTitle>
                  <CardDescription>
                    Detected sensors on your device
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sensors.map((sensor, index) => {
                    const StatusIcon = statusConfig[sensor.status].icon;
                    return (
                      <motion.div
                        key={sensor.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg transition-all",
                          sensor.status === "available" 
                            ? "bg-success/10 border border-success/20" 
                            : "bg-muted/30"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-lg",
                          sensor.status === "available" ? "bg-success/20" : "bg-muted"
                        )}>
                          <sensor.icon className={cn(
                            "h-5 w-5",
                            sensor.status === "available" ? "text-success" : "text-foreground"
                          )} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground text-sm">{sensor.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {sensor.value || sensor.description}
                          </div>
                        </div>

                        <div className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                          statusConfig[sensor.status].color
                        )}>
                          <StatusIcon className={cn(
                            "h-3.5 w-3.5",
                            sensor.status === "testing" && "animate-spin"
                          )} />
                          {statusConfig[sensor.status].label}
                        </div>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Live Visualizations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Accelerometer Visualization */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Move3d className="h-4 w-4 text-primary" />
                    Accelerometer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground mb-3">Move your device to see changes</div>
                  <div className="grid grid-cols-3 gap-4">
                    {['X', 'Y', 'Z'].map((axis, i) => {
                      const value = [accelData.x, accelData.y, accelData.z][i];
                      const normalized = Math.min(Math.abs(value) / 10, 1) * 100;
                      return (
                        <div key={axis} className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">{axis}-Axis</div>
                          <div className="h-20 bg-muted/30 rounded-lg relative overflow-hidden">
                            <motion.div
                              className="absolute bottom-0 left-0 right-0 bg-primary/50 rounded-lg"
                              animate={{ height: `${normalized}%` }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-sm font-mono">
                              {value.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Orientation Visualization */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Compass className="h-4 w-4 text-primary" />
                    Device Orientation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground mb-3">Rotate your device to see changes</div>
                  <div className="flex items-center justify-center">
                    <motion.div
                      className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary to-accent border-2 border-primary/30 flex items-center justify-center"
                      animate={{
                        rotateX: orientationData.beta,
                        rotateY: orientationData.gamma,
                        rotateZ: orientationData.alpha * 0.1,
                      }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Smartphone className="h-8 w-8 text-primary-foreground" />
                    </motion.div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                    <div>
                      <div className="text-muted-foreground">Alpha</div>
                      <div className="font-mono">{orientationData.alpha.toFixed(0)}°</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Beta</div>
                      <div className="font-mono">{orientationData.beta.toFixed(0)}°</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Gamma</div>
                      <div className="font-mono">{orientationData.gamma.toFixed(0)}°</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Touch Test Area */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-primary" />
                    Touch Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground mb-3">
                    Touch the area below with multiple fingers ({maxTouchPoints} max supported)
                  </div>
                  <div
                    ref={touchAreaRef}
                    className="h-40 bg-muted/30 rounded-lg relative overflow-hidden border-2 border-dashed border-muted-foreground/30"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                  >
                    {touchPoints.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                        Touch here to test
                      </div>
                    )}
                    {touchPoints.map((point, i) => {
                      const rect = touchAreaRef.current?.getBoundingClientRect();
                      if (!rect) return null;
                      return (
                        <motion.div
                          key={point.id}
                          className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full bg-primary/50 border-2 border-primary flex items-center justify-center text-xs font-bold text-primary-foreground"
                          initial={{ scale: 0 }}
                          animate={{ 
                            scale: 1,
                            left: point.x - rect.left,
                            top: point.y - rect.top,
                          }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          {i + 1}
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="mt-2 text-center text-sm">
                    <span className="text-muted-foreground">Active touches: </span>
                    <span className="font-bold text-foreground">{touchPoints.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Ambient Light */}
              {lightLevel !== null && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sun className="h-4 w-4 text-primary" />
                      Ambient Light
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Progress value={Math.min(lightLevel / 1000, 1) * 100} className="h-3" />
                      </div>
                      <div className="text-sm font-mono w-20 text-right">{lightLevel.toFixed(0)} lux</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Testing Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="font-medium text-foreground mb-1">Motion Sensors</div>
                    <p className="text-muted-foreground">Move or rotate your device to activate accelerometer and gyroscope readings.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="font-medium text-foreground mb-1">Touch Screen</div>
                    <p className="text-muted-foreground">Use multiple fingers in the touch test area to verify multi-touch support.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="font-medium text-foreground mb-1">Browser Support</div>
                    <p className="text-muted-foreground">Some sensors require HTTPS and may need permission. Use Chrome for best results.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SensorTest;
