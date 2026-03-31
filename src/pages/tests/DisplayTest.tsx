import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SEOHead, structuredData } from "@/components/SEOHead";
import {
  ArrowLeft,
  Expand,
  Minimize,
  ChevronLeft,
  ChevronRight,
  X,
  Monitor,
  Grid3X3,
  Palette,
  SlidersHorizontal,
  Type,
  Eye,
  CircleDot,
} from "lucide-react";

// Test categories
type TestCategory = "pixels" | "patterns" | "gradients" | "uniformity" | "sharpness" | "viewing";

interface TestItem {
  id: string;
  name: string;
  category: TestCategory;
  description: string;
  render: (params: TestParams) => React.ReactNode;
}

interface TestParams {
  grayscale: number;
  gradientSteps: number;
  fontSize: number;
  invertText: boolean;
}

// Solid colors for dead pixel test
const pixelColors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#FF0000" },
  { name: "Green", hex: "#00FF00" },
  { name: "Blue", hex: "#0000FF" },
];

// All tests
const tests: TestItem[] = [
  // Dead Pixel Tests
  ...pixelColors.map((color) => ({
    id: `pixel-${color.name.toLowerCase()}`,
    name: `${color.name}`,
    category: "pixels" as TestCategory,
    description: `Check for defective pixels on ${color.name.toLowerCase()} background`,
    render: () => (
      <div className="w-full h-full" style={{ backgroundColor: color.hex }} />
    ),
  })),
  // Test Pattern
  {
    id: "pattern-grid",
    name: "Test Pattern",
    category: "patterns",
    description: "Check circles, lines, and overall image quality",
    render: () => <TestPattern />,
  },
  // Gradients
  {
    id: "gradient-grayscale",
    name: "Grayscale",
    category: "gradients",
    description: "Check for banding in grayscale gradient",
    render: (params) => <GradientTest steps={params.gradientSteps} color="gray" />,
  },
  {
    id: "gradient-red",
    name: "Red Gradient",
    category: "gradients",
    description: "Check for banding in red gradient",
    render: (params) => <GradientTest steps={params.gradientSteps} color="red" />,
  },
  {
    id: "gradient-green",
    name: "Green Gradient",
    category: "gradients",
    description: "Check for banding in green gradient",
    render: (params) => <GradientTest steps={params.gradientSteps} color="green" />,
  },
  {
    id: "gradient-blue",
    name: "Blue Gradient",
    category: "gradients",
    description: "Check for banding in blue gradient",
    render: (params) => <GradientTest steps={params.gradientSteps} color="blue" />,
  },
  // Uniformity
  {
    id: "uniformity",
    name: "Uniformity",
    category: "uniformity",
    description: "Check brightness uniformity across the screen",
    render: (params) => (
      <div
        className="w-full h-full"
        style={{ backgroundColor: `hsl(0, 0%, ${params.grayscale}%)` }}
      />
    ),
  },
  // Sharpness
  {
    id: "sharpness",
    name: "Text Sharpness",
    category: "sharpness",
    description: "Check text clarity and sharpness",
    render: (params) => <SharpnessTest fontSize={params.fontSize} invert={params.invertText} />,
  },
  // Viewing Angle
  {
    id: "viewing-angle",
    name: "Viewing Angle",
    category: "viewing",
    description: "Test monitor's viewing angle stability",
    render: () => <ViewingAngleTest />,
  },
];

// Test Pattern Component
function TestPattern() {
  return (
    <div className="w-full h-full bg-neutral-900 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 1920 1080" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Background grid */}
        <defs>
          <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#333" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#444" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Center circles */}
        {[100, 200, 300, 400].map((r) => (
          <circle key={r} cx="960" cy="540" r={r} fill="none" stroke="#fff" strokeWidth="2" />
        ))}
        
        {/* Center crosshair */}
        <line x1="860" y1="540" x2="1060" y2="540" stroke="#fff" strokeWidth="2" />
        <line x1="960" y1="440" x2="960" y2="640" stroke="#fff" strokeWidth="2" />
        
        {/* Corner markers */}
        {[
          [50, 50], [1870, 50], [50, 1030], [1870, 1030],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="30" fill="none" stroke="#fff" strokeWidth="2" />
            <circle cx={x} cy={y} r="5" fill="#fff" />
          </g>
        ))}
        
        {/* Color bars */}
        {["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff", "#ffffff"].map((color, i) => (
          <rect key={color} x={760 + i * 60} y="800" width="50" height="100" fill={color} />
        ))}
        
        {/* Grayscale bars */}
        {Array.from({ length: 11 }).map((_, i) => (
          <rect key={i} x={460 + i * 40} y="920" width="35" height="60" fill={`rgb(${i * 25.5}, ${i * 25.5}, ${i * 25.5})`} />
        ))}
      </svg>
    </div>
  );
}

// Gradient Test Component
function GradientTest({ steps, color }: { steps: number; color: string }) {
  const getColor = (value: number) => {
    switch (color) {
      case "red": return `rgb(${value}, 0, 0)`;
      case "green": return `rgb(0, ${value}, 0)`;
      case "blue": return `rgb(0, 0, ${value})`;
      default: return `rgb(${value}, ${value}, ${value})`;
    }
  };

  if (steps >= 256) {
    // Smooth gradient
    const gradientColor = color === "gray" ? "white" : color;
    return (
      <div
        className="w-full h-full"
        style={{
          background: `linear-gradient(to right, black, ${gradientColor})`,
        }}
      />
    );
  }

  // Stepped gradient
  return (
    <div className="w-full h-full flex">
      {Array.from({ length: steps }).map((_, i) => (
        <div
          key={i}
          className="h-full flex-1"
          style={{ backgroundColor: getColor(Math.round((i / (steps - 1)) * 255)) }}
        />
      ))}
    </div>
  );
}

// Sharpness Test Component
function SharpnessTest({ fontSize, invert }: { fontSize: number; invert: boolean }) {
  const bg = invert ? "#000" : "#fff";
  const fg = invert ? "#fff" : "#000";
  const text = "The quick brown fox jumps over the lazy dog. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz !@#$%^&*()";

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-8 overflow-auto"
      style={{ backgroundColor: bg, color: fg }}
    >
      <div className="max-w-4xl space-y-6 text-center">
        <p style={{ fontSize: `${fontSize}px`, lineHeight: 1.6, fontFamily: "serif" }}>{text}</p>
        <p style={{ fontSize: `${fontSize}px`, lineHeight: 1.6, fontFamily: "sans-serif" }}>{text}</p>
        <p style={{ fontSize: `${fontSize}px`, lineHeight: 1.6, fontFamily: "monospace" }}>{text}</p>
        
        {/* Fine lines test */}
        <div className="mt-8 flex justify-center gap-1">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="h-20" style={{ width: "1px", backgroundColor: fg }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Viewing Angle Test Component
function ViewingAngleTest() {
  return (
    <div className="w-full h-full bg-black relative">
      {/* Five radial gradient circles */}
      {/* Top-left */}
      <div 
        className="absolute w-56 h-56 rounded-full"
        style={{
          top: '5%',
          left: '5%',
          background: 'radial-gradient(circle, white 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.3) 50%, transparent 70%)',
        }}
      />
      {/* Top-right */}
      <div 
        className="absolute w-56 h-56 rounded-full"
        style={{
          top: '5%',
          right: '5%',
          background: 'radial-gradient(circle, white 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.3) 50%, transparent 70%)',
        }}
      />
      {/* Center */}
      <div 
        className="absolute w-64 h-64 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, white 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.3) 50%, transparent 70%)',
        }}
      />
      {/* Bottom-left */}
      <div 
        className="absolute w-56 h-56 rounded-full"
        style={{
          bottom: '5%',
          left: '5%',
          background: 'radial-gradient(circle, white 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.3) 50%, transparent 70%)',
        }}
      />
      {/* Bottom-right */}
      <div 
        className="absolute w-56 h-56 rounded-full"
        style={{
          bottom: '5%',
          right: '5%',
          background: 'radial-gradient(circle, white 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.3) 50%, transparent 70%)',
        }}
      />
    </div>
  );
}

// Category config
const categories: { id: TestCategory; name: string; icon: React.ElementType }[] = [
  { id: "pixels", name: "Dead Pixels", icon: CircleDot },
  { id: "patterns", name: "Test Pattern", icon: Grid3X3 },
  { id: "gradients", name: "Gradients", icon: Palette },
  { id: "uniformity", name: "Uniformity", icon: Monitor },
  { id: "sharpness", name: "Sharpness", icon: Type },
  { id: "viewing", name: "Viewing Angle", icon: Eye },
];

const DisplayTest = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Test parameters
  const [grayscale, setGrayscale] = useState(50);
  const [gradientSteps, setGradientSteps] = useState(256);
  const [fontSize, setFontSize] = useState(14);
  const [invertText, setInvertText] = useState(false);

  const currentTest = tests[currentTestIndex];
  const testParams: TestParams = { grayscale, gradientSteps, fontSize, invertText };

  const enterFullscreen = (testIndex: number) => {
    setCurrentTestIndex(testIndex);
    setIsFullscreen(true);
    document.documentElement.requestFullscreen?.();
  };

  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false);
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  }, []);

  const nextTest = useCallback(() => {
    if (currentTestIndex < tests.length - 1) {
      setCurrentTestIndex(currentTestIndex + 1);
    }
  }, [currentTestIndex]);

  const prevTest = useCallback(() => {
    if (currentTestIndex > 0) {
      setCurrentTestIndex(currentTestIndex - 1);
    }
  }, [currentTestIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      switch (e.key) {
        case "Escape":
          exitFullscreen();
          break;
        case " ":
          e.preventDefault();
          setShowControls((prev) => !prev);
          break;
        case "ArrowRight":
        case "ArrowDown":
          nextTest();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          prevTest();
          break;
        case "Tab":
          e.preventDefault();
          setSidebarOpen((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, exitFullscreen, nextTest, prevTest]);

  // Group tests by category
  const testsByCategory = categories.map((cat) => ({
    ...cat,
    tests: tests.filter((t) => t.category === cat.id),
  }));

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <SEOHead
        title="Dead Pixel Test & Screen Test Online Free 2026"
        description="Free dead pixel test online! Check your screen for dead pixels, stuck pixels, color accuracy & uniformity. Best display test for LCD, OLED, laptop & monitor screens."
        keywords="dead pixel test, screen test, dead pixel checker, stuck pixel test, monitor test, display test, lcd test, oled test, screen uniformity test, color accuracy test, pixel test online"
        canonicalPath="/test/display"
        structuredData={structuredData.howTo(
          "How to Test Your Screen for Dead Pixels",
          "Use our free dead pixel test to check your display for defective pixels and color issues.",
          [
            { name: "Open fullscreen mode", text: "Click any color test to enter fullscreen" },
            { name: "Check each color", text: "Look for pixels that don't match the background color" },
            { name: "Test gradients", text: "Check for color banding in gradient tests" },
            { name: "Verify uniformity", text: "Ensure brightness is even across the screen" },
          ]
        )}
      />
      <Header />

      {/* Fullscreen Test Mode */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black overflow-hidden"
          >
            {/* Test Content */}
            <div className="w-full h-full">
              {currentTest.render(testParams)}
            </div>

            {/* Navigation Sidebar */}
            <AnimatePresence>
              {showControls && sidebarOpen && (
                <motion.div
                  initial={{ x: -320, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -320, opacity: 0 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="fixed top-0 left-0 bottom-0 w-72 bg-background/95 backdrop-blur-xl border-r border-border overflow-y-auto"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-foreground">Display Tests</h2>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                    </div>

                    {testsByCategory.map((category) => (
                      <div key={category.id} className="mb-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                          <category.icon className="h-3.5 w-3.5" />
                          {category.name}
                        </div>
                        <div className="space-y-1">
                          {category.tests.map((test) => {
                            const testIndex = tests.findIndex((t) => t.id === test.id);
                            return (
                              <button
                                key={test.id}
                                onClick={() => setCurrentTestIndex(testIndex)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                  currentTestIndex === testIndex
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted text-foreground"
                                }`}
                              >
                                {test.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {/* Parameter Controls */}
                    {currentTest.category === "uniformity" && (
                      <div className="mt-6 p-4 rounded-xl bg-muted/50">
                        <label className="text-xs font-medium text-muted-foreground mb-2 block">
                          Gray Level: {grayscale}%
                        </label>
                        <Slider
                          value={[grayscale]}
                          onValueChange={([v]) => setGrayscale(v)}
                          min={0}
                          max={100}
                          step={1}
                        />
                      </div>
                    )}

                    {currentTest.category === "gradients" && (
                      <div className="mt-6 p-4 rounded-xl bg-muted/50">
                        <label className="text-xs font-medium text-muted-foreground mb-2 block">
                          Steps: {gradientSteps}
                        </label>
                        <Slider
                          value={[gradientSteps]}
                          onValueChange={([v]) => setGradientSteps(v)}
                          min={8}
                          max={256}
                          step={8}
                        />
                      </div>
                    )}

                    {currentTest.category === "sharpness" && (
                      <div className="mt-6 space-y-4">
                        <div className="p-4 rounded-xl bg-muted/50">
                          <label className="text-xs font-medium text-muted-foreground mb-2 block">
                            Font Size: {fontSize}px
                          </label>
                          <Slider
                            value={[fontSize]}
                            onValueChange={([v]) => setFontSize(v)}
                            min={8}
                            max={32}
                            step={1}
                          />
                        </div>
                        <button
                          onClick={() => setInvertText(!invertText)}
                          className="w-full px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
                        >
                          {invertText ? "White on Black" : "Black on White"}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sidebar Toggle (when closed) */}
            <AnimatePresence>
              {showControls && !sidebarOpen && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => setSidebarOpen(true)}
                  className="fixed top-4 left-4 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-muted transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Top Controls */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed top-4 right-4 flex items-center gap-2"
                >
                  <div className="px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
                    <span className="text-sm text-foreground font-medium">
                      {currentTestIndex + 1} / {tests.length}
                    </span>
                  </div>
                  <button
                    onClick={exitFullscreen}
                    className="p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Info & Navigation */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3"
                >
                  <button
                    onClick={prevTest}
                    disabled={currentTestIndex === 0}
                    className="p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <div className="px-6 py-3 rounded-xl bg-background/80 backdrop-blur-sm border border-border text-center min-w-64">
                    <p className="font-medium text-foreground">{currentTest.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{currentTest.description}</p>
                  </div>
                  
                  <button
                    onClick={nextTest}
                    disabled={currentTestIndex === tests.length - 1}
                    className="p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Keyboard Hints */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed bottom-4 right-4 text-xs text-muted-foreground bg-background/60 backdrop-blur-sm px-3 py-2 rounded-lg"
                >
                  <span className="opacity-70">Space: toggle UI • Tab: menu • ←→: navigate • Esc: exit</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

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
              Display & Screen Test
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Comprehensive display testing for dead pixels, color accuracy, gradients, and sharpness.
              Click any test to enter fullscreen mode.
            </p>
          </motion.div>

          {/* Big Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <Button
              size="lg"
              onClick={() => enterFullscreen(0)}
              className="h-14 px-8 text-lg font-semibold gap-3"
            >
              <Expand className="h-5 w-5" />
              Start Screen Test
            </Button>
          </motion.div>

          {/* Test Categories */}
          {testsByCategory.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <category.icon className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">{category.name}</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {category.tests.map((test) => {
                  const testIndex = tests.findIndex((t) => t.id === test.id);
                  return (
                    <motion.button
                      key={test.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => enterFullscreen(testIndex)}
                      className="group relative aspect-video rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all bg-card"
                    >
                      <div className="absolute inset-0 overflow-hidden">
                        {test.render(testParams)}
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm">
                        <Expand className="h-5 w-5 text-white mb-2" />
                        <span className="text-sm font-medium text-white">{test.name}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {/* Screen Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Your Display Information
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Resolution</p>
                <p className="font-semibold text-foreground">
                  {window.screen.width} × {window.screen.height}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Color Depth</p>
                <p className="font-semibold text-foreground">
                  {window.screen.colorDepth} bit
                </p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Pixel Ratio</p>
                <p className="font-semibold text-foreground">
                  {window.devicePixelRatio}x
                </p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Available Size</p>
                <p className="font-semibold text-foreground">
                  {window.screen.availWidth} × {window.screen.availHeight}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10"
          >
            <h3 className="font-semibold text-foreground mb-3">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <kbd className="px-2 py-1 rounded bg-muted text-xs font-mono">Space</kbd>
                <span className="ml-2 text-muted-foreground">Toggle UI</span>
              </div>
              <div>
                <kbd className="px-2 py-1 rounded bg-muted text-xs font-mono">Tab</kbd>
                <span className="ml-2 text-muted-foreground">Toggle menu</span>
              </div>
              <div>
                <kbd className="px-2 py-1 rounded bg-muted text-xs font-mono">← →</kbd>
                <span className="ml-2 text-muted-foreground">Navigate tests</span>
              </div>
              <div>
                <kbd className="px-2 py-1 rounded bg-muted text-xs font-mono">Esc</kbd>
                <span className="ml-2 text-muted-foreground">Exit fullscreen</span>
              </div>
            </div>
          </motion.div>

          <RelatedArticles articles={[
            { title: "Used Laptop Buying Guide: How to Test Hardware Before You Buy", slug: "what-to-check-buying-used-laptop", excerpt: "Learn how to test the screen, keyboard, speakers, and ports instantly before buying a used laptop." },
          ]} />

          <RelatedTests tests={[
            { title: "Keyboard Test", path: "/test/keyboard", icon: Keyboard, description: "Test all keys" },
            { title: "Camera Test", path: "/test/camera", icon: Camera, description: "Check your webcam" },
            { title: "Full System Test", path: "/test/full", icon: Monitor, description: "Complete diagnostic" },
          ]} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DisplayTest;