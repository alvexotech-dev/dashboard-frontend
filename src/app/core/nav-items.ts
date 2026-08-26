import { AdminRole } from './models/admin-role';
import { NavGroup } from './models/nav-item';

const { SUPER_ADMIN, FINANCE_ADMIN, OPERATIONS_ADMIN } = AdminRole;

/**
 * Sidenav / Quick Navigation structure, mirrors the 12 epics in
 * "Admin portal .docx" (BR-22 quick-nav cards: Workshop, Rider, Sales Agent,
 * Finance, Reports, Platform Settings). Each group is gated by the roles
 * allowed to see it per ADMIN-US-29 / BR-23 — update dashboard/CLAUDE.md
 * if the role-to-module mapping changes.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Workshop Management',
    icon: 'store',
    roles: [SUPER_ADMIN, OPERATIONS_ADMIN],
    children: [
      { label: 'Directory', path: 'workshops/directory', description: 'Search, filter and view registered workshops.' },
      { label: 'Registration Requests', path: 'workshops/registration-requests', description: 'Approve, reject or request more info on new workshop registrations.' },
      { label: 'Verification Queue', path: 'workshops/verification-queue', description: 'Manage Listed Status and Platform Trust verification requests.' },
      { label: 'Operational Controls', path: 'workshops/operational-controls', description: 'Enable/disable Pickup & Drop and Advance Payment per workshop.' },
      { label: 'Lifecycle History', path: 'workshops/history', description: 'Registration, verification and status-change timeline per workshop.' },
    ],
  },
  {
    label: 'Rider Management',
    icon: 'two_wheeler',
    roles: [SUPER_ADMIN, OPERATIONS_ADMIN],
    children: [
      { label: 'Directory', path: 'riders/directory', description: 'Search and view rider accounts and essential details.' },
      { label: 'Rider History', path: 'riders/history', description: 'Vehicles, bookings, complaints and feedback for a rider.' },
    ],
  },
  {
    label: 'Sales Agent Management',
    icon: 'badge',
    roles: [SUPER_ADMIN, OPERATIONS_ADMIN],
    children: [
      { label: 'Directory', path: 'sales-agents/directory', description: 'Registration, qualification, workshop mapping and status.' },
    ],
  },
  {
    label: 'Finance',
    icon: 'payments',
    roles: [SUPER_ADMIN, FINANCE_ADMIN],
    children: [
      { label: 'Finance Dashboard', path: 'finance/dashboard', description: 'Consolidated settlement status and finance KPIs for a selected date.' },
      { label: 'Booking Financial Breakdown', path: 'finance/booking-breakdown', description: 'Booking-level payment and financial details.' },
      { label: 'Workshop Settlement Summary', path: 'finance/settlement-summary', description: 'Workshop-wise settlement batches and status.' },
      { label: 'Settlement Reconciliation', path: 'finance/reconciliation', description: 'Reconcile platform settlement batches against gateway records.' },
      { label: 'Sales Agent Commission', path: 'finance/commission', description: 'Weekly (Mon–Sat accrual, Sunday payout) sales agent commission.' },
      { label: 'Settlement Exceptions', path: 'finance/exceptions', description: 'Monitor and resolve failed, delayed or ageing settlements.' },
      { label: 'Finance Audit Trail', path: 'finance/audit-trail', description: 'Append-only log of financial actions, decisions and changes.' },
    ],
  },
  {
    label: 'Reports',
    icon: 'summarize',
    roles: [SUPER_ADMIN, FINANCE_ADMIN],
    children: [
      { label: 'Finance Reports', path: 'reports/finance', description: 'Settlement and commission reports, exportable as CSV/XLSX.' },
    ],
  },
  {
    label: 'Platform Settings',
    icon: 'settings',
    roles: [SUPER_ADMIN],
    children: [
      { label: 'Booking Rules', path: 'settings/booking-rules', description: 'Platform-wide booking behaviour (lead time, availability window, expiry).' },
      { label: 'Cancellation & Payment Rules', path: 'settings/cancellation-payment-rules', description: 'Cancellation windows and payment-related rules.' },
      { label: 'Commercial Rules', path: 'settings/commercial-rules', description: 'Fees, advance-payment range and other commercial parameters.' },
      { label: 'Sales Agent Rules', path: 'settings/sales-agent-rules', description: 'Qualification criteria and commission rule definitions.' },
      { label: 'Platform User Status', path: 'settings/user-status', description: 'Manual suspend/reactivate for workshops and sales agents.' },
      { label: 'Notification Templates', path: 'settings/notification-templates', description: 'Content templates per event and channel (in-app, SMS, email, push).' },
      { label: 'Admin Roles & Permissions', path: 'settings/admin-roles', description: 'Manage Super Admin, Finance Admin and Operations Admin access.' },
      { label: 'Platform Administration', path: 'settings/platform-administration', description: 'Maintenance mode and other platform-level controls.' },
      { label: 'Configuration Versioning', path: 'settings/config-versioning', description: 'Version history, operational overrides and rollback.' },
    ],
  },
];
