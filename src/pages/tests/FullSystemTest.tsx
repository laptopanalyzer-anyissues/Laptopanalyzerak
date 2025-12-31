import { useState, useEffect } from "react";
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
  SkipForward,
} from "lucide-react";

interface TestItem {
  id: string;
  name: string;
  icon: React.ElementType;
  path: string;
  status: "pending" | "completed" | "skipped";
  score: number | null;
}

const initialTests: TestItem[] = [
  { id: "display", name: "Display Test", icon: Monitor, path: "/test/display", status: "pending", score: null },
  { id: "keyboard", name: "Keyboard Test", icon: Keyboard, path: "/test/keyboard", status: "pending", score: null },
  { id: "camera", name: "Camera Test", icon: Camera, path: "/test/camera", status: "pending", score: null },
  { id: "microphone", name: "Microphone Test", icon: Mic, path: "/test/microphone", status: "pending", score: null },
  { id: "audio", name: "Audio Test", icon: Speaker, path: "/test/audio", status: "pending", score: null },
  { id: "network", name: "Network Test", icon: Wifi, path: "/test/network", status: "pending", score: null },
  { id: "touchpad", name: "Touchpad Test", icon: MousePointer2, path: "/test/touchpad", status: "pending", score: null },
  { id: "ports", name: "Ports Test", icon: Usb, path: "/test/ports", status: "pending", score: null },
];

// Storage key for persisting test state
const STORAGE_KEY = "fullSystemTestState";

interface StoredState {
  tests: TestItem[];
  currentIndex: number;
  startedAt: string;
}

const FullSystemTest = () => {
  const [tests, setTests] = useState<TestItem[]>(initialTests);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  // Load state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const state: StoredState = JSON.parse(stored);
        // Check if session is less than 1 hour old
        const startedAt = new Date(state.startedAt);
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (startedAt > hourAgo) {
          setTests(state.tests);
          setCurrentTestIndex(state.currentIndex);
          setHasStarted(true);
          // Check if all tests are done
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

  // Save state to localStorage when it changes
  useEffect(() => {
    if (hasStarted && !isComplete) {
      const state: StoredState = {
        tests,
        currentIndex: currentTestIndex,
        startedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [tests, currentTestIndex, hasStarted, isComplete]);

  // Calculate progress
  const completedCount = tests.filter(t => t.status !== "pending").length;
  const progress = (completedCount / tests.length) * 100;

  // Calculate overall score
  const calculateOverallScore = () => {
    const scoredTests = tests.filter(t => t.score !== null);
    if (scoredTests.length === 0) return 0;
    const total = scoredTests.reduce((sum, t) => sum + (t.score || 0), 0);
    return Math.round(total / scoredTests.length);
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
  };

  const markTestComplete = (score: number) => {
    setTests(prev => prev.map((t, i) => 
      i === currentTestIndex ? { ...t, status: "completed", score } : t
    ));
    
    if (currentTestIndex < tests.length - 1) {
      setCurrentTestIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const skipTest = () => {
    setTests(prev => prev.map((t, i) => 
      i === currentTestIndex ? { ...t, status: "skipped", score: null } : t
    ));
    
    if (currentTestIndex < tests.length - 1) {
      setCurrentTestIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const goToTest = () => {
    const currentTest = tests[currentTestIndex];
    // Store return URL so individual test pages can redirect back
    sessionStorage.setItem("fullTestReturnUrl", "/test/full");
    navigate(currentTest.path);
  };

  const resetTests = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTests(initialTests);
    setCurrentTestIndex(0);
    setHasStarted(false);
    setIsComplete(false);
  };

  const currentTest = tests[currentTestIndex];
  const scoreData = getScoreGrade(overallScore);

  const getStatusIcon = (status: TestItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "skipped":
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />;
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
                  You'll be guided through {tests.length} tests. Complete each test and rate your experience to get an overall health score.
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

            {/* Current Test Card */}
            {hasStarted && !isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6 mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    Test {currentTestIndex + 1} of {tests.length}
                  </span>
                  <span className="text-sm font-medium text-foreground">{Math.round(progress)}% complete</span>
                </div>
                <Progress value={progress} className="h-2 mb-6" />

                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-primary/10">
                    <currentTest.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{currentTest.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      Complete this test and rate your experience
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1" onClick={goToTest}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Test
                  </Button>
                  <Button variant="outline" onClick={skipTest}>
                    <SkipForward className="h-4 w-4 mr-2" />
                    Skip
                  </Button>
                </div>

                {/* Rating buttons after returning from test */}
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">After completing the test, rate it:</p>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { label: "Failed", score: 0, color: "bg-destructive/20 hover:bg-destructive/30 text-destructive" },
                      { label: "Poor", score: 25, color: "bg-orange-500/20 hover:bg-orange-500/30 text-orange-500" },
                      { label: "Fair", score: 50, color: "bg-warning/20 hover:bg-warning/30 text-warning" },
                      { label: "Good", score: 75, color: "bg-primary/20 hover:bg-primary/30 text-primary" },
                      { label: "Perfect", score: 100, color: "bg-success/20 hover:bg-success/30 text-success" },
                    ].map((option) => (
                      <button
                        key={option.score}
                        onClick={() => markTestComplete(option.score)}
                        className={`p-3 rounded-lg text-xs font-medium transition-colors ${option.color}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

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
                            test.status === "completed" ? "bg-success/10" :
                            test.status === "skipped" ? "bg-muted" :
                            isCurrent ? "bg-primary/10" : "bg-muted/50"
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              test.status === "completed" ? "text-success" :
                              test.status === "skipped" ? "text-muted-foreground" :
                              isCurrent ? "text-primary" : "text-muted-foreground"
                            }`} />
                          </div>
                          <div>
                            <span className={`font-medium ${
                              test.status === "completed" ? "text-foreground" :
                              test.status === "skipped" ? "text-muted-foreground" :
                              isCurrent ? "text-foreground" : "text-muted-foreground"
                            }`}>
                              {test.name}
                            </span>
                            {test.score !== null && (
                              <span className="text-xs text-muted-foreground ml-2">
                                Score: {test.score}%
                              </span>
                            )}
                            {test.status === "skipped" && (
                              <span className="text-xs text-muted-foreground ml-2">
                                Skipped
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {isCurrent && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                          {getStatusIcon(test.status)}
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
