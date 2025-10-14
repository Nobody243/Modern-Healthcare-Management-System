/**
 * Security & Input Validation Utilities for Hospital Management System
 */

// Basic email validation regex conforming to standard web standards
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Sanitizes generic user text inputs:
 * - Strips dangerous null bytes (\0)
 * - Trims leading and trailing whitespace
 * - Restricts excessively long inputs to prevent memory exhaustion
 */
export function sanitizeText(input: unknown, maxLength = 2000): string {
  if (typeof input !== 'string') {
    return '';
  }
  // Strip null bytes and control chars (except normal newlines/tabs)
  const cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  return cleaned.trim().slice(0, maxLength);
}

/**
 * Validates email addresses
 */
export function isValidEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length > 254 || trimmed.length < 5) return false;
  return EMAIL_REGEX.test(trimmed);
}

/**
 * Validates password strength
 * Minimum 6 characters (for internal hospital portal compatibility)
 */
export function isValidPassword(password: unknown, minLength = 6): { valid: boolean; reason?: string } {
  if (typeof password !== 'string' || !password) {
    return { valid: false, reason: 'Password is required' };
  }
  if (password.length < minLength) {
    return { valid: false, reason: `Password must be at least ${minLength} characters long` };
  }
  if (password.length > 128) {
    return { valid: false, reason: 'Password exceeds maximum length of 128 characters' };
  }
  return { valid: true };
}

/**
 * Parses safe integers within min and max boundaries
 */
export function parseSafeInt(val: unknown, min = 0, max = 2147483647): number | null {
  if (val === null || val === undefined || val === '') return null;
  const num = Number(val);
  if (isNaN(num) || !Number.isInteger(num)) return null;
  if (num < min || num > max) return null;
  return num;
}
