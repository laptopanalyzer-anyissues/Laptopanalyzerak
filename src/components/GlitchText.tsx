import { useEffect, useRef, useState, type ElementType } from "react";

/**
 * GlitchText — scramble-in reveal + interactive per-character hover scramble.
 * Adapted from the Originkit "Scramble Text" concept, rebuilt lightweight and
 * layout-stable for use inline in this app (e.g. the brand logo).
 *
 * - Base characters render in the inherited color; scrambling characters use
 *   the brand primary for a subtle accent.
 * - An invisible ghost holds the real text's width so scrambling never shifts
 *   surrounding layout.
 * - Accessible: the real word is exposed via aria-label; the animated glyphs
 *   are aria-hidden. Respects prefers-reduced-motion.
 */

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#%&$@";

// The header remounts on route changes — keep the intro reveal to once per session.
let hasRevealedOnce = false;

const reducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface GlitchTextProps {
  text: string;
  className?: string;
  /** Element to render as (default: span). */
  as?: ElementType;
  /** How many characters on each side of the cursor scramble on hover. */
  hoverRadius?: number;
  /** Duration of the intro scramble reveal, in ms. */
  revealMs?: number;
}

export function GlitchText({
  text,
  className,
  as: Tag = "span",
  hoverRadius = 2,
  revealMs = 900,
}: GlitchTextProps) {
  const chars = Array.from(text);
  const reduced = reducedMotion();

  // Base display starts as the real text (correct first paint for SEO / no-JS).
  const [display, setDisplay] = useState<string[]>(chars);
  const [revealGlitch, setRevealGlitch] = useState<Record<number, boolean>>({});
  const [hover, setHover] = useState<Record<number, string>>({});

  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hoverTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const windowRef = useRef<Set<number>>(new Set());

  const rnd = () => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];

  // ── Intro scramble reveal (once per session) ──────────────────────────────
  useEffect(() => {
    if (reduced || hasRevealedOnce) return;
    hasRevealedOnce = true;

    let frame = 0;
    const total = Math.max(1, Math.ceil(revealMs / 45));
    const id = setInterval(() => {
      frame++;
      const lock = Math.floor((frame / total) * chars.length);
      const g: Record<number, boolean> = {};
      setDisplay(
        chars.map((c, i) => {
          if (c === " ") return " ";
          if (i < lock) return c;
          g[i] = true;
          return rnd();
        })
      );
      setRevealGlitch(g);
      if (frame >= total) {
        clearInterval(id);
        setDisplay(chars);
        setRevealGlitch({});
      }
    }, 45);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // ── Interactive hover scramble around the cursor ──────────────────────────
  const handleMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const x = e.clientX;
    let pivot = -1;
    let min = Infinity;
    charRefs.current.forEach((el, i) => {
      if (!el || chars[i] === " ") return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const d = Math.abs(cx - x);
      if (d < min) {
        min = d;
        pivot = i;
      }
    });
    if (pivot < 0) return;

    const win = new Set<number>();
    for (
      let i = Math.max(0, pivot - hoverRadius);
      i <= Math.min(chars.length - 1, pivot + hoverRadius);
      i++
    ) {
      if (chars[i] !== " ") win.add(i);
    }
    windowRef.current = win;

    if (!hoverTimer.current) {
      hoverTimer.current = setInterval(() => {
        const next: Record<number, string> = {};
        windowRef.current.forEach((i) => {
          next[i] = rnd();
        });
        setHover(next);
      }, 55);
    }
  };

  const handleLeave = () => {
    if (hoverTimer.current) {
      clearInterval(hoverTimer.current);
      hoverTimer.current = null;
    }
    windowRef.current = new Set();
    setHover({});
  };

  useEffect(
    () => () => {
      if (hoverTimer.current) clearInterval(hoverTimer.current);
    },
    []
  );

  return (
    <Tag
      className={className}
      aria-label={text}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}
    >
      {/* Ghost holds the real text's width so scrambling never shifts layout. */}
      <span aria-hidden="true" style={{ visibility: "hidden" }}>
        {text}
      </span>

      {/* Animated glyphs, overlaid on the ghost. */}
      <span
        aria-hidden="true"
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        {chars.map((c, i) => {
          const isHover = hover[i] !== undefined;
          const shown = isHover ? hover[i] : display[i];
          const isGlitch = isHover || revealGlitch[i];
          return (
            <span
              key={i}
              ref={(el) => {
                charRefs.current[i] = el;
              }}
              style={{ color: isGlitch ? "hsl(var(--primary))" : undefined }}
            >
              {shown}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}

export default GlitchText;
