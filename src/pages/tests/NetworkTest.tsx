import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { SpeedGauge } from "@/components/network/SpeedGauge";
import { SpeedGraph } from "@/components/network/SpeedGraph";
import { 
  ArrowLeft, Wifi, WifiOff, ArrowDown, ArrowUp, Activity, 
  Gauge, Timer, Server, Globe, Zap 
} from "lucide-react";

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
  jitter: number | null;
}

interface NetworkMetadata {
  ip: string | null;
  isp: string | null;
  server: string;
}

const TEST_DURATION_MS = 15000;
const SAMPLE_INTERVAL_MS = 200; // Sample speed every 200ms for smooth updates

const NetworkTest = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [networkMetadata, setNetworkMetadata] = useState<NetworkMetadata>({
    ip: null,
    isp: null,
    server: "Cloudflare",
  });
  const [isTesting, setIsTesting] = useState(false);
  const [testPhase, setTestPhase] = useState<"idle" | "ping" | "download" | "upload" | "complete">("idle");
  const [speedResults, setSpeedResults] = useState<SpeedResults>({ 
    download: null, upload: null, ping: null, jitter: null 
  });
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(15);
  const [testProgress, setTestProgress] = useState(0);
  const [speedHistory, setSpeedHistory] = useState<number[]>([]);
  
  // Refs for streaming measurement
  const bytesReceivedRef = useRef(0);
  const bytesUploadedRef = useRef(0);
  const lastSampleTimeRef = useRef(0);
  const lastBytesRef = useRef(0);
  const isTestingRef = useRef(false);

  // Fetch network metadata
  useEffect(() => {
    const fetchNetworkMetadata = async () => {
      try {
        const response = await fetch("https://speed.cloudflare.com/meta");
        const data = await response.json();
        setNetworkMetadata({
          ip: data.clientIp || null,
          isp: data.asOrganization || null,
          server: "Cloudflare CDN",
        });
      } catch {
        // Keep defaults
      }
    };
    fetchNetworkMetadata();
  }, []);

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

  // Streaming speed sampler - calculates instantaneous speed from byte deltas
  const startSpeedSampler = useCallback((type: 'download' | 'upload') => {
    const bytesRef = type === 'download' ? bytesReceivedRef : bytesUploadedRef;
    lastSampleTimeRef.current = performance.now();
    lastBytesRef.current = 0;
    
    const sampleSpeed = () => {
      if (!isTestingRef.current) return;
      
      const now = performance.now();
      const timeDelta = (now - lastSampleTimeRef.current) / 1000;
      const bytesDelta = bytesRef.current - lastBytesRef.current;
      
      if (timeDelta > 0 && bytesDelta > 0) {
        const instantSpeed = (bytesDelta * 8) / timeDelta / 1000000; // Mbps
        
        // Use exponential moving average for smooth transitions
        setCurrentSpeed(prev => {
          const smoothingFactor = 0.3; // Lower = smoother, higher = more responsive
          return prev === 0 ? instantSpeed : prev * (1 - smoothingFactor) + instantSpeed * smoothingFactor;
        });
        
        setSpeedHistory(prev => [...prev, instantSpeed]);
      }
      
      lastSampleTimeRef.current = now;
      lastBytesRef.current = bytesRef.current;
      
      if (isTestingRef.current) {
        setTimeout(sampleSpeed, SAMPLE_INTERVAL_MS);
      }
    };
    
    setTimeout(sampleSpeed, SAMPLE_INTERVAL_MS);
  }, []);

  const measurePing = async (): Promise<{ ping: number; jitter: number }> => {
    const testUrl = "https://speed.cloudflare.com/__down?bytes=1";
    const pings: number[] = [];
    const startTime = performance.now();
    
    setSpeedHistory([]);
    
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
        
        // Smooth ping display using EMA
        const recentPings = pings.slice(-5);
        const avgPing = recentPings.reduce((a, b) => a + b, 0) / recentPings.length;
        setCurrentSpeed(prev => prev === 0 ? avgPing : prev * 0.7 + avgPing * 0.3);
        setSpeedHistory(prev => [...prev, Math.round(avgPing)]);
      } catch {
        // Skip failed pings
      }
      
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    if (pings.length === 0) return { ping: 0, jitter: 0 };
    
    const avgPing = pings.reduce((a, b) => a + b, 0) / pings.length;
    const squaredDiffs = pings.map(p => Math.pow(p - avgPing, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
    const jitter = Math.sqrt(avgSquaredDiff);
    
    pings.sort((a, b) => a - b);
    const trimCount = Math.floor(pings.length * 0.1);
    const trimmedPings = pings.slice(trimCount, pings.length - trimCount);
    const ping = Math.round(trimmedPings.reduce((a, b) => a + b, 0) / trimmedPings.length);
    
    return { ping, jitter: Math.round(jitter * 10) / 10 };
  };

  const measureDownloadSpeed = async (): Promise<number> => {
    const startTime = performance.now();
    bytesReceivedRef.current = 0;
    isTestingRef.current = true;
    
    setSpeedHistory([]);
    startSpeedSampler('download');
    
    const chunkSize = 25000000; // 25MB chunks for better saturation
    
    // Progress updater
    const progressInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const remaining = Math.ceil((TEST_DURATION_MS - elapsed) / 1000);
      setTimeRemaining(Math.max(0, remaining));
      setTestProgress(Math.min(100, Math.round((elapsed / TEST_DURATION_MS) * 100)));
    }, 100);
    
    // Continuous download loop with streaming reads
    const downloadLoop = async () => {
      while (performance.now() - startTime < TEST_DURATION_MS && isTestingRef.current) {
        try {
          // Start multiple parallel streams
          const streams = Array(4).fill(null).map(async () => {
            const response = await fetch(
              `https://speed.cloudflare.com/__down?bytes=${chunkSize}`, 
              { cache: "no-store" }
            );
            const reader = response.body?.getReader();
            if (!reader) return;
            
            // Stream read for real-time byte counting
            while (true) {
              const { done, value } = await reader.read();
              if (done || !isTestingRef.current) break;
              bytesReceivedRef.current += value.length;
            }
          });
          
          await Promise.all(streams);
        } catch {
          // Continue on error
        }
      }
    };
    
    await downloadLoop();
    
    isTestingRef.current = false;
    clearInterval(progressInterval);
    
    const totalDuration = (performance.now() - startTime) / 1000;
    const finalSpeed = (bytesReceivedRef.current * 8) / totalDuration / 1000000;
    
    return parseFloat(finalSpeed.toFixed(2));
  };

  const measureUploadSpeed = async (): Promise<number> => {
    const startTime = performance.now();
    bytesUploadedRef.current = 0;
    isTestingRef.current = true;
    
    setSpeedHistory([]);
    startSpeedSampler('upload');
    
    // Create test data chunks
    const chunkSize = 2000000; // 2MB chunks
    const testData = new Blob([new ArrayBuffer(chunkSize)]);
    
    // Progress updater
    const progressInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const remaining = Math.ceil((TEST_DURATION_MS - elapsed) / 1000);
      setTimeRemaining(Math.max(0, remaining));
      setTestProgress(Math.min(100, Math.round((elapsed / TEST_DURATION_MS) * 100)));
    }, 100);
    
    // Continuous upload loop
    const uploadLoop = async () => {
      while (performance.now() - startTime < TEST_DURATION_MS && isTestingRef.current) {
        try {
          // Start multiple parallel uploads
          const uploads = Array(3).fill(null).map(async () => {
            await fetch("https://speed.cloudflare.com/__up", {
              method: "POST",
              body: testData,
              cache: "no-store",
            });
            bytesUploadedRef.current += chunkSize;
          });
          
          await Promise.all(uploads);
        } catch {
          // Continue on error
        }
      }
    };
    
    await uploadLoop();
    
    isTestingRef.current = false;
    clearInterval(progressInterval);
    
    const totalDuration = (performance.now() - startTime) / 1000;
    const finalSpeed = (bytesUploadedRef.current * 8) / totalDuration / 1000000;
    
    return parseFloat(finalSpeed.toFixed(2));
  };

  const runSpeedTest = async () => {
    setIsTesting(true);
    setTestProgress(0);
    setCurrentSpeed(0);
    setTimeRemaining(15);
    setSpeedHistory([]);
    setSpeedResults({ download: null, upload: null, ping: null, jitter: null });

    try {
      // Phase 1: Ping Test
      setTestPhase("ping");
      const { ping, jitter } = await measurePing();
      setSpeedResults(prev => ({ ...prev, ping, jitter }));

      // Brief pause between phases for smooth transition
      await new Promise(resolve => setTimeout(resolve, 500));

      // Phase 2: Download Test
      setTestPhase("download");
      setTestProgress(0);
      setCurrentSpeed(0);
      setTimeRemaining(15);
      const download = await measureDownloadSpeed();
      setSpeedResults(prev => ({ ...prev, download }));

      await new Promise(resolve => setTimeout(resolve, 500));

      // Phase 3: Upload Test
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
      isTestingRef.current = false;
      setTestProgress(100);
    }
  };

  const getPhaseColor = () => {
    switch (testPhase) {
      case "ping": return "hsl(38, 92%, 50%)";
      case "download": return "hsl(142, 76%, 36%)";
      case "upload": return "hsl(199, 89%, 48%)";
      default: return "hsl(215, 16%, 47%)";
    }
  };

  const getMaxGaugeValue = () => {
    switch (testPhase) {
      case "ping": return 200;
      case "download": 
      case "upload": 
        return Math.max(currentSpeed * 1.3, 100);
      default: return 100;
    }
  };

  const getPhaseUnit = () => {
    switch (testPhase) {
      case "ping": return "ms";
      default: return "Mbps";
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
              Network Speed Test
            </h1>
            <p className="text-muted-foreground">
              Comprehensive 15-second tests for accurate speed measurements
            </p>
          </motion.div>

          {/* Main Test Area */}
          <div className="max-w-4xl mx-auto">
            {/* Central Gauge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-3xl p-8 mb-8"
            >
              <div className="flex flex-col items-center">
                {/* Speed Gauge with spring animation */}
                <SpeedGauge
                  value={currentSpeed}
                  maxValue={getMaxGaugeValue()}
                  unit={getPhaseUnit()}
                  phase={testPhase}
                  progress={testProgress}
                />

                {/* Time Remaining */}
                <AnimatePresence>
                  {isTesting && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 mt-4 text-muted-foreground"
                    >
                      <Timer className="h-4 w-4" />
                      <span className="font-medium tabular-nums">{timeRemaining}s remaining</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Start Button */}
                <Button
                  size="lg"
                  onClick={runSpeedTest}
                  disabled={isTesting || !networkInfo?.online}
                  className="mt-6 h-14 px-10 text-lg font-semibold gap-3"
                >
                  <Activity className="h-5 w-5" />
                  {isTesting ? "Testing..." : testPhase === "complete" ? "Test Again" : "Start Test"}
                </Button>
              </div>

              {/* Real-time Graph */}
              <AnimatePresence>
                {isTesting && speedHistory.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8"
                  >
                    <SpeedGraph
                      data={speedHistory}
                      maxDataPoints={75}
                      color={getPhaseColor()}
                      label={`Real-time ${testPhase === "ping" ? "Latency" : "Speed"}`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Results Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {/* Ping */}
              <div className={`glass-card rounded-2xl p-6 text-center transition-all duration-500 ${
                testPhase === "ping" && isTesting ? "ring-2 ring-warning shadow-lg shadow-warning/20" : ""
              }`}>
                <Gauge className="h-8 w-8 text-warning mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground mb-1 tabular-nums">
                  {testPhase === "ping" && isTesting 
                    ? Math.round(currentSpeed)
                    : (speedResults.ping !== null ? speedResults.ping : "--")}
                </p>
                <p className="text-sm text-muted-foreground">Ping (ms)</p>
              </div>

              {/* Jitter */}
              <div className={`glass-card rounded-2xl p-6 text-center transition-all duration-500 ${
                testPhase === "ping" && isTesting ? "ring-2 ring-warning/50 shadow-lg shadow-warning/10" : ""
              }`}>
                <Zap className="h-8 w-8 text-warning/70 mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground mb-1 tabular-nums">
                  {speedResults.jitter !== null ? speedResults.jitter : "--"}
                </p>
                <p className="text-sm text-muted-foreground">Jitter (ms)</p>
              </div>

              {/* Download */}
              <div className={`glass-card rounded-2xl p-6 text-center transition-all duration-500 ${
                testPhase === "download" && isTesting ? "ring-2 ring-success shadow-lg shadow-success/20" : ""
              }`}>
                <ArrowDown className="h-8 w-8 text-success mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground mb-1 tabular-nums">
                  {testPhase === "download" && isTesting 
                    ? currentSpeed.toFixed(1)
                    : (speedResults.download !== null ? speedResults.download : "--")}
                </p>
                <p className="text-sm text-muted-foreground">Download (Mbps)</p>
              </div>

              {/* Upload */}
              <div className={`glass-card rounded-2xl p-6 text-center transition-all duration-500 ${
                testPhase === "upload" && isTesting ? "ring-2 ring-primary shadow-lg shadow-primary/20" : ""
              }`}>
                <ArrowUp className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground mb-1 tabular-nums">
                  {testPhase === "upload" && isTesting 
                    ? currentSpeed.toFixed(1)
                    : (speedResults.upload !== null ? speedResults.upload : "--")}
                </p>
                <p className="text-sm text-muted-foreground">Upload (Mbps)</p>
              </div>
            </motion.div>

            {/* Network Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Network Information
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    {networkInfo?.online ? (
                      <Wifi className="h-4 w-4 text-success" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-destructive" />
                    )}
                    <p className="text-xs text-muted-foreground">Status</p>
                  </div>
                  <p className={`font-semibold ${networkInfo?.online ? "text-success" : "text-destructive"}`}>
                    {networkInfo?.online ? "Connected" : "Offline"}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">IP Address</p>
                  </div>
                  <p className="font-semibold text-foreground truncate text-sm">
                    {networkMetadata.ip || "Detecting..."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">ISP</p>
                  </div>
                  <p className="font-semibold text-foreground truncate text-sm">
                    {networkMetadata.isp || "Detecting..."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Test Server</p>
                  </div>
                  <p className="font-semibold text-foreground text-sm">
                    {networkMetadata.server}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10"
            >
              <h3 className="font-semibold text-foreground mb-3">About This Test</h3>
              <p className="text-sm text-muted-foreground">
                This test uses <strong>streaming measurement</strong> with real-time sampling every 200ms 
                for smooth, accurate readings. Multiple parallel connections saturate your bandwidth while 
                <strong> exponential moving averages</strong> provide fluid gauge animation.
              </p>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NetworkTest;
