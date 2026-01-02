import { useEffect, useCallback } from "react";

interface KeyboardShortcutsOptions {
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  onSpace?: () => void;
  enabled?: boolean;
}

/**
 * Hook for handling keyboard shortcuts
 * Provides navigation with arrow keys, Enter to confirm, Escape to cancel
 */
export const useKeyboardShortcuts = (options: KeyboardShortcutsOptions) => {
  const {
    onArrowLeft,
    onArrowRight,
    onArrowUp,
    onArrowDown,
    onEnter,
    onEscape,
    onSpace,
    enabled = true,
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger if user is typing in an input
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          onArrowLeft?.();
          break;
        case "ArrowRight":
          event.preventDefault();
          onArrowRight?.();
          break;
        case "ArrowUp":
          event.preventDefault();
          onArrowUp?.();
          break;
        case "ArrowDown":
          event.preventDefault();
          onArrowDown?.();
          break;
        case "Enter":
          event.preventDefault();
          onEnter?.();
          break;
        case "Escape":
          event.preventDefault();
          onEscape?.();
          break;
        case " ":
          event.preventDefault();
          onSpace?.();
          break;
      }
    },
    [enabled, onArrowLeft, onArrowRight, onArrowUp, onArrowDown, onEnter, onEscape, onSpace]
  );

  useEffect(() => {
    if (enabled) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [enabled, handleKeyDown]);
};

export default useKeyboardShortcuts;
