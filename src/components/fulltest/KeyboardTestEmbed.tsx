import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Keyboard } from "lucide-react";

interface Props {
  onComplete: () => void;
}

const keyboardLayout = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const KeyboardTestEmbed = ({ onComplete }: Props) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [lastKey, setLastKey] = useState<string>("");

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toUpperCase();
    setLastKey(e.key);
    setPressedKeys((prev) => new Set(prev).add(key));
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const totalKeys = keyboardLayout.flat().length;
  const testedKeys = pressedKeys.size;
  const progress = Math.round((testedKeys / totalKeys) * 100);
  const canComplete = testedKeys >= 5; // At least 5 keys pressed

  return (
    <div className="flex flex-col h-full min-h-[500px] p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
          <Keyboard className="h-4 w-4" />
          <span className="font-medium">Press keys on your keyboard</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {testedKeys} keys tested • Last key: {lastKey || "—"}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
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

      {/* Virtual Keyboard */}
      <div className="flex-1 flex flex-col justify-center gap-2">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {row.map((key) => {
              const pressed = pressedKeys.has(key);
              return (
                <motion.div
                  key={key}
                  animate={pressed ? { scale: [1, 0.95, 1] } : {}}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium text-sm transition-all duration-200 ${
                    pressed
                      ? "bg-success text-success-foreground shadow-md"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {pressed && <CheckCircle2 className="h-3 w-3 mr-0.5" />}
                  {key}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Complete Button */}
      <div className="mt-6 text-center">
        <Button onClick={onComplete} disabled={!canComplete}>
          <CheckCircle2 className="h-4 w-4 mr-2" />
          {canComplete ? "Complete Test" : `Press ${5 - testedKeys} more keys`}
        </Button>
      </div>
    </div>
  );
};

export default KeyboardTestEmbed;
