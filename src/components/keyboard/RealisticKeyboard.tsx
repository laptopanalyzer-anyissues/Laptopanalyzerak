import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import {
  KeyboardType,
  getKeyboardLayout,
  getKeyDisplay,
  getKeyWidth,
  untestableKeys,
} from "./keyboardLayouts";

interface RealisticKeyboardProps {
  keyboardType: KeyboardType;
  pressedKeys: Set<string>;
  justPressed: string | null;
  resetKey: number;
}

const isKeyPressed = (key: string, pressedKeys: Set<string>) => {
  const normalizedKey = key.startsWith("F") && key.length <= 3 ? key : key.toUpperCase();
  return pressedKeys.has(normalizedKey) || pressedKeys.has(key) || pressedKeys.has(key.toUpperCase());
};

export const RealisticKeyboard = ({
  keyboardType,
  pressedKeys,
  justPressed,
  resetKey,
}: RealisticKeyboardProps) => {
  const keyboardLayout = getKeyboardLayout(keyboardType);

  return (
    <motion.div
      key={resetKey}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl p-5 sm:p-8 overflow-x-auto overflow-y-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(222 30% 14%) 0%, hsl(222 35% 10%) 100%)",
        boxShadow:
          "0 20px 60px -15px hsl(222 47% 4% / 0.7), 0 0 0 1px hsl(222 30% 20% / 0.5), inset 0 1px 0 hsl(222 20% 22% / 0.5)",
        borderRadius: "1.25rem",
      }}
    >
      <div className="min-w-[820px]">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-[5px] mb-[5px] justify-center">
            {row.map((key, keyIndex) => {
              const isUntestable = untestableKeys.includes(key);
              const pressed = !isUntestable && isKeyPressed(key, pressedKeys);
              const isJustPressed =
                !isUntestable &&
                (justPressed === key.toUpperCase() || justPressed === key);

              return (
                <RealisticKey
                  key={`${rowIndex}-${keyIndex}`}
                  keyLabel={getKeyDisplay(key, keyboardType)}
                  widthClass={getKeyWidth(key, keyboardType)}
                  isPressed={pressed}
                  isJustPressed={isJustPressed}
                  isUntestable={isUntestable}
                />
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

interface RealisticKeyProps {
  keyLabel: string;
  widthClass: string;
  isPressed: boolean;
  isJustPressed: boolean;
  isUntestable: boolean;
}

const RealisticKey = ({
  keyLabel,
  widthClass,
  isPressed,
  isJustPressed,
  isUntestable,
}: RealisticKeyProps) => {
  const baseClasses = `${widthClass} h-[46px] flex items-center justify-center rounded-lg font-medium text-xs select-none relative`;

  if (isUntestable) {
    return (
      <div
        className={`${baseClasses} border border-dashed`}
        style={{
          background: "hsl(222 30% 12%)",
          borderColor: "hsl(222 20% 25% / 0.4)",
          color: "hsl(215 20% 40%)",
        }}
        title="This key cannot be detected by browsers"
      >
        {keyLabel}
      </div>
    );
  }

  if (isPressed) {
    return (
      <motion.div
        initial={false}
        animate={
          isJustPressed
            ? {
                scale: [1, 1.08, 1],
                y: [0, 1, 0],
              }
            : {}
        }
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`${baseClasses}`}
        style={{
          background: "linear-gradient(180deg, hsl(142 76% 38%) 0%, hsl(142 70% 30%) 100%)",
          boxShadow:
            "0 1px 2px hsl(142 80% 20% / 0.5), 0 0 12px hsl(142 76% 36% / 0.3), inset 0 1px 0 hsl(142 60% 50% / 0.4)",
          color: "hsl(0 0% 100%)",
          border: "1px solid hsl(142 60% 42% / 0.6)",
        }}
      >
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="mr-1"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
        </motion.span>
        {keyLabel}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={false}
      animate={
        isJustPressed
          ? { scale: [1, 0.95, 1], y: [0, 2, 0] }
          : {}
      }
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`${baseClasses} cursor-default`}
      style={{
        background: "linear-gradient(180deg, hsl(222 25% 20%) 0%, hsl(222 30% 15%) 100%)",
        boxShadow:
          "0 3px 0 hsl(222 35% 8%), 0 4px 6px hsl(222 47% 4% / 0.4), inset 0 1px 0 hsl(222 20% 28% / 0.6)",
        color: "hsl(210 30% 80%)",
        border: "1px solid hsl(222 25% 22% / 0.8)",
      }}
    >
      {keyLabel}
    </motion.div>
  );
};

export default RealisticKeyboard;
