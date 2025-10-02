// Centralized request/response payload models for API calls

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface EmptyRequest {}


export interface LoginResponse {
  // user: { id: string; email: string; name?: string };
    data: {
        access_token: string;
        refresh_token: string;
    };
}

export interface AuthUrlResponse {
  authorizerUrl: string;
}

// User Permissions
export interface UserPermissionResponse {
    data: {
        permissions: string[];
    };
}

// User
export interface ProfileAccount {
    data: {
        publicId: string;
        username: string;
        profile: {
            email: string;
            firstName: string;
            middleName: string;
            lastName: string;
            phoneNumber: string;
            profilePicture: string;
            settings: {
                role: string,
                isEmailVerified: boolean
            }
        }
    }
}

export interface PasswordResetResponse {
    data: {
        message: string;
    }
}

export interface PasswordUpdateResponse {
    data: string
}

export interface OtpVerificationResponse {
    data: {
        message: string;
        publicId: string;
    }
}

// Change Password (inferred from the ChangeUserPassword screen)
// Typical backend contract: requires a current password and new password.
// Confirm password is client-side validation only, but we keep it optional in case the backend needs it.
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface ChangePasswordResponse {
  data: string;
  message?: string;
}

export interface UserAccountRequest {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    phone: string;
    role: string;
    appId: string;
}

export interface UserAccountResponse {
  data: {
      publicId: string;
      message?: string;
  }
}
