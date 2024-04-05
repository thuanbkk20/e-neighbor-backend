import { HttpStatus } from '@nestjs/common';

// System error messages
export const ERROR_SYSTEM = 'error.system';

// User Module error messages
export const ERROR_USER_NOT_FOUND = 'error.userNotFound';
export const ERROR_UNIQUE_EMAIL = 'error.unique.email';
export const ERROR_USER_CONFLICT = 'error.userConflict';
export const ERROR_DATA_CONFLICT = 'error.dataConflict';

// Payment Module error messages
export const ERROR_DUPLICATE_PAYMENT_METHOD = 'error.duplicatePaymentMethod';

// Lessor Module error messages
export const ERROR_LESSOR_NOT_FOUND = 'error.lessorNotFound';

// Admin Module error messages
export const ERROR_ADMIN_NOT_FOUND = 'error.adminNotFound';

// Product Module error messages
export const ERROR_PRODUCT_NOT_FOUND = 'error.productNotFound';
export const ERROR_PRODUCT_MISSING_FIELD = 'error.productMissingField';

// Error refreshToken expired
export const ERROR_REFRESH_TOKEN_EXPIRED = 'error.refreshTokenExpired';

// Error Unauthorized
export const ERROR_UNAUTHORIZED = 'error.unauthorized';

// OAuth error messages
export const ERROR_OAUTH_FAILED = 'error.oauthFailed';

// Bad input error messages
export const ERROR_BAD_INPUT = 'error.badInput';

// logout exception
export const ERROR_LOGOUT_FAILED = 'error.logoutFailed';

export const CONSTRAINT_ERRORS: Record<string, string | string[]> = {
  // System error
  SYS_000: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
  SYS_002: HttpStatus.UNPROCESSABLE_ENTITY.toString(),
  SYS_003: HttpStatus.SERVICE_UNAVAILABLE.toString(),

  // Admin Module error
  ADMIN_001: ERROR_ADMIN_NOT_FOUND,

  // User Module error
  USER_001: ERROR_USER_NOT_FOUND,
  USER_002: [
    ERROR_UNIQUE_EMAIL,
    ERROR_UNAUTHORIZED,
    HttpStatus.UNAUTHORIZED.toString(),
  ],
  USER_004: ERROR_USER_CONFLICT,

  // Lessor Module error
  LESSOR_001: ERROR_LESSOR_NOT_FOUND,

  // Token error
  TOKEN_001: ERROR_REFRESH_TOKEN_EXPIRED,

  // OAuth error
  OAUTH_001: ERROR_OAUTH_FAILED,

  // Bad input error
  BAD_INPUT_001: ERROR_BAD_INPUT,

  // Logout error
  LOGOUT_001: ERROR_LOGOUT_FAILED,

  //Data
  DATA_001: ERROR_DATA_CONFLICT,

  // Payment
  PAYMENT_001: ERROR_DUPLICATE_PAYMENT_METHOD,
};
