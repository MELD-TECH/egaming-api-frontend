/**
 * High-level API helpers built on top of the httpClient.
 * Add domain-specific functions here, e.g., auth, profile, etc.
 */

import { httpGet, httpPost, httpPut, httpPatch, httpDelete, ApiError, setAuthToken, clearAuthToken, setAppInfo, clearAllAppInfo }
    from './httpClient';
import type { ApiResponse } from './httpClient';
import {
    LoginResponse,
    ChangePasswordRequest,
    ChangePasswordResponse,
    AuthUrlResponse, EmptyRequest, UserPermissionResponse, ProfileAccount, PasswordResetResponse,
    OtpVerificationResponse, UserAccountResponse, UserAccountRequest
} from './models';

export { httpGet, httpPost, httpPut, httpPatch, httpDelete, ApiError, setAuthToken, clearAuthToken, setAppInfo, clearAllAppInfo  };
export type { ApiResponse };
export * from './models';

// Auth
// @ts-ignore
let APP_ID = import.meta.env.VITE_APPLICATION_ID;
// @ts-ignore
let LOGIN_URL = `${import.meta.env.VITE_AUTH_BASE_URL}/login?appId=${APP_ID}&error`;
const SIGN_UP =  `/v1/users/public/sign-up`;
const AUTHORIZE_URL = `/v1/auth/users/authorize/endpoint/${APP_ID}`;
const EXCHANGE_CODE_URL = `/v1/auth/users/token/endpoint/${APP_ID}`;
const USER_PERMISSION = `/v1/users/permissions`;
const USER_PROFILE = `/v1/users/profiles`;
const LOG_OUT_URL =  `/v1/auth/users/logout/endpoint`;
const PASSWORD_RESET =  `v1/users/public/`;
const PASSWORD_RESET_SUFFIX =  `/password/reset`;
const PASSWORD_RESET_VERIFY_OTP =  `/v1/users/verify/otp/`;
const PASSWORD_RESET_OTP =  `/v1/users/public/email/`;
const PASSWORD_RESET_SEND_OTP =  `/send/otp`;
const PASSWORD_CHANGE =  `/password/publicId/`;

export { LOGIN_URL };
export { APP_ID };

export async function getAuthorizerUrl() {
  return httpGet<AuthUrlResponse>(AUTHORIZE_URL, { withAuth: false, base: 'apiV1' });
}

export async function requestCodeAuthorization(code: string | null) {
  // If your login is public, you can disable auth header injection:
  return httpPost<LoginResponse, EmptyRequest>(`${EXCHANGE_CODE_URL}/${code}`, {}, { withAuth: false, base: 'apiV1' });
}

export async function loadUserPermissions() {
  return httpGet<UserPermissionResponse>(USER_PERMISSION, { base: 'apiV1' });
}

export async function logout() {
  return httpGet<string>(`${LOG_OUT_URL}?appId=${APP_ID}`, { base: 'apiV1' });
}

export async function resetPassword(email: string) {
  return httpGet<PasswordResetResponse>(`${PASSWORD_RESET}${email}${PASSWORD_RESET_SUFFIX}?appId=${APP_ID}`, { base: 'apiV1', withAuth: false });
}

export async function resendPasswordResetOtp(email: string) {
  return httpPost<PasswordResetResponse>(`${PASSWORD_RESET_OTP}${email}${PASSWORD_RESET_SEND_OTP}`, {}, { base: 'apiV1', withAuth: false });
}

export async function verifyPasswordResetOtp( code: string) {
  return httpPut<OtpVerificationResponse>(`${PASSWORD_RESET_VERIFY_OTP}${code}`, {}, { base: 'apiV1', withAuth: false });
}

export async function changeUserPassword( publicId: string, body: ChangePasswordRequest) {
  return httpPut<ChangePasswordResponse, ChangePasswordRequest>(`${PASSWORD_RESET}${PASSWORD_CHANGE}${publicId}`, body, { base: 'apiV1', withAuth: false });
}

// Profile
export async function fetchProfile() {
  return httpGet<ProfileAccount>(USER_PROFILE, { base: 'apiV1' });
}

// User Sign Up
export async function signUpUser(body: UserAccountRequest) {
  return httpPost<UserAccountResponse, UserAccountRequest>(SIGN_UP, body, { base: 'apiV1', withAuth: false });
}
