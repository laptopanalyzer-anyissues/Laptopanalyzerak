import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, CheckCircle2, Settings2 } from "lucide-react";
import { useConfetti } from "@/hooks/useConfetti";
import { KeyboardTypeModal } from "@/components/keyboard/KeyboardTypeModal";
import { SEOHead, structuredData } from "@/components/SEOHead";
import {
  KeyboardType,
  getKeyboardLayout,
  getKeyDisplay,
  getKeyWidth,
  untestableKeys,
} from "@/components/keyboard/keyboardLayouts";

const KEYBOARD_TYPE_KEY = "laptop-keyboard-type";

const KeyboardTest = () => {
  const [keyboardType, setKeyboardType] = useState<KeyboardType | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [lastKey, setLastKey] = useState<string>("");
  const [lastKeyCode, setLastKeyCode] = useState<string>("");
  const [justPressed, setJustPressed] = useState<string | null>(null);
  const [testCompleted, setTestCompleted] = useState(false);
  const { fireConfetti } = useConfetti();
  const completionRef = useRef<HTMLDivElement>(null);

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
    
    // Debug logging for F-keys
    console.log('Key pressed:', { key, code: e.code, keyCode: e.keyCode });
    
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

  const isKeyPressed = (key: string) => {
    const normalizedKey = key.startsWith("F") && key.length <= 3 ? key : key.toUpperCase();
    return pressedKeys.has(normalizedKey) || pressedKeys.has(key) || pressedKeys.has(key.toUpperCase());
  };

  // Exclude untestable keys and deduplicate for accurate counting
  const testableKeys = [...new Set(keyboardLayout.flat().filter(key => !untestableKeys.includes(key)))];
  const totalKeys = testableKeys.length;
  // Only count pressed keys that actually match a testable layout key
  const testedKeys = testableKeys.filter(key => isKeyPressed(key)).length;
  const progress = totalKeys > 0 ? Math.min(100, Math.round((testedKeys / totalKeys) * 100)) : 0;

  // Check for test completion (only when all keys are tested)
  useEffect(() => {
    if (progress === 100 && !testCompleted) {
      setTestCompleted(true);
      // Delay confetti slightly so the banner renders first
      setTimeout(() => {
        fireConfetti();
        completionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [progress, testCompleted, fireConfetti]);

  const resetTest = () => {
    setPressedKeys(new Set());
    setLastKey("");
    setLastKeyCode("");
    setJustPressed(null);
    setTestCompleted(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Online Keyboard Tester - Test All Keys Free 2026"
        description="Free keyboard tester online! Check if all your keyboard keys work with our interactive key tester. Test mechanical keyboards, laptop keyboards, function keys & numpad instantly."
        keywords="keyboard tester, keyboard test, online keyboard tester, key tester, keyboard tester online, test keyboard keys, mechanical keyboard tester, laptop keyboard test, function key test, numpad test"
        canonicalPath="/test/keyboard"
        structuredData={structuredData.howTo(
          "How to Test Your Keyboard Online",
          "Use our free online keyboard tester to verify all keys work correctly on your keyboard.",
          [
            { name: "Open the keyboard test", text: "Navigate to the keyboard tester page" },
            { name: "Select keyboard type", text: "Choose between Mac or Windows keyboard layout" },
            { name: "Press each key", text: "Press every key on your keyboard - tested keys turn green" },
            { name: "Check progress", text: "Monitor your progress until 100% of keys are tested" },
          ]
        )}
      />
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
                        const isUntestable = untestableKeys.includes(key);
                        const pressed = !isUntestable && isKeyPressed(key);
                        const isJustPressed = !isUntestable && (justPressed === key.toUpperCase() || justPressed === key);
                        
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
                              isUntestable
                                ? "bg-muted/50 text-muted-foreground border border-dashed border-muted-foreground/30"
                                : pressed
                                  ? "bg-success text-success-foreground"
                                  : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                            title={isUntestable ? "This key cannot be detected by browsers" : undefined}
                          >
                            {pressed && !isUntestable && (
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

              {/* Completion Banner */}
              {testCompleted && (
                <motion.div
                  ref={completionRef}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 150, damping: 18 }}
                  className="mt-8 relative overflow-hidden rounded-2xl border border-success/40 p-10 text-center"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--success) / 0.12) 0%, hsl(var(--success) / 0.04) 50%, hsl(var(--success) / 0.1) 100%)",
                    boxShadow: "0 0 40px -10px hsl(var(--success) / 0.3), inset 0 1px 0 hsl(var(--success) / 0.15)",
                  }}
                >
                  {/* Glow effect */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse at center, hsl(var(--success) / 0.15) 0%, transparent 70%)",
                    }}
                  />

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 12 }}
                    className="relative inline-flex items-center justify-center w-20 h-20 rounded-full mb-5"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--success) / 0.25), hsl(var(--success) / 0.1))",
                      boxShadow: "0 0 30px hsl(var(--success) / 0.2)",
                    }}
                  >
                    <CheckCircle2 className="h-10 w-10 text-success" />
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative text-2xl font-bold text-foreground mb-2"
                  >
                    All {totalKeys} Keys Passed
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="relative text-muted-foreground max-w-md mx-auto"
                  >
                    Your keyboard is fully functional — every key registered successfully.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="relative mt-6"
                  >
                    <Button variant="outline" size="sm" onClick={resetTest}>
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                      Test Again
                    </Button>
                  </motion.div>
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
                  {keyboardType === "mac" && (
                    <>
                      <li>• <span className="text-amber-500 font-medium">⚠️ F11/F12 keys</span> — macOS may intercept these for Mission Control. Press <strong>fn + F11/F12</strong> or enable "Use F1, F2, etc. keys as standard function keys" in System Preferences</li>
                      <li>• <span className="text-amber-500 font-medium">⚠️ fn key cannot be tested</span> — it's a hardware-level modifier that browsers cannot detect</li>
                      <li>• Mac keyboards use ⌘ Command and ⌥ Option instead of Windows key and Alt</li>
                    </>
                  )}
                  {keyboardType === "windows" && (
                    <li>• Some function keys (F1-F12) may require pressing Fn key on laptops</li>
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
