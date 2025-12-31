/**
 * Security Utilities
 * Protection against: XSS, SQL Injection, CSRF, Clickjacking, Session Hijacking,
 * File Inclusion, Input Validation attacks
 */

// ============= Input Sanitization (XSS Prevention) =============

/**
 * Sanitizes HTML to prevent XSS attacks
 * Removes all HTML tags and encodes special characters
 */
export const sanitizeHTML = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#x60;')
    .replace(/=/g, '&#x3D;');
};

/**
 * Sanitizes input for use in URLs
 */
export const sanitizeURL = (url: string): string => {
  if (typeof url !== 'string') return '';
  
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.href;
  } catch {
    return '';
  }
};

/**
 * Validates and sanitizes file paths to prevent LFI/RFI attacks
 */
export const sanitizePath = (path: string): string => {
  if (typeof path !== 'string') return '';
  
  // Remove path traversal attempts
  return path
    .replace(/\.\./g, '')
    .replace(/\/\//g, '/')
    .replace(/\\/g, '/')
    .replace(/^\/+/, '');
};

// ============= Input Validation =============

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validates string length within bounds
 */
export const isValidLength = (input: string, min: number, max: number): boolean => {
  if (typeof input !== 'string') return false;
  return input.length >= min && input.length <= max;
};

/**
 * Checks for SQL injection patterns
 */
export const hasSQLInjectionPatterns = (input: string): boolean => {
  if (typeof input !== 'string') return false;
  
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|EXEC|UNION|SCRIPT)\b)/i,
    /(-{2}|\/\*|\*\/)/,
    /(;|\||`)/,
    /(\bOR\b\s+\d+\s*=\s*\d+)/i,
    /(\bAND\b\s+\d+\s*=\s*\d+)/i,
    /('|\"|;|--)/,
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * Checks for XSS patterns
 */
export const hasXSSPatterns = (input: string): boolean => {
  if (typeof input !== 'string') return false;
  
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<\s*img[^>]+onerror/gi,
    /<\s*iframe/gi,
    /<\s*object/gi,
    /<\s*embed/gi,
    /<\s*link/gi,
    /data:/gi,
    /vbscript:/gi,
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
};

/**
 * Comprehensive input validation
 */
export const validateInput = (input: string, options?: {
  maxLength?: number;
  minLength?: number;
  allowHTML?: boolean;
  checkSQLInjection?: boolean;
}): { isValid: boolean; sanitized: string; errors: string[] } => {
  const errors: string[] = [];
  const opts = {
    maxLength: 10000,
    minLength: 0,
    allowHTML: false,
    checkSQLInjection: true,
    ...options,
  };

  if (typeof input !== 'string') {
    return { isValid: false, sanitized: '', errors: ['Invalid input type'] };
  }

  let sanitized = input.trim();

  if (sanitized.length < opts.minLength) {
    errors.push(`Input must be at least ${opts.minLength} characters`);
  }

  if (sanitized.length > opts.maxLength) {
    errors.push(`Input must not exceed ${opts.maxLength} characters`);
    sanitized = sanitized.slice(0, opts.maxLength);
  }

  if (opts.checkSQLInjection && hasSQLInjectionPatterns(sanitized)) {
    errors.push('Input contains potentially dangerous patterns');
  }

  if (!opts.allowHTML && hasXSSPatterns(sanitized)) {
    errors.push('Input contains potentially dangerous HTML');
  }

  if (!opts.allowHTML) {
    sanitized = sanitizeHTML(sanitized);
  }

  return {
    isValid: errors.length === 0,
    sanitized,
    errors,
  };
};

// ============= CSRF Protection =============

/**
 * Generates a CSRF token
 */
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Stores CSRF token in sessionStorage
 */
export const storeCSRFToken = (token: string): void => {
  try {
    sessionStorage.setItem('csrf_token', token);
  } catch {
    // Silent fail for environments without sessionStorage
  }
};

/**
 * Retrieves CSRF token from sessionStorage
 */
export const getCSRFToken = (): string | null => {
  try {
    return sessionStorage.getItem('csrf_token');
  } catch {
    return null;
  }
};

/**
 * Validates CSRF token
 */
export const validateCSRFToken = (token: string): boolean => {
  const storedToken = getCSRFToken();
  return storedToken !== null && storedToken === token;
};

// ============= Session Security =============

/**
 * Generates a secure session fingerprint based on browser characteristics
 * Helps detect session hijacking attempts
 */
export const generateSessionFingerprint = (): string => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth.toString(),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    new Date().getTimezoneOffset().toString(),
  ];
  
  // Simple hash function for fingerprint
  const hash = components.join('|');
  let hashValue = 0;
  for (let i = 0; i < hash.length; i++) {
    const char = hash.charCodeAt(i);
    hashValue = ((hashValue << 5) - hashValue) + char;
    hashValue = hashValue & hashValue;
  }
  return Math.abs(hashValue).toString(36);
};

/**
 * Validates session fingerprint to detect potential hijacking
 */
export const validateSessionFingerprint = (storedFingerprint: string): boolean => {
  return storedFingerprint === generateSessionFingerprint();
};

// ============= Rate Limiting (Client-side DoS/Brute Force Prevention) =============

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  blocked: boolean;
  blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Client-side rate limiting
 * @param key - Unique identifier for the action being rate limited
 * @param maxRequests - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @param blockDurationMs - How long to block after exceeding limit
 */
export const checkRateLimit = (
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000,
  blockDurationMs: number = 300000
): { allowed: boolean; remainingRequests: number; retryAfter?: number } => {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // Check if currently blocked
  if (entry?.blocked && entry.blockedUntil) {
    if (now < entry.blockedUntil) {
      return {
        allowed: false,
        remainingRequests: 0,
        retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
      };
    }
    // Block expired, reset
    rateLimitStore.delete(key);
  }

  if (!entry || now - entry.firstRequest > windowMs) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      firstRequest: now,
      blocked: false,
    });
    return { allowed: true, remainingRequests: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    // Block the user
    rateLimitStore.set(key, {
      ...entry,
      blocked: true,
      blockedUntil: now + blockDurationMs,
    });
    return {
      allowed: false,
      remainingRequests: 0,
      retryAfter: Math.ceil(blockDurationMs / 1000),
    };
  }

  // Increment counter
  rateLimitStore.set(key, {
    ...entry,
    count: entry.count + 1,
  });

  return { allowed: true, remainingRequests: maxRequests - entry.count - 1 };
};

/**
 * Clears rate limit for a specific key
 */
export const clearRateLimit = (key: string): void => {
  rateLimitStore.delete(key);
};

// ============= Clickjacking Protection =============

/**
 * Detects if the page is loaded in an iframe (potential clickjacking)
 */
export const detectClickjacking = (): boolean => {
  try {
    return window.self !== window.top;
  } catch {
    // If access is denied, we're in an iframe from a different origin
    return true;
  }
};

/**
 * Attempts to break out of malicious iframes
 */
export const preventClickjacking = (): void => {
  if (detectClickjacking()) {
    // Try to redirect top frame to our page
    try {
      if (window.top) {
        window.top.location.href = window.self.location.href;
      }
    } catch {
      // If we can't redirect, hide the body
      document.body.style.display = 'none';
      console.warn('Potential clickjacking attempt detected');
    }
  }
};

// ============= Secure Storage Wrapper =============

/**
 * Securely stores data with integrity check
 */
export const secureStore = {
  set: (key: string, value: unknown): void => {
    try {
      const data = JSON.stringify({
        value,
        timestamp: Date.now(),
        fingerprint: generateSessionFingerprint(),
      });
      localStorage.setItem(key, data);
    } catch {
      // Silent fail
    }
  },

  get: <T>(key: string): T | null => {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;

      const parsed = JSON.parse(data);
      
      // Validate fingerprint to detect tampering
      if (parsed.fingerprint !== generateSessionFingerprint()) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.value as T;
    } catch {
      return null;
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Silent fail
    }
  },
};

// ============= Content Security =============

/**
 * Validates that a resource URL is from an allowed domain
 */
export const isAllowedDomain = (url: string, allowedDomains: string[]): boolean => {
  try {
    const parsed = new URL(url);
    return allowedDomains.some(domain => 
      parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
};

/**
 * Strips dangerous attributes from HTML elements (if dynamic HTML is needed)
 */
export const stripDangerousAttributes = (element: Element): void => {
  const dangerousAttrs = ['onclick', 'onerror', 'onload', 'onmouseover', 'onfocus', 'onblur'];
  dangerousAttrs.forEach(attr => {
    if (element.hasAttribute(attr)) {
      element.removeAttribute(attr);
    }
  });
  
  // Recursively clean children
  Array.from(element.children).forEach(child => stripDangerousAttributes(child));
};
