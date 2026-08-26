import { AdminRole } from './admin-role';

export interface NavChild {
  label: string;
  path: string;
  description: string;
}

export interface NavGroup {
  label: string;
  icon: string;
  roles: AdminRole[];
  children: NavChild[];
}
