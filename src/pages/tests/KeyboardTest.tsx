import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, CheckCircle2, Settings2, PartyPopper } from "lucide-react";
import { useConfetti } from "@/hooks/useConfetti";
import { KeyboardTypeModal } from "@/components/keyboard/KeyboardTypeModal";
import {
  KeyboardType,
  getKeyboardLayout,
  getKeyDisplay,
  getKeyWidth,
} from "@/components/keyboard/keyboardLayouts";

const KEYBOARD_TYPE_KEY = "laptop-keyboard-type";

const KeyboardTest = () => {
  const [keyboardType, setKeyboardType] = useState<KeyboardType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [lastKey, setLastKey] = useState<string>("");
  const [lastKeyCode, setLastKeyCode] = useState<string>("");
  const [justPressed, setJustPressed] = useState<string | null>(null);
  const [testCompleted, setTestCompleted] = useState(false);
  const { fireConfetti } = useConfetti();

  // Check for stored keyboard type on mount
  useEffect(() => {
    const stored = localStorage.getItem(KEYBOARD_TYPE_KEY);
    if (stored === "mac" || stored === "windows") {
      setKeyboardType(stored);
    } else {
      setShowModal(true);
    }
  }, []);

  const handleKeyboardSelect = (type: KeyboardType) => {
    localStorage.setItem(KEYBOARD_TYPE_KEY, type);
    setKeyboardType(type);
    setShowModal(false);
    // Reset test when changing keyboard type
    setPressedKeys(new Set());
    setLastKey("");
    setLastKeyCode("");
  };

  const handleChangeKeyboard = () => {
    setShowModal(true);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    const key = e.key;
    
    setLastKey(key);
    setLastKeyCode(e.code);
    
    // Normalize key for comparison - keep F-keys as-is, uppercase letters
    const normalizedKey = key.startsWith("F") && key.length <= 3 ? key : key.toUpperCase();
    setPressedKeys((prev) => new Set(prev).add(normalizedKey));
    
    // Trigger animation for this specific key
    setJustPressed(normalizedKey);
    setTimeout(() => setJustPressed(null), 600);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const keyboardLayout = keyboardType ? getKeyboardLayout(keyboardType) : [];
  const totalKeys = keyboardLayout.flat().length;
  const testedKeys = pressedKeys.size;
  const progress = totalKeys > 0 ? Math.round((testedKeys / totalKeys) * 100) : 0;

  // Check for test completion (only when all keys are tested)
  useEffect(() => {
    if (progress === 100 && !testCompleted) {
      setTestCompleted(true);
      fireConfetti();
    }
  }, [progress, testCompleted, fireConfetti]);

  const resetTest = () => {
    setPressedKeys(new Set());
    setLastKey("");
    setLastKeyCode("");
    setTestCompleted(false);
  };

  const isKeyPressed = (key: string) => {
    // Check both original key and normalized versions for F-keys
    const normalizedKey = key.startsWith("F") && key.length <= 3 ? key : key.toUpperCase();
    return pressedKeys.has(normalizedKey) || pressedKeys.has(key) || pressedKeys.has(key.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Keyboard Type Selection Modal */}
      <KeyboardTypeModal isOpen={showModal} onSelect={handleKeyboardSelect} />

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
              Keyboard Test
            </h1>
            <p className="text-muted-foreground mb-4">
              Press any key to test. Keys will light up green when pressed.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Button variant="outline" size="sm" onClick={resetTest}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Test
              </Button>
              <Button variant="ghost" size="sm" onClick={handleChangeKeyboard}>
                <Settings2 className="h-4 w-4 mr-2" />
                {keyboardType === "mac" ? "Mac Keyboard" : "Windows Keyboard"}
              </Button>
            </div>
          </motion.div>

          {keyboardType && (
            <>
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
                        const isJustPressed = justPressed === key.toUpperCase() || justPressed === key;
                        
                        return (
                          <motion.div
                            key={`${rowIndex}-${keyIndex}`}
                            initial={false}
                            animate={
                              isJustPressed
                                ? {
                                    scale: [1, 1.15, 1],
                                    boxShadow: [
                                      "0 0 0 0 rgba(34, 197, 94, 0)",
                                      "0 0 20px 8px rgba(34, 197, 94, 0.6)",
                                      "0 0 0 0 rgba(34, 197, 94, 0)"
                                    ],
                                  }
                                : {}
                            }
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={`${getKeyWidth(key, keyboardType)} h-12 flex items-center justify-center rounded-lg font-medium text-sm transition-colors duration-200 ${
                              pressed
                                ? "bg-success text-success-foreground"
                                : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                          >
                            {pressed && (
                              <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                              </motion.span>
                            )}
                            {getKeyDisplay(key, keyboardType)}
                          </motion.div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Congratulations Message */}
              {testCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                  className="mt-6 p-6 rounded-2xl bg-success/10 border border-success/30 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mb-4"
                  >
                    <PartyPopper className="h-8 w-8 text-success" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-success mb-2">
                    🎉 Congratulations!
                  </h3>
                  <p className="text-foreground font-medium mb-1">
                    Your keyboard is working perfectly!
                  </p>
                  <p className="text-muted-foreground text-sm">
                    All {totalKeys} keys have been tested and are functioning correctly.
                  </p>
                </motion.div>
              )}

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
                  {keyboardType === "mac" && (
                    <li>• Mac keyboards use ⌘ Command and ⌥ Option instead of Windows key and Alt</li>
                  )}
                </ul>
              </motion.div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default KeyboardTest;
