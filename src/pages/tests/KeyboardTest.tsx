import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, CheckCircle2, Settings2 } from "lucide-react";
import { useConfetti } from "@/hooks/useConfetti";
import { KeyboardTypeModal } from "@/components/keyboard/KeyboardTypeModal";
import { RealisticKeyboard } from "@/components/keyboard/RealisticKeyboard";
import { KeyboardStats } from "@/components/keyboard/KeyboardStats";
import { SEOHead, structuredData } from "@/components/SEOHead";
import {
  KeyboardType,
  getKeyboardLayout,
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
    setPressedKeys(new Set());
    setLastKey("");
    setLastKeyCode("");
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    const key = e.key;
    setLastKey(key);
    setLastKeyCode(e.code);
    const normalizedKey = key.startsWith("F") && key.length <= 3 ? key : key.toUpperCase();
    setPressedKeys((prev) => new Set(prev).add(normalizedKey));
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

  const testableKeys = [...new Set(keyboardLayout.flat().filter(key => !untestableKeys.includes(key)))];
  const totalKeys = testableKeys.length;
  const testedKeys = testableKeys.filter(key => isKeyPressed(key)).length;
  const progress = totalKeys > 0 ? Math.min(100, Math.round((testedKeys / totalKeys) * 100)) : 0;

  useEffect(() => {
    if (progress === 100 && !testCompleted) {
      setTestCompleted(true);
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
    setResetKey(k => k + 1);
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
      <KeyboardTypeModal isOpen={showModal} onSelect={handleKeyboardSelect} />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
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

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl font-extrabold text-foreground mb-2 tracking-tight">
              Keyboard Test
            </h1>
            <p className="text-muted-foreground mb-5 text-base">
              Press any key to test it. Tested keys light up{" "}
              <span className="text-success font-semibold">green</span>.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={resetTest}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(true)}
                className="gap-2"
              >
                <Settings2 className="h-4 w-4" />
                {keyboardType === "mac" ? "Mac Layout" : "Windows Layout"}
              </Button>
            </div>
          </motion.div>

          {keyboardType && (
            <>
              {/* Stats */}
              <KeyboardStats
                progress={progress}
                testedKeys={testedKeys}
                totalKeys={totalKeys}
                lastKey={lastKey}
                lastKeyCode={lastKeyCode}
              />

              {/* 3D Keyboard */}
              <RealisticKeyboard
                keyboardType={keyboardType}
                pressedKeys={pressedKeys}
                justPressed={justPressed}
                resetKey={resetKey}
              />

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
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at center, hsl(var(--success) / 0.15) 0%, transparent 70%)" }}
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
                      <li>• <span className="text-warning font-medium">⚠️ F11/F12 keys</span> — macOS may intercept these for Mission Control. Press <strong>fn + F11/F12</strong> or enable "Use F1, F2, etc. keys as standard function keys" in System Preferences</li>
                      <li>• <span className="text-warning font-medium">⚠️ fn key cannot be tested</span> — it's a hardware-level modifier that browsers cannot detect</li>
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
