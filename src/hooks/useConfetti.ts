import { useCallback } from "react";
import confetti from "canvas-confetti";

export const useConfetti = () => {
  const fireConfetti = useCallback(() => {
    // Fire confetti from both sides
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    // Left side burst
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      origin: { x: 0.2, y: 0.7 },
    });

    fire(0.2, {
      spread: 60,
      origin: { x: 0.2, y: 0.7 },
    });

    // Center burst
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      origin: { x: 0.5, y: 0.7 },
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      origin: { x: 0.5, y: 0.7 },
    });

    // Right side burst
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      origin: { x: 0.8, y: 0.7 },
    });

    fire(0.2, {
      spread: 60,
      origin: { x: 0.8, y: 0.7 },
    });

    // Second wave after a short delay
    setTimeout(() => {
      fire(0.1, {
        spread: 100,
        startVelocity: 45,
        decay: 0.9,
        origin: { x: 0.5, y: 0.6 },
      });
    }, 200);
  }, []);

  return { fireConfetti };
};
