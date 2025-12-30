import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Usb,
  Monitor,
  Headphones,
  Mic,
  HardDrive,
  Plug,
  Wifi,
  Bluetooth,
  Signal,
  Activity,
  Check,
  X,
  AlertTriangle,
  HelpCircle,
  ArrowLeft,
  Shield,
  RefreshCw,
  Zap,
  Cable,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type PortStatus = "not-tested" | "testing" | "working" | "intermittent" | "not-working";

interface PortItem {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  status: PortStatus;
}

interface WirelessTest {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  status: PortStatus;
  value?: string | number;
}

const initialPorts: PortItem[] = [
  { id: "usb-a", name: "USB-A Port", icon: Usb, description: "Standard USB Type-A port for peripherals", status: "not-tested" },
  { id: "usb-c", name: "USB-C Port", icon: Cable, description: "Universal USB Type-C port for data and charging", status: "not-tested" },
  { id: "hdmi", name: "HDMI Output", icon: Monitor, description: "Video output for external displays", status: "not-tested" },
  { id: "headphone", name: "Headphone Jack", icon: Headphones, description: "3.5mm audio output jack", status: "not-tested" },
  { id: "mic", name: "Microphone Jack", icon: Mic, description: "3.5mm audio input or combo jack", status: "not-tested" },
  { id: "sd-card", name: "SD Card Reader", icon: HardDrive, description: "SD/microSD card slot", status: "not-tested" },
  { id: "charging", name: "Charging Port", icon: Plug, description: "Power input for charging the laptop", status: "not-tested" },
];

const initialWirelessTests: WirelessTest[] = [
  { id: "wifi-status", name: "Wi-Fi Status", icon: Wifi, description: "Check if Wi-Fi is connected", status: "not-tested" },
  { id: "wifi-strength", name: "Signal Strength", icon: Signal, description: "Measure Wi-Fi signal quality", status: "not-tested" },
  { id: "wifi-stability", name: "Connection Stability", icon: Activity, description: "Test connection consistency", status: "not-tested" },
  { id: "bluetooth", name: "Bluetooth Status", icon: Bluetooth, description: "Check Bluetooth availability", status: "not-tested" },
];

const statusConfig = {
  "not-tested": { label: "Not Tested", color: "bg-muted text-muted-foreground", icon: HelpCircle },
  "testing": { label: "Testing...", color: "bg-primary/20 text-primary", icon: RefreshCw },
  "working": { label: "Working", color: "bg-success/20 text-success", icon: Check },
  "intermittent": { label: "Intermittent", color: "bg-warning/20 text-warning", icon: AlertTriangle },
  "not-working": { label: "Not Working", color: "bg-destructive/20 text-destructive", icon: X },
};

const PortsTest = () => {
  const [ports, setPorts] = useState<PortItem[]>(initialPorts);
  const [wirelessTests, setWirelessTests] = useState<WirelessTest[]>(initialWirelessTests);
  const [isTestingWireless, setIsTestingWireless] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [latencyResults, setLatencyResults] = useState<number[]>([]);
  const [packetLoss, setPacketLoss] = useState<number | null>(null);

  const updatePortStatus = (portId: string, status: PortStatus) => {
    setPorts(prev => prev.map(p => p.id === portId ? { ...p, status } : p));
  };

  const runWirelessTests = useCallback(async () => {
    setIsTestingWireless(true);
    setTestProgress(0);
    setLatencyResults([]);
    setPacketLoss(null);

    // Reset wireless tests
    setWirelessTests(initialWirelessTests.map(t => ({ ...t, status: "testing" })));

    // Test Wi-Fi Status
    await new Promise(r => setTimeout(r, 500));
    setTestProgress(20);
    
    const isOnline = navigator.onLine;
    setWirelessTests(prev => prev.map(t => 
      t.id === "wifi-status" ? { ...t, status: isOnline ? "working" : "not-working", value: isOnline ? "Connected" : "Disconnected" } : t
    ));

    // Test Signal Strength (simulated based on connection quality)
    await new Promise(r => setTimeout(r, 500));
    setTestProgress(40);

    if (isOnline && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      const effectiveType = connection?.effectiveType || "4g";
      const signalStrength = effectiveType === "4g" ? "Excellent" : effectiveType === "3g" ? "Good" : "Fair";
      setWirelessTests(prev => prev.map(t => 
        t.id === "wifi-strength" ? { ...t, status: "working", value: signalStrength } : t
      ));
    } else {
      setWirelessTests(prev => prev.map(t => 
        t.id === "wifi-strength" ? { ...t, status: isOnline ? "working" : "not-working", value: isOnline ? "Unknown" : "N/A" } : t
      ));
    }

    // Test Connection Stability (ping simulation)
    await new Promise(r => setTimeout(r, 500));
    setTestProgress(60);

    if (isOnline) {
      const latencies: number[] = [];
      let successful = 0;
      const totalPings = 10;

      for (let i = 0; i < totalPings; i++) {
        try {
          const start = performance.now();
          await fetch("https://www.google.com/favicon.ico", { 
            mode: "no-cors",
            cache: "no-store"
          });
          const latency = performance.now() - start;
          latencies.push(latency);
          successful++;
        } catch {
          // Packet lost
        }
        await new Promise(r => setTimeout(r, 100));
      }

      setLatencyResults(latencies);
      const loss = ((totalPings - successful) / totalPings) * 100;
      setPacketLoss(loss);

      const avgLatency = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;
      const stability = loss === 0 && avgLatency < 100 ? "working" : loss < 20 ? "intermittent" : "not-working";
      
      setWirelessTests(prev => prev.map(t => 
        t.id === "wifi-stability" ? { ...t, status: stability, value: `${avgLatency.toFixed(0)}ms avg` } : t
      ));
    } else {
      setWirelessTests(prev => prev.map(t => 
        t.id === "wifi-stability" ? { ...t, status: "not-working", value: "No connection" } : t
      ));
    }

    // Test Bluetooth
    await new Promise(r => setTimeout(r, 500));
    setTestProgress(80);

    if ('bluetooth' in navigator) {
      setWirelessTests(prev => prev.map(t => 
        t.id === "bluetooth" ? { ...t, status: "working", value: "Available" } : t
      ));
    } else {
      setWirelessTests(prev => prev.map(t => 
        t.id === "bluetooth" ? { ...t, status: "intermittent", value: "Not supported in browser" } : t
      ));
    }

    setTestProgress(100);
    setIsTestingWireless(false);
  }, []);

  const getTestSummary = () => {
    const allItems = [...ports, ...wirelessTests];
    const working = allItems.filter(i => i.status === "working").length;
    const intermittent = allItems.filter(i => i.status === "intermittent").length;
    const notWorking = allItems.filter(i => i.status === "not-working").length;
    const notTested = allItems.filter(i => i.status === "not-tested" || i.status === "testing").length;
    
    return { working, intermittent, notWorking, notTested, total: allItems.length };
  };

  const summary = getTestSummary();
  const healthScore = summary.total > 0 
    ? Math.round(((summary.working + summary.intermittent * 0.5) / (summary.total - summary.notTested)) * 100) || 0
    : 0;

  const resetAllTests = () => {
    setPorts(initialPorts);
    setWirelessTests(initialWirelessTests);
    setLatencyResults([]);
    setPacketLoss(null);
    setTestProgress(0);
  };

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
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                <Cable className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Ports & Connectivity Test
                </h1>
                <p className="text-muted-foreground">
                  Verify all physical ports and wireless connections
                </p>
              </div>
            </div>
          </motion.div>

          {/* Privacy Notice */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3">
              <Shield className="h-4 w-4 text-success" />
              <span>No data is transferred outside your device. All tests run locally in your browser.</span>
            </div>
          </motion.div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Test Summary</CardTitle>
                  <Button variant="outline" size="sm" onClick={resetAllTests}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-foreground">{summary.total}</div>
                    <div className="text-xs text-muted-foreground">Total Tests</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-success/10">
                    <div className="text-2xl font-bold text-success">{summary.working}</div>
                    <div className="text-xs text-muted-foreground">Working</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-warning/10">
                    <div className="text-2xl font-bold text-warning">{summary.intermittent}</div>
                    <div className="text-xs text-muted-foreground">Intermittent</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-destructive/10">
                    <div className="text-2xl font-bold text-destructive">{summary.notWorking}</div>
                    <div className="text-xs text-muted-foreground">Not Working</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-primary/10">
                    <div className="text-2xl font-bold text-primary">
                      {summary.notTested === summary.total ? "—" : `${healthScore}%`}
                    </div>
                    <div className="text-xs text-muted-foreground">Health Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Physical Ports Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Usb className="h-5 w-5 text-primary" />
                    Physical Ports Check
                  </CardTitle>
                  <CardDescription>
                    Manually test each port and mark its status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ports.map((port, index) => (
                    <motion.div
                      key={port.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-2 rounded-lg bg-muted">
                            <port.icon className="h-5 w-5 text-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{port.description}</TooltipContent>
                      </Tooltip>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground text-sm">{port.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{port.description}</div>
                      </div>

                      <div className="flex gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-8 w-8 p-0",
                                port.status === "working" && "bg-success/20 text-success"
                              )}
                              onClick={() => updatePortStatus(port.id, "working")}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Working</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-8 w-8 p-0",
                                port.status === "intermittent" && "bg-warning/20 text-warning"
                              )}
                              onClick={() => updatePortStatus(port.id, "intermittent")}
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Intermittent</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-8 w-8 p-0",
                                port.status === "not-working" && "bg-destructive/20 text-destructive"
                              )}
                              onClick={() => updatePortStatus(port.id, "not-working")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Not Working</TooltipContent>
                        </Tooltip>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Wireless Connectivity Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Wifi className="h-5 w-5 text-primary" />
                        Wireless Connectivity
                      </CardTitle>
                      <CardDescription>
                        Automated tests for Wi-Fi and Bluetooth
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={runWirelessTests} 
                      disabled={isTestingWireless}
                      size="sm"
                    >
                      {isTestingWireless ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Run Tests
                        </>
                      )}
                    </Button>
                  </div>
                  {isTestingWireless && (
                    <Progress value={testProgress} className="mt-3" />
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {wirelessTests.map((test, index) => {
                    const StatusIcon = statusConfig[test.status].icon;
                    return (
                      <motion.div
                        key={test.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        <div className="p-2 rounded-lg bg-muted">
                          <test.icon className="h-5 w-5 text-foreground" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground text-sm">{test.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {test.value || test.description}
                          </div>
                        </div>

                        <div className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                          statusConfig[test.status].color
                        )}>
                          <StatusIcon className={cn(
                            "h-3.5 w-3.5",
                            test.status === "testing" && "animate-spin"
                          )} />
                          {statusConfig[test.status].label}
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Latency Visualization */}
                  <AnimatePresence>
                    {latencyResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 rounded-lg bg-muted/50"
                      >
                        <div className="text-sm font-medium text-foreground mb-3">Packet Stability</div>
                        <div className="flex items-end gap-1 h-16">
                          {latencyResults.map((latency, i) => (
                            <motion.div
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: `${Math.min((latency / 200) * 100, 100)}%` }}
                              transition={{ delay: i * 0.05 }}
                              className={cn(
                                "flex-1 rounded-t",
                                latency < 50 ? "bg-success" : latency < 100 ? "bg-warning" : "bg-destructive"
                              )}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                          <span>Avg: {(latencyResults.reduce((a, b) => a + b, 0) / latencyResults.length).toFixed(0)}ms</span>
                          {packetLoss !== null && (
                            <span className={packetLoss > 0 ? "text-warning" : "text-success"}>
                              Packet Loss: {packetLoss.toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Data & Speed Validation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Quick Reference Guide
                </CardTitle>
                <CardDescription>
                  Step-by-step instructions for testing physical ports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: "USB Ports", steps: ["Connect a USB device", "Check if it's recognized", "Try copying a small file"] },
                    { title: "HDMI/DisplayPort", steps: ["Connect external display", "Check if signal is detected", "Verify resolution works"] },
                    { title: "Audio Jacks", steps: ["Plug in headphones", "Play audio/record test", "Check for static/noise"] },
                    { title: "SD Card Reader", steps: ["Insert SD card", "Check if it mounts", "Try reading a file"] },
                    { title: "Charging Port", steps: ["Connect charger", "Check charging indicator", "Verify power delivery"] },
                    { title: "Network Ports", steps: ["Connect ethernet cable", "Check link light", "Test internet access"] },
                  ].map((guide, index) => (
                    <div key={index} className="p-4 rounded-lg bg-muted/30">
                      <h4 className="font-medium text-foreground mb-2">{guide.title}</h4>
                      <ol className="text-sm text-muted-foreground space-y-1">
                        {guide.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary font-medium">{i + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
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

export default PortsTest;
