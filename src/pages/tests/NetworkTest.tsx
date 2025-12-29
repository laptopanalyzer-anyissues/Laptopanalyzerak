import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wifi, WifiOff, Globe, ArrowDown, ArrowUp, Activity } from "lucide-react";

interface NetworkInfo {
  online: boolean;
  type: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
}

const NetworkTest = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [testProgress, setTestProgress] = useState(0);

  useEffect(() => {
    const updateNetworkInfo = () => {
      const connection = (navigator as any).connection;
      setNetworkInfo({
        online: navigator.onLine,
        type: connection?.type || "unknown",
        effectiveType: connection?.effectiveType || "unknown",
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0,
      });
    };

    updateNetworkInfo();

    window.addEventListener("online", updateNetworkInfo);
    window.addEventListener("offline", updateNetworkInfo);
    
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener("change", updateNetworkInfo);
    }

    return () => {
      window.removeEventListener("online", updateNetworkInfo);
      window.removeEventListener("offline", updateNetworkInfo);
      if (connection) {
        connection.removeEventListener("change", updateNetworkInfo);
      }
    };
  }, []);

  const runSpeedTest = async () => {
    setIsTesting(true);
    setTestProgress(0);
    setDownloadSpeed(null);

    try {
      // Simple speed test using a known file
      const testFileUrl = "https://speed.cloudflare.com/__down?bytes=5000000";
      const startTime = performance.now();
      
      const response = await fetch(testFileUrl, { cache: "no-store" });
      const reader = response.body?.getReader();
      
      if (!reader) {
        throw new Error("Could not read response");
      }

      let receivedBytes = 0;
      const totalBytes = 5000000;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        receivedBytes += value.length;
        setTestProgress(Math.round((receivedBytes / totalBytes) * 100));
      }

      const endTime = performance.now();
      const durationSeconds = (endTime - startTime) / 1000;
      const bitsReceived = receivedBytes * 8;
      const speedMbps = (bitsReceived / durationSeconds / 1000000).toFixed(2);
      
      setDownloadSpeed(parseFloat(speedMbps));
    } catch (err) {
      console.error("Speed test failed:", err);
    } finally {
      setIsTesting(false);
      setTestProgress(100);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tests
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Network & Internet Test
            </h1>
            <p className="text-muted-foreground">
              Check your connection status and test your download speed.
            </p>
          </motion.div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <Button
              size="lg"
              onClick={runSpeedTest}
              disabled={isTesting || !networkInfo?.online}
              className="h-14 px-8 text-lg font-semibold gap-3"
            >
              <Activity className="h-5 w-5" />
              Start Network Test
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Connection Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card rounded-2xl p-8"
            >
              <div className="text-center mb-8">
                <motion.div
                  animate={{ scale: networkInfo?.online ? [1, 1.1, 1] : 1 }}
                  transition={{ repeat: networkInfo?.online ? Infinity : 0, duration: 2 }}
                  className={`inline-flex p-6 rounded-full mb-4 ${
                    networkInfo?.online ? "bg-success/10" : "bg-destructive/10"
                  }`}
                >
                  {networkInfo?.online ? (
                    <Wifi className="h-16 w-16 text-success" />
                  ) : (
                    <WifiOff className="h-16 w-16 text-destructive" />
                  )}
                </motion.div>
                <h3 className={`text-2xl font-bold ${
                  networkInfo?.online ? "text-success" : "text-destructive"
                }`}>
                  {networkInfo?.online ? "Connected" : "Offline"}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {networkInfo?.online
                    ? "Your device is connected to the internet"
                    : "No internet connection detected"}
                </p>
              </div>

              {networkInfo && networkInfo.online && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Connection Type</p>
                    <p className="font-semibold text-foreground capitalize">
                      {networkInfo.type !== "unknown" ? networkInfo.type : "Unknown"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Effective Type</p>
                    <p className="font-semibold text-foreground uppercase">
                      {networkInfo.effectiveType}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Est. Downlink</p>
                    <p className="font-semibold text-foreground">
                      {networkInfo.downlink} Mbps
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Latency (RTT)</p>
                    <p className="font-semibold text-foreground">
                      {networkInfo.rtt} ms
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Speed Test */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card rounded-2xl p-8"
            >
              <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Speed Test
              </h3>

              <div className="text-center mb-8">
                {downloadSpeed !== null ? (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-5xl font-bold gradient-text mb-2">
                      {downloadSpeed}
                    </p>
                    <p className="text-muted-foreground">Mbps Download</p>
                  </motion.div>
                ) : isTesting ? (
                  <div>
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${testProgress * 3.52} 352`}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="hsl(199, 89%, 48%)" />
                            <stop offset="100%" stopColor="hsl(172, 66%, 50%)" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-foreground">
                          {testProgress}%
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">Testing download speed...</p>
                  </div>
                ) : (
                  <div className="py-8">
                    <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Click the button below to start</p>
                  </div>
                )}
              </div>

              <Button
                variant="hero"
                className="w-full"
                onClick={runSpeedTest}
                disabled={isTesting || !networkInfo?.online}
              >
                {isTesting ? (
                  <>Testing...</>
                ) : downloadSpeed !== null ? (
                  <>Run Again</>
                ) : (
                  <>
                    <ArrowDown className="h-4 w-4 mr-2" />
                    Start Speed Test
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10"
          >
            <h3 className="font-semibold text-foreground mb-3">About This Test</h3>
            <p className="text-sm text-muted-foreground">
              This test measures your download speed by downloading a 5MB test file from Cloudflare's servers. 
              Results may vary based on current network conditions, server load, and other factors.
              For the most accurate results, close other applications that might be using bandwidth.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NetworkTest;
