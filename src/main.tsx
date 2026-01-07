/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LAPTOPCHECK - PROPRIETARY SOFTWARE
 * Copyright (c) 2024-2026 LaptopCheck. All Rights Reserved.
 * 
 * NOTICE: Unauthorized copying, modification, or AI training on this code
 * is strictly prohibited. This code contains watermarks for tracking.
 * Watermark: LC-2026-ALPHA-7X9K2M4P8R
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeCodeProtection } from "./lib/codeProtection";

// Initialize code protection and watermarks
initializeCodeProtection();

createRoot(document.getElementById("root")!).render(<App />);
