import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { SpeedGauge } from "@/components/network/SpeedGauge";
import { SpeedGraph } from "@/components/network/SpeedGraph";
import { SpeedTestResults } from "@/components/network/SpeedTestResults";
import { SEOHead, structuredData } from "@/components/SEOHead";
import { RelatedArticles } from "@/components/internal-links/RelatedArticles";
import { RelatedTests } from "@/components/internal-links/RelatedTests";
import { 
  ArrowLeft, Wifi, WifiOff, ArrowDown, ArrowUp, Activity, 
  Gauge, Timer, Server, Globe, Zap, Usb, Monitor, Keyboard
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
  
  const isTestingRef = useRef(false);
  const speedSamplesRef = useRef<number[]>([]);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const testStartTimeRef = useRef<number>(0);

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

  // Accurate speed measurement using parallel connections to saturate bandwidth
  const measureSpeed = useCallback(async (
    type: 'download' | 'upload',
    onProgress: (speed: number, progress: number, remaining: number) => void,
    onTimerUpdate: (remaining: number, progress: number) => void
  ): Promise<number> => {
    const testStartTime = performance.now();
    speedSamplesRef.current = [];
    isTestingRef.current = true;
    
    // Use smaller chunk sizes for more reliable connections
    const PARALLEL_CONNECTIONS = 4;
    const CHUNK_SIZE = type === 'download' ? 2000000 : 500000; // 2MB down, 500KB up
    
    let totalBytes = 0;
    let successfulRequests = 0;
    let failedRequests = 0;
    
    // Start timer update interval for smooth countdown
    const timerInterval = setInterval(() => {
      const elapsed = performance.now() - testStartTime;
      const remaining = Math.max(0, Math.ceil((TEST_DURATION_MS - elapsed) / 1000));
      const progress = Math.min(100, Math.round((elapsed / TEST_DURATION_MS) * 100));
      onTimerUpdate(remaining, progress);
    }, 100);
    
    // Quick connection warmup with retry
    let warmupSuccess = false;
    for (let attempt = 0; attempt < 3 && !warmupSuccess; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        if (type === 'download') {
          const response = await fetch(`https://speed.cloudflare.com/__down?bytes=50000`, { 
            cache: "no-store",
            signal: controller.signal
          });
          await response.arrayBuffer();
        } else {
          await fetch("https://speed.cloudflare.com/__up", {
            method: "POST",
            body: new ArrayBuffer(50000),
            cache: "no-store",
            signal: controller.signal
          });
        }
        clearTimeout(timeoutId);
        warmupSuccess = true;
      } catch (e) {
        console.warn(`Warmup attempt ${attempt + 1} failed:`, e);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    // Reset measurement after warmup
    totalBytes = 0;
    const measurementStartTime = performance.now();
    
    // Main measurement loop with parallel connections
    while (performance.now() - testStartTime < TEST_DURATION_MS && isTestingRef.current) {
      const elapsed = performance.now() - testStartTime;
      const remaining = Math.ceil((TEST_DURATION_MS - elapsed) / 1000);
      const progress = Math.round((elapsed / TEST_DURATION_MS) * 100);
      
      try {
        // Launch parallel requests with individual timeouts
        const promises: Promise<number>[] = [];
        
        for (let i = 0; i < PARALLEL_CONNECTIONS; i++) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          
          if (type === 'download') {
            promises.push(
              fetch(`https://speed.cloudflare.com/__down?bytes=${CHUNK_SIZE}`, { 
                cache: "no-store",
                signal: controller.signal
              }).then(async (response) => {
                clearTimeout(timeoutId);
                const buffer = await response.arrayBuffer();
                successfulRequests++;
                return buffer.byteLength;
              }).catch((err) => {
                clearTimeout(timeoutId);
                failedRequests++;
                console.warn("Download chunk failed:", err.message);
                return 0;
              })
            );
          } else {
            const data = new ArrayBuffer(CHUNK_SIZE);
            promises.push(
              fetch("https://speed.cloudflare.com/__up", {
                method: "POST",
                body: data,
                cache: "no-store",
                signal: controller.signal
              }).then(() => {
                clearTimeout(timeoutId);
                successfulRequests++;
                return CHUNK_SIZE;
              }).catch((err) => {
                clearTimeout(timeoutId);
                failedRequests++;
                console.warn("Upload chunk failed:", err.message);
                return 0;
              })
            );
          }
        }
        
        // Wait for all parallel requests
        const results = await Promise.all(promises);
        const batchBytes = results.reduce((sum, bytes) => sum + bytes, 0);
        totalBytes += batchBytes;
        
        // Calculate current speed based on total bytes and elapsed time
        const measurementDuration = (performance.now() - measurementStartTime) / 1000;
        if (measurementDuration > 0.05 && totalBytes > 0) {
          const currentSpeedMbps = (totalBytes * 8) / measurementDuration / 1000000;
          speedSamplesRef.current.push(currentSpeedMbps);
          onProgress(currentSpeedMbps, progress, remaining);
        }
        
      } catch (error) {
        console.error(`${type} measurement error:`, error);
      }
    }
    
    clearInterval(timerInterval);
    isTestingRef.current = false;
    
    console.log(`${type} test complete: ${successfulRequests} successful, ${failedRequests} failed`);
    
    // Calculate final speed - use median of last samples for stability
    if (speedSamplesRef.current.length === 0) {
      console.warn(`No ${type} samples collected`);
      return 0;
    }
    
    // Use last 5 samples and take median for final result
    const recentSamples = speedSamplesRef.current.slice(-5);
    const sortedRecent = [...recentSamples].sort((a, b) => a - b);
    const medianIndex = Math.floor(sortedRecent.length / 2);
    const finalSpeed = sortedRecent[medianIndex];
    
    return parseFloat(finalSpeed.toFixed(2));
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

  // Timer update callback for measureSpeed
  const handleTimerUpdate = useCallback((remaining: number, progress: number) => {
    setTimeRemaining(remaining);
    setTestProgress(progress);
  }, []);

  const runSpeedTest = async () => {
    setIsTesting(true);
    setTestProgress(0);
    setCurrentSpeed(0);
    setTimeRemaining(15);
    setSpeedHistory([]);
    setSpeedResults({ download: null, upload: null, ping: null, jitter: null });

    try {
      // Phase 1: Download Test
      setTestPhase("download");
      setTimeRemaining(15);
      setTestProgress(0);
      const download = await measureSpeed('download', (speed) => {
        setCurrentSpeed(speed);
        setSpeedHistory(prev => [...prev, speed]);
      }, handleTimerUpdate);
      setSpeedResults(prev => ({ ...prev, download }));

      await new Promise(resolve => setTimeout(resolve, 500));

      // Phase 2: Upload Test
      setTestPhase("upload");
      setCurrentSpeed(0);
      setSpeedHistory([]);
      setTimeRemaining(15);
      setTestProgress(0);
      
      const upload = await measureSpeed('upload', (speed) => {
        setCurrentSpeed(speed);
        setSpeedHistory(prev => [...prev, speed]);
      }, handleTimerUpdate);
      setSpeedResults(prev => ({ ...prev, upload }));

      await new Promise(resolve => setTimeout(resolve, 500));

      // Phase 3: Ping Test
      setTestPhase("ping");
      setCurrentSpeed(0);
      setSpeedHistory([]);
      setTimeRemaining(15);
      setTestProgress(0);
      
      const { ping, jitter } = await measurePing();
      setSpeedResults(prev => ({ ...prev, ping, jitter }));

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
      <SEOHead
        title="Internet Speed Test - Check Download & Upload Free 2026"
        description="Free internet speed test! Measure download speed, upload speed & ping latency. Accurate 15-second test using Cloudflare's global network. Test WiFi & network speed."
        keywords="speed test, internet speed test, wifi speed test, network speed test, download speed test, upload speed test, ping test, bandwidth test, connection speed test, internet test"
        canonicalPath="/test/network"
        structuredData={structuredData.howTo(
          "How to Test Your Internet Speed",
          "Use our free speed test to measure your download, upload, and ping.",
          [
            { name: "Click Start Test", text: "Begin the 15-second speed measurement" },
            { name: "Wait for download test", text: "Measure your download speed in Mbps" },
            { name: "Wait for upload test", text: "Measure your upload speed in Mbps" },
            { name: "View results", text: "See download, upload, ping, and jitter results" },
          ]
        )}
      />
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
              Accurate 15-second tests using Cloudflare's global network
            </p>
          </motion.div>

          {/* Main Test Area */}
          <div className="max-w-4xl mx-auto">
            {/* Show Results View when complete, otherwise show Gauge */}
            <AnimatePresence mode="wait">
              {testPhase === "complete" && speedResults.download !== null ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <SpeedTestResults
                    download={speedResults.download || 0}
                    upload={speedResults.upload || 0}
                    ping={speedResults.ping || 0}
                    jitter={speedResults.jitter || 0}
                    networkMetadata={networkMetadata}
                    onTestAgain={runSpeedTest}
                    isOnline={networkInfo?.online ?? false}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="gauge"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card rounded-3xl p-8 mb-8"
                >
                  <div className="flex flex-col items-center">
                    <SpeedGauge
                      value={currentSpeed}
                      maxValue={getMaxGaugeValue()}
                      unit={getPhaseUnit()}
                      phase={testPhase}
                      progress={testProgress}
                    />

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

                    <Button
                      size="lg"
                      onClick={runSpeedTest}
                      disabled={isTesting || !networkInfo?.online}
                      className="mt-6 h-14 px-10 text-lg font-semibold gap-3"
                    >
                      <Activity className="h-5 w-5" />
                      {isTesting ? "Testing..." : "Start Test"}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {isTesting && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-8"
                      >
                        <SpeedGraph
                          data={speedHistory.length > 0 ? speedHistory : [0]}
                          maxDataPoints={75}
                          color={getPhaseColor()}
                          label={`Real-time ${testPhase === "ping" ? "Latency" : "Speed"}`}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Grid - only show during testing */}
            <AnimatePresence>
              {isTesting && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                  <div className={`glass-card rounded-2xl p-6 text-center transition-all duration-500 ${
                    testPhase === "download" ? "ring-2 ring-success shadow-lg shadow-success/20" : ""
                  }`}>
                    <ArrowDown className="h-8 w-8 text-success mx-auto mb-3" />
                    <p className="text-3xl font-bold text-foreground mb-1 tabular-nums">
                      {testPhase === "download" 
                        ? currentSpeed.toFixed(1)
                        : (speedResults.download !== null ? speedResults.download : "--")}
                    </p>
                    <p className="text-sm text-muted-foreground">Download (Mbps)</p>
                  </div>

                  <div className={`glass-card rounded-2xl p-6 text-center transition-all duration-500 ${
                    testPhase === "upload" ? "ring-2 ring-primary shadow-lg shadow-primary/20" : ""
                  }`}>
                    <ArrowUp className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="text-3xl font-bold text-foreground mb-1 tabular-nums">
                      {testPhase === "upload" 
                        ? currentSpeed.toFixed(1)
                        : (speedResults.upload !== null ? speedResults.upload : "--")}
                    </p>
                    <p className="text-sm text-muted-foreground">Upload (Mbps)</p>
                  </div>

                  <div className={`glass-card rounded-2xl p-6 text-center transition-all duration-500 ${
                    testPhase === "ping" ? "ring-2 ring-warning shadow-lg shadow-warning/20" : ""
                  }`}>
                    <Gauge className="h-8 w-8 text-warning mx-auto mb-3" />
                    <p className="text-3xl font-bold text-foreground mb-1 tabular-nums">
                      {testPhase === "ping" 
                        ? Math.round(currentSpeed)
                        : (speedResults.ping !== null ? speedResults.ping : "--")}
                    </p>
                    <p className="text-sm text-muted-foreground">Ping (ms)</p>
                  </div>

                  <div className={`glass-card rounded-2xl p-6 text-center transition-all duration-500 ${
                    testPhase === "ping" ? "ring-2 ring-warning/50 shadow-lg shadow-warning/10" : ""
                  }`}>
                    <Zap className="h-8 w-8 text-warning/70 mx-auto mb-3" />
                    <p className="text-3xl font-bold text-foreground mb-1 tabular-nums">
                      {speedResults.jitter !== null ? speedResults.jitter : "--"}
                    </p>
                    <p className="text-sm text-muted-foreground">Jitter (ms)</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                This test uses <strong>adaptive file sizing</strong> to accurately measure your connection. 
                It automatically increases request sizes until your bandwidth is saturated, then calculates 
                the <strong>90th percentile</strong> speed for accurate results matching professional tools.
              </p>
            </motion.div>

            <RelatedArticles articles={[
              { title: "Used Laptop Buying Guide: How to Test Hardware Before You Buy", slug: "what-to-check-buying-used-laptop", excerpt: "Learn how to test the screen, keyboard, speakers, and ports before buying a used laptop." },
            ]} />

            <RelatedTests tests={[
              { title: "Ports Test", path: "/test/ports", icon: Usb, description: "Check USB & ports" },
              { title: "Display Test", path: "/test/display", icon: Monitor, description: "Check for dead pixels" },
              { title: "Keyboard Test", path: "/test/keyboard", icon: Keyboard, description: "Test all keys" },
            ]} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NetworkTest;
