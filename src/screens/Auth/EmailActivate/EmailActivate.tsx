import React from "react";
import { useNavigate } from "react-router-dom";
import { OtpInput } from "../../../components/form/OtpInput";
import { LoadingButton } from "../../../components/feedback/LoadingButton";
import { useToast } from "../../../components/feedback/Toast";
import { Label } from "../../../components/ui/label";
import { cn } from "../../../lib/utils";
import { verifyPasswordResetOtp } from "../../../lib/api";

export const EmailActivate: React.FC = () => {
    const [code, setCode] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [cooldown, setCooldown] = React.useState(0); // seconds
    const { show } = useToast();
    const navigate = useNavigate();

    // simple resend cooldown timer
    React.useEffect(() => {
        if (cooldown <= 0) return;
        const t = setInterval(() => setCooldown((c) => c - 1), 1000);
        return () => clearInterval(t);
    }, [cooldown]);

    const handleVerify = async () => {
        setSubmitting(true);
        setError(null);
        try {
            const resp = await verifyPasswordResetOtp(code);
            const ok = resp?.data;
            if (ok?.data) {
                show({ type: "success", title: "Verified", message: "OTP verified successfully" });
                // Navigate to change password or next step. Adjust as needed.
                navigate("/", { replace: true });
            } else {
                setError("The code you entered is not valid. Please try again.");
                show({ type: "error", title: "Invalid code", message: "Please check the 6-digit code and try again." });
            }
        } catch (e: any) {
            setError(e?.details?.userMessage || "Unable to verify code. Try again.");
            show({ type: "error", title: "Verification failed", message: e?.details?.userMessage || "Network error" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-5 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-12 h-14 mx-auto mb-6 rounded-lg flex items-center justify-center">
                        <div className="relative w-[45.38px] h-[49px] bg-[url(/vector.png)] bg-[100%_100%]" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-80 mb-2 tracking-tight">Verify Code</h1>
                    <p className="text-lg text-slate-600 font-normal leading-relaxed">
                        Enter the 6-digit code sent to your email
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-80 tracking-tight">One-time code</Label>
                        <OtpInput
                            length={6}
                            value={code}
                            onChange={(v) => {
                                setCode(v);
                                if (error) setError(null);
                            }}
                            onComplete={(v) => setCode(v)}
                            autoFocus
                            disabled={submitting}
                            hasError={!!error}
                            errorMessage={error || undefined}
                        />
                    </div>

                    <LoadingButton
                        type="button"
                        onClick={handleVerify}
                        loading={submitting}
                        className={cn(
                            "w-full h-12 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-full tracking-tight transition-all duration-200 shadow-lg hover:shadow-xl"
                        )}
                        disabled={code.replace(/\D/g, "").length !== 6 || submitting}
                    >
                        Verify
                    </LoadingButton>

                </div>

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