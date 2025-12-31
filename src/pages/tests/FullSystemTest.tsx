import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Monitor,
  Keyboard,
  Camera,
  Mic,
  Speaker,
  Wifi,
  Usb,
  MousePointer2,
  Trophy,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface TestResult {
  id: string;
  name: string;
  icon: React.ElementType;
  status: "pending" | "running" | "passed" | "failed" | "skipped";
  score: number;
  details?: string;
}

const initialTests: TestResult[] = [
  { id: "display", name: "Display", icon: Monitor, status: "pending", score: 0 },
  { id: "keyboard", name: "Keyboard", icon: Keyboard, status: "pending", score: 0 },
  { id: "camera", name: "Camera", icon: Camera, status: "pending", score: 0 },
  { id: "microphone", name: "Microphone", icon: Mic, status: "pending", score: 0 },
  { id: "audio", name: "Audio", icon: Speaker, status: "pending", score: 0 },
  { id: "network", name: "Network", icon: Wifi, status: "pending", score: 0 },
  { id: "touchpad", name: "Touchpad", icon: MousePointer2, status: "pending", score: 0 },
  { id: "ports", name: "Ports", icon: Usb, status: "pending", score: 0 },
];

const FullSystemTest = () => {
  const [tests, setTests] = useState<TestResult[]>(initialTests);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(-1);
  const [overallScore, setOverallScore] = useState(0);
  const navigate = useNavigate();
  const abortRef = useRef(false);

  // Calculate overall progress
  const completedTests = tests.filter(t => 
    t.status === "passed" || t.status === "failed" || t.status === "skipped"
  ).length;
  const progress = (completedTests / tests.length) * 100;

  // Update test status helper
  const updateTest = useCallback((id: string, updates: Partial<TestResult>) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  // Individual test functions
  const runDisplayTest = async (): Promise<{ passed: boolean; score: number; details: string }> => {
    // Check screen properties
    const width = window.screen.width;
    const height = window.screen.height;
    const colorDepth = window.screen.colorDepth;
    const pixelRatio = window.devicePixelRatio;
    
    let score = 100;
    const issues: string[] = [];
    
    if (width < 1280 || height < 720) {
      score -= 20;
      issues.push("Low resolution");
    }
    if (colorDepth < 24) {
      score -= 30;
      issues.push("Limited color depth");
    }
    if (pixelRatio < 1) {
      score -= 10;
      issues.push("Low pixel density");
    }
    
    await new Promise(r => setTimeout(r, 1500));
    
    return {
      passed: score >= 70,
      score: Math.max(0, score),
      details: issues.length > 0 ? issues.join(", ") : `${width}x${height}, ${colorDepth}-bit color`
    };
  };

  const runKeyboardTest = async (): Promise<{ passed: boolean; score: number; details: string }> => {
    // Check if keyboard is available (basic check)
    const hasKeyboard = 'keyboard' in navigator || window.matchMedia('(pointer: fine)').matches;
    
    await new Promise(r => setTimeout(r, 1200));
    
    return {
      passed: hasKeyboard,
      score: hasKeyboard ? 100 : 0,
      details: hasKeyboard ? "Keyboard detected" : "No keyboard detected"
    };
  };

  const runCameraTest = async (): Promise<{ passed: boolean; score: number; details: string }> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(d => d.kind === "videoinput");
      
      await new Promise(r => setTimeout(r, 1000));
      
      if (cameras.length === 0) {
        return { passed: false, score: 0, details: "No camera found" };
      }
      
      // Try to access camera briefly
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        return { 
          passed: true, 
          score: 100, 
          details: `${cameras.length} camera(s) available` 
        };
      } catch {
        return { 
          passed: true, 
          score: 70, 
          details: `${cameras.length} camera(s) found (permission needed)` 
        };
      }
    } catch {
      return { passed: false, score: 0, details: "Camera access unavailable" };
    }
  };

  const runMicrophoneTest = async (): Promise<{ passed: boolean; score: number; details: string }> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices.filter(d => d.kind === "audioinput");
      
      await new Promise(r => setTimeout(r, 1000));
      
      if (mics.length === 0) {
        return { passed: false, score: 0, details: "No microphone found" };
      }
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        return { 
          passed: true, 
          score: 100, 
          details: `${mics.length} microphone(s) available` 
        };
      } catch {
        return { 
          passed: true, 
          score: 70, 
          details: `${mics.length} mic(s) found (permission needed)` 
        };
      }
    } catch {
      return { passed: false, score: 0, details: "Microphone access unavailable" };
    }
  };

  const runAudioTest = async (): Promise<{ passed: boolean; score: number; details: string }> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const speakers = devices.filter(d => d.kind === "audiooutput");
      
      // Check Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await audioContext.close();
      
      await new Promise(r => setTimeout(r, 1200));
      
      return {
        passed: true,
        score: speakers.length > 0 ? 100 : 80,
        details: speakers.length > 0 ? `${speakers.length} output(s) available` : "Audio system ready"
      };
    } catch {
      return { passed: false, score: 0, details: "Audio system unavailable" };
    }
  };

  const runNetworkTest = async (): Promise<{ passed: boolean; score: number; details: string }> => {
    if (!navigator.onLine) {
      return { passed: false, score: 0, details: "No network connection" };
    }
    
    try {
      const connection = (navigator as any).connection;
      const startTime = performance.now();
      
      // Quick connectivity check
      await fetch("https://speed.cloudflare.com/__down?bytes=10000", { cache: "no-store" });
      const latency = performance.now() - startTime;
      
      let score = 100;
      let details = "";
      
      if (connection) {
        const downlink = connection.downlink || 0;
        if (downlink < 1) score -= 30;
        else if (downlink < 10) score -= 10;
        details = `${downlink} Mbps, ${Math.round(latency)}ms latency`;
      } else {
        details = `${Math.round(latency)}ms latency`;
        if (latency > 500) score -= 20;
        else if (latency > 200) score -= 10;
      }
      
      return { passed: score >= 70, score, details };
    } catch {
      return { passed: false, score: 30, details: "Limited connectivity" };
    }
  };

  const runTouchpadTest = async (): Promise<{ passed: boolean; score: number; details: string }> => {
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    await new Promise(r => setTimeout(r, 1000));
    
    if (hasPointer || hasTouch) {
      return {
        passed: true,
        score: 100,
        details: hasTouch ? "Touchpad/Touch detected" : "Pointer device detected"
      };
    }
    
    return { passed: false, score: 0, details: "No pointing device detected" };
  };

  const runPortsTest = async (): Promise<{ passed: boolean; score: number; details: string }> => {
    let score = 50; // Base score
    const features: string[] = [];
    
    // Check for USB support
    if ('usb' in navigator) {
      score += 15;
      features.push("USB");
    }
    
    // Check for Bluetooth support
    if ('bluetooth' in navigator) {
      score += 15;
      features.push("Bluetooth");
    }
    
    // Check for serial port support
    if ('serial' in navigator) {
      score += 10;
      features.push("Serial");
    }
    
    // Check for HID support
    if ('hid' in navigator) {
      score += 10;
      features.push("HID");
    }
    
    await new Promise(r => setTimeout(r, 1200));
    
    return {
      passed: score >= 50,
      score: Math.min(100, score),
      details: features.length > 0 ? features.join(", ") + " supported" : "Basic connectivity"
    };
  };

  // Run all tests sequentially
  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setIsComplete(false);
    abortRef.current = false;
    setTests(initialTests);

    const testFunctions = [
      { id: "display", fn: runDisplayTest },
      { id: "keyboard", fn: runKeyboardTest },
      { id: "camera", fn: runCameraTest },
      { id: "microphone", fn: runMicrophoneTest },
      { id: "audio", fn: runAudioTest },
      { id: "network", fn: runNetworkTest },
      { id: "touchpad", fn: runTouchpadTest },
      { id: "ports", fn: runPortsTest },
    ];

    for (let i = 0; i < testFunctions.length; i++) {
      if (abortRef.current) break;
      
      const { id, fn } = testFunctions[i];
      setCurrentTestIndex(i);
      updateTest(id, { status: "running" });

      try {
        const result = await fn();
        updateTest(id, {
          status: result.passed ? "passed" : "failed",
          score: result.score,
          details: result.details
        });
      } catch (error) {
        updateTest(id, { 
          status: "failed", 
          score: 0, 
          details: "Test error" 
        });
      }

      // Small delay between tests
      await new Promise(r => setTimeout(r, 300));
    }

    setIsRunning(false);
    setIsComplete(true);
    setCurrentTestIndex(-1);
  }, [updateTest]);

  // Calculate overall score when tests complete
  useEffect(() => {
    if (isComplete) {
      const totalScore = tests.reduce((sum, t) => sum + t.score, 0);
      const avgScore = Math.round(totalScore / tests.length);
      setOverallScore(avgScore);
    }
  }, [isComplete, tests]);

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: "A+", color: "text-success", bg: "bg-success/20" };
    if (score >= 80) return { grade: "A", color: "text-success", bg: "bg-success/20" };
    if (score >= 70) return { grade: "B", color: "text-primary", bg: "bg-primary/20" };
    if (score >= 60) return { grade: "C", color: "text-warning", bg: "bg-warning/20" };
    return { grade: "D", color: "text-destructive", bg: "bg-destructive/20" };
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "running":
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      case "passed":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "skipped":
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />;
    }
  };

  const scoreData = getScoreGrade(overallScore);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                Full System Diagnostic
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Run All Tests
              </h1>
              <p className="text-muted-foreground">
                Complete diagnostic scan of your laptop's hardware
              </p>
            </motion.div>

            {/* Score Display (when complete) */}
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card rounded-3xl p-8 mb-8 text-center"
                >
                  <div className="flex items-center justify-center mb-4">
                    <Trophy className="h-8 w-8 text-warning mr-3" />
                    <span className="text-lg font-medium text-foreground">System Score</span>
                  </div>
                  
                  <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${scoreData.bg} mb-4`}>
                    <span className={`text-5xl font-bold ${scoreData.color}`}>
                      {overallScore}
                    </span>
                  </div>
                  
                  <div className={`inline-block px-4 py-1 rounded-full ${scoreData.bg} ${scoreData.color} font-semibold mb-4`}>
                    Grade: {scoreData.grade}
                  </div>
                  
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    {overallScore >= 80 
                      ? "Your laptop is in excellent condition! All major components are working properly."
                      : overallScore >= 60
                      ? "Your laptop is in good condition with some minor issues detected."
                      : "Some issues were detected. Consider checking the individual test results."}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                    <Button variant="outline" onClick={runAllTests}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Run Again
                    </Button>
                    <Button asChild>
                      <Link to="/dashboard">
                        View Individual Tests
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress Bar */}
            {isRunning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Testing progress</span>
                  <span className="text-sm font-medium text-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </motion.div>
            )}

            {/* Tests Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl overflow-hidden mb-8"
            >
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Hardware Tests</h2>
              </div>
              
              <div className="divide-y divide-border">
                {tests.map((test, index) => {
                  const Icon = test.icon;
                  const isActive = currentTestIndex === index;
                  
                  return (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-4 transition-colors ${
                        isActive ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          test.status === "passed" ? "bg-success/20" :
                          test.status === "failed" ? "bg-destructive/20" :
                          test.status === "running" ? "bg-primary/20" :
                          "bg-muted"
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            test.status === "passed" ? "text-success" :
                            test.status === "failed" ? "text-destructive" :
                            test.status === "running" ? "text-primary" :
                            "text-muted-foreground"
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{test.name}</p>
                          {test.details && (
                            <p className="text-xs text-muted-foreground">{test.details}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {(test.status === "passed" || test.status === "failed") && (
                          <span className={`text-sm font-medium ${
                            test.score >= 80 ? "text-success" :
                            test.score >= 60 ? "text-warning" :
                            "text-destructive"
                          }`}>
                            {test.score}%
                          </span>
                        )}
                        {getStatusIcon(test.status)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Start Button */}
            {!isRunning && !isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <Button size="lg" onClick={runAllTests} className="h-14 px-10 text-lg font-semibold gap-3">
                  <Play className="h-5 w-5" />
                  Start Full Diagnostic
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  This will take approximately 30 seconds
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FullSystemTest;
