/**
 * API Interceptor
 * Global error handling for backend API calls
 */

import { showError } from '@/lib/notifications';

export class ApiError extends Error {
  code: string;
  status?: number;
  details?: any;

  constructor(code: string, message: string, status?: number, details?: any) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
    this.name = 'ApiError';
  }
}

/**
 * Handle API errors and show notifications
 */
export function handleApiError(error: any): never {
  let errorCode = 'API_ERROR';
  let errorMessage = 'Request failed';

  if (error?.message) {
    errorMessage = error.message;
  }

  if (error?.status) {
    switch (error.status) {
      case 400:
        errorCode = 'VALIDATION_ERROR';
        errorMessage = 'Invalid request data';
        break;
      case 401:
        errorCode = 'UNAUTHORIZED';
        errorMessage = 'Please sign in to continue';
        break;
      case 403:
        errorCode = 'FORBIDDEN';
        errorMessage = 'You do not have permission';
        break;
      case 404:
        errorCode = 'NOT_FOUND';
        errorMessage = 'Resource not found';
        break;
      case 500:
        errorCode = 'SERVER_ERROR';
        errorMessage = 'Server error. Please try again later';
        break;
    }
  }

  const apiError = new ApiError(errorCode, errorMessage, error?.status, error);
  showError(apiError);
  throw apiError;
}
