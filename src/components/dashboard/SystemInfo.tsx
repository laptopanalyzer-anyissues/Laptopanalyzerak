import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Laptop,
  Monitor,
  Cpu,
  MemoryStick,
  Globe,
  Battery,
} from "lucide-react";

interface SystemData {
  deviceName: string;
  os: string;
  browser: string;
  screenResolution: string;
  cpuCores: number;
  memory: string;
  batteryLevel: number | null;
  batteryCharging: boolean | null;
}

export function SystemInfo() {
  const [systemData, setSystemData] = useState<SystemData>({
    deviceName: "Unknown",
    os: "Unknown",
    browser: "Unknown",
    screenResolution: "Unknown",
    cpuCores: 0,
    memory: "Unknown",
    batteryLevel: null,
    batteryCharging: null,
  });

  useEffect(() => {
    const getSystemInfo = async () => {
      // Get OS
      const userAgent = navigator.userAgent;
      let os = "Unknown";
      if (userAgent.includes("Windows")) os = "Windows";
      else if (userAgent.includes("Mac")) os = "macOS";
      else if (userAgent.includes("Linux")) os = "Linux";
      else if (userAgent.includes("Android")) os = "Android";
      else if (userAgent.includes("iOS")) os = "iOS";

      // Get Browser
      let browser = "Unknown";
      if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) browser = "Chrome";
      else if (userAgent.includes("Firefox")) browser = "Firefox";
      else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
      else if (userAgent.includes("Edg")) browser = "Edge";

      // Get screen resolution
      const screenResolution = `${window.screen.width} × ${window.screen.height}`;

      // Get CPU cores
      const cpuCores = navigator.hardwareConcurrency || 0;

      // Get memory (if available)
      const memory = (navigator as any).deviceMemory
        ? `${(navigator as any).deviceMemory} GB`
        : "Not available";

      // Get battery info
      let batteryLevel = null;
      let batteryCharging = null;
      try {
        const battery = await (navigator as any).getBattery?.();
        if (battery) {
          batteryLevel = Math.round(battery.level * 100);
          batteryCharging = battery.charging;
        }
      } catch (e) {
        // Battery API not available
      }

      setSystemData({
        deviceName: os + " Device",
        os,
        browser,
        screenResolution,
        cpuCores,
        memory,
        batteryLevel,
        batteryCharging,
      });
    };

    getSystemInfo();
  }, []);

  const infoCards = [
    { icon: Laptop, label: "Device", value: systemData.deviceName },
    { icon: Globe, label: "Browser", value: systemData.browser },
    { icon: Monitor, label: "Screen", value: systemData.screenResolution },
    { icon: Cpu, label: "CPU Cores", value: systemData.cpuCores.toString() },
    { icon: MemoryStick, label: "Memory", value: systemData.memory },
    {
      icon: Battery,
      label: "Battery",
      value:
        systemData.batteryLevel !== null
          ? `${systemData.batteryLevel}%${systemData.batteryCharging ? " ⚡" : ""}`
          : "Not available",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h2 className="text-xl font-semibold text-foreground mb-4">
        System Overview
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {infoCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-4 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <card.icon className="h-4 w-4" />
              <span className="text-xs font-medium">{card.label}</span>
            </div>
            <p className="text-sm font-semibold text-foreground truncate">
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
