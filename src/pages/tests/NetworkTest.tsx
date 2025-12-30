import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wifi, WifiOff, Globe, ArrowDown, ArrowUp, Activity, Gauge, Timer } from "lucide-react";

interface NetworkInfo {
  online: boolean;
  type: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
}

interface SpeedResults {
  download: number | null;
  upload: number | null;
  ping: number | null;
}

const TEST_DURATION_MS = 15000; // 15 seconds per test

const NetworkTest = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testPhase, setTestPhase] = useState<"idle" | "ping" | "download" | "upload" | "complete">("idle");
  const [speedResults, setSpeedResults] = useState<SpeedResults>({ download: null, upload: null, ping: null });
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(15);
  const [testProgress, setTestProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

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

  const measurePing = async (): Promise<number> => {
    const testUrl = "https://speed.cloudflare.com/__down?bytes=1";
    const pings: number[] = [];
    const startTime = performance.now();
    
    // Run ping tests for 15 seconds
    while (performance.now() - startTime < TEST_DURATION_MS) {
      const elapsed = performance.now() - startTime;
      const remaining = Math.ceil((TEST_DURATION_MS - elapsed) / 1000);
      setTimeRemaining(remaining);
      setTestProgress(Math.round((elapsed / TEST_DURATION_MS) * 100));
      
      const pingStart = performance.now();
      try {
        await fetch(testUrl, { cache: "no-store" });
        const pingEnd = performance.now();
        const pingValue = pingEnd - pingStart;
        pings.push(pingValue);
        
        // Update current ping (average of last 5)
        const recentPings = pings.slice(-5);
        const avgPing = recentPings.reduce((a, b) => a + b, 0) / recentPings.length;
        setCurrentSpeed(Math.round(avgPing));
      } catch {
        // Skip failed pings
      }
      
      // Small delay between pings
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    if (pings.length === 0) return 0;
    
    // Return average ping, excluding top and bottom 10%
    pings.sort((a, b) => a - b);
    const trimCount = Math.floor(pings.length * 0.1);
    const trimmedPings = pings.slice(trimCount, pings.length - trimCount);
    return Math.round(trimmedPings.reduce((a, b) => a + b, 0) / trimmedPings.length);
  };

  const measureDownloadSpeed = async (): Promise<number> => {
    const startTime = performance.now();
    let totalBytesReceived = 0;
    const speedSamples: number[] = [];
    
    // Use larger chunk size for more accurate measurement
    const chunkSize = 10000000; // 10MB chunks
    
    // Run download test for 15 seconds with parallel connections
    while (performance.now() - startTime < TEST_DURATION_MS) {
      const elapsed = performance.now() - startTime;
      const remaining = Math.ceil((TEST_DURATION_MS - elapsed) / 1000);
      setTimeRemaining(remaining);
      setTestProgress(Math.round((elapsed / TEST_DURATION_MS) * 100));
      
      try {
        abortControllerRef.current = new AbortController();
        const chunkStart = performance.now();
        
        // Start multiple parallel downloads for better saturation
        const downloadPromises = Array(3).fill(null).map(() => 
          fetch(`https://speed.cloudflare.com/__down?bytes=${chunkSize}`, { 
            cache: "no-store",
            signal: abortControllerRef.current?.signal
          }).then(async (response) => {
            const reader = response.body?.getReader();
            if (!reader) return 0;
            
            let bytesReceived = 0;
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              bytesReceived += value.length;
            }
            return bytesReceived;
          }).catch(() => 0)
        );
        
        const results = await Promise.all(downloadPromises);
        const chunkBytesReceived = results.reduce((a, b) => a + b, 0);
        totalBytesReceived += chunkBytesReceived;
        
        const chunkEnd = performance.now();
        const chunkDuration = (chunkEnd - chunkStart) / 1000;
        
        if (chunkDuration > 0 && chunkBytesReceived > 0) {
          const chunkSpeedMbps = (chunkBytesReceived * 8) / chunkDuration / 1000000;
          speedSamples.push(chunkSpeedMbps);
          
          // Calculate rolling average of last 5 samples
          const recentSamples = speedSamples.slice(-5);
          const avgSpeed = recentSamples.reduce((a, b) => a + b, 0) / recentSamples.length;
          setCurrentSpeed(parseFloat(avgSpeed.toFixed(2)));
        }
      } catch {
        // Continue on error
      }
    }
    
    // Calculate final speed from total data and time
    const totalDuration = (performance.now() - startTime) / 1000;
    const finalSpeed = (totalBytesReceived * 8) / totalDuration / 1000000;
    
    return parseFloat(finalSpeed.toFixed(2));
  };

  const measureUploadSpeed = async (): Promise<number> => {
    const startTime = performance.now();
    let totalBytesUploaded = 0;
    const speedSamples: number[] = [];
    
    // Create reusable test data (2MB chunks)
    const chunkSize = 2000000;
    const testData = new Blob([new ArrayBuffer(chunkSize)]);
    
    // Run upload test for 15 seconds
    while (performance.now() - startTime < TEST_DURATION_MS) {
      const elapsed = performance.now() - startTime;
      const remaining = Math.ceil((TEST_DURATION_MS - elapsed) / 1000);
      setTimeRemaining(remaining);
      setTestProgress(Math.round((elapsed / TEST_DURATION_MS) * 100));
      
      try {
        const chunkStart = performance.now();
        
        // Start multiple parallel uploads for better saturation
        const uploadPromises = Array(2).fill(null).map(() => 
          fetch("https://speed.cloudflare.com/__up", {
            method: "POST",
            body: testData,
            cache: "no-store",
          }).then(() => chunkSize).catch(() => 0)
        );
        
        const results = await Promise.all(uploadPromises);
        const chunkBytesUploaded = results.reduce((a, b) => a + b, 0);
        totalBytesUploaded += chunkBytesUploaded;
        
        const chunkEnd = performance.now();
        const chunkDuration = (chunkEnd - chunkStart) / 1000;
        
        if (chunkDuration > 0 && chunkBytesUploaded > 0) {
          const chunkSpeedMbps = (chunkBytesUploaded * 8) / chunkDuration / 1000000;
          speedSamples.push(chunkSpeedMbps);
          
          // Calculate rolling average of last 5 samples
          const recentSamples = speedSamples.slice(-5);
          const avgSpeed = recentSamples.reduce((a, b) => a + b, 0) / recentSamples.length;
          setCurrentSpeed(parseFloat(avgSpeed.toFixed(2)));
        }
      } catch {
        // Continue on error
      }
    }
    
    // Calculate final speed from total data and time
    const totalDuration = (performance.now() - startTime) / 1000;
    const finalSpeed = (totalBytesUploaded * 8) / totalDuration / 1000000;
    
    return parseFloat(finalSpeed.toFixed(2));
  };

  const runSpeedTest = async () => {
    setIsTesting(true);
    setTestProgress(0);
    setCurrentSpeed(0);
    setTimeRemaining(15);
    setSpeedResults({ download: null, upload: null, ping: null });

    try {
      // Phase 1: Ping Test (15 seconds)
      setTestPhase("ping");
      const ping = await measurePing();
      setSpeedResults(prev => ({ ...prev, ping }));

      // Phase 2: Download Test (15 seconds)
      setTestPhase("download");
      setTestProgress(0);
      setCurrentSpeed(0);
      setTimeRemaining(15);
      const download = await measureDownloadSpeed();
      setSpeedResults(prev => ({ ...prev, download }));

      // Phase 3: Upload Test (15 seconds)
      setTestPhase("upload");
      setTestProgress(0);
      setCurrentSpeed(0);
      setTimeRemaining(15);
      const upload = await measureUploadSpeed();
      setSpeedResults(prev => ({ ...prev, upload }));

      setTestPhase("complete");
    } catch (err) {
      console.error("Speed test failed:", err);
    } finally {
      setIsTesting(false);
      setTestProgress(100);
    }
  };

  const getPhaseLabel = () => {
    switch (testPhase) {
      case "ping": return "Measuring ping latency...";
      case "download": return "Testing download speed...";
      case "upload": return "Testing upload speed...";
      default: return "Click the button to start";
    }
  };

  const getPhaseUnit = () => {
    switch (testPhase) {
      case "ping": return "ms";
      case "download": 
      case "upload": 
        return "Mbps";
      default: return "";
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
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Network & Internet Test
            </h1>
            <p className="text-muted-foreground">
              Comprehensive 15-second tests for accurate ping, download, and upload speeds.
            </p>
          </motion.div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12 flex justify-center"
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

              {/* Results Grid */}
              {(speedResults.download !== null || speedResults.upload !== null || speedResults.ping !== null) && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {/* Ping */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-4 rounded-xl text-center ${
                      testPhase === "ping" && isTesting ? "bg-warning/20 ring-2 ring-warning" : "bg-muted/50"
                    }`}
                  >
                    <Gauge className="h-6 w-6 text-warning mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">
                      {testPhase === "ping" && isTesting ? currentSpeed : (speedResults.ping !== null ? speedResults.ping : "--")}
                    </p>
                    <p className="text-xs text-muted-foreground">Ping (ms)</p>
                  </motion.div>

                  {/* Download */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`p-4 rounded-xl text-center ${
                      testPhase === "download" && isTesting ? "bg-success/20 ring-2 ring-success" : "bg-muted/50"
                    }`}
                  >
                    <ArrowDown className="h-6 w-6 text-success mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">
                      {testPhase === "download" && isTesting ? currentSpeed : (speedResults.download !== null ? speedResults.download : "--")}
                    </p>
                    <p className="text-xs text-muted-foreground">Download (Mbps)</p>
                  </motion.div>

                  {/* Upload */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`p-4 rounded-xl text-center ${
                      testPhase === "upload" && isTesting ? "bg-primary/20 ring-2 ring-primary" : "bg-muted/50"
                    }`}
                  >
                    <ArrowUp className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">
                      {testPhase === "upload" && isTesting ? currentSpeed : (speedResults.upload !== null ? speedResults.upload : "--")}
                    </p>
                    <p className="text-xs text-muted-foreground">Upload (Mbps)</p>
                  </motion.div>
                </div>
              )}

              <div className="text-center mb-8">
                {isTesting ? (
                  <div>
                    <div className="relative w-40 h-40 mx-auto mb-4">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="url(#gradient)"
                          strokeWidth="10"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${testProgress * 4.4} 440`}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="hsl(199, 89%, 48%)" />
                            <stop offset="100%" stopColor="hsl(172, 66%, 50%)" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-foreground">
                          {currentSpeed}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {getPhaseUnit()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                      <Timer className="h-4 w-4" />
                      <span className="font-medium">{timeRemaining}s remaining</span>
                    </div>
                    <p className="text-muted-foreground">{getPhaseLabel()}</p>
                  </div>
                ) : testPhase === "complete" ? (
                  <div className="py-4">
                    <p className="text-success font-semibold">Test Complete!</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total test duration: ~45 seconds
                    </p>
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
                ) : testPhase === "complete" ? (
                  <>Run Again</>
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-2" />
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
              This comprehensive test runs for 15 seconds per phase (ping, download, upload) using Cloudflare's servers with 
              multiple parallel connections to accurately saturate your connection and measure true maximum speeds. 
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
