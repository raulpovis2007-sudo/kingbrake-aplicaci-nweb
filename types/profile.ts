export type Role = 'CLIENT' | 'ADMIN';
export type UserStatus = "ACTIVE" | "SUSPENDED";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  role: Role;
  createdAt: Date;
  status: UserStatus;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  image?: string;
}

export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
