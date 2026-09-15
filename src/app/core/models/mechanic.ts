export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';

export interface Mechanic {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  workshopName: string;
  city: string;
  state: string | null;
  specialization: string | null;
  experienceYears: number | null;
  hourlyRate: number | null;
  rating: number | null;
  registeredAt: string;
  pickupDropEnabled: boolean;
  advancePaymentEnabled: boolean;
  accountStatus: AccountStatus;
  salesAgentName: string | null;
}
