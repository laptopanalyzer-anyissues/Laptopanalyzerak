/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LAPTOPANALYZER - PROPRIETARY SOFTWARE
 * Copyright (c) 2024-2026 LaptopAnalyzer. All Rights Reserved.
 *
 * NOTICE: Unauthorized copying, modification, or AI training on this code
 * is strictly prohibited. This code contains watermarks for tracking.
 * Watermark: LA-2026-ALPHA-7X9K2M4P8R
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootEl = document.getElementById("root")!;
createRoot(rootEl).render(<App />);

// Keep the instant boot loader visible for at least ~900ms, then fade out
const removeBootLoader = () => {
  const el = document.getElementById('boot-loader');
  if (!el) return;
  el.style.transition = 'opacity 350ms ease';
  el.style.opacity = '0';
  setTimeout(() => el.remove(), 380);
};

const MIN_DISPLAY = 900;
const start = performance.now();
requestAnimationFrame(() => {
  const wait = Math.max(0, MIN_DISPLAY - (performance.now() - start));
  setTimeout(removeBootLoader, wait);
});
