import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';
import { LoginResponse } from '../models/login-response';
import { AdminRole } from '../models/admin-role';

const TOKEN_STORAGE_KEY = 'admin_access_token';

interface AccessTokenClaims {
  sub: string;
  email: string;
  fullName: string;
  role: AdminRole;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isAuthenticated = signal(false);
  readonly currentRole = signal<AdminRole | null>(null);
  readonly adminName = signal<string | null>(null);
  readonly currentAdminId = signal<number | null>(null);

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  login(email: string, password: string): Observable<void> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/api/auth/login`, { email, password })
      .pipe(
        tap((response) => this.applySession(response.data.accessToken)),
        map(() => void 0),
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    this.adminName.set(null);
    this.currentRole.set(null);
    this.currentAdminId.set(null);
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  private restoreSession(): void {
    const token = this.getToken();
    if (!token) return;

    const claims = this.decodeClaims(token);
    if (!claims || claims.exp * 1000 <= Date.now()) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return;
    }

    this.currentAdminId.set(Number(claims.sub));
    this.adminName.set(claims.fullName);
    this.currentRole.set(claims.role);
    this.isAuthenticated.set(true);
  }

  private applySession(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    const claims = this.decodeClaims(token);
    if (!claims) return;

    this.currentAdminId.set(Number(claims.sub));
    this.adminName.set(claims.fullName);
    this.currentRole.set(claims.role);
    this.isAuthenticated.set(true);
  }

  private decodeClaims(token: string): AccessTokenClaims | null {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64)) as AccessTokenClaims;
    } catch {
      return null;
    }
  }
}
