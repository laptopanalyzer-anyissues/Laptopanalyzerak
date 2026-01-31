import { useState, useRef, forwardRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { SEOHead, structuredData } from "@/components/SEOHead";
import { ArrowLeft, Mouse, RotateCcw, CheckCircle2 } from "lucide-react";

const TouchpadTest = forwardRef<HTMLDivElement>((_, ref) => {
  const [leftClicks, setLeftClicks] = useState(0);
  const [rightClicks, setRightClicks] = useState(0);
  const [scrollEvents, setScrollEvents] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const trackingAreaRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPosition({ x, y });
    setTrail((prev) => [...prev.slice(-20), { x, y }]);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.button === 0) {
      setLeftClicks((prev) => prev + 1);
    } else if (e.button === 2) {
      setRightClicks((prev) => prev + 1);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setRightClicks((prev) => prev + 1);
  };

  const handleScroll = (e: React.WheelEvent) => {
    setScrollEvents((prev) => prev + 1);
  };

  const resetTest = () => {
    setLeftClicks(0);
    setRightClicks(0);
    setScrollEvents(0);
    setTrail([]);
  };

  return (
    <div ref={ref} className="min-h-screen bg-background">
      <SEOHead
        title="Touchpad Test Online - Test Mouse & Trackpad Free 2026"
        description="Free touchpad test online! Check cursor tracking, left/right click, and scroll on your laptop trackpad or mouse. Test touchpad gestures and responsiveness."
        keywords="touchpad test, trackpad test, mouse test, cursor test, laptop touchpad test, click test, scroll test, mouse tester, trackpad checker, touchpad gestures test"
        canonicalPath="/test/touchpad"
        structuredData={structuredData.howTo(
          "How to Test Your Touchpad or Mouse",
          "Use our free touchpad tester to verify cursor tracking and clicks work correctly.",
          [
            { name: "Move cursor in tracking area", text: "Test smooth cursor movement" },
            { name: "Test left click", text: "Click to verify left mouse button" },
            { name: "Test right click", text: "Right-click to verify right button" },
            { name: "Test scroll", text: "Scroll up and down to verify scroll function" },
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
              Touchpad & Mouse Test
            </h1>
            <p className="text-muted-foreground">
              Test cursor tracking, clicks, and scroll functionality.
            </p>
            <Button variant="outline" size="sm" onClick={resetTest} className="mt-4">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Test
            </Button>
          </motion.div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12 flex justify-center flex-col items-center"
          >
            <Button
              size="lg"
              className="h-14 px-8 text-lg font-semibold gap-3"
              onClick={() => {
                trackingAreaRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Mouse className="h-5 w-5" />
              Start Touchpad Test
            </Button>
            <p className="text-sm text-muted-foreground mt-2">Move your cursor to the tracking area below</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tracking Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Cursor Tracking Area</h3>
                <div
                  ref={trackingAreaRef}
                  className="relative aspect-video bg-muted rounded-xl overflow-hidden cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onClick={handleClick}
                  onContextMenu={handleContextMenu}
                  onWheel={handleScroll}
                >
                  {/* Grid */}
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 pointer-events-none">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-border/20" />
                    ))}
                  </div>

                  {/* Cursor Trail */}
                  {trail.map((point, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-primary pointer-events-none"
                      style={{ left: point.x - 4, top: point.y - 4 }}
                      initial={{ opacity: 0.8, scale: 1 }}
                      animate={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.5 }}
                    />
                  ))}

                  {/* Current Position */}
                  <div
                    className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ left: cursorPosition.x, top: cursorPosition.y }}
                  >
                    <div className="w-full h-full rounded-full border-2 border-primary bg-primary/20 animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
                  </div>

                  {/* Instructions */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm text-sm text-muted-foreground">
                    Move cursor • Left/Right click • Scroll
                  </div>
                </div>

                {/* Coordinates */}
                <div className="mt-4 flex gap-4 text-sm">
                  <div className="px-3 py-1.5 rounded-lg bg-muted">
                    <span className="text-muted-foreground">X:</span>{" "}
                    <span className="font-mono font-semibold">{Math.round(cursorPosition.x)}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-muted">
                    <span className="text-muted-foreground">Y:</span>{" "}
                    <span className="font-mono font-semibold">{Math.round(cursorPosition.y)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              {/* Click Stats */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Click Detection</h3>
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-xl flex items-center justify-between ${
                      leftClicks > 0 ? "bg-success/10" : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {leftClicks > 0 && <CheckCircle2 className="h-5 w-5 text-success" />}
                      <span className="text-foreground">Left Click</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">{leftClicks}</span>
                  </div>
                  <div
                    className={`p-4 rounded-xl flex items-center justify-between ${
                      rightClicks > 0 ? "bg-success/10" : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {rightClicks > 0 && <CheckCircle2 className="h-5 w-5 text-success" />}
                      <span className="text-foreground">Right Click</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">{rightClicks}</span>
                  </div>
                  <div
                    className={`p-4 rounded-xl flex items-center justify-between ${
                      scrollEvents > 0 ? "bg-success/10" : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {scrollEvents > 0 && <CheckCircle2 className="h-5 w-5 text-success" />}
                      <span className="text-foreground">Scroll</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">{scrollEvents}</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                <h3 className="font-semibold text-foreground mb-3">What to Check</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Smooth cursor movement</li>
                  <li>• Responsive left/right clicks</li>
                  <li>• Scroll up and down works</li>
                  <li>• No cursor jumping or lag</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
});

TouchpadTest.displayName = "TouchpadTest";

export default TouchpadTest;
