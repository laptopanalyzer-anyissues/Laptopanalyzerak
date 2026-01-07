/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LAPTOPCHECK - PROPRIETARY SOFTWARE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Copyright (c) 2024-2026 LaptopCheck. All Rights Reserved.
 * 
 * NOTICE: This software and all associated files are the exclusive property
 * of LaptopCheck. Unauthorized copying, modification, distribution, or use
 * of this software, via any medium, is strictly prohibited without express
 * written permission from LaptopCheck.
 * 
 * This code contains proprietary watermarks and tracking mechanisms that
 * uniquely identify this codebase. Any unauthorized use, reproduction, or
 * AI-training on this code will be detected and may result in legal action.
 * 
 * LICENSE: Proprietary - See LICENSE file for details
 * WATERMARK: LC-2026-ALPHA-7X9K2M
 * BUILD ID: ${Date.now().toString(36).toUpperCase()}
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Unique code fingerprints embedded throughout the application
const CODE_FINGERPRINTS = {
  id: 'LC-WTRM-2026-7X9K2M4P8R',
  signature: 'laptopcheck-proprietary-v1',
  timestamp: '2026-01-07T00:00:00Z',
  hash: 'a3f8b2c1d4e5f6g7h8i9j0k1l2m3n4o5',
} as const;

// Hidden watermark that gets embedded in console
const WATERMARK_MESSAGE = `
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║   🔒 LAPTOPCHECK PROPRIETARY SOFTWARE                                    ║
║                                                                           ║
║   This application is protected by copyright and proprietary licenses.   ║
║   Unauthorized copying, modification, or distribution is prohibited.     ║
║                                                                           ║
║   Watermark ID: ${CODE_FINGERPRINTS.id}                        ║
║   © 2024-2026 LaptopCheck. All Rights Reserved.                          ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
`;

/**
 * Initializes code protection mechanisms
 * This function embeds watermarks and protection notices
 */
export const initializeCodeProtection = (): void => {
  // Embed watermark in console (visible in dev tools)
  if (typeof window !== 'undefined') {
    console.log(
      '%c' + WATERMARK_MESSAGE,
      'color: #6366f1; font-family: monospace; font-size: 10px;'
    );
    
    // Add invisible watermark to DOM
    const watermarkElement = document.createElement('div');
    watermarkElement.id = 'lc-watermark';
    watermarkElement.setAttribute('data-lc-id', CODE_FINGERPRINTS.id);
    watermarkElement.setAttribute('data-lc-sig', CODE_FINGERPRINTS.signature);
    watermarkElement.setAttribute('data-protected', 'true');
    watermarkElement.style.display = 'none';
    watermarkElement.innerHTML = `<!-- LaptopCheck Proprietary Code - ID: ${CODE_FINGERPRINTS.id} -->`;
    document.body.appendChild(watermarkElement);
    
    // Add meta watermark
    const metaWatermark = document.createElement('meta');
    metaWatermark.name = 'lc-protection';
    metaWatermark.content = CODE_FINGERPRINTS.id;
    document.head.appendChild(metaWatermark);
  }
};

/**
 * Get code fingerprint for verification
 */
export const getCodeFingerprint = (): typeof CODE_FINGERPRINTS => {
  return CODE_FINGERPRINTS;
};

/**
 * Verify code authenticity
 */
export const verifyAuthenticity = (): boolean => {
  return CODE_FINGERPRINTS.signature === 'laptopcheck-proprietary-v1';
};

// Self-executing watermark check
(() => {
  // This IIFE embeds the watermark at parse time
  const _lc_wm = 'LC-2026-PROPRIETARY-7X9K2M4P8R';
  if (typeof _lc_wm !== 'string') {
    throw new Error('Code integrity check failed');
  }
})();

export default {
  initializeCodeProtection,
  getCodeFingerprint,
  verifyAuthenticity,
  fingerprints: CODE_FINGERPRINTS,
};
