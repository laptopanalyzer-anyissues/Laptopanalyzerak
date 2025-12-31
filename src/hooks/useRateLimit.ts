import { useState, useCallback } from 'react';
import { checkRateLimit, clearRateLimit } from '@/lib/security';

interface UseRateLimitOptions {
  maxRequests?: number;
  windowMs?: number;
  blockDurationMs?: number;
}

interface UseRateLimitReturn {
  checkLimit: () => boolean;
  isBlocked: boolean;
  remainingRequests: number;
  retryAfter: number | null;
  reset: () => void;
}

/**
 * React hook for rate limiting actions
 * Prevents brute force and DoS attacks at the client level
 */
export const useRateLimit = (
  key: string,
  options: UseRateLimitOptions = {}
): UseRateLimitReturn => {
  const {
    maxRequests = 10,
    windowMs = 60000, // 1 minute
    blockDurationMs = 300000, // 5 minutes
  } = options;

  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(maxRequests);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  const checkLimit = useCallback((): boolean => {
    const result = checkRateLimit(key, maxRequests, windowMs, blockDurationMs);
    
    setIsBlocked(!result.allowed);
    setRemainingRequests(result.remainingRequests);
    setRetryAfter(result.retryAfter ?? null);

    return result.allowed;
  }, [key, maxRequests, windowMs, blockDurationMs]);

  const reset = useCallback((): void => {
    clearRateLimit(key);
    setIsBlocked(false);
    setRemainingRequests(maxRequests);
    setRetryAfter(null);
  }, [key, maxRequests]);

  return {
    checkLimit,
    isBlocked,
    remainingRequests,
    retryAfter,
    reset,
  };
};

export default useRateLimit;
