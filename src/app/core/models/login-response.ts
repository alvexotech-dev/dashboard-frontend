import { AdminRole } from './admin-role';

export interface AdminUserSummary {
  id: number;
  email: string;
  fullName: string;
  role: AdminRole;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  adminUser: AdminUserSummary;
}
