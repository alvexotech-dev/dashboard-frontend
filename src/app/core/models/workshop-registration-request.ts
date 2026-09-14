export type WorkshopRegistrationRequestStatus =
  | 'PENDING'
  | 'ADDITIONAL_INFO_REQUESTED'
  | 'APPROVED'
  | 'REJECTED';

export interface WorkshopRegistrationRequestSummary {
  id: number;
  workshopName: string;
  ownerName: string;
  mobileNumber: string;
  city: string | null;
  registeredAt: string;
  status: WorkshopRegistrationRequestStatus;
}

export interface WorkshopRegistrationRequestDetail {
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
  referredSalesAgentName: string | null;
  status: WorkshopRegistrationRequestStatus;
  decisionReason: string | null;
  decidedByAdminName: string | null;
  decidedAt: string | null;
}
