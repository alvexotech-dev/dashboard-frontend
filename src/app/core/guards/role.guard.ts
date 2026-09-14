import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AdminRole } from '../models/admin-role';

/**
 * Checks the current admin's role against `route.data['roles']` (set per
 * NAV_GROUPS-generated route in app.routes.ts). Routes without a `roles`
 * entry are allowed for any authenticated admin. This is UX-only — the
 * actual security boundary is each backend endpoint's own @PreAuthorize.
 */
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as AdminRole[] | undefined;
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  if (auth.currentRole() && allowedRoles.includes(auth.currentRole()!)) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
