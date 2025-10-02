import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../../components/ui/input.tsx";
import { Label } from "../../../components/ui/label.tsx";
import { MailIcon } from "lucide-react";
import {LoadingButton} from "../../../components/feedback/LoadingButton.tsx";
import {resetPassword} from "../../../lib/api.ts";
import {useToast} from "../../../components/feedback/Toast.tsx";
import {AlertCard} from "../../../components/feedback/AlertCard.tsx";

export const ResetPassword = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [success, setSuccess] = useState(null);
  const [msg, setMsg] = useState('');
  const {show} = useToast();
  const navigate = useNavigate();

  const handleBackToSignIn = () => {
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
      setDisabled(!disabled);
      if(email === "" ) {
          e.preventDefault();
          setDisabled(false);
          show({ type: "error", title: "Email is required", message: "Email cannot be empty" });
          return;
      }
      try {
          const resp = await resetPassword(email);
          const pwdResp = resp?.data;
          if (pwdResp?.data) {
              setMsg(pwdResp?.data?.message);
              // @ts-ignore
              setSuccess('success');
              setEmail("");
              navigate('/verify-otp', { state: { email } });
          }
      }catch (e) {
          console.log(e);
          // @ts-ignore
          setMsg(e?.details?.userMessage || "Something went wrong. Please try again later.");
          // @ts-ignore
          setSuccess('failed');
          setDisabled(false);
      }
  }

  return (
    <div className="min-h-screen bg-gray-5 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
            <div className="w-12 h-14 mx-auto mb-6 rounded-lg flex items-center justify-center">
                <div className="relative w-[45.38px] h-[49px] bg-[url(/vector.png)] bg-[100%_100%]" />
            </div>
          
          <h1 className="text-3xl font-extrabold text-gray-80 mb-2 tracking-tight">
            Reset Password
          </h1>
          
          <p className="text-lg text-slate-600 font-normal leading-relaxed">
            Enter your email to reset your password
          </p>
            <div className={`${success !== null? '':'hidden'} items-center justify-center`}>
                <AlertCard intent="success" title="Reset OTP Sent!" className={`${success === 'success'? '':'hidden'}`}>
                    To continue with your password reset, please check your email for the reset OTP.
                    <br />
                    <br />
                     <strong>{msg}</strong>
                </AlertCard>
                <AlertCard intent="error" title="Password Reset Email Failed" className={`${success === 'failed'? '':'hidden'}`}>
                    We are sorry but we could not send the reset password email <span className=" font-bold">{email}</span>.
                    Please try again later.
                    <br/>
                    <br/>
                    <strong>{msg}</strong>
                </AlertCard>
            </div>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="email" 
              className="text-sm font-bold text-gray-80 tracking-tight"
            >
              Email address
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-slate-600" />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-white border-gray-30 rounded-full text-slate-600 font-medium tracking-tight focus:border-brand-60 focus:ring-brand-60"
                placeholder="example@gmail.com"
              />
            </div>
          </div>

            <LoadingButton type="submit"
                           loading={disabled}
                           disabled={disabled}
                           onClick={handleSubmit}
                           className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-full tracking-tight transition-all duration-200 shadow-lg hover:shadow-xl">
                Reset Password
            </LoadingButton>

          {/* Back to Sign In */}
          <div className="text-center space-y-4">
            <p className="text-sm font-bold text-gray-80 tracking-tight">
              Remember your password?{" "}
              <button
                type="button"
                onClick={handleBackToSignIn}
                className="text-primary-500 hover:text-primary-600 transition-colors font-bold"
              >
                Back to Sign In
              </button>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-30">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <p className="text-base font-bold text-slate-600 tracking-tight">
              Copyright 2025 ESGC ©
            </p>
            <div className="flex items-center space-x-8">
              <button className="text-base font-medium text-primary-500 hover:text-primary-600 transition-colors tracking-tight">
                Privacy Policy
              </button>
              <button className="text-base font-medium text-primary-500 hover:text-primary-600 transition-colors tracking-tight">
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};