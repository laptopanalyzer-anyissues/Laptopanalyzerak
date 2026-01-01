import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onComplete: () => void;
}

// Full keyboard layout including all common keys
const keyboardLayout = [
  ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
  ["Ctrl", "Fn", "Alt", "Space", "Alt", "Ctrl", "←", "↑", "↓", "→"],
];

// Map display names to actual key values
const keyMappings: Record<string, string[]> = {
  "Esc": ["Escape"],
  "Backspace": ["Backspace"],
  "Tab": ["Tab"],
  "Caps": ["CapsLock"],
  "Enter": ["Enter"],
  "Shift": ["Shift"],
  "Ctrl": ["Control"],
  "Alt": ["Alt"],
  "Fn": ["Fn"], // Fn usually doesn't trigger keydown
  "Space": [" "],
  "←": ["ArrowLeft"],
  "↑": ["ArrowUp"],
  "↓": ["ArrowDown"],
  "→": ["ArrowRight"],
};

const KeyboardTestEmbed = ({ onComplete }: Props) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [lastKey, setLastKey] = useState<string>("");
  const [idleTimer, setIdleTimer] = useState(0); // Only count idle time (no key presses)
  const lastActivityRef = useRef(Date.now());
  const hasCompletedRef = useRef(false);

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
        onComplete();
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

  const totalKeys = keyboardLayout.flat().length;
  const testedKeys = pressedKeys.size;
  const progress = Math.round((testedKeys / totalKeys) * 100);

  return (
    <div className="flex flex-col h-full min-h-[500px] p-4">
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
              const pressed = pressedKeys.has(key);
              const isWide = ["Backspace", "Tab", "Caps", "Enter", "Shift", "Space", "Ctrl", "Alt"].includes(key);
              const isExtraWide = key === "Space";
              
              return (
                <motion.div
                  key={`${key}-${keyIndex}`}
                  animate={pressed ? { scale: [1, 0.95, 1] } : {}}
                  className={`
                    ${isExtraWide ? "w-32" : isWide ? "w-14" : "w-8"} 
                    h-8 flex items-center justify-center rounded-md font-medium text-xs transition-all duration-200
                    ${pressed
                      ? "bg-success text-success-foreground shadow-md"
                      : "bg-muted text-foreground"
                    }
                  `}
                >
                  {pressed && <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />}
                  {key === "Space" ? "Space" : key}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Complete Button */}
      <div className="mt-4 flex justify-center">
        <Button 
          onClick={handleComplete}
          size="lg"
          className="px-8"
        >
          Complete Keyboard Test
        </Button>
      </div>
    </div>
  );
};

export default KeyboardTestEmbed;
