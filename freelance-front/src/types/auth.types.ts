// ViewModels для API
export interface SignInVM {
  email: string;
  password: string;
}

export interface SignUpVM {
  email: string;
  password: string;
  displayName?: string;
  isFreelancer: boolean;
}

export interface ExternalLoginVM {
  provider: string;
  token: string;
}

// Response types
export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: UserData;
}

export interface UserData {
  id: string;
  email: string;
  displayName?: string;
  isFreelancer: boolean;
}

// Form validation
export interface FormErrors {
  [key: string]: string;
}
