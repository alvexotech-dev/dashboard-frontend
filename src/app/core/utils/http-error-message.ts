import { HttpErrorResponse } from '@angular/common/http';

/**
 * A failed request's HttpErrorResponse.status is 0 specifically when the
 * browser never got a response at all — connection refused, DNS failure, a
 * blocked CORS preflight — as opposed to any real HTTP status the backend
 * itself returned (401, 403, 500, ...). That's the one case worth calling
 * out separately: every other error already has its own accurate message
 * (e.g. "Invalid email or password"), and blaming "the backend is down" for
 * a 401 would be actively misleading.
 */
export function httpErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse && error.status === 0) {
    return 'Cannot reach the dashboard backend. Please check that it is running and try again.';
  }
  return fallback;
}
