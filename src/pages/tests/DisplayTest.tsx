import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Expand, Minimize } from "lucide-react";

const colors = [
  { name: "Red", hex: "#FF0000", description: "Check for stuck red pixels" },
  { name: "Green", hex: "#00FF00", description: "Check for stuck green pixels" },
  { name: "Blue", hex: "#0000FF", description: "Check for stuck blue pixels" },
  { name: "White", hex: "#FFFFFF", description: "Check for dead/black pixels" },
  { name: "Black", hex: "#000000", description: "Check for bright/stuck pixels" },
  { name: "Cyan", hex: "#00FFFF", description: "Additional color check" },
  { name: "Magenta", hex: "#FF00FF", description: "Additional color check" },
  { name: "Yellow", hex: "#FFFF00", description: "Additional color check" },
];

const DisplayTest = () => {
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enterFullscreen = (colorIndex: number) => {
    setActiveColor(colorIndex);
    setIsFullscreen(true);
    document.documentElement.requestFullscreen?.();
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
    setActiveColor(null);
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  };

  const nextColor = () => {
    if (activeColor !== null && activeColor < colors.length - 1) {
      setActiveColor(activeColor + 1);
    } else {
      exitFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Fullscreen Color Display */}
      <AnimatePresence>
        {isFullscreen && activeColor !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] cursor-pointer flex items-center justify-center"
            style={{ backgroundColor: colors[activeColor].hex }}
            onClick={nextColor}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-black/50 backdrop-blur-sm text-white text-center"
            >
              <p className="text-sm font-medium">
                {colors[activeColor].name} — {colors[activeColor].description}
              </p>
              <p className="text-xs opacity-70 mt-1">
                Click anywhere for next color • ESC to exit
              </p>
            </motion.div>
            <button
              onClick={(e) => { e.stopPropagation(); exitFullscreen(); }}
              className="absolute top-4 right-4 p-2 rounded-lg bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
            >
              <Minimize className="h-5 w-5" />
            </button>
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
              Test your display for dead pixels, stuck pixels, and color accuracy.
              Click on any color below to view it fullscreen and inspect your screen.
            </p>
          </motion.div>

          {/* Color Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Dead Pixel Test Colors
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {colors.map((color, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => enterFullscreen(index)}
                  className="group relative aspect-video rounded-2xl overflow-hidden border border-border shadow-md hover:shadow-lg transition-shadow"
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-white">
                      <Expand className="h-5 w-5" />
                      <span className="font-medium">{color.name}</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Screen Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10"
          >
            <h3 className="font-semibold text-foreground mb-3">How to Test</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>1. Click on any color card above to view it fullscreen</li>
              <li>2. Look carefully at your entire screen for any pixels that don't match the color</li>
              <li>3. Dead pixels appear as black dots on bright colors</li>
              <li>4. Stuck pixels appear as colored dots that don't change with the background</li>
              <li>5. Click anywhere to cycle through all colors, or press ESC to exit</li>
            </ol>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DisplayTest;
