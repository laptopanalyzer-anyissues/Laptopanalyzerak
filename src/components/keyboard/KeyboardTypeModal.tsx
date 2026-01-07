import { motion, AnimatePresence } from "framer-motion";
import { Laptop, Apple, Monitor, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KeyboardTypeModalProps {
  isOpen: boolean;
  onSelect: (type: "mac" | "windows") => void;
}

export const KeyboardTypeModal = ({ isOpen, onSelect }: KeyboardTypeModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-lg mx-4 p-8 rounded-2xl bg-card border border-border shadow-2xl"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Laptop className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Which keyboard does your laptop have?
              </h2>
              <p className="text-muted-foreground">
                Select your keyboard type for an accurate testing experience
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect("mac")}
                className="group p-6 rounded-xl border-2 border-border hover:border-primary bg-background hover:bg-primary/5 transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                    <Apple className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="font-semibold text-lg text-foreground">Mac Keyboard</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Includes ⌘ Command, ⌥ Option, ⌃ Control, and fn keys
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect("windows")}
                className="group p-6 rounded-xl border-2 border-border hover:border-primary bg-background hover:bg-primary/5 transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                    <Monitor className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="font-semibold text-lg text-foreground">Windows / Other</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Includes Windows key, Alt, Ctrl, and Function keys
                </p>
              </motion.button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              <span>Keyboard layout is selected for accuracy and does not collect any data</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
