import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Usb, Plug, Wifi, Check, X, CheckCircle2, Loader2, ArrowLeft, Monitor, Headphones, Mic, Signal } from "lucide-react";

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

interface PortStatus {
  id: string;
  name: string;
  icon: React.ElementType;
  status: "checking" | "connected" | "not-connected" | "not-supported";
  detail?: string;
}

const PortsTestEmbed = ({ onComplete, onBack }: Props) => {
  const [ports, setPorts] = useState<PortStatus[]>([
    { id: "wifi", name: "Wi-Fi", icon: Wifi, status: "checking" },
    { id: "wifi-strength", name: "Signal Strength", icon: Signal, status: "checking" },
    { id: "usb", name: "USB Devices", icon: Usb, status: "checking" },
    { id: "display", name: "External Display", icon: Monitor, status: "checking" },
    { id: "audio-output", name: "Audio Output", icon: Headphones, status: "checking" },
    { id: "audio-input", name: "Microphone", icon: Mic, status: "checking" },
    { id: "charging", name: "Power/Charging", icon: Plug, status: "checking" },
  ]);
  const [hasChecked, setHasChecked] = useState(false);

  const updatePort = useCallback((id: string, status: PortStatus["status"], detail?: string) => {
    setPorts(prev => prev.map(p => p.id === id ? { ...p, status, detail } : p));
  }, []);

  const runChecks = useCallback(async () => {
    // Check Wi-Fi
    const isOnline = navigator.onLine;
    updatePort("wifi", isOnline ? "connected" : "not-connected", 
      isOnline ? "Connected to network" : "No connection");

    // Check Wi-Fi Signal Strength (via Network Information API)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        const effectiveType = connection.effectiveType || 'unknown';
        const downlink = connection.downlink ? `${connection.downlink} Mbps` : '';
        updatePort("wifi-strength", isOnline ? "connected" : "not-connected", 
          isOnline ? `${effectiveType.toUpperCase()}${downlink ? ` - ${downlink}` : ''}` : "Not connected");
      } else {
        updatePort("wifi-strength", "not-supported", "Network Info API not available");
      }
    } else {
      updatePort("wifi-strength", "not-supported", "Network Info API not available");
    }

    // Check USB (WebUSB API availability)
    if ('usb' in navigator) {
      try {
        const devices = await (navigator as any).usb.getDevices();
        if (devices.length > 0) {
          const names = devices.map((d: any) => d.productName || "USB Device").slice(0, 2).join(", ");
          updatePort("usb", "connected", `${devices.length} device${devices.length > 1 ? 's' : ''}: ${names}`);
        } else {
          updatePort("usb", "not-connected", "No paired USB devices");
        }
      } catch {
        updatePort("usb", "not-connected", "No paired USB devices");
      }
    } else {
      updatePort("usb", "not-supported", "WebUSB not supported");
    }

    // Check External Display (Window Management API)
    if ('getScreenDetails' in window) {
      updatePort("display", "not-connected", "Click dashboard for full test");
    } else {
      updatePort("display", "not-supported", "Screen API not available");
    }

    // Check Audio Output
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const outputs = devices.filter(d => d.kind === 'audiooutput');
      if (outputs.length > 0) {
        const hasNamed = outputs.some(d => d.label);
        updatePort("audio-output", "connected", 
          hasNamed ? outputs.find(d => d.label)?.label || `${outputs.length} output(s)` : `${outputs.length} output(s) available`);
      } else {
        updatePort("audio-output", "not-connected", "No audio outputs detected");
      }
    } catch {
      updatePort("audio-output", "not-connected", "Unable to detect audio");
    }

    // Check Microphone
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const inputs = devices.filter(d => d.kind === 'audioinput');
      if (inputs.length > 0) {
        const hasNamed = inputs.some(d => d.label);
        updatePort("audio-input", "connected", 
          hasNamed ? inputs.find(d => d.label)?.label || `${inputs.length} mic(s)` : `${inputs.length} mic(s) available`);
      } else {
        updatePort("audio-input", "not-connected", "No microphones detected");
      }
    } catch {
      updatePort("audio-input", "not-connected", "Unable to detect mics");
    }

    // Check Battery/Charging
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        const level = Math.round(battery.level * 100);
        if (battery.charging) {
          updatePort("charging", "connected", `Charging (${level}%)`);
        } else {
          updatePort("charging", "not-connected", `On battery (${level}%)`);
        }
      } catch {
        updatePort("charging", "not-connected", "Unable to check");
      }
    } else {
      updatePort("charging", "not-supported", "Battery API not supported");
    }

    setHasChecked(true);
  }, [updatePort]);

  useEffect(() => {
    runChecks();
  }, [runChecks]);

  const getStatusIcon = (status: PortStatus["status"]) => {
    switch (status) {
      case "checking":
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
      case "connected":
        return <Check className="h-4 w-4 text-success" />;
      case "not-connected":
        return <X className="h-4 w-4 text-muted-foreground" />;
      case "not-supported":
        return <X className="h-4 w-4 text-warning" />;
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[500px] p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-2">
          <Usb className="h-4 w-4" />
          <span className="font-medium">Ports & Connectivity</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Checking your device connectivity
        </p>
      </div>

      {/* Port List */}
      <div className="flex-1 overflow-auto max-w-md mx-auto w-full space-y-2 py-2">
        {ports.map((port, index) => {
          const Icon = port.icon;
          return (
            <motion.div
              key={port.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-xl border-2 transition-colors ${
                port.status === "connected" 
                  ? "bg-success/10 border-success/30" 
                  : port.status === "checking"
                  ? "bg-muted border-border"
                  : port.status === "not-supported"
                  ? "bg-warning/5 border-warning/20"
                  : "bg-muted/50 border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    port.status === "connected" ? "bg-success/20" : 
                    port.status === "not-supported" ? "bg-warning/10" : "bg-muted"
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      port.status === "connected" ? "text-success" : 
                      port.status === "not-supported" ? "text-warning" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{port.name}</p>
                    {port.detail && (
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{port.detail}</p>
                    )}
                  </div>
                </div>
                {getStatusIcon(port.status)}
              </div>
            </motion.div>
          );
        })}

        {/* Note */}
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Note:</strong> Some features require permissions. 
            Test individually from the dashboard for full access.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center gap-3">
        {onBack && (
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <Button onClick={() => onComplete()} disabled={!hasChecked}>
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Complete Test
        </Button>
      </div>
    </div>
  );
};

export default PortsTestEmbed;
