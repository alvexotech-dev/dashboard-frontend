export type WorkshopVerificationType = 'LISTED' | 'TRUST';

export type WorkshopVerificationStatus =
  | 'PENDING'
  | 'ADDITIONAL_INFO_REQUESTED'
  | 'APPROVED'
  | 'REJECTED';

export interface WorkshopVerificationSummary {
  id: number;
  workshopName: string;
  ownerName: string;
  mobileNumber: string;
  city: string | null;
  verificationType: WorkshopVerificationType;
  status: WorkshopVerificationStatus;
  requestedAt: string;
}

/**
 * ADMIN-US-06 verification detail. The rating/totalReviews/totalBookingsCompleted/
 * pickupDropEnabled/advancePaymentEnabled fields are the "qualification
 * information" AC-03 calls for — there's no configured Listed/Trust rule set
 * (Epic 10) yet to check automatically, so this is what the admin reviews to
 * make the call manually.
 */
export interface WorkshopVerificationDetail {
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

  verificationType: WorkshopVerificationType;
  status: WorkshopVerificationStatus;
  requestedAt: string;

  registeredAt: string;
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  rating: number | null;
  totalReviews: number | null;
  totalBookingsCompleted: number | null;
  pickupDropEnabled: boolean;
  advancePaymentEnabled: boolean;
  salesAgentName: string | null;

  decisionReason: string | null;
  decidedByAdminName: string | null;
  decidedAt: string | null;
}
