// Константи для ролей
export const UserRoles = {
  FREELANCER: "freelancer",
  EMPLOYER: "employer",
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

// ViewModels для API
export interface SignInVM {
  email: string;
  password: string;
}

export interface SignUpVM {
  email: string;
  password: string;
  displayName?: string;
  userRole: UserRole;
}

export interface ExternalLoginVM {
  provider: string;
  token: string;
  userRole?: UserRole;
}

// Response types
export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
  token?: string;
  user?: UserData;
}

export interface UserData {
  id: string;
  email: string;
  displayName?: string;
  userRole: UserRole;
}

// Form validation
export interface FormErrors {
  [key: string]: string;
}
