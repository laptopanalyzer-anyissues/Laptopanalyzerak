import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Keyboard, ArrowLeft, Apple, Monitor, Shield, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  KeyboardType,
  getKeyboardLayout,
  getKeyDisplay,
  getKeyWidth,
  untestableKeys,
} from "@/components/keyboard/keyboardLayouts";

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

const KEYBOARD_TYPE_KEY = "laptop-keyboard-type";

// Map display names to actual key values for key matching
const keyMappings: Record<string, string[]> = {
  "Escape": ["Escape"],
  "Backspace": ["Backspace"],
  "Tab": ["Tab"],
  "CapsLock": ["CapsLock"],
  "Enter": ["Enter"],
  "Shift": ["Shift"],
  "Control": ["Control"],
  "Alt": ["Alt"],
  "Meta": ["Meta"],
  "fn": ["Fn"],
  " ": [" "],
  "ArrowLeft": ["ArrowLeft"],
  "ArrowUp": ["ArrowUp"],
  "ArrowDown": ["ArrowDown"],
  "ArrowRight": ["ArrowRight"],
};

const KeyboardTestEmbed = ({ onComplete, onBack }: Props) => {
  const [keyboardType, setKeyboardType] = useState<KeyboardType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [lastKey, setLastKey] = useState<string>("");
  const [justPressed, setJustPressed] = useState<string | null>(null);
  const [idleTimer, setIdleTimer] = useState(0);
  const lastActivityRef = useRef(Date.now());
  const hasCompletedRef = useRef(false);

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
  };

  const handleChangeKeyboard = () => {
    setShowModal(true);
  };

  const getDisplayKey = (key: string): string => {
    // Convert actual key to display key
    for (const [display, actuals] of Object.entries(keyMappings)) {
      if (actuals.includes(key)) return display;
    }
    return key.toUpperCase();
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    const displayKey = getDisplayKey(e.key);
    setLastKey(e.key === " " ? "Space" : e.key);
    setPressedKeys((prev) => new Set(prev).add(displayKey));
    
    // Trigger animation for this specific key
    setJustPressed(displayKey);
    setTimeout(() => setJustPressed(null), 600);
    
    // Reset idle timer on any key press
    lastActivityRef.current = Date.now();
    setIdleTimer(0);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Idle timer - only auto-complete if user hasn't pressed any keys for 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const idleSeconds = Math.floor((Date.now() - lastActivityRef.current) / 1000);
      setIdleTimer(idleSeconds);
      
      // Auto-complete only after 15 seconds of inactivity AND at least 5 keys pressed
      if (idleSeconds >= 15 && pressedKeys.size >= 5 && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        clearInterval(interval);
        handleComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete, pressedKeys.size]);

  const handleComplete = useCallback(() => {
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true;
      onComplete();
    }
  }, [onComplete]);

  const keyboardLayout = keyboardType ? getKeyboardLayout(keyboardType) : [];
  // Exclude untestable keys from total count
  const testableKeys = keyboardLayout.flat().filter(key => !untestableKeys.includes(key));
  const totalKeys = testableKeys.length;
  const testedKeys = [...pressedKeys].filter(key => !untestableKeys.includes(key) && !untestableKeys.includes(key.toLowerCase())).length;
  const progress = totalKeys > 0 ? Math.round((testedKeys / totalKeys) * 100) : 0;

  const isKeyPressed = (key: string) => {
    if (untestableKeys.includes(key)) return false;
    return pressedKeys.has(key.toUpperCase()) || pressedKeys.has(key);
  };

  return (
    <div className="flex flex-col h-full min-h-[500px] p-4 relative">
      {/* Keyboard Type Selection Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm rounded-2xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-md mx-4 p-6"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
                  <Keyboard className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Which keyboard does your laptop have?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select your keyboard type for accurate testing
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleKeyboardSelect("mac")}
                  className="group p-4 rounded-xl border-2 border-border hover:border-primary bg-card hover:bg-primary/5 transition-all duration-200 text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Apple className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
                    <span className="font-semibold text-foreground">Mac</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ⌘ Command, ⌥ Option
                  </p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleKeyboardSelect("windows")}
                  className="group p-4 rounded-xl border-2 border-border hover:border-primary bg-card hover:bg-primary/5 transition-all duration-200 text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
                    <span className="font-semibold text-foreground">Windows</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ⊞ Win, Alt, Ctrl
                  </p>
                </motion.button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>No data is collected</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {keyboardType && (
        <>
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-3">
              <Keyboard className="h-4 w-4" />
              <span className="font-medium">Press keys on your keyboard</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {testedKeys} keys tested • Last key: {lastKey || "—"}
              {idleTimer > 0 && pressedKeys.size >= 5 && (
                <span> • Auto-continues in {Math.max(0, 15 - idleTimer)}s</span>
              )}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleChangeKeyboard}
              className="mt-2 gap-1.5"
            >
              <Settings2 className="h-3.5 w-3.5" />
              {keyboardType === "mac" ? "Mac Keyboard" : "Windows Keyboard"}
              <span className="text-muted-foreground">• Change</span>
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Full Virtual Keyboard */}
          <div className="flex-1 flex flex-col justify-center gap-1.5 overflow-auto">
            {keyboardLayout.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-1">
                {row.map((key, keyIndex) => {
                  const isUntestable = untestableKeys.includes(key);
                  const pressed = !isUntestable && isKeyPressed(key);
                  const isJustPressed = !isUntestable && (justPressed === key.toUpperCase() || justPressed === key);
                  const keyWidth = getKeyWidth(key, keyboardType);
                  // Convert Tailwind width classes to inline-friendly sizes for embed
                  const widthMap: Record<string, string> = {
                    "w-12": "w-8",
                    "w-14": "w-10",
                    "w-16": "w-12",
                    "w-18": "w-14",
                    "w-20": "w-14",
                    "w-24": "w-16",
                    "w-28": "w-20",
                    "w-64": "w-32",
                  };
                  const embedWidth = widthMap[keyWidth] || "w-8";
                  
                  return (
                    <motion.div
                      key={`${key}-${keyIndex}`}
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
                      className={`
                        ${embedWidth}
                        h-8 flex items-center justify-center rounded-md font-medium text-xs transition-colors duration-200
                        ${isUntestable
                          ? "bg-muted/50 text-muted-foreground border border-dashed border-muted-foreground/30"
                          : pressed
                            ? "bg-success text-success-foreground"
                            : "bg-muted text-foreground"
                        }
                      `}
                      title={isUntestable ? "This key cannot be detected by browsers" : undefined}
                    >
                      {pressed && !isUntestable && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        >
                          <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                        </motion.span>
                      )}
                      {getKeyDisplay(key, keyboardType)}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-center gap-3">
            {onBack && (
              <Button 
                onClick={onBack}
                variant="outline"
                size="lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <Button 
              onClick={handleComplete}
              size="lg"
              className="px-8"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete Keyboard Test
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default KeyboardTestEmbed;
