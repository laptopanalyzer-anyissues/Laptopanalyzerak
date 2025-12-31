import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Activity, CheckCircle2, Loader2 } from "lucide-react";

interface Props {
  onComplete: () => void;
}

const NetworkTestEmbed = ({ onComplete }: Props) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isTesting, setIsTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const runQuickTest = async () => {
    if (!isOnline) return;
    
    setIsTesting(true);
    setDownloadSpeed(null);
    setPing(null);

    try {
      // Quick ping test
      const pingStart = performance.now();
      await fetch("https://speed.cloudflare.com/__down?bytes=1", { cache: "no-store" });
      const pingEnd = performance.now();
      setPing(Math.round(pingEnd - pingStart));

      // Quick download test (500KB)
      const dlStart = performance.now();
      const response = await fetch("https://speed.cloudflare.com/__down?bytes=500000", { cache: "no-store" });
      await response.arrayBuffer();
      const dlEnd = performance.now();
      const durationSec = (dlEnd - dlStart) / 1000;
      const speedMbps = (500000 * 8) / durationSec / 1000000;
      setDownloadSpeed(Math.round(speedMbps * 10) / 10);
    } catch {
      // Silently fail
    } finally {
      setIsTesting(false);
    }
  };

  const hasTestRun = downloadSpeed !== null || ping !== null;

  return (
    <div className="flex flex-col h-full min-h-[500px] p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-2">
          <Wifi className="h-4 w-4" />
          <span className="font-medium">Network Test</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Quick network speed check
        </p>
      </div>

      {/* Network Status */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Connection Status */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
          isOnline ? "bg-success/20" : "bg-destructive/20"
        }`}>
          {isOnline ? (
            <Wifi className="h-12 w-12 text-success" />
          ) : (
            <WifiOff className="h-12 w-12 text-destructive" />
          )}
        </div>

        <p className={`font-semibold text-lg mb-4 ${isOnline ? "text-success" : "text-destructive"}`}>
          {isOnline ? "Connected" : "Offline"}
        </p>

        {/* Results */}
        {hasTestRun && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4 w-full max-w-xs mb-6"
          >
            <div className="p-4 rounded-xl bg-muted text-center">
              <p className="text-xs text-muted-foreground mb-1">Ping</p>
              <p className="text-xl font-bold text-foreground">{ping} ms</p>
            </div>
            <div className="p-4 rounded-xl bg-muted text-center">
              <p className="text-xs text-muted-foreground mb-1">Download</p>
              <p className="text-xl font-bold text-foreground">{downloadSpeed} Mbps</p>
            </div>
          </motion.div>
        )}

        {/* Test Button */}
        {!hasTestRun && isOnline && (
          <Button onClick={runQuickTest} disabled={isTesting}>
            {isTesting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Run Quick Test
              </>
            )}
          </Button>
        )}
      </div>

      {/* Complete Button */}
      <div className="mt-6 text-center">
        <Button onClick={onComplete} disabled={!isOnline && !hasTestRun}>
          <CheckCircle2 className="h-4 w-4 mr-2" />
          {hasTestRun || isOnline ? "Complete Test" : "Connect to network first"}
        </Button>
      </div>
    </div>
  );
};

export default NetworkTestEmbed;
