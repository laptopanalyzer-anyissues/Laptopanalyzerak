import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Usb, Plug, Wifi, Check, X, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

interface PortStatus {
  id: string;
  name: string;
  icon: React.ElementType;
  status: "checking" | "connected" | "not-connected";
  detail?: string;
}

const PortsTestEmbed = ({ onComplete, onBack }: Props) => {
  const [ports, setPorts] = useState<PortStatus[]>([
    { id: "wifi", name: "Wi-Fi", icon: Wifi, status: "checking" },
    { id: "charging", name: "Power", icon: Plug, status: "checking" },
  ]);
  const [hasChecked, setHasChecked] = useState(false);

  const updatePort = useCallback((id: string, status: PortStatus["status"], detail?: string) => {
    setPorts(prev => prev.map(p => p.id === id ? { ...p, status, detail } : p));
  }, []);

  const runChecks = useCallback(async () => {
    // Check Wi-Fi
    updatePort("wifi", navigator.onLine ? "connected" : "not-connected", 
      navigator.onLine ? "Connected to network" : "No connection");

    // Check Battery/Charging
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        const level = Math.round(battery.level * 100);
        if (battery.charging) {
          updatePort("charging", "connected", `Charging (${level}%)`);
        } else {
          updatePort("charging", "not-connected", `Battery (${level}%)`);
        }
      } catch {
        updatePort("charging", "not-connected", "Unable to check");
      }
    } else {
      updatePort("charging", "not-connected", "Battery API not supported");
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
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-3">
        {ports.map((port) => {
          const Icon = port.icon;
          return (
            <motion.div
              key={port.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-xl border-2 transition-colors ${
                port.status === "connected" 
                  ? "bg-success/10 border-success/30" 
                  : port.status === "checking"
                  ? "bg-muted border-border"
                  : "bg-muted/50 border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    port.status === "connected" ? "bg-success/20" : "bg-muted"
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      port.status === "connected" ? "text-success" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{port.name}</p>
                    {port.detail && (
                      <p className="text-xs text-muted-foreground">{port.detail}</p>
                    )}
                  </div>
                </div>
                {getStatusIcon(port.status)}
              </div>
            </motion.div>
          );
        })}

        {/* USB Note */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mt-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> USB and Bluetooth detection require browser permissions. 
            You can test these individually from the dashboard.
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
        <Button onClick={onComplete} disabled={!hasChecked}>
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Complete Test
        </Button>
      </div>
    </div>
  );
};

export default PortsTestEmbed;
