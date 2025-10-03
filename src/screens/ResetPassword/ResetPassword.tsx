import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { MailIcon } from "lucide-react";

export const ResetPassword = (): JSX.Element => {
  const [email, setEmail] = useState("example@gmail.com");
  const navigate = useNavigate();

  const handleBackToSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-5 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-14 mx-auto mb-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <div className="w-8 h-10 bg-white rounded-sm opacity-90"></div>
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-80 mb-2 tracking-tight">
            Reset Password
          </h1>
          
          <p className="text-lg text-slate-600 font-normal leading-relaxed">
            Enter your email to reset your password
          </p>
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

          {/* Reset Password Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-full tracking-tight transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Reset Password
          </Button>

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