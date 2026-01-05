import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Usb,
  Monitor,
  Headphones,
  Mic,
  Plug,
  Wifi,
  Bluetooth,
  Signal,
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
  Lock,
  Unlock,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type PortStatus = "not-tested" | "testing" | "connected" | "not-connected" | "needs-permission";

interface PortItem {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  status: PortStatus;
  deviceName?: string;
  hasPermission: boolean;
  permissionType?: "usb" | "audio" | "display";
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
  "needs-permission": { label: "Grant Access", color: "bg-warning/20 text-warning", icon: Lock },
};

const PortsTest = () => {
  const [ports, setPorts] = useState<PortItem[]>([
    { id: "usb", name: "USB Devices", icon: Usb, description: "Click to allow USB detection", status: "needs-permission", hasPermission: false, permissionType: "usb" },
    { id: "display", name: "External Display", icon: Monitor, description: "Click to check displays", status: "needs-permission", hasPermission: false, permissionType: "display" },
    { id: "audio-output", name: "Audio Output", icon: Headphones, description: "Click to detect audio devices", status: "needs-permission", hasPermission: false, permissionType: "audio" },
    { id: "audio-input", name: "Microphone", icon: Mic, description: "Click to detect microphones", status: "needs-permission", hasPermission: false, permissionType: "audio" },
    { id: "charging", name: "Power/Charging", icon: Plug, description: "Checking...", status: "not-tested", hasPermission: true },
  ]);

  const [wirelessTests, setWirelessTests] = useState<WirelessTest[]>([
    { id: "wifi-status", name: "Wi-Fi Status", icon: Wifi, description: "Network connection", status: "not-tested" },
    { id: "wifi-strength", name: "Signal Strength", icon: Signal, description: "Connection quality", status: "not-tested" },
    { id: "bluetooth", name: "Bluetooth", icon: Bluetooth, description: "Click to check Bluetooth", status: "needs-permission" },
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [detectedDevices, setDetectedDevices] = useState<string[]>([]);
  const [showBluetoothDialog, setShowBluetoothDialog] = useState(false);
  const [showUSBDialog, setShowUSBDialog] = useState(false);
  const [permissions, setPermissions] = useState({
    usb: false,
    audio: false,
    display: false,
  });

  // Update port status helper
  const updatePort = useCallback((id: string, status: PortStatus, deviceName?: string, hasPermission?: boolean) => {
    setPorts(prev => prev.map(p => p.id === id ? { 
      ...p, 
      status, 
      deviceName,
      hasPermission: hasPermission !== undefined ? hasPermission : p.hasPermission 
    } : p));
  }, []);

  // Update wireless status helper
  const updateWireless = useCallback((id: string, status: PortStatus, value?: string) => {
    setWirelessTests(prev => prev.map(t => t.id === id ? { ...t, status, value } : t));
  }, []);

  // Show USB confirmation dialog first
  const handleUSBClick = useCallback(() => {
    if (!('usb' in navigator)) {
      updatePort("usb", "not-connected", "WebUSB not supported in this browser");
      toast({ title: "USB detection not supported", description: "Try using Chrome or Edge", variant: "destructive" });
      return;
    }
    setShowUSBDialog(true);
  }, [updatePort]);

  // Request USB permission and detect devices (called after dialog confirmation)
  const requestUSBPermission = useCallback(async () => {
    setShowUSBDialog(false);
    updatePort("usb", "testing");

    try {
      // This triggers the browser's USB device picker
      const device = await (navigator as any).usb.requestDevice({ filters: [] });
      if (device) {
        const name = device.productName || "USB Device";
        updatePort("usb", "connected", name, true);
        setDetectedDevices(prev => [...prev.filter(d => d !== name), name]);
        setPermissions(prev => ({ ...prev, usb: true }));
        toast({ title: "USB device detected", description: name });
        
        // Now we can also get all previously paired devices
        const devices = await (navigator as any).usb.getDevices();
        if (devices.length > 1) {
          const names = devices.map((d: any) => d.productName || "USB Device").join(", ");
          updatePort("usb", "connected", `${devices.length} devices: ${names}`, true);
        }
      }
    } catch (e: any) {
      if (e.name === "NotFoundError") {
        updatePort("usb", "not-connected", "No USB device selected", true);
        setPermissions(prev => ({ ...prev, usb: true }));
      } else {
        updatePort("usb", "needs-permission", "Click to try again");
      }
    }
  }, [updatePort]);

  // Request Audio permission and detect devices
  const requestAudioPermission = useCallback(async () => {
    updatePort("audio-output", "testing");
    updatePort("audio-input", "testing");
    
    if (!navigator.mediaDevices?.enumerateDevices) {
      updatePort("audio-output", "not-connected", "Not supported");
      updatePort("audio-input", "not-connected", "Not supported");
      return;
    }

    try {
      // Request microphone permission to get device labels
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissions(prev => ({ ...prev, audio: true }));
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      // Check audio outputs
      const audioOutputs = devices.filter(d => d.kind === "audiooutput" && d.label);
      const externalOutputs = audioOutputs.filter(d => 
        d.label.toLowerCase().includes("headphone") || 
        d.label.toLowerCase().includes("external") ||
        d.label.toLowerCase().includes("usb") ||
        d.label.toLowerCase().includes("bluetooth") ||
        d.label.toLowerCase().includes("airpods") ||
        d.label.toLowerCase().includes("beats")
      );
      
      if (externalOutputs.length > 0) {
        updatePort("audio-output", "connected", externalOutputs[0].label, true);
        setDetectedDevices(prev => [...prev.filter(d => d !== externalOutputs[0].label), externalOutputs[0].label]);
        toast({ title: "Audio output detected", description: externalOutputs[0].label });
      } else {
        const defaultOutput = audioOutputs.find(d => d.deviceId === "default");
        updatePort("audio-output", "connected", defaultOutput?.label || `${audioOutputs.length} output(s) available`, true);
      }
      
      // Check audio inputs
      const audioInputs = devices.filter(d => d.kind === "audioinput" && d.label);
      const externalInputs = audioInputs.filter(d => 
        !d.label.toLowerCase().includes("default") &&
        !d.label.toLowerCase().includes("built-in")
      );
      
      if (externalInputs.length > 0) {
        updatePort("audio-input", "connected", externalInputs[0].label, true);
        setDetectedDevices(prev => [...prev.filter(d => d !== externalInputs[0].label), externalInputs[0].label]);
      } else {
        const defaultInput = audioInputs.find(d => d.label);
        updatePort("audio-input", "connected", defaultInput?.label || "Built-in microphone", true);
      }
      
      toast({ title: "Audio permission granted", description: "Devices detected successfully" });
      
    } catch (e: any) {
      if (e.name === "NotAllowedError") {
        updatePort("audio-output", "needs-permission", "Permission denied - click to retry");
        updatePort("audio-input", "needs-permission", "Permission denied - click to retry");
        toast({ title: "Audio permission denied", variant: "destructive" });
      } else {
        updatePort("audio-output", "not-connected", "Detection failed");
        updatePort("audio-input", "not-connected", "Detection failed");
      }
    }
  }, [updatePort]);

  // Request Display permission
  const requestDisplayPermission = useCallback(async () => {
    updatePort("display", "testing");
    
    if ('getScreenDetails' in window) {
      try {
        const screenDetails = await (window as any).getScreenDetails();
        const screens = screenDetails.screens;
        setPermissions(prev => ({ ...prev, display: true }));
        
        if (screens.length > 1) {
          updatePort("display", "connected", `${screens.length} displays detected`, true);
          setDetectedDevices(prev => [...prev, `${screens.length - 1} External Display(s)`]);
          toast({ title: "External display detected", description: `${screens.length} displays total` });
        } else {
          updatePort("display", "not-connected", "Only built-in display", true);
        }
        
        // Listen for display changes
        screenDetails.addEventListener('screenschange', () => {
          const newCount = screenDetails.screens.length;
          if (newCount > 1) {
            updatePort("display", "connected", `${newCount} displays detected`, true);
            toast({ title: "Display connected" });
          } else {
            updatePort("display", "not-connected", "Only built-in display", true);
            toast({ title: "Display disconnected", variant: "destructive" });
          }
        });
        
      } catch (e) {
        // Fallback check
        if (window.screen && 'isExtended' in window.screen) {
          if ((window.screen as any).isExtended) {
            updatePort("display", "connected", "Extended display active", true);
          } else {
            updatePort("display", "not-connected", "No external display", true);
          }
        } else {
          updatePort("display", "needs-permission", "Click to grant access");
        }
      }
    } else {
      // Basic fallback
      if (window.screen && 'isExtended' in window.screen && (window.screen as any).isExtended) {
        updatePort("display", "connected", "Extended display detected", true);
      } else {
        updatePort("display", "not-connected", "Multi-display API not available", true);
      }
    }
  }, [updatePort]);

  // Detect charging status (no permission needed)
  const detectCharging = useCallback(async () => {
    updatePort("charging", "testing");
    
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        
        const updateBatteryStatus = () => {
          if (battery.charging) {
            const level = Math.round(battery.level * 100);
            updatePort("charging", "connected", `Charging (${level}%)`, true);
            if (!detectedDevices.includes("Power Adapter")) {
              setDetectedDevices(prev => [...prev, "Power Adapter"]);
            }
          } else {
            const level = Math.round(battery.level * 100);
            updatePort("charging", "not-connected", `On battery (${level}%)`, true);
            setDetectedDevices(prev => prev.filter(d => d !== "Power Adapter"));
          }
        };
        
        updateBatteryStatus();
        
        // Listen for charging changes
        battery.addEventListener("chargingchange", () => {
          updateBatteryStatus();
          toast({ 
            title: battery.charging ? "Charger connected" : "Charger disconnected",
            variant: battery.charging ? "default" : "destructive"
          });
        });
        
      } catch (e) {
        updatePort("charging", "not-connected", "Battery API error", true);
      }
    } else {
      updatePort("charging", "not-connected", "Battery API not supported", true);
    }
  }, [updatePort, detectedDevices]);

  // Detect Wi-Fi status
  const detectWifi = useCallback(() => {
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

  // Show Bluetooth confirmation dialog first
  const handleBluetoothClick = useCallback(() => {
    if (!('bluetooth' in navigator)) {
      updateWireless("bluetooth", "not-connected", "Not supported in browser");
      toast({ title: "Bluetooth not supported", description: "Try using Chrome or Edge", variant: "destructive" });
      return;
    }
    setShowBluetoothDialog(true);
  }, [updateWireless]);

  // Request Bluetooth permission and detect (called after dialog confirmation)
  const requestBluetoothPermission = useCallback(async () => {
    setShowBluetoothDialog(false);
    updateWireless("bluetooth", "testing");

    try {
      // Check if Bluetooth adapter is available first
      const bluetoothAvailable = await (navigator as any).bluetooth?.getAvailability?.();
      
      if (bluetoothAvailable === false) {
        updateWireless("bluetooth", "not-connected", "No Bluetooth hardware");
        toast({ title: "Bluetooth not available", description: "No Bluetooth adapter detected on this device", variant: "destructive" });
        return;
      }

      // Show info toast about the browser picker
      toast({ 
        title: "Select a Bluetooth device", 
        description: "Choose a device from the browser's Bluetooth picker. Make sure your device is in pairing mode and visible." 
      });

      // This triggers the browser's Bluetooth device picker
      // The picker will scan and show available devices
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information', 'generic_access']
      });
      
      if (device) {
        updateWireless("bluetooth", "connected", device.name || "Bluetooth device found");
        if (!detectedDevices.includes(device.name || "Bluetooth Device")) {
          setDetectedDevices(prev => [...prev, device.name || "Bluetooth Device"]);
        }
        toast({ title: "Bluetooth detected", description: `Connected to: ${device.name || "Unknown device"}` });
      }
    } catch (e: any) {
      console.log("Bluetooth error:", e.name, e.message);
      
      // User cancelled or no Bluetooth adapter found
      if (e.name === "NotFoundError") {
        // User cancelled the picker or no devices available
        updateWireless("bluetooth", "not-connected", "Cancelled or no devices");
        toast({ 
          title: "No device selected", 
          description: "You cancelled or no devices were found. Ensure devices are in pairing mode and try again.", 
          variant: "destructive" 
        });
      } else if (e.name === "SecurityError") {
        updateWireless("bluetooth", "needs-permission", "Permission denied");
        toast({ title: "Bluetooth permission denied", description: "Please allow Bluetooth access in your browser settings", variant: "destructive" });
      } else if (e.message?.includes("adapter") || e.message?.includes("Bluetooth") || e.message?.includes("User denied")) {
        // No Bluetooth hardware or user denied
        updateWireless("bluetooth", "not-connected", "No Bluetooth hardware");
        toast({ title: "Bluetooth not available", description: "No Bluetooth adapter detected", variant: "destructive" });
      } else {
        // Permission denied or other error
        updateWireless("bluetooth", "needs-permission", "Click to retry");
        toast({ title: "Bluetooth error", description: e.message || "Try again", variant: "destructive" });
      }
    }
  }, [updateWireless, detectedDevices]);

  // Handle port click for permission request or rescan
  const handlePortClick = useCallback((port: PortItem) => {
    switch (port.permissionType) {
      case "usb":
        handleUSBClick();
        break;
      case "audio":
        requestAudioPermission();
        break;
      case "display":
        requestDisplayPermission();
        break;
    }
  }, [handleUSBClick, requestAudioPermission, requestDisplayPermission]);

  // Run all wireless tests (only Wi-Fi auto-runs, Bluetooth needs permission)
  const runWirelessTests = useCallback(() => {
    detectWifi();
    // Bluetooth is not auto-run, it requires user permission click
  }, [detectWifi]);

  // Listen for device changes
  useEffect(() => {
    // Online/offline events
    const handleOnline = () => {
      detectWifi();
      toast({ title: "Network connected" });
    };
    const handleOffline = () => {
      detectWifi();
      toast({ title: "Network disconnected", variant: "destructive" });
    };
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // USB device events (only if we have permission)
    if ('usb' in navigator && permissions.usb) {
      const handleUSBConnect = async () => {
        const devices = await (navigator as any).usb.getDevices();
        if (devices.length > 0) {
          const names = devices.map((d: any) => d.productName || "USB Device").join(", ");
          updatePort("usb", "connected", devices.length > 1 ? `${devices.length} devices` : names, true);
          toast({ title: "USB device connected" });
        }
      };
      const handleUSBDisconnect = async () => {
        const devices = await (navigator as any).usb.getDevices();
        if (devices.length === 0) {
          updatePort("usb", "not-connected", "No devices connected", true);
          toast({ title: "USB device disconnected", variant: "destructive" });
        } else {
          const names = devices.map((d: any) => d.productName || "USB Device").join(", ");
          updatePort("usb", "connected", names, true);
        }
      };
      
      (navigator as any).usb.addEventListener("connect", handleUSBConnect);
      (navigator as any).usb.addEventListener("disconnect", handleUSBDisconnect);
    }

    // Audio device changes
    if (navigator.mediaDevices && permissions.audio) {
      navigator.mediaDevices.addEventListener("devicechange", async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioOutputs = devices.filter(d => d.kind === "audiooutput" && d.label);
        const audioInputs = devices.filter(d => d.kind === "audioinput" && d.label);
        
        if (audioOutputs.length > 0) {
          updatePort("audio-output", "connected", audioOutputs[0].label, true);
        }
        if (audioInputs.length > 0) {
          updatePort("audio-input", "connected", audioInputs[0].label, true);
        }
        
        toast({ title: "Audio device changed" });
      });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [detectWifi, permissions, updatePort]);

  // Auto-detect on mount
  useEffect(() => {
    detectCharging();
    runWirelessTests();
  }, []);

  // Calculate summary
  const allItems = [...ports, ...wirelessTests];
  const connected = allItems.filter(i => i.status === "connected").length;
  const notConnected = allItems.filter(i => i.status === "not-connected").length;
  const needsPermission = ports.filter(p => p.status === "needs-permission").length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Bluetooth Permission Dialog */}
      <Dialog open={showBluetoothDialog} onOpenChange={setShowBluetoothDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <Bluetooth className="h-5 w-5 text-primary" />
              </div>
              Bluetooth Detection
            </DialogTitle>
            <DialogDescription className="text-left space-y-3 pt-2">
              <p>
                To verify your Bluetooth hardware, we need to request access through your browser.
              </p>
              <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>
                    <strong>How it works:</strong> A browser picker will appear showing nearby Bluetooth devices.
                  </p>
                  <p>
                    <strong>To confirm Bluetooth works:</strong> Select any device from the list and click "Pair". Devices may show as "Unknown" - this is normal until paired.
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowBluetoothDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={requestBluetoothPermission}>
              <Bluetooth className="h-4 w-4 mr-2" />
              Verify Bluetooth
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* USB Permission Dialog */}
      <Dialog open={showUSBDialog} onOpenChange={setShowUSBDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <Usb className="h-5 w-5 text-primary" />
              </div>
              USB Detection
            </DialogTitle>
            <DialogDescription className="text-left space-y-3 pt-2">
              <p>
                To detect connected USB devices, we need to request access through your browser.
              </p>
              <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  A browser dialog will appear next. Select a connected USB device to verify your USB ports are working.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowUSBDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={requestUSBPermission}>
              <Usb className="h-4 w-4 mr-2" />
              Detect USB Devices
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                <Cable className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Ports & Connectivity
                </h1>
                <p className="text-muted-foreground">
                  Grant permissions to auto-detect connected devices
                </p>
              </div>
            </div>
          </motion.div>

          {/* Permission Banner */}
          {needsPermission > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-warning mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground mb-1">
                      Grant permissions for automatic detection
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click on each port below to grant browser permissions. Once granted, 
                      devices will be detected automatically when connected.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Privacy Notice */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3">
              <Shield className="h-4 w-4 text-success" />
              <span>No data is sent externally. All detection happens locally in your browser.</span>
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
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-success/10">
                    <div className="text-2xl font-bold text-success">{connected}</div>
                    <div className="text-xs text-muted-foreground">Connected</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-muted-foreground">{notConnected}</div>
                    <div className="text-xs text-muted-foreground">Not Connected</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-warning/10">
                    <div className="text-2xl font-bold text-warning">{needsPermission}</div>
                    <div className="text-xs text-muted-foreground">Needs Access</div>
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
                    Click each port to grant access and enable detection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ports.map((port, index) => {
                    const StatusIcon = statusConfig[port.status].icon;
                    const isClickable = port.status === "needs-permission" || (port.permissionType && !port.hasPermission);
                    const canRescan = port.hasPermission && port.status === "not-connected" && (port.id === "usb" || port.id === "display");
                    
                    return (
                      <motion.div
                        key={port.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        onClick={() => isClickable && handlePortClick(port)}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg transition-all",
                          port.status === "connected" 
                            ? "bg-success/10 border border-success/20" 
                            : port.status === "needs-permission"
                            ? "bg-warning/5 border border-warning/20 cursor-pointer hover:bg-warning/10"
                            : "bg-muted/30",
                          isClickable && "cursor-pointer hover:scale-[1.02]"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-lg",
                          port.status === "connected" ? "bg-success/20" : 
                          port.status === "needs-permission" ? "bg-warning/20" : "bg-muted"
                        )}>
                          <port.icon className={cn(
                            "h-5 w-5",
                            port.status === "connected" ? "text-success" : 
                            port.status === "needs-permission" ? "text-warning" : "text-foreground"
                          )} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground text-sm">{port.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {port.deviceName || port.description}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Scan button for USB/Display when not connected */}
                          {canRescan && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 px-2 text-xs text-primary hover:bg-primary/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePortClick(port);
                              }}
                            >
                              <ScanLine className="h-3.5 w-3.5" />
                            </Button>
                          )}

                          {port.status === "needs-permission" ? (
                            <Button size="sm" variant="outline" className="gap-1.5 text-warning border-warning/30 hover:bg-warning/10">
                              <Unlock className="h-3.5 w-3.5" />
                              Grant Access
                            </Button>
                          ) : (
                            <div className={cn(
                              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                              statusConfig[port.status].color
                            )}>
                              <StatusIcon className={cn(
                                "h-3.5 w-3.5",
                                port.status === "testing" && "animate-spin"
                              )} />
                              {statusConfig[port.status].label}
                            </div>
                          )}
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
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Wifi className="h-5 w-5 text-primary" />
                        Wireless Connectivity
                      </CardTitle>
                      <CardDescription>
                        Auto-detected network status
                      </CardDescription>
                    </div>
                    <Button size="sm" variant="outline" onClick={runWirelessTests}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {wirelessTests.map((test, index) => {
                    const StatusIcon = statusConfig[test.status].icon;
                    const isBluetooth = test.id === "bluetooth";
                    const isClickable = isBluetooth && (test.status === "needs-permission" || test.status === "not-connected");
                    
                    return (
                      <motion.div
                        key={test.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        onClick={isClickable ? handleBluetoothClick : undefined}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-lg transition-all",
                          test.status === "connected" 
                            ? "bg-success/10 border border-success/20" 
                            : test.status === "needs-permission"
                            ? "bg-warning/5 border border-warning/20"
                            : "bg-muted/30",
                          isClickable && "cursor-pointer hover:bg-warning/10"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-lg",
                          test.status === "connected" ? "bg-success/20" : 
                          test.status === "needs-permission" ? "bg-warning/20" : "bg-muted"
                        )}>
                          <test.icon className={cn(
                            "h-5 w-5",
                            test.status === "connected" ? "text-success" : 
                            test.status === "needs-permission" ? "text-warning" : "text-foreground"
                          )} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground text-sm">{test.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {test.value || test.description}
                          </div>
                        </div>

                        {test.status === "needs-permission" ? (
                          <Button size="sm" variant="outline" className="gap-1.5 text-warning border-warning/30 hover:bg-warning/10">
                            <Unlock className="h-3.5 w-3.5" />
                            Grant Access
                          </Button>
                        ) : (
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
                        )}
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Detected Devices */}
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
                <CardTitle className="text-base">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="font-medium text-foreground mb-1 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-warning/20 text-warning flex items-center justify-center text-xs">1</span>
                      Grant Permission
                    </div>
                    <p className="text-muted-foreground">Click "Grant Access" on each port to allow the browser to detect devices.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="font-medium text-foreground mb-1 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">2</span>
                      Connect Device
                    </div>
                    <p className="text-muted-foreground">Plug in your USB device, headphones, or external display.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="font-medium text-foreground mb-1 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center text-xs">3</span>
                      Auto Detection
                    </div>
                    <p className="text-muted-foreground">The browser will automatically detect and show connected devices.</p>
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
