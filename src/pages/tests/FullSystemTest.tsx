import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
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
} from "lucide-react";

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
  status: "pending" | "completed" | "failed";
  passed: boolean | null;
}

const initialTests: TestItem[] = [
  { id: "display", name: "Display Test", icon: Monitor, status: "pending", passed: null },
  { id: "keyboard", name: "Keyboard Test", icon: Keyboard, status: "pending", passed: null },
  { id: "camera", name: "Camera Test", icon: Camera, status: "pending", passed: null },
  { id: "microphone", name: "Microphone Test", icon: Mic, status: "pending", passed: null },
  { id: "audio", name: "Audio Test", icon: Speaker, status: "pending", passed: null },
  { id: "network", name: "Network Test", icon: Wifi, status: "pending", passed: null },
  { id: "touchpad", name: "Touchpad Test", icon: MousePointer2, status: "pending", passed: null },
  { id: "ports", name: "Ports Test", icon: Usb, status: "pending", passed: null },
];

const STORAGE_KEY = "fullSystemTestState";

// Map test IDs to their icons (icons can't be serialized to JSON)
const testIconMap: Record<string, React.ElementType> = {
  display: Monitor,
  keyboard: Keyboard,
  camera: Camera,
  microphone: Mic,
  audio: Speaker,
  network: Wifi,
  touchpad: MousePointer2,
  ports: Usb,
};

interface StoredTestItem {
  id: string;
  name: string;
  status: "pending" | "completed" | "failed";
  passed: boolean | null;
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
  const [showResultPopup, setShowResultPopup] = useState(false);

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
          const allDone = state.tests.every(t => t.status !== "pending");
          setIsComplete(allDone);
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
      const testsToStore: StoredTestItem[] = tests.map(({ id, name, status, passed }) => ({
        id,
        name,
        status,
        passed,
      }));
      const state: StoredState = {
        tests: testsToStore,
        currentIndex: currentTestIndex,
        startedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [tests, currentTestIndex, hasStarted, isComplete]);

  const completedCount = tests.filter(t => t.status !== "pending").length;
  const progress = (completedCount / tests.length) * 100;
  const passedCount = tests.filter(t => t.passed === true).length;
  const failedCount = tests.filter(t => t.passed === false).length;

  // Calculate score: passed tests get 100%, failed get 0%
  const calculateOverallScore = () => {
    const testedCount = tests.filter(t => t.status !== "pending").length;
    if (testedCount === 0) return 0;
    return Math.round((passedCount / testedCount) * 100);
  };

  const overallScore = calculateOverallScore();

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: "A+", color: "text-success", bg: "bg-success/20" };
    if (score >= 80) return { grade: "A", color: "text-success", bg: "bg-success/20" };
    if (score >= 70) return { grade: "B", color: "text-primary", bg: "bg-primary/20" };
    if (score >= 60) return { grade: "C", color: "text-warning", bg: "bg-warning/20" };
    return { grade: "D", color: "text-destructive", bg: "bg-destructive/20" };
  };

  const startTests = () => {
    setHasStarted(true);
    setTests(initialTests);
    setCurrentTestIndex(0);
    setIsComplete(false);
    setIsRunningTest(true);
  };

  // Called when an embedded test completes
  const handleTestComplete = useCallback(() => {
    setIsRunningTest(false);
    setShowResultPopup(true);
  }, []);

  // User answers Yes (no issues) or No (issues found)
  const handleResultAnswer = (noIssues: boolean) => {
    setShowResultPopup(false);
    
    setTests(prev => prev.map((t, i) => 
      i === currentTestIndex 
        ? { ...t, status: noIssues ? "completed" : "failed", passed: noIssues } 
        : t
    ));
    
    if (currentTestIndex < tests.length - 1) {
      setCurrentTestIndex(prev => prev + 1);
      setIsRunningTest(true);
    } else {
      setIsComplete(true);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const resetTests = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTests(initialTests);
    setCurrentTestIndex(0);
    setHasStarted(false);
    setIsComplete(false);
    setIsRunningTest(false);
    setShowResultPopup(false);
  };

  const currentTest = tests[currentTestIndex] || tests[0];
  const scoreData = getScoreGrade(overallScore);

  const getStatusIcon = (status: TestItem["status"], passed: boolean | null) => {
    if (status === "completed" && passed) {
      return <CheckCircle2 className="h-5 w-5 text-success" />;
    }
    if (status === "failed" || (status === "completed" && !passed)) {
      return <XCircle className="h-5 w-5 text-destructive" />;
    }
    return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />;
  };

  // Render the embedded test component
  const renderTestComponent = () => {
    const props = { onComplete: handleTestComplete };
    
    switch (currentTest.id) {
      case "display":
        return <DisplayTestEmbed {...props} />;
      case "keyboard":
        return <KeyboardTestEmbed {...props} />;
      case "camera":
        return <CameraTestEmbed {...props} />;
      case "microphone":
        return <MicrophoneTestEmbed {...props} />;
      case "audio":
        return <AudioTestEmbed {...props} />;
      case "network":
        return <NetworkTestEmbed {...props} />;
      case "touchpad":
        return <TouchpadTestEmbed {...props} />;
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
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
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
              <p className="text-muted-foreground">
                Complete each test to get your laptop's health score
              </p>
            </motion.div>

            {/* Not Started State */}
            {!hasStarted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl p-8 text-center mb-8"
              >
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Play className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Ready to Test Your Laptop?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You'll go through {tests.length} tests. After each test, tell us if you noticed any issues.
                </p>
                <Button size="lg" onClick={startTests}>
                  <Play className="h-5 w-5 mr-2" />
                  Start Full Test
                </Button>
              </motion.div>
            )}

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

                  <div className="flex justify-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <span className="text-foreground font-medium">{passedCount} Passed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-destructive" />
                      <span className="text-foreground font-medium">{failedCount} Failed</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    {overallScore >= 80 
                      ? "Your laptop is in excellent condition! All major components are working properly."
                      : overallScore >= 60
                      ? "Your laptop is in good condition with some minor issues detected."
                      : "Some issues were detected. Consider checking the individual test results."}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                    <Button variant="outline" onClick={resetTests}>
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

            {/* Running Test */}
            {hasStarted && !isComplete && isRunningTest && currentTest && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                {/* Progress Bar */}
                <div className="glass-card rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Test {currentTestIndex + 1} of {tests.length}: {currentTest.name}
                    </span>
                    <span className="text-sm font-medium text-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Embedded Test */}
                <div className="glass-card rounded-2xl overflow-hidden min-h-[500px]">
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-[500px]">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  }>
                    {renderTestComponent()}
                  </Suspense>
                </div>
              </motion.div>
            )}

            {/* Result Popup */}
            <AnimatePresence>
              {showResultPopup && currentTest && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="glass-card rounded-3xl p-8 max-w-md mx-4 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <currentTest.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {currentTest.name} Complete
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Did you notice anything unusual during this test?
                    </p>
                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-success text-success hover:bg-success/10"
                        onClick={() => handleResultAnswer(true)}
                      >
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        No Issues
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => handleResultAnswer(false)}
                      >
                        <XCircle className="h-5 w-5 mr-2" />
                        Yes, Issues
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tests List */}
            {hasStarted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-border">
                  <h2 className="font-semibold text-foreground">All Tests</h2>
                </div>
                
                <div className="divide-y divide-border">
                  {tests.map((test, index) => {
                    const Icon = test.icon;
                    const isCurrent = index === currentTestIndex && !isComplete;
                    
                    return (
                      <div
                        key={test.id}
                        className={`flex items-center justify-between p-4 transition-colors ${
                          isCurrent ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${
                            test.passed === true ? "bg-success/10" :
                            test.passed === false ? "bg-destructive/10" :
                            isCurrent ? "bg-primary/10" : "bg-muted/50"
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              test.passed === true ? "text-success" :
                              test.passed === false ? "text-destructive" :
                              isCurrent ? "text-primary" : "text-muted-foreground"
                            }`} />
                          </div>
                          <span className={`font-medium ${
                            test.status !== "pending" ? "text-foreground" :
                            isCurrent ? "text-foreground" : "text-muted-foreground"
                          }`}>
                            {test.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {isCurrent && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                          {getStatusIcon(test.status, test.passed)}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
