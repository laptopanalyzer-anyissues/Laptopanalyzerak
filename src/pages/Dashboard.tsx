import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import RunAllTestsCard from "@/components/dashboard/RunAllTestsCard";
import { TestCard } from "@/components/dashboard/TestCard";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { SEOHead } from "@/components/SEOHead";
import {
  Monitor,
  Keyboard,
  Camera,
  Mic,
  Speaker,
  Wifi,
  Mouse,
  Cable,
} from "lucide-react";

const tests = [
  {
    icon: Monitor,
    title: "Display Test",
    description: "Check for dead pixels, color accuracy, and screen quality",
    path: "/test/display",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Keyboard,
    title: "Keyboard Test",
    description: "Verify every key on your keyboard works correctly",
    path: "/test/keyboard",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Mouse,
    title: "Touchpad Test",
    description: "Test cursor tracking, clicks, and scroll gestures",
    path: "/test/touchpad",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: Camera,
    title: "Camera Test",
    description: "Test your webcam with live preview and snapshot",
    path: "/test/camera",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Mic,
    title: "Microphone Test",
    description: "Audio input test with real-time visualization",
    path: "/test/microphone",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Speaker,
    title: "Speaker Test",
    description: "Verify left and right speaker audio output",
    path: "/test/audio",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Wifi,
    title: "Network Test",
    description: "Test connection status and network speed",
    path: "/test/network",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    icon: Cable,
    title: "Ports & Connectivity",
    description: "Verify physical ports and wireless connections",
    path: "/test/ports",
    gradient: "from-orange-500 to-red-500",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleNavigateToTest = useCallback(() => {
    navigate(tests[focusedIndex].path);
  }, [focusedIndex, navigate]);

  const handleNextTest = useCallback(() => {
    setFocusedIndex((prev) => (prev + 1) % tests.length);
  }, []);

  const handlePrevTest = useCallback(() => {
    setFocusedIndex((prev) => (prev - 1 + tests.length) % tests.length);
  }, []);

  const handleRowUp = useCallback(() => {
    setFocusedIndex((prev) => {
      const newIndex = prev - 4;
      return newIndex >= 0 ? newIndex : prev;
    });
  }, []);

  const handleRowDown = useCallback(() => {
    setFocusedIndex((prev) => {
      const newIndex = prev + 4;
      return newIndex < tests.length ? newIndex : prev;
    });
  }, []);

  useKeyboardShortcuts({
    onArrowRight: handleNextTest,
    onArrowLeft: handlePrevTest,
    onArrowUp: handleRowUp,
    onArrowDown: handleRowDown,
    onEnter: handleNavigateToTest,
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Laptop Diagnostic Tests - Free Hardware Checker 2026"
        description="Run free laptop diagnostic tests! Check display, keyboard, webcam, mic, speakers, network, touchpad & USB ports. Complete hardware testing suite for laptops."
        keywords="laptop diagnostic, laptop test, hardware test, laptop checker, pc health check, computer diagnostic, laptop diagnostics free, hardware diagnostic tool"
        canonicalPath="/dashboard"
        noIndex={true}
      />
      <Header />
      <main className="pt-24 pb-16" role="main" aria-label="Laptop Diagnostics Dashboard">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Laptop Diagnostics
            </h1>
            <p className="text-muted-foreground">
              Select a test to verify your laptop's hardware components
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2 hidden md:block">
              💡 Use arrow keys to navigate, Enter to select
            </p>
          </motion.div>

          {/* Run All Tests Card */}
          <RunAllTestsCard />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-4" id="available-tests">
              Available Tests
            </h2>
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
              role="list"
              aria-labelledby="available-tests"
            >
              {tests.map((test, index) => (
                <TestCard 
                  key={index} 
                  {...test} 
                  index={index} 
                  isFocused={focusedIndex === index}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
