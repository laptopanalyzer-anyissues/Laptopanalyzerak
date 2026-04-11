/**
 * Generates an SEO-safe page title that fits within 60 characters.
 * Brand suffix: " | Laptop Analyzer" (18 chars including space+pipe+space)
 */

const BRAND_SUFFIX = " | Laptop Analyzer";
const MAX_TITLE_LENGTH = 60;

// Manual overrides for specific blog posts
const TITLE_OVERRIDES: Record<string, string> = {
  "laptop-keyboard-not-working": "Keyboard Fix Guide: 11 Practical Tips",
  "touchpad-test-online": "Free Online Touchpad Test Tool",
  "what-to-check-buying-used-laptop": "Used Laptop Buying Checklist",
};

// Manual description overrides for specific blog posts
const DESCRIPTION_OVERRIDES: Record<string, string> = {
  "laptop-keyboard-not-working": "Laptop keyboard not working on Windows 11 or 10? Try these 11 practical fixes to solve typing issues and hardware lag. Test your keys at Laptop Analyzer.",
  "laptop-camera-not-working": "Laptop camera not working? Fix black screens and driver errors with these 15 proven fixes. Then test your webcam instantly online with Laptop Analyzer.",
};

/**
 * Returns a manually overridden description for a blog post, or null if none exists.
 */
export function getSEODescription(slug?: string): string | null {
  if (slug && DESCRIPTION_OVERRIDES[slug]) {
    return DESCRIPTION_OVERRIDES[slug];
  }
  return null;
}

/**
 * Returns a title that fits within 60 characters including brand suffix.
 * Uses manual overrides first, then auto-truncates if needed.
 */
export function getSEOTitle(title: string, slug?: string): string {
  // Check for manual override
  if (slug && TITLE_OVERRIDES[slug]) {
    return `${TITLE_OVERRIDES[slug]}${BRAND_SUFFIX}`;
  }

  const full = `${title}${BRAND_SUFFIX}`;
  if (full.length <= MAX_TITLE_LENGTH) {
    return full;
  }

  // Truncate the title part to fit
  const maxTitlePart = MAX_TITLE_LENGTH - BRAND_SUFFIX.length; // 42 chars
  let shortened = title.slice(0, maxTitlePart).trim();
  
  // Don't cut mid-word — find last space
  const lastSpace = shortened.lastIndexOf(" ");
  if (lastSpace > maxTitlePart * 0.6) {
    shortened = shortened.slice(0, lastSpace);
  }

  return `${shortened}${BRAND_SUFFIX}`;
}
