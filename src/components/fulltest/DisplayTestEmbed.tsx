import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  Monitor,
  Grid3X3,
  Palette,
  Type,
  Eye,
  CircleDot,
} from "lucide-react";

interface Props {
  onComplete: () => void;
}

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

// Test Pattern Component
function TestPattern() {
  return (
    <div className="w-full h-full bg-neutral-900 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 1920 1080" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="smallGridEmbed" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#333" strokeWidth="0.5" />
          </pattern>
          <pattern id="gridEmbed" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGridEmbed)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#444" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridEmbed)" />
        
        {[100, 200, 300, 400].map((r) => (
          <circle key={r} cx="960" cy="540" r={r} fill="none" stroke="#fff" strokeWidth="2" />
        ))}
        
        <line x1="860" y1="540" x2="1060" y2="540" stroke="#fff" strokeWidth="2" />
        <line x1="960" y1="440" x2="960" y2="640" stroke="#fff" strokeWidth="2" />
        
        {[
          [50, 50], [1870, 50], [50, 1030], [1870, 1030],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="30" fill="none" stroke="#fff" strokeWidth="2" />
            <circle cx={x} cy={y} r="5" fill="#fff" />
          </g>
        ))}
        
        {["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff", "#ffffff"].map((color, i) => (
          <rect key={color} x={760 + i * 60} y="800" width="50" height="100" fill={color} />
        ))}
        
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
  const text = "The quick brown fox jumps over the lazy dog. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-8 overflow-auto"
      style={{ backgroundColor: bg, color: fg }}
    >
      <div className="max-w-4xl space-y-4 text-center">
        <p style={{ fontSize: `${fontSize}px`, lineHeight: 1.6, fontFamily: "serif" }}>{text}</p>
        <p style={{ fontSize: `${fontSize}px`, lineHeight: 1.6, fontFamily: "sans-serif" }}>{text}</p>
        <p style={{ fontSize: `${fontSize}px`, lineHeight: 1.6, fontFamily: "monospace" }}>{text}</p>
        
        <div className="mt-6 flex justify-center gap-1">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="h-16" style={{ width: "1px", backgroundColor: fg }} />
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
      <div 
        className="absolute w-32 h-32 rounded-full"
        style={{
          top: '5%',
          left: '5%',
          background: 'radial-gradient(circle, white 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.3) 50%, transparent 70%)',
        }}
      />
      <div 
        className="absolute w-32 h-32 rounded-full"
        style={{
          top: '5%',
          right: '5%',
          background: 'radial-gradient(circle, white 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.3) 50%, transparent 70%)',
        }}
      />
      <div 
        className="absolute w-40 h-40 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, white 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.3) 50%, transparent 70%)',
        }}
      />
      <div 
        className="absolute w-32 h-32 rounded-full"
        style={{
          bottom: '5%',
          left: '5%',
          background: 'radial-gradient(circle, white 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.3) 50%, transparent 70%)',
        }}
      />
      <div 
        className="absolute w-32 h-32 rounded-full"
        style={{
          bottom: '5%',
          right: '5%',
          background: 'radial-gradient(circle, white 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.3) 50%, transparent 70%)',
        }}
      />
    </div>
  );
}

// All tests
const tests: TestItem[] = [
  ...pixelColors.map((color) => ({
    id: `pixel-${color.name.toLowerCase()}`,
    name: color.name,
    category: "pixels" as TestCategory,
    description: `Check for defective pixels on ${color.name.toLowerCase()} background`,
    render: () => (
      <div className="w-full h-full" style={{ backgroundColor: color.hex }} />
    ),
  })),
  {
    id: "pattern-grid",
    name: "Test Pattern",
    category: "patterns",
    description: "Check circles, lines, and overall image quality",
    render: () => <TestPattern />,
  },
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
  {
    id: "sharpness",
    name: "Text Sharpness",
    category: "sharpness",
    description: "Check text clarity and sharpness",
    render: (params) => <SharpnessTest fontSize={params.fontSize} invert={params.invertText} />,
  },
  {
    id: "viewing-angle",
    name: "Viewing Angle",
    category: "viewing",
    description: "Test monitor's viewing angle stability",
    render: () => <ViewingAngleTest />,
  },
];

// Category config
const categories: { id: TestCategory; name: string; icon: React.ElementType }[] = [
  { id: "pixels", name: "Dead Pixels", icon: CircleDot },
  { id: "patterns", name: "Test Pattern", icon: Grid3X3 },
  { id: "gradients", name: "Gradients", icon: Palette },
  { id: "uniformity", name: "Uniformity", icon: Monitor },
  { id: "sharpness", name: "Sharpness", icon: Type },
  { id: "viewing", name: "Viewing Angle", icon: Eye },
];

const DisplayTestEmbed = ({ onComplete }: Props) => {
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Test parameters
  const [grayscale, setGrayscale] = useState(50);
  const [gradientSteps, setGradientSteps] = useState(256);
  const [fontSize, setFontSize] = useState(14);
  const [invertText, setInvertText] = useState(false);

  const currentTest = tests[currentTestIndex];
  const testParams: TestParams = { grayscale, gradientSteps, fontSize, invertText };

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
      switch (e.key) {
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
  }, [nextTest, prevTest]);

  // Group tests by category
  const testsByCategory = categories.map((cat) => ({
    ...cat,
    tests: tests.filter((t) => t.category === cat.id),
  }));

  const isLastTest = currentTestIndex === tests.length - 1;

  return (
    <div className="flex flex-col h-full min-h-[500px] relative overflow-hidden">
      {/* Test Display Area */}
      <div className="flex-1 relative">
        {/* Test Content */}
        <div className="absolute inset-0">
          {currentTest.render(testParams)}
        </div>

        {/* Navigation Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute top-0 left-0 bottom-0 w-[180px] bg-background/95 backdrop-blur-xl border-r border-border overflow-y-auto z-10"
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-foreground text-sm">Display Tests</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                </div>

                {testsByCategory.map((category) => (
                  <div key={category.id} className="mb-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                      <category.icon className="h-3 w-3" />
                      {category.name}
                    </div>
                    <div className="space-y-0.5">
                      {category.tests.map((test) => {
                        const testIndex = tests.findIndex((t) => t.id === test.id);
                        return (
                          <button
                            key={test.id}
                            onClick={() => setCurrentTestIndex(testIndex)}
                            className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors ${
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
                  <div className="mt-4 p-3 rounded-xl bg-muted/50">
                    <label className="text-[10px] font-medium text-muted-foreground mb-2 block">
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
                  <div className="mt-4 p-3 rounded-xl bg-muted/50">
                    <label className="text-[10px] font-medium text-muted-foreground mb-2 block">
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
                  <div className="mt-4 space-y-3">
                    <div className="p-3 rounded-xl bg-muted/50">
                      <label className="text-[10px] font-medium text-muted-foreground mb-2 block">
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
                      className="w-full text-left px-3 py-2 rounded-xl bg-muted/50 text-xs hover:bg-muted transition-colors"
                    >
                      {invertText ? "Switch to Black on White" : "Switch to White on Black"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Toggle (when closed) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-muted transition-colors z-10"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Close button */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-muted transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Test Counter */}
        <div className="absolute top-4 right-16 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm border border-border text-xs font-medium z-10">
          {currentTestIndex + 1} / {tests.length}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-4 bg-background border-t border-border">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={prevTest}
            disabled={currentTestIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex-1 text-center">
            <p className="text-sm font-medium text-foreground">{currentTest.name}</p>
            <p className="text-xs text-muted-foreground">{currentTest.description}</p>
          </div>

          {isLastTest ? (
            <Button size="sm" onClick={onComplete}>
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Complete Test
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={nextTest}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
        
        {/* Keyboard shortcuts hint */}
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Tab: toggle menu • ←→: navigate
        </p>
      </div>
    </div>
  );
};

export default DisplayTestEmbed;
