/**
 * High-level API helpers built on top of the httpClient.
 * Add domain-specific functions here, e.g., auth, profile, etc.
 */

import {
    httpGet,
    httpPost,
    httpPut,
    httpPatch,
    httpDelete,
    ApiError,
    setAuthToken,
    clearAuthToken,
    setAppInfo,
    clearAllAppInfo,
    buildSignedHeaders
}
    from './httpClient';
import type { ApiResponse } from './httpClient';
import {
    LoginResponse,
    ChangePasswordRequest,
    ChangePasswordResponse,
    AuthUrlResponse, EmptyRequest, UserPermissionResponse, ProfileAccount, PasswordResetResponse,
    OtpVerificationResponse, UserAccountResponse, UserAccountRequest, OperatorVerificationRequest,
    OperatorVerificationResponse, LgaResponse, CompanyRequest, CompanyResponse, SignerConfig, ProfileUpdateRequest,
    UploadResponse, UploadRequest, GenericResponse, OperatorMetricsResponse
} from './models';
import {getBase64Image} from "./uploaders.ts";
import {OperatorData} from "./appModels.ts";

export { httpGet, httpPost, httpPut, httpPatch, httpDelete, ApiError, setAuthToken, clearAuthToken, setAppInfo, clearAllAppInfo  };
export type { ApiResponse };
export * from './models';

// Auth
// @ts-ignore
let APP_ID = import.meta.env.VITE_APPLICATION_ID;
// @ts-ignore
let LOGIN_URL = `${import.meta.env.VITE_AUTH_BASE_URL}/login?appId=${APP_ID}&error`;
// @ts-ignore
const STATE_CODE = import.meta.env.VITE_STATE_CODE;
// @ts-ignore
const SERVER_SECRET_KEY = import.meta.env.VITE_SERVER_SK;

// Auth Endpoints
const SIGN_UP =  `/v1/users/public/sign-up`;
const AUTHORIZE_URL = `/v1/auth/users/authorize/endpoint/${APP_ID}`;
const EXCHANGE_CODE_URL = `/v1/auth/users/token/endpoint/${APP_ID}`;
const USER_PERMISSION = `/v1/users/permissions`;
const USER_PROFILE = `/v1/users/profiles`;
const LOG_OUT_URL =  `/v1/auth/users/logout/endpoint`;

// User Service Endpoints
const PASSWORD_RESET =  `v1/users/public/`;
const PASSWORD_RESET_SUFFIX =  `/password/reset`;
const PASSWORD_RESET_VERIFY_OTP =  `/v1/users/verify/otp/`;
const PASSWORD_RESET_OTP =  `/v1/users/public/email/`;
const PASSWORD_RESET_SEND_OTP =  `/send/otp`;
const PASSWORD_CHANGE =  `/password/publicId/`;
const AUTH_USER_PASSWORD_CHANGE =  `/v1/users/password`;
const OPERATOR_VERIFICATION_URL =  `/v1/users/verify/identity?type=`;
const CHANGE_ROLE_URL =  `/v1/users/role/change`;
const USER_PROFILE_ADMIN =  `/v1/users/admin/profiles/`;
const UPLOAD_DOCUMENT_URL =  `/v1/documents/upload`;

// State Service Endpoints
const GET_LGA_URL =  `/region/api/v1/lgas?stateCode=${STATE_CODE}&size=`;
const OPERATOR_URL =  `/platform/api/v1/operators`;
const OPERATORS_METRICS_URL =  `/platform/api/v1/metrics/operators`;
const OPERATOR_METRICS_URL =  `/platform/api/v1/metrics/summary/by-operator/`;


export { LOGIN_URL };
export { APP_ID };
export { SERVER_SECRET_KEY };

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

export async function changeLoginUserPassword( body: ChangePasswordRequest ) {
  return httpPut<ChangePasswordResponse, ChangePasswordRequest>(`${AUTH_USER_PASSWORD_CHANGE}`, body, { base: 'apiV1' });
}

// Profile
export async function fetchProfile() {
  return httpGet<ProfileAccount>(USER_PROFILE, { base: 'apiV1' });
}

export async function updateProfile(publicId: string, body: ProfileUpdateRequest) {
  return httpPut<ProfileAccount, ProfileUpdateRequest>(`${USER_PROFILE_ADMIN}${publicId}`, body, { base: 'apiV1' });
}

// User Sign Up
export async function signUpUser(body: UserAccountRequest) {
  return httpPost<UserAccountResponse, UserAccountRequest>(SIGN_UP, body, { base: 'apiV1', withAuth: false });
}

// Verify Operator
export async function verifyBusinessRegistration(body: OperatorVerificationRequest, type: string) {
  return httpPost<OperatorVerificationResponse, OperatorVerificationRequest>(`${OPERATOR_VERIFICATION_URL}${type}`, body, { base: 'apiV1', withAuth: false });
}

// Get Local Government Areas
export async function getLGAs(size: number) {
    return httpGet<LgaResponse>(`${GET_LGA_URL}${size}`, { base: 'api', withAuth: false });
}

// Add New Operator
export async function addOperator(body: CompanyRequest) {
    return httpPost<CompanyResponse, CompanyRequest>(OPERATOR_URL, body,{ base: 'api' });
}

// Change User Role
export async function requestUserRoleChange(publicId: string, username: string) {
    const cfg: SignerConfig = {
        secret: SERVER_SECRET_KEY,
        saltBytes: 16,
        saltFormat: 'base64',
        tsSkewSecs: 0
    }
    // @ts-ignore
    const headers = await buildSignedHeaders(publicId, username, 'STANDARD', cfg);
    return httpPut<CompanyResponse>(`${CHANGE_ROLE_URL}`, {},{ base: 'apiV1', headers });
}

// Upload Avatar
export async function uploadFileWithBase64(file: File, onProgress?: (pct: number) => void) {
    return await getBase64Image(file)
        .then((body) => {
            return httpPost<UploadResponse, UploadRequest>(UPLOAD_DOCUMENT_URL, body, { base: 'apiV1',
                onUploadProgress: (evt) => {
                    if (!onProgress || !evt.total) return;
                    const pct = Math.round((evt.loaded / evt.total) * 100);
                    onProgress(pct);
                },
            });
        })
}


// Get Operators
export async function fetchOperators(queryString: string) {
    return httpGet<GenericResponse<OperatorData>>(`${OPERATORS_METRICS_URL}?${queryString}`, { base: 'api' });
}

export async function fetchOperatorMetric(operatorId: string | undefined) {
    return httpGet<OperatorMetricsResponse>(`${OPERATOR_METRICS_URL}${operatorId}`, { base: 'api' });
}