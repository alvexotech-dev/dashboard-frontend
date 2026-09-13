export interface VehicleUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  city: string;
  state: string | null;
  emailVerified: boolean;
  mobileVerified: boolean;
  active: boolean;
  createdAt: string;
}
