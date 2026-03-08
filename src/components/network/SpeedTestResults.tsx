import { motion } from "framer-motion";
import { Globe, Wifi, ArrowDown, ArrowUp, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpeedTestResultsProps {
  download: number;
  upload: number;
  ping: number;
  jitter: number;
  networkMetadata: {
    ip: string | null;
    isp: string | null;
    server: string;
  };
  onTestAgain: () => void;
  isOnline: boolean;
}

export const SpeedTestResults = ({
  download,
  upload,
  ping,
  jitter,
  networkMetadata,
  onTestAgain,
  isOnline,
}: SpeedTestResultsProps) => {
  // Calculate percentages for progress bars (assuming 100 Mbps as reference max)
  const maxSpeed = Math.max(download, upload, 100);
  const downloadPercent = (download / maxSpeed) * 100;
  const uploadPercent = (upload / maxSpeed) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-3xl p-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Test Result</h2>
        
        {/* Connection indicator */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Globe className="h-5 w-5" />
          <span>Internet</span>
          <span className="text-muted-foreground/50">→</span>
          <span>This device</span>
        </div>
      </div>

      {/* Speed Bars */}
      <div className="space-y-6 mb-6">
        {/* Download Bar */}
        <div className="space-y-2">
          <div className="h-10 bg-muted/30 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, hsl(199, 89%, 48%), hsl(262, 83%, 58%))",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${downloadPercent}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
          </div>
          <div className="flex justify-end items-center gap-2">
            <ArrowDown className="h-4 w-4 text-primary" />
            <span className="font-bold text-foreground tabular-nums">
              {download.toFixed(2)} Mbps
            </span>
          </div>
        </div>

        {/* Upload Bar */}
        <div className="space-y-2">
          <div className="h-10 bg-muted/30 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, hsl(142, 76%, 36%), hsl(142, 76%, 50%))",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${uploadPercent}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            />
          </div>
          <div className="flex justify-end items-center gap-2">
            <ArrowUp className="h-4 w-4 text-success" />
            <span className="font-bold text-foreground tabular-nums">
              {upload.toFixed(2)} Mbps
            </span>
          </div>
        </div>
      </div>

      {/* Ping & Jitter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/20">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Activity className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Ping</p>
            <p className="text-lg font-bold text-foreground tabular-nums">{ping} ms</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/20">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Activity className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Jitter</p>
            <p className="text-lg font-bold text-foreground tabular-nums">{jitter} ms</p>
          </div>
        </div>
      </motion.div>

      {/* Separator */}
      <div className="border-t border-border/50 my-6" />

      {/* Network Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Service Provider</span>
            <span className="font-semibold text-foreground text-right truncate max-w-[200px]">
              {networkMetadata.isp || "Unknown"}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Test Server</span>
            <span className="font-semibold text-primary">
              {networkMetadata.server}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Your IP Address</span>
            <span className="font-semibold text-foreground font-mono text-sm">
              {networkMetadata.ip || "Unknown"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Wifi className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by Cloudflare
            </p>
          </div>
        </div>
      </motion.div>

      {/* Test Again Button - Inside the card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex justify-center"
      >
        <Button
          size="lg"
          onClick={onTestAgain}
          disabled={!isOnline}
          className="h-14 px-10 text-lg font-semibold gap-3"
        >
          <Activity className="h-5 w-5" />
          Test Again
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default SpeedTestResults;
