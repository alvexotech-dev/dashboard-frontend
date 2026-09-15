import { AccountStatus } from './mechanic';

export type SettlementStatus = 'PENDING' | 'PROCESSING' | 'PAID';

/**
 * ADMIN-US-02 Workshop Summary (BR-06..BR-11). Business Information
 * (BR-08: supported vehicle types, working days/hours) and Listed/Platform
 * Trusted status (part of BR-09) are omitted — see WorkshopSummaryDto on the
 * backend for why.
 */
export interface WorkshopSummary {
  id: number;
  workshopName: string;
  ownerName: string;
  mobileNumber: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;

  registeredAt: string;
  pickupDropEnabled: boolean;
  advancePaymentEnabled: boolean;
  salesAgentName: string | null;
  accountStatus: AccountStatus;

  totalBookings: number;
  upcomingBookings: number;
  cancelledBookings: number;

  lastSettlementDate: string | null;
  lastSettlementStatus: SettlementStatus | null;
}
