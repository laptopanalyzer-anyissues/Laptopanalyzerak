import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, CheckCircle2 } from "lucide-react";

// Standard QWERTY keyboard layout
const keyboardLayout = [
  ["Escape", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
  ["Control", "Meta", "Alt", " ", "Alt", "Meta", "Control"],
];

const getKeyDisplay = (key: string) => {
  const displayMap: Record<string, string> = {
    " ": "Space",
    "Escape": "Esc",
    "Backspace": "⌫",
    "Tab": "Tab",
    "CapsLock": "Caps",
    "Enter": "Enter",
    "Shift": "Shift",
    "Control": "Ctrl",
    "Meta": "⌘",
    "Alt": "Alt",
  };
  return displayMap[key] || key;
};

const getKeyWidth = (key: string) => {
  const widths: Record<string, string> = {
    "Backspace": "w-24",
    "Tab": "w-16",
    "CapsLock": "w-20",
    "Enter": "w-24",
    "Shift": "w-28",
    "Control": "w-16",
    "Meta": "w-14",
    "Alt": "w-14",
    " ": "flex-1",
  };
  return widths[key] || "w-12";
};

const KeyboardTest = () => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [lastKey, setLastKey] = useState<string>("");
  const [lastKeyCode, setLastKeyCode] = useState<string>("");

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    const key = e.key;
    setLastKey(key);
    setLastKeyCode(e.code);
    setPressedKeys((prev) => new Set(prev).add(key.toUpperCase()));
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const totalKeys = keyboardLayout.flat().length;
  const testedKeys = pressedKeys.size;
  const progress = Math.round((testedKeys / totalKeys) * 100);

  const resetTest = () => {
    setPressedKeys(new Set());
    setLastKey("");
    setLastKeyCode("");
  };

  const isKeyPressed = (key: string) => {
    return pressedKeys.has(key.toUpperCase()) || pressedKeys.has(key);
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
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Keyboard Test
                </h1>
                <p className="text-muted-foreground">
                  Press any key to test. Keys will light up green when pressed.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={resetTest}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Test
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="p-4 rounded-xl bg-card border border-border">
              <p className="text-xs text-muted-foreground mb-1">Progress</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-primary to-accent"
                  />
                </div>
                <span className="text-sm font-semibold">{progress}%</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <p className="text-xs text-muted-foreground mb-1">Keys Tested</p>
              <p className="font-semibold text-foreground text-lg">
                {testedKeys} / {totalKeys}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <p className="text-xs text-muted-foreground mb-1">Last Key</p>
              <p className="font-semibold text-foreground text-lg">
                {lastKey || "—"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <p className="text-xs text-muted-foreground mb-1">Key Code</p>
              <p className="font-semibold text-foreground text-lg">
                {lastKeyCode || "—"}
              </p>
            </div>
          </motion.div>

          {/* Virtual Keyboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card rounded-2xl p-6 overflow-x-auto"
          >
            <div className="min-w-[800px]">
              {keyboardLayout.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-1.5 mb-1.5 justify-center">
                  {row.map((key, keyIndex) => {
                    const pressed = isKeyPressed(key);
                    return (
                      <motion.div
                        key={`${rowIndex}-${keyIndex}`}
                        animate={pressed ? { scale: [1, 0.95, 1] } : {}}
                        className={`${getKeyWidth(key)} h-12 flex items-center justify-center rounded-lg font-medium text-sm transition-all duration-200 ${
                          pressed
                            ? "bg-success text-success-foreground shadow-md"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        {pressed && <CheckCircle2 className="h-4 w-4 mr-1" />}
                        {getKeyDisplay(key)}
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10"
          >
            <h3 className="font-semibold text-foreground mb-3">Testing Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Press each key firmly to test if it registers</li>
              <li>• Green keys indicate they've been successfully tested</li>
              <li>• If a key doesn't light up, try pressing it multiple times</li>
              <li>• Check function keys (F1-F12) — they may require Fn key on some laptops</li>
            </ul>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default KeyboardTest;
