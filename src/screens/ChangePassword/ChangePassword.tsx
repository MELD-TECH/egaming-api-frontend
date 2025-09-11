import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { EyeIcon, EyeOffIcon, LockIcon, ArrowLeft } from "lucide-react";

export const ChangePassword = (): JSX.Element => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/settings');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic here
    console.log("Password change submitted");
  };

  return (
    <div className="min-h-screen bg-gray-5 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-60 hover:text-gray-80 p-0 h-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Settings
          </Button>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-14 mx-auto mb-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <div className="w-8 h-10 bg-white rounded-sm opacity-90"></div>
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-80 mb-2 tracking-tight">
            Change Password
          </h1>
          
          <p className="text-lg text-slate-600 font-normal leading-relaxed">
            Update your account password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="currentPassword" 
              className="text-sm font-bold text-gray-80 tracking-tight"
            >
              Current Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-slate-600" />
              </div>
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pl-10 pr-10 h-12 bg-white border-gray-30 rounded-full text-slate-600 font-medium tracking-tight focus:border-brand-60 focus:ring-brand-60"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-slate-600 hover:text-gray-80 transition-colors" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-slate-600 hover:text-gray-80 transition-colors" />
                )}
              </button>
            </div>
          </div>

          {/* New Password Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="newPassword" 
              className="text-sm font-bold text-gray-80 tracking-tight"
            >
              New Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-slate-600" />
              </div>
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 pr-10 h-12 bg-white border-gray-30 rounded-full text-slate-600 font-medium tracking-tight focus:border-brand-60 focus:ring-brand-60"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-slate-600 hover:text-gray-80 transition-colors" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-slate-600 hover:text-gray-80 transition-colors" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="confirmPassword" 
              className="text-sm font-bold text-gray-80 tracking-tight"
            >
              Confirm New Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-slate-600" />
              </div>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 h-12 bg-white border-gray-30 rounded-full text-slate-600 font-medium tracking-tight focus:border-brand-60 focus:ring-brand-60"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-slate-600 hover:text-gray-80 transition-colors" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-slate-600 hover:text-gray-80 transition-colors" />
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-5 rounded-lg p-4">
            <h4 className="text-sm font-bold text-gray-80 mb-3 tracking-tight">Password Requirements</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-40 rounded-full"></div>
                <span className="text-sm text-gray-60 tracking-tight">At least 8 characters long</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-40 rounded-full"></div>
                <span className="text-sm text-gray-60 tracking-tight">Contains uppercase and lowercase letters</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-40 rounded-full"></div>
                <span className="text-sm text-gray-60 tracking-tight">Contains at least one number</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-40 rounded-full"></div>
                <span className="text-sm text-gray-60 tracking-tight">Contains at least one special character</span>
              </div>
            </div>
          </div>

          {/* Change Password Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-full tracking-tight transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Change Password
          </Button>
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