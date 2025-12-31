import { useState, useMemo } from "react";
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
  ArrowLeft,
  Shield,
  RefreshCw,
  Compass,
  Move3d,
  Fingerprint,
  ScanLine,
  Monitor,
  Eye,
  Download,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useSensorDetection, type SensorResult } from "@/hooks/use-sensor-detection";
import { SensorCard } from "@/components/sensors/SensorCard";
import { SensorSummary } from "@/components/sensors/SensorSummary";
import { AccelerometerViz } from "@/components/sensors/AccelerometerViz";
import { GyroscopeViz } from "@/components/sensors/GyroscopeViz";
import { OrientationViz } from "@/components/sensors/OrientationViz";
import { TouchTestArea } from "@/components/sensors/TouchTestArea";
import { AmbientLightViz } from "@/components/sensors/AmbientLightViz";

// Sensor metadata for display
const sensorMeta = {
  accelerometer: { icon: Move3d, description: "Detects device movement and tilt in 3D space" },
  gyroscope: { icon: RotateCcw, description: "Measures rotation rate around X, Y, Z axes" },
  orientation: { icon: Compass, description: "Tracks device orientation in 3D space" },
  "ambient-light": { icon: Sun, description: "Measures surrounding light intensity (lux)" },
  proximity: { icon: Hand, description: "Detects nearby objects (near/far)" },
  "screen-orientation": { icon: Monitor, description: "Detects portrait/landscape orientation" },
  touch: { icon: Fingerprint, description: "Multi-touch capability detection" },
  biometric: { icon: Fingerprint, description: "Fingerprint, Face ID, or Windows Hello" },
  lid: { icon: Eye, description: "Detects screen visibility state" },
};

const SensorTest = () => {
  const {
    sensors,
    sensorsMap,
    isScanning,
    scanProgress,
    permissionGranted,
    accelerometerData,
    gyroscopeData,
    orientationData,
    lightLevel,
    touchPoints,
    maxTouchPoints,
    runFullScan,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useSensorDetection();

  const [showPermissionPrompt, setShowPermissionPrompt] = useState(true);

  const handleStartScan = async () => {
    setShowPermissionPrompt(false);
    toast({
      title: "Starting sensor scan...",
      description: "Move your device to help detect motion sensors",
    });
    await runFullScan();
    toast({ title: "Scan complete", description: "All sensors have been tested" });
  };

  // Check which visualizations should be active
  const accelActive = sensorsMap.accelerometer.status === "available";
  const gyroActive = sensorsMap.gyroscope.status === "available";
  const orientActive = sensorsMap.orientation.status === "available";
  const lightActive = sensorsMap.ambientLight.status === "available";
  const touchActive = sensorsMap.touch.status === "available" || sensorsMap.touch.status === "limited";

  // Generate export report
  const generateReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      device: navigator.userAgent,
      sensors: sensors.map(s => ({
        name: s.name,
        status: s.status,
        value: s.value,
        details: s.details,
      })),
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sensor-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: "Report exported", description: "Sensor diagnostic report saved" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
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
                    Comprehensive hardware sensor detection and visualization
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {permissionGranted && (
                  <Button variant="outline" onClick={generateReport} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                )}
                <Button onClick={handleStartScan} disabled={isScanning} size="lg">
                  {isScanning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <ScanLine className="h-4 w-4 mr-2" />
                      {permissionGranted ? "Rescan" : "Start Scan"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Permission Prompt */}
          <AnimatePresence>
            {showPermissionPrompt && !permissionGranted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                className="mb-6"
              >
                <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="p-4 rounded-full bg-primary/20">
                        <Shield className="h-10 w-10 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          Grant Sensor Permissions
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-lg">
                          This test will detect and verify your device's hardware sensors including 
                          accelerometer, gyroscope, ambient light, touchscreen, and biometric sensors.
                          Grant access when prompted by your browser.
                        </p>
                      </div>
                      <Button size="lg" onClick={handleStartScan} className="mt-2">
                        <Shield className="h-4 w-4 mr-2" />
                        Grant Permission & Start Test
                      </Button>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Shield className="h-3 w-3 text-success" />
                        All sensor data is processed locally. Nothing is stored or transmitted.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scan Progress */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="bg-primary/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <RefreshCw className="h-5 w-5 text-primary animate-spin" />
                    <span className="font-medium text-foreground">
                      Detecting sensors... {scanProgress}%
                    </span>
                  </div>
                  <Progress value={scanProgress} className="h-2" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content - After Permission */}
          {permissionGranted && (
            <>
              {/* Privacy Notice */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-success/10 rounded-lg px-4 py-3 border border-success/20">
                  <Shield className="h-4 w-4 text-success shrink-0" />
                  <span>
                    <strong className="text-foreground">Privacy First:</strong> All sensor data is 
                    processed locally in your browser. No data is stored or sent to any server.
                  </span>
                </div>
              </motion.div>

              {/* Summary */}
              <div className="mb-8">
                <SensorSummary sensors={sensors} />
              </div>

              {/* Main Grid */}
              <div className="grid lg:grid-cols-5 gap-6">
                {/* Sensor List - 2 columns */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="lg:col-span-2"
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Detected Sensors
                      </CardTitle>
                      <CardDescription>
                        Hardware sensors detected on your device
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {sensors.map((sensor, index) => {
                        const meta = sensorMeta[sensor.id as keyof typeof sensorMeta];
                        return (
                          <SensorCard
                            key={sensor.id}
                            id={sensor.id}
                            name={sensor.name}
                            icon={meta?.icon || Activity}
                            status={sensor.status}
                            value={sensor.value}
                            details={sensor.details}
                            description={meta?.description || sensor.name}
                            index={index}
                          />
                        );
                      })}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Visualizations - 3 columns */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:col-span-3 space-y-6"
                >
                  {/* Top row - Motion sensors */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <AccelerometerViz data={accelerometerData} isActive={accelActive} />
                    <GyroscopeViz data={gyroscopeData} isActive={gyroActive} />
                  </div>

                  {/* Middle row - Orientation and Light */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <OrientationViz data={orientationData} isActive={orientActive} />
                    <AmbientLightViz lightLevel={lightLevel} isActive={lightActive} />
                  </div>

                  {/* Touch Test */}
                  <TouchTestArea
                    touchPoints={touchPoints}
                    maxTouchPoints={maxTouchPoints}
                    isAvailable={touchActive}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  />
                </motion.div>
              </div>

              {/* Tips Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Testing Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <div className="font-medium text-foreground mb-1">Motion Sensors</div>
                        <p className="text-muted-foreground text-xs">
                          Move or shake your device to verify accelerometer and gyroscope readings.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <div className="font-medium text-foreground mb-1">Ambient Light</div>
                        <p className="text-muted-foreground text-xs">
                          Cover the sensor or change lighting to verify light level detection.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <div className="font-medium text-foreground mb-1">Touch Screen</div>
                        <p className="text-muted-foreground text-xs">
                          Use multiple fingers in the test area to verify multi-touch support.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <div className="font-medium text-foreground mb-1">Browser Support</div>
                        <p className="text-muted-foreground text-xs">
                          Use Chrome/Edge for best results. Some sensors require HTTPS.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SensorTest;
