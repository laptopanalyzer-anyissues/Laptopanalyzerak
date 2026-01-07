import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
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
  Loader2,
  Shield,
  SkipForward,
  MinusCircle,
  RefreshCw,
} from "lucide-react";
import { useTestSounds } from "@/hooks/useTestSounds";
import { useConfetti } from "@/hooks/useConfetti";

// Lazy load test components
const DisplayTestEmbed = lazy(() => import("@/components/fulltest/DisplayTestEmbed"));
const KeyboardTestEmbed = lazy(() => import("@/components/fulltest/KeyboardTestEmbed"));
const CameraTestEmbed = lazy(() => import("@/components/fulltest/CameraTestEmbed"));
const MicrophoneTestEmbed = lazy(() => import("@/components/fulltest/MicrophoneTestEmbed"));
const AudioTestEmbed = lazy(() => import("@/components/fulltest/AudioTestEmbed"));
const NetworkTestEmbed = lazy(() => import("@/components/fulltest/NetworkTestEmbed"));
const TouchpadTestEmbed = lazy(() => import("@/components/fulltest/TouchpadTestEmbed"));
const PortsTestEmbed = lazy(() => import("@/components/fulltest/PortsTestEmbed"));

interface TestItem {
  id: string;
  name: string;
  icon: React.ElementType;
  status: "pending" | "running" | "completed" | "issue" | "skipped";
  passed: boolean | null; // null = not tested, true = passed, false = issue
  weight: number; // Score weight for this test
}

// Test order as specified: Display, Keyboard, Touchpad, Camera, Microphone, Speaker, Network, Ports
const initialTests: TestItem[] = [
  { id: "display", name: "Display Test", icon: Monitor, status: "pending", passed: null, weight: 15 },
  { id: "keyboard", name: "Keyboard Test", icon: Keyboard, status: "pending", passed: null, weight: 12 },
  { id: "touchpad", name: "Touchpad Test", icon: MousePointer2, status: "pending", passed: null, weight: 10 },
  { id: "camera", name: "Camera Test", icon: Camera, status: "pending", passed: null, weight: 12 },
  { id: "microphone", name: "Microphone Test", icon: Mic, status: "pending", passed: null, weight: 12 },
  { id: "audio", name: "Speaker Test", icon: Speaker, status: "pending", passed: null, weight: 13 },
  { id: "network", name: "Network Test", icon: Wifi, status: "pending", passed: null, weight: 13 },
  { id: "ports", name: "Ports & Connectivity", icon: Usb, status: "pending", passed: null, weight: 13 },
];

const STORAGE_KEY = "fullSystemTestState_v2";

// Map test IDs to their icons (icons can't be serialized to JSON)
const testIconMap: Record<string, React.ElementType> = {
  display: Monitor,
  keyboard: Keyboard,
  touchpad: MousePointer2,
  camera: Camera,
  microphone: Mic,
  audio: Speaker,
  network: Wifi,
  ports: Usb,
};

interface StoredTestItem {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "issue" | "skipped";
  passed: boolean | null;
  weight: number;
}

interface StoredState {
  tests: StoredTestItem[];
  currentIndex: number;
  startedAt: string;
}

const FullSystemTest = () => {
  const [tests, setTests] = useState<TestItem[]>(initialTests);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [showDisplayPopup, setShowDisplayPopup] = useState(false);
  
  const { playSuccessSound, playCompleteSound, playSkipSound } = useTestSounds();
  const { fireConfetti } = useConfetti();

  // Load state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const state: StoredState = JSON.parse(stored);
        const startedAt = new Date(state.startedAt);
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (startedAt > hourAgo) {
          // Restore tests with icons mapped back from testIconMap
          const restoredTests: TestItem[] = state.tests.map(t => ({
            ...t,
            icon: testIconMap[t.id] || Monitor,
          }));
          setTests(restoredTests);
          setCurrentTestIndex(state.currentIndex);
          setHasStarted(true);
          const allDone = state.tests.every(t => t.status !== "pending" && t.status !== "running");
          setIsComplete(allDone);
          // If not all done, resume running the current test
          if (!allDone) {
            setIsRunningTest(true);
          }
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save state to localStorage (exclude icon since functions can't be serialized)
  useEffect(() => {
    if (hasStarted && !isComplete) {
      const testsToStore: StoredTestItem[] = tests.map(({ id, name, status, passed, weight }) => ({
        id,
        name,
        status,
        passed,
        weight,
      }));
      const state: StoredState = {
        tests: testsToStore,
        currentIndex: currentTestIndex,
        startedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [tests, currentTestIndex, hasStarted, isComplete]);

  const completedCount = tests.filter(t => t.status === "completed" || t.status === "issue" || t.status === "skipped").length;
  const progress = (completedCount / tests.length) * 100;
  const passedCount = tests.filter(t => t.passed === true).length;
  const issueCount = tests.filter(t => t.passed === false).length;
  const skippedCount = tests.filter(t => t.status === "skipped").length;
  const testedCount = tests.filter(t => t.status === "completed" || t.status === "issue").length;

  // Calculate weighted score - skipped tests are excluded from calculation
  const calculateOverallScore = useCallback(() => {
    const earnedWeight = tests.reduce((sum, t) => {
      if (t.passed === true) return sum + t.weight;
      return sum; // Issue reported or skipped = 0 points
    }, 0);
    
    // Only count tests that were actually run (not skipped)
    const testedWeight = tests.reduce((sum, t) => {
      if (t.status === "completed" || t.status === "issue") return sum + t.weight;
      return sum; // Skipped tests don't affect score
    }, 0);
    
    if (testedWeight === 0) return null; // If all skipped, return null (no score)
    return Math.round((earnedWeight / testedWeight) * 100);
  }, [tests]);

  const overallScore = calculateOverallScore();

  const getScoreLabel = (score: number | null) => {
    if (score === null) return { label: "No Tests Run", color: "text-muted-foreground", bg: "bg-muted/50", borderColor: "border-muted" };
    if (score >= 90) return { label: "Excellent", color: "text-success", bg: "bg-success/20", borderColor: "border-success" };
    if (score >= 75) return { label: "Good", color: "text-primary", bg: "bg-primary/20", borderColor: "border-primary" };
    if (score >= 50) return { label: "Fair", color: "text-warning", bg: "bg-warning/20", borderColor: "border-warning" };
    return { label: "Needs Attention", color: "text-destructive", bg: "bg-destructive/20", borderColor: "border-destructive" };
  };

  const startTests = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasStarted(true);
    setTests(initialTests.map(t => ({ ...t, status: "pending", passed: null })));
    setCurrentTestIndex(0);
    setIsComplete(false);
    setIsRunningTest(true);
  };

  // Move to next test or complete
  const moveToNextTest = useCallback((passed: boolean) => {
    // Play success sound for passed tests
    if (passed) {
      playSuccessSound();
    }
    
    setTests(prev => prev.map((t, i) => 
      i === currentTestIndex 
        ? { ...t, status: passed ? "completed" : "issue", passed } 
        : t
    ));
    
    if (currentTestIndex < tests.length - 1) {
      setCurrentTestIndex(prev => prev + 1);
      setIsRunningTest(true);
    } else {
      setIsComplete(true);
      localStorage.removeItem(STORAGE_KEY);
      // Play celebration sound and confetti if score is good
      setTimeout(() => {
        playCompleteSound();
        // Fire confetti if all tests passed or score >= 75
        const passedTests = tests.filter((t, i) => i < currentTestIndex ? t.passed === true : passed).length + (passed ? 1 : 0);
        const testedTests = tests.filter((t, i) => i <= currentTestIndex && t.status !== "skipped").length;
        const score = testedTests > 0 ? (passedTests / testedTests) * 100 : 100;
        if (score >= 75) {
          fireConfetti();
        }
      }, 300);
    }
  }, [currentTestIndex, tests, playSuccessSound, playCompleteSound, fireConfetti]);

  // Called when an embedded test completes (with optional passed result)
  const handleTestComplete = useCallback((passed?: boolean) => {
    console.log("[FullSystemTest] handleTestComplete called for test:", tests[currentTestIndex]?.id, "passed:", passed);
    const testId = tests[currentTestIndex]?.id;
    
    // Stop running the current test FIRST
    setIsRunningTest(false);
    
    if (testId === "display") {
      // Delay showing popup to ensure the DisplayTestEmbed fully unmounts
      console.log("[FullSystemTest] Scheduling display popup after delay");
      setTimeout(() => {
        console.log("[FullSystemTest] Now showing display popup");
        setShowDisplayPopup(true);
      }, 200);
    } else if (passed !== undefined) {
      // If passed result is provided (e.g., from audio test), use it
      console.log("[FullSystemTest] Using provided passed result:", passed);
      moveToNextTest(passed);
    } else {
      // Auto-pass all other tests
      console.log("[FullSystemTest] Auto-passing test, moving to next");
      moveToNextTest(true);
    }
  }, [tests, currentTestIndex, moveToNextTest]);

  // User answers the display popup
  const handleDisplayAnswer = (noIssues: boolean) => {
    setShowDisplayPopup(false);
    moveToNextTest(noIssues);
  };

  const resetTests = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTests(initialTests.map(t => ({ ...t, status: "pending", passed: null })));
    setCurrentTestIndex(0);
    setHasStarted(false);
    setIsComplete(false);
    setIsRunningTest(false);
    setShowDisplayPopup(false);
  };

  // Skip the current test
  const skipCurrentTest = useCallback(() => {
    playSkipSound();
    
    setTests(prev => prev.map((t, i) => 
      i === currentTestIndex 
        ? { ...t, status: "skipped", passed: null } 
        : t
    ));
    
    if (currentTestIndex < tests.length - 1) {
      setCurrentTestIndex(prev => prev + 1);
      setIsRunningTest(true);
    } else {
      setIsComplete(true);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentTestIndex, tests.length, playSkipSound]);

  // Quick re-test - run a single test again
  const reRunTest = useCallback((testId: string) => {
    const testIndex = tests.findIndex(t => t.id === testId);
    if (testIndex === -1) return;
    
    setTests(prev => prev.map((t, i) => 
      i === testIndex 
        ? { ...t, status: "pending", passed: null } 
        : t
    ));
    setCurrentTestIndex(testIndex);
    setIsComplete(false);
    setIsRunningTest(true);
  }, [tests]);

  // Go back to previous test
  const goToPreviousTest = useCallback(() => {
    if (currentTestIndex > 0) {
      // Reset the previous test status to pending so it can be re-run
      setTests(prev => prev.map((t, i) => 
        i === currentTestIndex - 1 
          ? { ...t, status: "pending", passed: null } 
          : t
      ));
      setCurrentTestIndex(prev => prev - 1);
      setIsRunningTest(true);
    }
  }, [currentTestIndex]);

  const currentTest = tests[currentTestIndex] || tests[0];
  const scoreData = getScoreLabel(overallScore);

  const getStatusIcon = (status: TestItem["status"], passed: boolean | null) => {
    if (status === "completed" && passed === true) {
      return <CheckCircle2 className="h-5 w-5 text-success" />;
    }
    if (status === "issue" || passed === false) {
      return <AlertTriangle className="h-5 w-5 text-warning" />;
    }
    if (status === "skipped") {
      return <MinusCircle className="h-5 w-5 text-muted-foreground" />;
    }
    if (status === "running") {
      return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
    }
    return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />;
  };

  // Render the embedded test component
  const renderTestComponent = () => {
    const props = { 
      onComplete: handleTestComplete,
      onBack: currentTestIndex > 0 ? goToPreviousTest : undefined,
    };
    
    switch (currentTest.id) {
      case "display":
        return <DisplayTestEmbed onComplete={handleTestComplete} />;
      case "keyboard":
        return <KeyboardTestEmbed {...props} />;
      case "touchpad":
        return <TouchpadTestEmbed {...props} />;
      case "camera":
        return <CameraTestEmbed {...props} />;
      case "microphone":
        return <MicrophoneTestEmbed {...props} />;
      case "audio":
        return <AudioTestEmbed onComplete={(passed) => handleTestComplete(passed)} onBack={props.onBack} />;
      case "network":
        return <NetworkTestEmbed {...props} />;
      case "ports":
        return <PortsTestEmbed {...props} />;
      default:
        return null;
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
            className="mb-6"
          >
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </motion.div>

          <div className="max-w-4xl mx-auto">
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
              <p className="text-muted-foreground mb-4">
                Complete each test to get your laptop's health score out of 100
              </p>
              
              {/* Privacy notice */}
              <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
                <Shield className="h-4 w-4" />
                All tests run locally in your browser. No data is uploaded or stored.
              </div>
            </motion.div>

            {/* Not Started State - Show Start Button + Test List */}
            {!hasStarted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Start Button Card */}
                <div className="glass-card rounded-3xl p-8 text-center mb-6">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    {/* Animated rings */}
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
                    <div className="relative w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                      <Play className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Ready to Test Your Laptop?
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    We'll run {tests.length} diagnostic tests in sequence. Each test runs automatically, and you'll confirm the results when needed.
                  </p>
                  
                  <Button 
                    size="xl" 
                    onClick={startTests}
                    className="group"
                  >
                    <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-primary-foreground/20 mr-2 group-hover:animate-pulse">
                      <Play className="h-4 w-4" />
                    </span>
                    Run All Tests
                  </Button>
                </div>

                {/* Test List Preview */}
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-semibold text-foreground">Tests We'll Run</h2>
                    <span className="text-sm text-muted-foreground">{tests.length} tests</span>
                  </div>
                  <div className="divide-y divide-border">
                    {tests.map((test, index) => {
                      const Icon = test.icon;
                      return (
                        <div
                          key={test.id}
                          className="flex items-center gap-4 p-4"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="p-2 rounded-lg bg-muted/50">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-foreground">
                            {test.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Score Display (when complete) */}
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-6"
                >
                  {/* All Tests Passed Celebration Banner - only show when ALL tests ran and passed */}
                  {passedCount === tests.length && skippedCount === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-success/20 via-primary/20 to-accent/20 border border-success/30 p-6"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-success/5 to-transparent animate-pulse" />
                      <div className="relative flex items-center justify-center gap-3">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                        >
                          <Sparkles className="h-8 w-8 text-success" />
                        </motion.div>
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-success">Perfect Score!</h3>
                          <p className="text-sm text-success/80">All {tests.length} tests passed successfully</p>
                        </div>
                        <motion.div
                          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                        >
                          <Sparkles className="h-8 w-8 text-success" />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* Score Card */}
                  <div className="glass-card rounded-3xl p-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Trophy className={`h-8 w-8 mr-3 ${overallScore === 100 ? "text-success animate-bounce" : "text-warning"}`} />
                      <span className="text-lg font-medium text-foreground">Laptop Health Score</span>
                    </div>
                    
                    {/* Score Circle */}
                    <div className="relative w-40 h-40 mx-auto mb-6">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={440}
                          strokeDashoffset={overallScore !== null ? 440 - (440 * overallScore) / 100 : 440}
                          strokeLinecap="round"
                          className={scoreData.color}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-5xl font-bold ${scoreData.color}`}>
                          {overallScore !== null ? overallScore : "—"}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {overallScore !== null ? "out of 100" : "no data"}
                        </span>
                      </div>
                    </div>
                    
                    <div className={`inline-block px-6 py-2 rounded-full ${scoreData.bg} ${scoreData.color} font-semibold mb-4`}>
                      {scoreData.label}
                    </div>

                    <div className="flex justify-center gap-6 mb-6 flex-wrap">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        <span className="text-foreground font-medium">{passedCount} Passed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                        <span className="text-foreground font-medium">{issueCount} Issues</span>
                      </div>
                      {skippedCount > 0 && (
                        <div className="flex items-center gap-2">
                          <MinusCircle className="h-5 w-5 text-muted-foreground" />
                          <span className="text-muted-foreground font-medium">{skippedCount} Skipped</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                      {overallScore === null
                        ? "You skipped all tests. Run at least one test to get a health score."
                        : overallScore >= 90 
                        ? "Your laptop is in excellent condition! All major components are working properly."
                        : overallScore >= 75
                        ? "Your laptop is in good condition with minor issues detected."
                        : overallScore >= 50
                        ? "Some issues were detected. Consider checking the highlighted components."
                        : "Several issues were detected. We recommend addressing the flagged components."}
                    </p>
                  </div>
                  
                  {/* Summary Breakdown */}
                  <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <h2 className="font-semibold text-foreground">Test Summary</h2>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <span className="text-success font-medium">{passedCount}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          <span className="text-warning font-medium">{issueCount}</span>
                        </span>
                        {skippedCount > 0 && (
                          <span className="flex items-center gap-1.5">
                            <MinusCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground font-medium">{skippedCount}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="divide-y divide-border">
                      {tests.map((test, index) => {
                        const Icon = test.icon;
                        return (
                          <motion.div
                            key={test.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center justify-between p-4 transition-colors ${
                              test.passed === false ? "bg-warning/5" : 
                              test.passed === true ? "hover:bg-success/5" : ""
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                                {index + 1}
                              </div>
                              <div className={`p-2 rounded-lg transition-colors ${
                                test.passed === true ? "bg-success/10" :
                                test.passed === false ? "bg-warning/10" :
                                "bg-muted/50"
                              }`}>
                                <Icon className={`h-5 w-5 ${
                                  test.passed === true ? "text-success" :
                                  test.passed === false ? "text-warning" :
                                  "text-muted-foreground"
                                }`} />
                              </div>
                              <div>
                                <span className="font-medium text-foreground block">
                                  {test.name}
                                </span>
                                {test.passed === false && test.id === "display" && (
                                  <span className="text-xs text-warning">
                                    Screen issue reported by user
                                  </span>
                                )}
                                {test.passed === false && test.id === "audio" && (
                                  <span className="text-xs text-warning">
                                    Speaker issue reported by user
                                  </span>
                                )}
                                {test.status === "skipped" && (
                                  <span className="text-xs text-muted-foreground">
                                    Test was skipped
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {test.passed === true && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-xs text-success font-medium">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Passed
                                </span>
                              )}
                              {test.passed === false && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10 text-xs text-warning font-medium">
                                  <AlertTriangle className="h-3 w-3" />
                                  Issue
                                </span>
                              )}
                              {test.status === "skipped" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-xs text-muted-foreground font-medium">
                                  <MinusCircle className="h-3 w-3" />
                                  Skipped
                                </span>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => reRunTest(test.id)}
                                className="h-8 px-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                title={`Re-run ${test.name}`}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="outline" size="lg" onClick={resetTests}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Run Again
                    </Button>
                    <Button size="lg" asChild>
                      <Link to="/dashboard">
                        View Individual Tests
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Running Test */}
            {hasStarted && !isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Progress Bar with Skip Button */}
                <div className="glass-card rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          {currentTestIndex + 1}
                        </span>
                        <span className="text-sm font-medium text-primary">
                          of {tests.length}
                        </span>
                      </div>
                      <span className="font-semibold text-foreground">{currentTest.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}% complete</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={skipCurrentTest}
                        className="text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        <SkipForward className="h-4 w-4 mr-1" />
                        Skip
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress value={progress} className="h-2" />
                    {/* Step indicators */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-0">
                      {tests.map((_, index) => {
                        const stepProgress = ((index + 1) / tests.length) * 100;
                        const isCompleted = progress >= stepProgress;
                        const isCurrent = index === currentTestIndex;
                        return (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              isCurrent ? "bg-primary ring-2 ring-primary/30 ring-offset-1 ring-offset-background scale-150" :
                              isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Test Progress List (mini) */}
                <div className="glass-card rounded-2xl p-4">
                  <div className="flex flex-wrap gap-3">
                    {tests.map((test, index) => {
                      const Icon = test.icon;
                      const isCurrent = index === currentTestIndex;
                      const isDone = test.status === "completed" || test.status === "issue";
                      const isSkipped = test.status === "skipped";
                      
                      return (
                        <div
                          key={test.id}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                            isCurrent ? "bg-primary/10 border border-primary/30" :
                            isDone ? (test.passed ? "bg-success/10" : "bg-warning/10") :
                            isSkipped ? "bg-muted/30" :
                            "bg-muted/50"
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${
                            isCurrent ? "text-primary" :
                            isDone ? (test.passed ? "text-success" : "text-warning") :
                            isSkipped ? "text-muted-foreground/50" :
                            "text-muted-foreground"
                          }`} />
                          <span className={`text-xs font-medium ${
                            isCurrent ? "text-primary" :
                            isDone ? "text-foreground" :
                            isSkipped ? "text-muted-foreground/50 line-through" :
                            "text-muted-foreground"
                          }`}>
                            {test.name.replace(" Test", "")}
                          </span>
                          {isDone && (
                            test.passed ? 
                              <CheckCircle2 className="h-3 w-3 text-success" /> :
                              <AlertTriangle className="h-3 w-3 text-warning" />
                          )}
                          {isSkipped && (
                            <MinusCircle className="h-3 w-3 text-muted-foreground/50" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Embedded Test */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTest.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card rounded-2xl overflow-hidden min-h-[500px]"
                  >
                    <Suspense fallback={
                      <div className="flex flex-col items-center justify-center h-[500px] gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-muted-foreground">Loading {currentTest.name}...</span>
                      </div>
                    }>
                      {renderTestComponent()}
                    </Suspense>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}

            {/* Display Test Popup - using Dialog for better UX */}
            <Dialog open={showDisplayPopup} onOpenChange={() => {}}>
              <DialogContent className="sm:max-w-md" hideCloseButton>
                <DialogHeader className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Monitor className="h-8 w-8 text-primary" />
                  </div>
                  <DialogTitle className="text-xl">
                    Did you notice any screen issues?
                  </DialogTitle>
                  <DialogDescription className="text-left mt-4">
                    <span className="font-medium text-foreground block mb-2">Examples:</span>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Dead pixels or bright spots</li>
                      <li>• Flickering or blinking</li>
                      <li>• Color distortion or banding</li>
                      <li>• Brightness unevenness</li>
                    </ul>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex gap-3 mt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 border-success text-success hover:bg-success/10 hover:border-success"
                    onClick={() => handleDisplayAnswer(true)}
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    No issues found
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 border-warning text-warning hover:bg-warning/10 hover:border-warning"
                    onClick={() => handleDisplayAnswer(false)}
                  >
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Yes, I noticed an issue
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FullSystemTest;
