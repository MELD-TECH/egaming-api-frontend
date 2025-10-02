import React, { useState } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import { password as passwordValidator } from "../../../components/form/validators";
import {LoadingButton} from "../../../components/feedback/LoadingButton.tsx";
import { changeUserPassword } from "../../../lib/api.ts";
import {useToast} from "../../../components/feedback/Toast.tsx"; // <-- add this

// Helper to get email and public id from router state or query
function useEmailAndPublicIdFromRoute(): { email: string | null; publicId: string } {
    const navigate = useNavigate();
    const { state, search } = useLocation();
    const emailFromState = (state as any)?.email as string | undefined;
    const idFromState = (state as any)?.ref as string | undefined;
    const params = new URLSearchParams(search);
    const emailFromQuery = params.get("email") ?? undefined;
    const idFromQuery = params.get("id") ?? undefined;
    const email = emailFromState || emailFromQuery || null;
    const publicId = idFromState || idFromQuery || null;

    React.useEffect(() => {
        if (!email && !publicId) {
            // If user landed here without email and public id, redirect back to reset
            navigate("/reset-password");
        }
    }, [email, navigate]);

    // @ts-ignore
    return {email: email, publicId: publicId};
}

export const ChangeUserPassword = (): JSX.Element => {
    const {email, publicId } = useEmailAndPublicIdFromRoute();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentPassword, ] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [disabled, setDisabled] = useState(false);
    const { show } = useToast();

    // NEW: error state
    const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

    const navigate = useNavigate();

    const validateNewPassword = (value: string) => {
        const err = passwordValidator(8)(value);

        setNewPasswordError(err);
        if (confirmPassword) {
            setConfirmPasswordError(value === confirmPassword ? null : "Passwords do not match");
        }
    };

    const validateConfirmPassword = (value: string, base: string) => {
        setConfirmPasswordError(value === base ? null : "Passwords do not match");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const pwErr = passwordValidator(8)(newPassword);
        const confErr = newPassword === confirmPassword ? null : "Passwords do not match";

        setNewPasswordError(pwErr);
        setConfirmPasswordError(confErr);

        if (pwErr || confErr) return; // prevent submit

        // Handle password change logic here
        setDisabled(!disabled);
        try {
            const resp = await changeUserPassword(publicId, { newPassword, currentPassword});
            const updatedPwd = resp?.data;
            if (updatedPwd?.data?.includes(email as string)) {
                navigate('/', { replace: true, state: { email: null, ref: null } });
            }
        }catch (e) {
            console.log(e);
            show({ type: "error", title: "Invalid code", message: "Please check the 6-digit code and try again." });
            setDisabled(false);
        }
    };

    const disableSubmit = !!(passwordValidator(8)(newPassword) || newPassword !== confirmPassword);

    return (
        <div className="min-h-screen bg-gray-5 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-12 h-14 mx-auto mb-6 rounded-lg flex items-center justify-center">
                        <div className="relative w-[45.38px] h-[49px] bg-[url(/vector.png)] bg-[100%_100%]" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-80 mb-2 tracking-tight">Change Password</h1>
                    <p className="text-lg text-slate-600 font-normal leading-relaxed">Update your account password <br/>
                        <span className="border text-blue-600">{email}</span>
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-bold text-gray-80 tracking-tight">New Password</Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockIcon className="h-5 w-5 text-slate-600" />
                            </div>
                            <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => { setNewPassword(e.target.value); validateNewPassword(e.target.value); }}
                                className="pl-10 pr-10 h-12 bg-white border-gray-30 rounded-full text-slate-600 font-medium tracking-tight focus:border-brand-60 focus:ring-brand-60"
                                placeholder="Enter new password"
                                required
                                aria-invalid={!!newPasswordError}
                                aria-describedby="newPassword-error"
                            />
                            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowNewPassword(!showNewPassword)}>
                                {showNewPassword ? (
                                    <EyeOffIcon className="h-5 w-5 text-slate-600 hover:text-gray-80 transition-colors" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-slate-600 hover:text-gray-80 transition-colors" />
                                )}
                            </button>
                        </div>
                        {newPasswordError && (
                            <p id="newPassword-error" className="text-sm text-red-600 mt-1">{newPasswordError}</p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-bold text-gray-80 tracking-tight">Confirm New Password</Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockIcon className="h-5 w-5 text-slate-600" />
                            </div>
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => { setConfirmPassword(e.target.value); validateConfirmPassword(e.target.value, newPassword); }}
                                className="pl-10 pr-10 h-12 bg-white border-gray-30 rounded-full text-slate-600 font-medium tracking-tight focus:border-brand-60 focus:ring-brand-60"
                                placeholder="Confirm new password"
                                required
                                aria-invalid={!!confirmPasswordError}
                                aria-describedby="confirmPassword-error"
                            />
                            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? (
                                    <EyeOffIcon className="h-5 w-5 text-slate-600 hover:text-gray-80 transition-colors" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-slate-600 hover:text-gray-80 transition-colors" />
                                )}
                            </button>
                        </div>
                        {confirmPasswordError && (
                            <p id="confirmPassword-error" className="text-sm text-red-600 mt-1">{confirmPasswordError}</p>
                        )}
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-gray-5 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-gray-80 mb-3 tracking-tight">Password Requirements</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-40 rounded-full"></div><span className="text-sm text-gray-60 tracking-tight">At least 8 characters long</span></div>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-40 rounded-full"></div><span className="text-sm text-gray-60 tracking-tight">Contains uppercase and lowercase letters</span></div>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-40 rounded-full"></div><span className="text-sm text-gray-60 tracking-tight">Contains at least one number</span></div>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-40 rounded-full"></div><span className="text-sm text-gray-60 tracking-tight">Contains at least one special character</span></div>
                        </div>
                    </div>

                    {/* Change Password Button */}
                    <LoadingButton type="submit"
                                   loading={disabled}
                                   disabled={disableSubmit}
                                   onClick={handleSubmit}
                                   className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-full tracking-tight transition-all duration-200 shadow-lg hover:shadow-xl">
                        Change Password
                    </LoadingButton>
                </form>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-30">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <p className="text-base font-bold text-slate-600 tracking-tight">Copyright 2025 ESGC ©</p>
                        <div className="flex items-center space-x-8">
                            <button className="text-base font-medium text-primary-500 hover:text-primary-600 transition-colors tracking-tight">Privacy Policy</button>
                            <button className="text-base font-medium text-primary-500 hover:text-primary-600 transition-colors tracking-tight">Terms & Conditions</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};