import { Injectable, signal } from '@angular/core';
import { AdminRole } from '../models/admin-role';

/**
 * Stub auth service — no backend exists yet (see dashboard/CLAUDE.md).
 * login() currently accepts a role directly instead of validating credentials
 * against a server. Replace with a real HTTP call + JWT storage once
 * dashboard/backend exposes an auth endpoint.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isAuthenticated = signal(false);
  readonly currentRole = signal<AdminRole | null>(null);
  readonly adminName = signal<string | null>(null);

  login(name: string, role: AdminRole): void {
    this.adminName.set(name);
    this.currentRole.set(role);
    this.isAuthenticated.set(true);
  }

  logout(): void {
    this.adminName.set(null);
    this.currentRole.set(null);
    this.isAuthenticated.set(false);
  }
}
