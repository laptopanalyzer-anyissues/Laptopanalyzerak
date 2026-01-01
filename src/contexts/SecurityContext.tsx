import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { 
  preventClickjacking, 
  detectClickjacking,
  generateCSRFToken,
  storeCSRFToken,
  getCSRFToken,
  generateSessionFingerprint,
} from '@/lib/security';

interface SecurityContextType {
  isSecure: boolean;
  isInIframe: boolean;
  csrfToken: string | null;
  sessionFingerprint: string;
  reportSecurityEvent: (event: SecurityEvent) => void;
  securityEvents: SecurityEvent[];
}

interface SecurityEvent {
  type: 'clickjacking' | 'xss' | 'csrf' | 'rate_limit' | 'suspicious_input' | 'session_anomaly';
  message: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
  enableClickjackingProtection?: boolean;
  enableCSRFProtection?: boolean;
  onSecurityEvent?: (event: SecurityEvent) => void;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({
  children,
  enableClickjackingProtection = true,
  enableCSRFProtection = true,
  onSecurityEvent,
}) => {
  const [isSecure, setIsSecure] = useState(true);
  const [isInIframe, setIsInIframe] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [sessionFingerprint] = useState(() => generateSessionFingerprint());
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);

  const reportSecurityEvent = useCallback((event: SecurityEvent) => {
    setSecurityEvents(prev => [...prev.slice(-99), event]); // Keep last 100 events
    onSecurityEvent?.(event);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Security] ${event.severity.toUpperCase()}: ${event.type} - ${event.message}`);
    }
  }, [onSecurityEvent]);

  // Initialize security measures
  useEffect(() => {
    // Check for clickjacking
    const inIframe = detectClickjacking();
    setIsInIframe(inIframe);
    
    // Allow Lovable preview iframes and localhost
    const isAllowedIframe = 
      window.location.hostname.includes('lovable.app') || 
      window.location.hostname.includes('localhost') ||
      window.location.hostname === '127.0.0.1';
    
    if (inIframe && enableClickjackingProtection && !isAllowedIframe) {
      preventClickjacking();
      setIsSecure(false);
      reportSecurityEvent({
        type: 'clickjacking',
        message: 'Page loaded in iframe - potential clickjacking attempt',
        timestamp: Date.now(),
        severity: 'critical',
      });
    }

    // Initialize CSRF token
    if (enableCSRFProtection) {
      let token = getCSRFToken();
      if (!token) {
        token = generateCSRFToken();
        storeCSRFToken(token);
      }
      setCsrfToken(token);
    }

    // Set up global error handler for XSS attempts
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const errorString = args.join(' ');
      if (
        errorString.includes('SecurityError') ||
        errorString.includes('cross-origin') ||
        errorString.includes('Content Security Policy')
      ) {
        reportSecurityEvent({
          type: 'xss',
          message: `Potential XSS/security violation: ${errorString.slice(0, 200)}`,
          timestamp: Date.now(),
          severity: 'high',
        });
      }
      originalConsoleError.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, [enableClickjackingProtection, enableCSRFProtection, reportSecurityEvent]);

  // Monitor for suspicious activity
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Log when tab becomes visible again (potential session hijacking detection)
      if (document.visibilityState === 'visible') {
        const currentFingerprint = generateSessionFingerprint();
        if (currentFingerprint !== sessionFingerprint) {
          reportSecurityEvent({
            type: 'session_anomaly',
            message: 'Session fingerprint changed - possible session anomaly',
            timestamp: Date.now(),
            severity: 'medium',
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [sessionFingerprint, reportSecurityEvent]);

  const value: SecurityContextType = {
    isSecure,
    isInIframe,
    csrfToken,
    sessionFingerprint,
    reportSecurityEvent,
    securityEvents,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

export default SecurityProvider;
