export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  FINANCE_ADMIN = 'FINANCE_ADMIN',
  OPERATIONS_ADMIN = 'OPERATIONS_ADMIN',
}

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  [AdminRole.SUPER_ADMIN]: 'Super Admin',
  [AdminRole.FINANCE_ADMIN]: 'Finance Admin',
  [AdminRole.OPERATIONS_ADMIN]: 'Operations Admin',
};
