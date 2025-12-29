import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Laptop,
  Monitor,
  Cpu,
  MemoryStick,
  Globe,
  Battery,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SystemData {
  deviceName: string;
  os: string;
  browser: string;
  browserVersion: string;
  screenResolution: string;
  screenColorDepth: number;
  cpuCores: number;
  memory: string;
  batteryLevel: number | null;
  batteryCharging: boolean | null;
  platform: string;
  language: string;
  online: boolean;
}

export function SystemInfo() {
  const [systemData, setSystemData] = useState<SystemData>({
    deviceName: "Detecting...",
    os: "Detecting...",
    browser: "Detecting...",
    browserVersion: "",
    screenResolution: "Detecting...",
    screenColorDepth: 0,
    cpuCores: 0,
    memory: "Detecting...",
    batteryLevel: null,
    batteryCharging: null,
    platform: "",
    language: "",
    online: true,
  });

  useEffect(() => {
    const getSystemInfo = async () => {
      const userAgent = navigator.userAgent;
      
      // Get OS with version
      let os = "Unknown";
      let platform = navigator.platform || "";
      
      if (userAgent.includes("Windows NT 10.0")) os = "Windows 10/11";
      else if (userAgent.includes("Windows NT 6.3")) os = "Windows 8.1";
      else if (userAgent.includes("Windows NT 6.2")) os = "Windows 8";
      else if (userAgent.includes("Windows NT 6.1")) os = "Windows 7";
      else if (userAgent.includes("Windows")) os = "Windows";
      else if (userAgent.includes("Mac OS X")) {
        const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
        os = match ? `macOS ${match[1].replace("_", ".")}` : "macOS";
      }
      else if (userAgent.includes("Linux")) os = "Linux";
      else if (userAgent.includes("Android")) {
        const match = userAgent.match(/Android (\d+(\.\d+)?)/);
        os = match ? `Android ${match[1]}` : "Android";
      }
      else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
        const match = userAgent.match(/OS (\d+_\d+)/);
        os = match ? `iOS ${match[1].replace("_", ".")}` : "iOS";
      }

      // Get Browser with version
      let browser = "Unknown";
      let browserVersion = "";
      
      if (userAgent.includes("Edg/")) {
        browser = "Microsoft Edge";
        const match = userAgent.match(/Edg\/(\d+(\.\d+)?)/);
        browserVersion = match ? match[1] : "";
      } else if (userAgent.includes("Chrome/")) {
        browser = "Google Chrome";
        const match = userAgent.match(/Chrome\/(\d+(\.\d+)?)/);
        browserVersion = match ? match[1] : "";
      } else if (userAgent.includes("Firefox/")) {
        browser = "Mozilla Firefox";
        const match = userAgent.match(/Firefox\/(\d+(\.\d+)?)/);
        browserVersion = match ? match[1] : "";
      } else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome")) {
        browser = "Apple Safari";
        const match = userAgent.match(/Version\/(\d+(\.\d+)?)/);
        browserVersion = match ? match[1] : "";
      }

      // Get screen info
      const screenResolution = `${window.screen.width} × ${window.screen.height}`;
      const screenColorDepth = window.screen.colorDepth;

      // Get CPU cores (logical processors)
      const cpuCores = navigator.hardwareConcurrency || 0;

      // Get approximate memory (Chrome only, returns approximate value)
      const deviceMemory = (navigator as any).deviceMemory;
      const memory = deviceMemory ? `~${deviceMemory} GB` : "Not accessible";

      // Get battery info
      let batteryLevel = null;
      let batteryCharging = null;
      try {
        const battery = await (navigator as any).getBattery?.();
        if (battery) {
          batteryLevel = Math.round(battery.level * 100);
          batteryCharging = battery.charging;
          
          // Listen for battery changes
          battery.addEventListener("levelchange", () => {
            setSystemData(prev => ({
              ...prev,
              batteryLevel: Math.round(battery.level * 100),
            }));
          });
          battery.addEventListener("chargingchange", () => {
            setSystemData(prev => ({
              ...prev,
              batteryCharging: battery.charging,
            }));
          });
        }
      } catch (e) {
        // Battery API not available
      }

      // Device name based on platform
      let deviceName = "Unknown Device";
      if (platform.includes("Win")) deviceName = "Windows PC";
      else if (platform.includes("Mac")) deviceName = "Mac";
      else if (platform.includes("Linux")) deviceName = "Linux PC";
      else if (/Android/i.test(userAgent)) deviceName = "Android Device";
      else if (/iPhone|iPad|iPod/i.test(userAgent)) deviceName = "iOS Device";

      setSystemData({
        deviceName,
        os,
        browser,
        browserVersion,
        screenResolution,
        screenColorDepth,
        cpuCores,
        memory,
        batteryLevel,
        batteryCharging,
        platform,
        language: navigator.language,
        online: navigator.onLine,
      });
    };

    getSystemInfo();

    // Listen for online/offline changes
    const handleOnline = () => setSystemData(prev => ({ ...prev, online: true }));
    const handleOffline = () => setSystemData(prev => ({ ...prev, online: false }));
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const infoCards = [
    { 
      icon: Laptop, 
      label: "Device", 
      value: systemData.deviceName,
      tooltip: `Platform: ${systemData.platform || "Unknown"}`
    },
    { 
      icon: Globe, 
      label: "Browser", 
      value: systemData.browser,
      tooltip: systemData.browserVersion ? `Version ${systemData.browserVersion}` : "Version unknown"
    },
    { 
      icon: Monitor, 
      label: "Screen", 
      value: systemData.screenResolution,
      tooltip: `Color depth: ${systemData.screenColorDepth}-bit`
    },
    { 
      icon: Cpu, 
      label: "CPU Cores", 
      value: systemData.cpuCores > 0 ? systemData.cpuCores.toString() : "Not accessible",
      tooltip: "Logical processor count"
    },
    { 
      icon: MemoryStick, 
      label: "Memory", 
      value: systemData.memory,
      tooltip: "Approximate RAM (browser-reported)"
    },
    {
      icon: Battery,
      label: "Battery",
      value:
        systemData.batteryLevel !== null
          ? `${systemData.batteryLevel}%${systemData.batteryCharging ? " ⚡" : ""}`
          : "Not accessible",
      tooltip: systemData.batteryCharging ? "Charging" : "On battery"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          System Overview
        </h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Info className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-xs">
              Hardware detection is limited by browser security. Some values are approximate or may not be available in all browsers.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {infoCards.map((card, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors cursor-help"
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <card.icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{card.label}</span>
                </div>
                <p className="text-sm font-semibold text-foreground truncate">
                  {card.value}
                </p>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{card.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </motion.div>
  );
}