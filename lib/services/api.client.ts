/**
 * Shared API Client with Auth Headers
 * RULE: Always use NEXT_PUBLIC_API_URL — never hardcode backend URLs.
 */

const getBaseApiUrl = () => {
  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');
  return base.endsWith('/api') ? base : `${base}/api`;
};

const API_URL = getBaseApiUrl();

// In-flight request cache for deduplication
let inFlightRequests = new Map<string, Promise<any>>();

/**
 * Clear the global API cache
 * Call this on page transitions or meaningful state resets
 */
export function clearApiCache() {
  inFlightRequests.clear();
}

export class APIError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'APIError';
  }
}

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Filter out Next.js RSC internal calls
  if (endpoint.includes('_rsc=')) {
    console.warn('[API Client] Blocked internal RSC call:', endpoint);
    throw new APIError('Internal call blocked', 0, 'INTERNAL');
  }

  // Create cache key from endpoint + method + body (if POST/PATCH)
  const method = options?.method || 'GET';
  const bodyKey = options?.body ? `:${(options.body as string).length}` : '';
  const cacheKey = `${method}:${endpoint}${bodyKey}`;

  // Deduplicate: return existing in-flight request
  // Only deduplicate GET and strictly identical POST/PATCH if body is stable
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey)!;
  }

  const requestPromise = (async () => {
    try {
      // Add timeout protection (10 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', // Standard CSRF mitigation helper
          ...options?.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Backend envelope: { success: false, error: { code, message, details? } }
        const backendError = errorData.error || {};
        const errorMessage = backendError.message || errorData.message || 'Request failed';
        const errorCode = backendError.code || 'API_ERROR';

        // Suppress expected 401 from /auth/me validation checks
        if (!(response.status === 401 && endpoint === '/auth/me')) {
          if (response.status >= 500) {
            console.error(`[API] ${response.status} ${errorCode}:`, errorMessage);
          } else {
            console.warn(`[API] ${response.status} ${errorCode}:`, errorMessage);
          }
        }
        throw new APIError(errorMessage, response.status, errorCode);
      }

      const result = await response.json();
      // Guard: backend may return success:false with HTTP 200 in edge cases
      if (result.success === false) {
        const err = result.error || {};
        throw new APIError(err.message || 'Request failed', 0, err.code || 'API_ERROR');
      }
      return result.data !== undefined ? result.data : result;
    } catch (error: any) {
      if (error instanceof APIError) {
        throw error;
      }

      // Handle Timeout
      if (error.name === 'AbortError') {
        console.warn('[API Client] Request timeout (Backend not responding)');
        throw new APIError('Request timed out. Please check if the backend server is running.', 0, 'TIMEOUT');
      }

      // Handle Network Errors (Connection Refused, Offline, etc.)
      if (error.name === 'TypeError' || error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
        console.warn('[API Client] Network error (Backend likely offline):', error.message);
        // Throw a specific error code that consumers can check
        throw new APIError('Cannot reach server', 0, 'NETWORK_ERROR');
      }

      console.error('[API Client] Unexpected error:', error);
      throw new APIError(error.message || 'An unexpected error occurred', 0, 'UNKNOWN_ERROR');
    }
  })();

  // Track the request
  inFlightRequests.set(cacheKey, requestPromise);

  requestPromise.finally(() => {
    // Remove from in-flight cache shortly after completion to allow batching but ensure fresh subsequent calls
    setTimeout(() => inFlightRequests.delete(cacheKey), 500);
  });

  return requestPromise;
}
