import { useState, useCallback, useEffect } from 'react';
import { 
  validateInput, 
  isValidEmail, 
  generateCSRFToken, 
  storeCSRFToken, 
  getCSRFToken 
} from '@/lib/security';
import { useRateLimit } from './useRateLimit';

interface SecureFormField {
  value: string;
  error: string | null;
  touched: boolean;
}

interface UseSecureFormOptions {
  maxSubmitsPerMinute?: number;
  csrfProtection?: boolean;
}

interface UseSecureFormReturn<T extends Record<string, string>> {
  fields: Record<keyof T, SecureFormField>;
  setField: (name: keyof T, value: string) => void;
  validateField: (name: keyof T, validators?: FieldValidator[]) => boolean;
  validateAll: (validators: Record<keyof T, FieldValidator[]>) => boolean;
  isSubmitting: boolean;
  isRateLimited: boolean;
  retryAfter: number | null;
  handleSubmit: (onSubmit: () => Promise<void>) => Promise<void>;
  csrfToken: string | null;
  reset: () => void;
}

interface FieldValidator {
  validate: (value: string) => boolean;
  message: string;
}

// Common validators
export const validators = {
  required: (message = 'This field is required'): FieldValidator => ({
    validate: (value: string) => value.trim().length > 0,
    message,
  }),
  
  email: (message = 'Please enter a valid email'): FieldValidator => ({
    validate: isValidEmail,
    message,
  }),
  
  minLength: (min: number, message?: string): FieldValidator => ({
    validate: (value: string) => value.length >= min,
    message: message ?? `Must be at least ${min} characters`,
  }),
  
  maxLength: (max: number, message?: string): FieldValidator => ({
    validate: (value: string) => value.length <= max,
    message: message ?? `Must not exceed ${max} characters`,
  }),
  
  noMaliciousContent: (message = 'Invalid content detected'): FieldValidator => ({
    validate: (value: string) => {
      const result = validateInput(value, { checkSQLInjection: true, allowHTML: false });
      return result.isValid;
    },
    message,
  }),
};

/**
 * Secure form hook with built-in protections against:
 * - XSS (input sanitization)
 * - CSRF (token generation)
 * - Brute force (rate limiting)
 * - SQL Injection (pattern detection)
 */
export function useSecureForm<T extends Record<string, string>>(
  initialValues: T,
  options: UseSecureFormOptions = {}
): UseSecureFormReturn<T> {
  const { 
    maxSubmitsPerMinute = 5, 
    csrfProtection = true 
  } = options;

  const [fields, setFields] = useState<Record<keyof T, SecureFormField>>(() => {
    const initial: Record<string, SecureFormField> = {};
    for (const key of Object.keys(initialValues)) {
      initial[key] = { value: initialValues[key], error: null, touched: false };
    }
    return initial as Record<keyof T, SecureFormField>;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const { checkLimit, isBlocked: isRateLimited, retryAfter, reset: resetRateLimit } = useRateLimit(
    'form_submit',
    { maxRequests: maxSubmitsPerMinute, windowMs: 60000, blockDurationMs: 60000 }
  );

  // Initialize CSRF token
  useEffect(() => {
    if (csrfProtection) {
      let token = getCSRFToken();
      if (!token) {
        token = generateCSRFToken();
        storeCSRFToken(token);
      }
      setCsrfToken(token);
    }
  }, [csrfProtection]);

  const setField = useCallback((name: keyof T, value: string) => {
    // Sanitize input on change
    const sanitized = validateInput(value, { maxLength: 10000 }).sanitized;
    
    setFields(prev => ({
      ...prev,
      [name]: { 
        value: sanitized, 
        error: null, 
        touched: true 
      },
    }));
  }, []);

  const validateField = useCallback((
    name: keyof T, 
    fieldValidators: FieldValidator[] = []
  ): boolean => {
    const field = fields[name];
    
    for (const validator of fieldValidators) {
      if (!validator.validate(field.value)) {
        setFields(prev => ({
          ...prev,
          [name]: { ...prev[name], error: validator.message },
        }));
        return false;
      }
    }
    
    setFields(prev => ({
      ...prev,
      [name]: { ...prev[name], error: null },
    }));
    return true;
  }, [fields]);

  const validateAll = useCallback((
    allValidators: Record<keyof T, FieldValidator[]>
  ): boolean => {
    let isValid = true;
    
    for (const key of Object.keys(allValidators) as Array<keyof T>) {
      if (!validateField(key, allValidators[key])) {
        isValid = false;
      }
    }
    
    return isValid;
  }, [validateField]);

  const handleSubmit = useCallback(async (onSubmit: () => Promise<void>) => {
    // Check rate limit
    if (!checkLimit()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  }, [checkLimit]);

  const reset = useCallback(() => {
    const initial: Record<string, SecureFormField> = {};
    for (const key of Object.keys(initialValues)) {
      initial[key] = { value: initialValues[key], error: null, touched: false };
    }
    setFields(initial as Record<keyof T, SecureFormField>);
    resetRateLimit();
  }, [initialValues, resetRateLimit]);

  return {
    fields,
    setField,
    validateField,
    validateAll,
    isSubmitting,
    isRateLimited,
    retryAfter,
    handleSubmit,
    csrfToken,
    reset,
  };
}

export default useSecureForm;
