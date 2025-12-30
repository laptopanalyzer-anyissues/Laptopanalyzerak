import { useState, useEffect, useCallback, useRef } from "react";
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
  ScanLine,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type PortStatus = "not-tested" | "testing" | "connected" | "not-connected" | "not-supported";

interface PortItem {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  status: PortStatus;
  deviceName?: string;
  autoDetect: boolean;
}

interface WirelessTest {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  status: PortStatus;
  value?: string | number;
}

const statusConfig = {
  "not-tested": { label: "Waiting...", color: "bg-muted text-muted-foreground", icon: HelpCircle },
  "testing": { label: "Scanning...", color: "bg-primary/20 text-primary", icon: RefreshCw },
  "connected": { label: "Connected", color: "bg-success/20 text-success", icon: Check },
  "not-connected": { label: "Not Connected", color: "bg-muted text-muted-foreground", icon: X },
  "not-supported": { label: "Not Supported", color: "bg-warning/20 text-warning", icon: AlertTriangle },
};

const PortsTest = () => {
  const [ports, setPorts] = useState<PortItem[]>([
    { id: "usb", name: "USB Devices", icon: Usb, description: "USB-A and USB-C connected devices", status: "not-tested", autoDetect: true },
    { id: "display", name: "External Display", icon: Monitor, description: "HDMI/DisplayPort output", status: "not-tested", autoDetect: true },
    { id: "audio-output", name: "Audio Output", icon: Headphones, description: "Headphones or speakers connected", status: "not-tested", autoDetect: true },
    { id: "audio-input", name: "Microphone", icon: Mic, description: "External microphone connected", status: "not-tested", autoDetect: true },
    { id: "charging", name: "Power/Charging", icon: Plug, description: "Charging cable connected", status: "not-tested", autoDetect: true },
  ]);

  const [wirelessTests, setWirelessTests] = useState<WirelessTest[]>([
    { id: "wifi-status", name: "Wi-Fi Status", icon: Wifi, description: "Network connection", status: "not-tested" },
    { id: "wifi-strength", name: "Signal Strength", icon: Signal, description: "Connection quality", status: "not-tested" },
    { id: "bluetooth", name: "Bluetooth", icon: Bluetooth, description: "Bluetooth availability", status: "not-tested" },
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedDevices, setDetectedDevices] = useState<string[]>([]);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update port status helper
  const updatePort = useCallback((id: string, status: PortStatus, deviceName?: string) => {
    setPorts(prev => prev.map(p => p.id === id ? { ...p, status, deviceName } : p));
  }, []);

  // Update wireless status helper
  const updateWireless = useCallback((id: string, status: PortStatus, value?: string) => {
    setWirelessTests(prev => prev.map(t => t.id === id ? { ...t, status, value } : t));
  }, []);

  // Detect USB devices
  const detectUSBDevices = useCallback(async () => {
    updatePort("usb", "testing");
    
    if ('usb' in navigator) {
      try {
        const devices = await (navigator as any).usb.getDevices();
        if (devices.length > 0) {
          const names = devices.map((d: any) => d.productName || "USB Device").join(", ");
          updatePort("usb", "connected", `${devices.length} device(s): ${names}`);
          setDetectedDevices(prev => [...prev, ...devices.map((d: any) => d.productName || "USB Device")]);
          return true;
        }
      } catch (e) {
        // WebUSB not available or permission denied
      }
    }
    
    // Fallback: check for HID devices (keyboards, mice)
    if ('hid' in navigator) {
      try {
        const devices = await (navigator as any).hid.getDevices();
        if (devices.length > 0) {
          updatePort("usb", "connected", `${devices.length} HID device(s) detected`);
          return true;
        }
      } catch (e) {
        // HID not available
      }
    }
    
    updatePort("usb", "not-connected", "No USB devices detected");
    return false;
  }, [updatePort]);

  // Detect external displays
  const detectDisplays = useCallback(async () => {
    updatePort("display", "testing");
    
    if ('getScreenDetails' in window) {
      try {
        const screenDetails = await (window as any).getScreenDetails();
        const screens = screenDetails.screens;
        if (screens.length > 1) {
          updatePort("display", "connected", `${screens.length} displays connected`);
          setDetectedDevices(prev => [...prev, `${screens.length} External Display(s)`]);
          return true;
        }
      } catch (e) {
        // Permission denied or not supported
      }
    }
    
    // Fallback: check screen count
    if (window.screen && 'isExtended' in window.screen) {
      if ((window.screen as any).isExtended) {
        updatePort("display", "connected", "Extended display detected");
        setDetectedDevices(prev => [...prev, "External Display"]);
        return true;
      }
    }
    
    updatePort("display", "not-connected", "No external display detected");
    return false;
  }, [updatePort]);

  // Detect audio devices
  const detectAudioDevices = useCallback(async () => {
    updatePort("audio-output", "testing");
    updatePort("audio-input", "testing");
    
    if (!navigator.mediaDevices?.enumerateDevices) {
      updatePort("audio-output", "not-supported");
      updatePort("audio-input", "not-supported");
      return false;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      // Check audio outputs (speakers/headphones)
      const audioOutputs = devices.filter(d => d.kind === "audiooutput");
      const externalOutputs = audioOutputs.filter(d => 
        d.label.toLowerCase().includes("headphone") || 
        d.label.toLowerCase().includes("external") ||
        d.label.toLowerCase().includes("usb") ||
        d.label.toLowerCase().includes("bluetooth") ||
        d.label.toLowerCase().includes("airpods")
      );
      
      if (externalOutputs.length > 0) {
        updatePort("audio-output", "connected", externalOutputs[0].label || "External audio device");
        setDetectedDevices(prev => [...prev, externalOutputs[0].label || "Audio Output"]);
      } else if (audioOutputs.length > 1) {
        // More than just built-in speaker
        updatePort("audio-output", "connected", `${audioOutputs.length} audio outputs available`);
      } else {
        updatePort("audio-output", "not-connected", "Using built-in speaker");
      }
      
      // Check audio inputs (microphones)
      const audioInputs = devices.filter(d => d.kind === "audioinput");
      const externalInputs = audioInputs.filter(d => 
        d.label.toLowerCase().includes("external") ||
        d.label.toLowerCase().includes("usb") ||
        d.label.toLowerCase().includes("bluetooth") ||
        d.label.toLowerCase().includes("airpods")
      );
      
      if (externalInputs.length > 0) {
        updatePort("audio-input", "connected", externalInputs[0].label || "External microphone");
        setDetectedDevices(prev => [...prev, externalInputs[0].label || "Microphone"]);
      } else if (audioInputs.length > 1) {
        updatePort("audio-input", "connected", `${audioInputs.length} microphones available`);
      } else {
        updatePort("audio-input", "not-connected", "Using built-in microphone");
      }
      
      return externalOutputs.length > 0 || externalInputs.length > 0;
    } catch (e) {
      updatePort("audio-output", "not-supported", "Permission required");
      updatePort("audio-input", "not-supported", "Permission required");
      return false;
    }
  }, [updatePort]);

  // Detect charging status
  const detectCharging = useCallback(async () => {
    updatePort("charging", "testing");
    
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        if (battery.charging) {
          const level = Math.round(battery.level * 100);
          updatePort("charging", "connected", `Charging (${level}%)`);
          setDetectedDevices(prev => [...prev, "Power Adapter"]);
          return true;
        } else {
          const level = Math.round(battery.level * 100);
          updatePort("charging", "not-connected", `On battery (${level}%)`);
          return false;
        }
      } catch (e) {
        updatePort("charging", "not-supported", "Battery API not available");
        return false;
      }
    }
    
    updatePort("charging", "not-supported", "Battery API not supported");
    return false;
  }, [updatePort]);

  // Detect Wi-Fi status
  const detectWifi = useCallback(() => {
    updateWireless("wifi-status", "testing");
    updateWireless("wifi-strength", "testing");
    
    const isOnline = navigator.onLine;
    
    if (isOnline) {
      updateWireless("wifi-status", "connected", "Connected");
      
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const effectiveType = connection?.effectiveType || "unknown";
        const downlink = connection?.downlink;
        
        let strength = "Unknown";
        if (effectiveType === "4g" && downlink > 5) strength = "Excellent";
        else if (effectiveType === "4g") strength = "Good";
        else if (effectiveType === "3g") strength = "Fair";
        else strength = "Weak";
        
        updateWireless("wifi-strength", "connected", strength);
      } else {
        updateWireless("wifi-strength", "connected", "Available");
      }
    } else {
      updateWireless("wifi-status", "not-connected", "Disconnected");
      updateWireless("wifi-strength", "not-connected", "N/A");
    }
  }, [updateWireless]);

  // Detect Bluetooth
  const detectBluetooth = useCallback(async () => {
    updateWireless("bluetooth", "testing");
    
    if ('bluetooth' in navigator) {
      updateWireless("bluetooth", "connected", "Available");
    } else {
      updateWireless("bluetooth", "not-supported", "Not supported in browser");
    }
  }, [updateWireless]);

  // Run full scan
  const runFullScan = useCallback(async () => {
    setIsScanning(true);
    setScanProgress(0);
    setDetectedDevices([]);
    
    // Reset all to testing
    setPorts(prev => prev.map(p => ({ ...p, status: "testing" as PortStatus, deviceName: undefined })));
    setWirelessTests(prev => prev.map(t => ({ ...t, status: "testing" as PortStatus, value: undefined })));

    toast({
      title: "Scanning ports...",
      description: "Connect your devices now for automatic detection",
    });

    const steps = [
      { fn: detectUSBDevices, progress: 20 },
      { fn: detectDisplays, progress: 35 },
      { fn: detectAudioDevices, progress: 55 },
      { fn: detectCharging, progress: 70 },
      { fn: detectWifi, progress: 85 },
      { fn: detectBluetooth, progress: 100 },
    ];

    for (const step of steps) {
      await step.fn();
      setScanProgress(step.progress);
      await new Promise(r => setTimeout(r, 300));
    }

    setIsScanning(false);
    
    toast({
      title: "Scan complete",
      description: `Detected ${detectedDevices.length} connected devices`,
    });
  }, [detectUSBDevices, detectDisplays, detectAudioDevices, detectCharging, detectWifi, detectBluetooth, detectedDevices.length]);

  // Listen for device changes
  useEffect(() => {
    const handleOnline = () => detectWifi();
    const handleOffline = () => detectWifi();
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for USB connect/disconnect
    if ('usb' in navigator) {
      (navigator as any).usb.addEventListener("connect", () => {
        detectUSBDevices();
        toast({ title: "USB device connected" });
      });
      (navigator as any).usb.addEventListener("disconnect", () => {
        detectUSBDevices();
        toast({ title: "USB device disconnected", variant: "destructive" });
      });
    }

    // Listen for audio device changes
    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener("devicechange", () => {
        detectAudioDevices();
        toast({ title: "Audio device changed" });
      });
    }

    // Listen for battery/charging changes
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        battery.addEventListener("chargingchange", () => {
          detectCharging();
          toast({ 
            title: battery.charging ? "Charger connected" : "Charger disconnected",
            variant: battery.charging ? "default" : "destructive"
          });
        });
      });
    }

    // Listen for screen changes
    if ('screen' in window && 'addEventListener' in window.screen) {
      (window.screen as any).addEventListener?.("change", detectDisplays);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [detectUSBDevices, detectDisplays, detectAudioDevices, detectCharging, detectWifi]);

  // Auto-scan on mount
  useEffect(() => {
    runFullScan();
  }, []);

  // Calculate summary
  const allItems = [...ports, ...wirelessTests];
  const connected = allItems.filter(i => i.status === "connected").length;
  const notConnected = allItems.filter(i => i.status === "not-connected").length;
  const notSupported = allItems.filter(i => i.status === "not-supported").length;
  const healthScore = Math.round((connected / (allItems.length - notSupported)) * 100) || 0;

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                  <Cable className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Ports & Connectivity
                  </h1>
                  <p className="text-muted-foreground">
                    Real-time detection of connected devices
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
                    Scan All Ports
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
                    <span className="font-medium text-foreground">Scanning for connected devices...</span>
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
              <span>Real-time detection. Connect or disconnect devices to see instant updates.</span>
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
                <CardTitle className="text-lg">Detection Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-success/10">
                    <div className="text-2xl font-bold text-success">{connected}</div>
                    <div className="text-xs text-muted-foreground">Connected</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-muted-foreground">{notConnected}</div>
                    <div className="text-xs text-muted-foreground">Not Connected</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-warning/10">
                    <div className="text-2xl font-bold text-warning">{notSupported}</div>
                    <div className="text-xs text-muted-foreground">Not Supported</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-primary/10">
                    <div className="text-2xl font-bold text-primary">
                      {isScanning ? "—" : `${healthScore}%`}
                    </div>
                    <div className="text-xs text-muted-foreground">Connectivity</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Physical Ports */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Usb className="h-5 w-5 text-primary" />
                    Physical Ports
                  </CardTitle>
                  <CardDescription>
                    Auto-detected connected devices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ports.map((port, index) => {
                    const StatusIcon = statusConfig[port.status].icon;
                    return (
                      <motion.div
                        key={port.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg transition-all",
                          port.status === "connected" 
                            ? "bg-success/10 border border-success/20" 
                            : "bg-muted/30"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-lg",
                          port.status === "connected" ? "bg-success/20" : "bg-muted"
                        )}>
                          <port.icon className={cn(
                            "h-5 w-5",
                            port.status === "connected" ? "text-success" : "text-foreground"
                          )} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground text-sm">{port.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {port.deviceName || port.description}
                          </div>
                        </div>

                        <div className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                          statusConfig[port.status].color
                        )}>
                          <StatusIcon className={cn(
                            "h-3.5 w-3.5",
                            port.status === "testing" && "animate-spin"
                          )} />
                          {statusConfig[port.status].label}
                        </div>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Wireless */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-primary" />
                    Wireless Connectivity
                  </CardTitle>
                  <CardDescription>
                    Network and Bluetooth status
                  </CardDescription>
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
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg transition-all",
                          test.status === "connected" 
                            ? "bg-success/10 border border-success/20" 
                            : "bg-muted/30"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-lg",
                          test.status === "connected" ? "bg-success/20" : "bg-muted"
                        )}>
                          <test.icon className={cn(
                            "h-5 w-5",
                            test.status === "connected" ? "text-success" : "text-foreground"
                          )} />
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
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Detected Devices List */}
          <AnimatePresence>
            {detectedDevices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Detected Devices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {detectedDevices.map((device, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="px-3 py-1.5 bg-success/10 text-success rounded-full text-sm font-medium flex items-center gap-1.5"
                        >
                          <Check className="h-3.5 w-3.5" />
                          {device}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tips */}
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
                  Tips for Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="font-medium text-foreground mb-1">USB Devices</div>
                    <p className="text-muted-foreground">Connect USB devices and they'll be detected automatically. Some browsers require permission.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="font-medium text-foreground mb-1">Audio Devices</div>
                    <p className="text-muted-foreground">Plug in headphones or a microphone. Detection updates instantly when devices change.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="font-medium text-foreground mb-1">Charging</div>
                    <p className="text-muted-foreground">Connect or disconnect your charger to verify the charging port is working properly.</p>
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

export default PortsTest;
