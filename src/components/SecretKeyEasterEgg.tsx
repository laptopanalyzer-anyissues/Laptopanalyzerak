import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, X, Sparkles } from "lucide-react";

const SECRET_KEY = "miles";

export function SecretKeyEasterEgg() {
  const [buffer, setBuffer] = useState("");
  const [revealed, setRevealed] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (revealed) return;

      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      // Only accept a-z keys
      if (!/^[a-z]$/.test(key)) {
        setBuffer("");
        return;
      }

      setBuffer((prev) => {
        const next = (prev + key).slice(-SECRET_KEY.length);
        if (next === SECRET_KEY) {
          setRevealed(true);
          return "";
        }
        return next;
      });
    },
    [revealed]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const close = () => setRevealed(false);

  return (
    <AnimatePresence>
      {revealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative mx-4 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow ring */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary opacity-40 blur-lg animate-pulse-slow" />

            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/95 p-8 shadow-2xl backdrop-blur-xl">
              {/* Decorative code icon */}
              <div className="absolute -right-4 -top-4 opacity-10">
                <Code2 className="h-32 w-32" />
              </div>

              {/* Close button */}
              <button
                onClick={close}
                className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Developer Revealed
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Secret key unlocked
                  </p>
                </div>
              </div>

              {/* Name reveal */}
              <div className="mb-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-sm font-medium uppercase tracking-widest text-muted-foreground"
                >
                  Crafted by
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="mt-2 text-4xl font-extrabold tracking-tight"
                >
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Jin Sakai
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-2 text-xs text-muted-foreground"
                >
                  Lead Developer & Architect
                </motion.div>
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-2 rounded-xl bg-muted/60 px-4 py-2.5 text-xs text-muted-foreground"
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>Type "miles" anywhere to reveal again</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
