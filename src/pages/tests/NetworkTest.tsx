import { useState, useEffect, useRef } from "react";
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
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch network metadata (IP and ISP)
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
        
        const recentPings = pings.slice(-5);
        const avgPing = recentPings.reduce((a, b) => a + b, 0) / recentPings.length;
        setCurrentSpeed(Math.round(avgPing));
        setSpeedHistory(prev => [...prev, Math.round(avgPing)]);
      } catch {
        // Skip failed pings
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    if (pings.length === 0) return { ping: 0, jitter: 0 };
    
    // Calculate jitter (standard deviation of ping times)
    const avgPing = pings.reduce((a, b) => a + b, 0) / pings.length;
    const squaredDiffs = pings.map(p => Math.pow(p - avgPing, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
    const jitter = Math.sqrt(avgSquaredDiff);
    
    // Return average ping, excluding top and bottom 10%
    pings.sort((a, b) => a - b);
    const trimCount = Math.floor(pings.length * 0.1);
    const trimmedPings = pings.slice(trimCount, pings.length - trimCount);
    const ping = Math.round(trimmedPings.reduce((a, b) => a + b, 0) / trimmedPings.length);
    
    return { ping, jitter: Math.round(jitter * 10) / 10 };
  };

  const measureDownloadSpeed = async (): Promise<number> => {
    const startTime = performance.now();
    let totalBytesReceived = 0;
    const speedSamples: number[] = [];
    const chunkSize = 10000000;
    
    setSpeedHistory([]);
    
    while (performance.now() - startTime < TEST_DURATION_MS) {
      const elapsed = performance.now() - startTime;
      const remaining = Math.ceil((TEST_DURATION_MS - elapsed) / 1000);
      setTimeRemaining(remaining);
      setTestProgress(Math.round((elapsed / TEST_DURATION_MS) * 100));
      
      try {
        abortControllerRef.current = new AbortController();
        const chunkStart = performance.now();
        
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
          
          const recentSamples = speedSamples.slice(-5);
          const avgSpeed = recentSamples.reduce((a, b) => a + b, 0) / recentSamples.length;
          setCurrentSpeed(parseFloat(avgSpeed.toFixed(2)));
          setSpeedHistory(prev => [...prev, parseFloat(avgSpeed.toFixed(2))]);
        }
      } catch {
        // Continue on error
      }
    }
    
    const totalDuration = (performance.now() - startTime) / 1000;
    const finalSpeed = (totalBytesReceived * 8) / totalDuration / 1000000;
    
    return parseFloat(finalSpeed.toFixed(2));
  };

  const measureUploadSpeed = async (): Promise<number> => {
    const startTime = performance.now();
    let totalBytesUploaded = 0;
    const speedSamples: number[] = [];
    const chunkSize = 2000000;
    const testData = new Blob([new ArrayBuffer(chunkSize)]);
    
    setSpeedHistory([]);
    
    while (performance.now() - startTime < TEST_DURATION_MS) {
      const elapsed = performance.now() - startTime;
      const remaining = Math.ceil((TEST_DURATION_MS - elapsed) / 1000);
      setTimeRemaining(remaining);
      setTestProgress(Math.round((elapsed / TEST_DURATION_MS) * 100));
      
      try {
        const chunkStart = performance.now();
        
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
          
          const recentSamples = speedSamples.slice(-5);
          const avgSpeed = recentSamples.reduce((a, b) => a + b, 0) / recentSamples.length;
          setCurrentSpeed(parseFloat(avgSpeed.toFixed(2)));
          setSpeedHistory(prev => [...prev, parseFloat(avgSpeed.toFixed(2))]);
        }
      } catch {
        // Continue on error
      }
    }
    
    const totalDuration = (performance.now() - startTime) / 1000;
    const finalSpeed = (totalBytesUploaded * 8) / totalDuration / 1000000;
    
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

      // Phase 2: Download Test
      setTestPhase("download");
      setTestProgress(0);
      setCurrentSpeed(0);
      setTimeRemaining(15);
      const download = await measureDownloadSpeed();
      setSpeedResults(prev => ({ ...prev, download }));

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
        return Math.max(currentSpeed * 1.5, 100);
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
                {/* Speed Gauge */}
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
                      <span className="font-medium">{timeRemaining}s remaining</span>
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
                {isTesting && speedHistory.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8"
                  >
                    <SpeedGraph
                      data={speedHistory}
                      color={getPhaseColor()}
                      label={`Real-time ${testPhase === "ping" ? "Ping" : "Speed"}`}
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
              <div className={`glass-card rounded-2xl p-6 text-center transition-all duration-300 ${
                testPhase === "ping" && isTesting ? "ring-2 ring-warning shadow-lg" : ""
              }`}>
                <Gauge className="h-8 w-8 text-warning mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground mb-1">
                  {testPhase === "ping" && isTesting 
                    ? currentSpeed 
                    : (speedResults.ping !== null ? speedResults.ping : "--")}
                </p>
                <p className="text-sm text-muted-foreground">Ping (ms)</p>
              </div>

              {/* Jitter */}
              <div className={`glass-card rounded-2xl p-6 text-center transition-all duration-300 ${
                testPhase === "ping" && isTesting ? "ring-2 ring-warning/50 shadow-lg" : ""
              }`}>
                <Zap className="h-8 w-8 text-warning/70 mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground mb-1">
                  {speedResults.jitter !== null ? speedResults.jitter : "--"}
                </p>
                <p className="text-sm text-muted-foreground">Jitter (ms)</p>
              </div>

              {/* Download */}
              <div className={`glass-card rounded-2xl p-6 text-center transition-all duration-300 ${
                testPhase === "download" && isTesting ? "ring-2 ring-success shadow-lg" : ""
              }`}>
                <ArrowDown className="h-8 w-8 text-success mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground mb-1">
                  {testPhase === "download" && isTesting 
                    ? currentSpeed 
                    : (speedResults.download !== null ? speedResults.download : "--")}
                </p>
                <p className="text-sm text-muted-foreground">Download (Mbps)</p>
              </div>

              {/* Upload */}
              <div className={`glass-card rounded-2xl p-6 text-center transition-all duration-300 ${
                testPhase === "upload" && isTesting ? "ring-2 ring-primary shadow-lg" : ""
              }`}>
                <ArrowUp className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground mb-1">
                  {testPhase === "upload" && isTesting 
                    ? currentSpeed 
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
                {/* Connection Status */}
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

                {/* IP Address */}
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">IP Address</p>
                  </div>
                  <p className="font-semibold text-foreground truncate">
                    {networkMetadata.ip || "Detecting..."}
                  </p>
                </div>

                {/* ISP */}
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">ISP</p>
                  </div>
                  <p className="font-semibold text-foreground truncate">
                    {networkMetadata.isp || "Detecting..."}
                  </p>
                </div>

                {/* Server */}
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Test Server</p>
                  </div>
                  <p className="font-semibold text-foreground">
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
                This test measures <strong>Ping</strong> (latency), <strong>Jitter</strong> (ping variation), 
                <strong> Download</strong>, and <strong>Upload</strong> speeds over 15 seconds each using 
                Cloudflare's global CDN with parallel connections for accurate saturation testing.
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
