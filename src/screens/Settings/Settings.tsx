import React, { useState } from "react";
import { 
  Bell, 
  Search, 
  User, 
  ChevronDown,
  Save,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  UserIcon,
  Building,
  MapPin,
  Shield,
  Key,
  Smartphone,
  Globe,
  CreditCard,
  Palette,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Camera,
  Upload,
  Edit,
  Check,
  X
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { Sidebar } from "../../components/Sidebar";

export const Settings = (): JSX.Element => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@esgc.com",
    phone: "801 234 5678",
    jobTitle: "System Administrator",
    department: "Management",
    organization: "ESGC Game Staking",
    location: "Lagos, Nigeria"
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecurityChange = (field: string, value: string) => {
    setSecurityData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    console.log("Saving profile:", profileData);
  };

  const handleSaveSecurity = () => {
    console.log("Saving security settings:", securityData);
  };

  return (
    <div className="flex min-h-screen bg-gray-5">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-20 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-80">
                Settings
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-40 w-4 h-4" />
                <Input
                  placeholder="Search settings..."
                  className="pl-10 w-64 h-10 bg-gray-5 border-gray-30 rounded-full"
                />
              </div>
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5 text-gray-60" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-60" />
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-80 mb-2">
              Settings
            </h2>
            <p className="text-gray-60">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Settings */}
            <div className="bg-white rounded-xl border border-gray-20 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-80">Profile Settings</h3>
                  <p className="text-sm text-gray-60">Update your personal information</p>
                </div>
                <Button 
                  onClick={handleSaveProfile}
                  className="bg-primary-500 hover:bg-primary-600 text-white h-10 px-4 rounded-lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>

              <div className="space-y-4">
                {/* Profile Picture */}
                <div className="flex items-center gap-4 p-4 bg-gray-5 rounded-lg">
                  <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">JS</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-80">Profile Picture</h4>
                    <p className="text-xs text-gray-60 mb-2">JPG, PNG or GIF. Max size 2MB.</p>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                      <Upload className="w-3 h-3 mr-1" />
                      Upload
                    </Button>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-80 mb-2 block">
                      First Name
                    </Label>
                    <Input
                      value={profileData.firstName}
                      onChange={(e) => handleProfileChange("firstName", e.target.value)}
                      className="h-10 bg-white border-gray-30 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-80 mb-2 block">
                      Last Name
                    </Label>
                    <Input
                      value={profileData.lastName}
                      onChange={(e) => handleProfileChange("lastName", e.target.value)}
                      className="h-10 bg-white border-gray-30 rounded-lg"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label className="text-sm font-semibold text-gray-80 mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                    className="h-10 bg-white border-gray-30 rounded-lg"
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label className="text-sm font-semibold text-gray-80 mb-2 block">
                    Phone Number
                  </Label>
                  <div className="flex h-10 bg-white rounded-lg border border-gray-30">
                    <div className="inline-flex items-center gap-1.5 px-3 bg-gray-5 border-r border-gray-30 rounded-l-lg">
                      <span className="text-sm font-bold text-slate-600">+234</span>
                    </div>
                    <Input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange("phone", e.target.value)}
                      className="flex-1 border-0 bg-transparent rounded-r-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>

                {/* Job Title */}
                <div>
                  <Label className="text-sm font-semibold text-gray-80 mb-2 block">
                    Job Title
                  </Label>
                  <Input
                    value={profileData.jobTitle}
                    onChange={(e) => handleProfileChange("jobTitle", e.target.value)}
                    className="h-10 bg-white border-gray-30 rounded-lg"
                  />
                </div>

                {/* Department */}
                <div>
                  <Label className="text-sm font-semibold text-gray-80 mb-2 block">
                    Department
                  </Label>
                  <Select 
                    value={profileData.department} 
                    onValueChange={(value) => handleProfileChange("department", value)}
                  >
                    <SelectTrigger className="h-10 bg-white border-gray-30 rounded-lg">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Management">Management</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Compliance">Compliance</SelectItem>
                      <SelectItem value="Analytics">Analytics</SelectItem>
                      <SelectItem value="Customer Service">Customer Service</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-xl border border-gray-20 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-80">Security Settings</h3>
                  <p className="text-sm text-gray-60">Update your password and security preferences</p>
                </div>
                <Button 
                  onClick={handleSaveSecurity}
                  className="bg-primary-500 hover:bg-primary-600 text-white h-10 px-4 rounded-lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Update
                </Button>
              </div>

              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <Label className="text-sm font-semibold text-gray-80 mb-2 block">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={securityData.currentPassword}
                      onChange={(e) => handleSecurityChange("currentPassword", e.target.value)}
                      placeholder="Enter current password"
                      className="pr-10 h-10 bg-white border-gray-30 rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-600 hover:text-gray-80 transition-colors" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-600 hover:text-gray-80 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <Label className="text-sm font-semibold text-gray-80 mb-2 block">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={securityData.newPassword}
                      onChange={(e) => handleSecurityChange("newPassword", e.target.value)}
                      placeholder="Enter new password"
                      className="pr-10 h-10 bg-white border-gray-30 rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-600 hover:text-gray-80 transition-colors" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-600 hover:text-gray-80 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <Label className="text-sm font-semibold text-gray-80 mb-2 block">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={securityData.confirmPassword}
                      onChange={(e) => handleSecurityChange("confirmPassword", e.target.value)}
                      placeholder="Confirm new password"
                      className="pr-10 h-10 bg-white border-gray-30 rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-600 hover:text-gray-80 transition-colors" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-600 hover:text-gray-80 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-5 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-80 mb-3">Password Requirements</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-40 rounded-full"></div>
                      <span className="text-xs text-gray-60">At least 8 characters long</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-40 rounded-full"></div>
                      <span className="text-xs text-gray-60">Contains uppercase and lowercase letters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-40 rounded-full"></div>
                      <span className="text-xs text-gray-60">Contains at least one number</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-40 rounded-full"></div>
                      <span className="text-xs text-gray-60">Contains at least one special character</span>
                    </div>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="border-t border-gray-20 pt-4">
                  <div className="flex items-center justify-between p-4 bg-gray-5 rounded-lg">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-80">Two-Factor Authentication</h4>
                      <p className="text-xs text-gray-60">Add an extra layer of security to your account</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="twoFactor"
                        defaultChecked={true}
                        className="w-4 h-4 rounded border-gray-30 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
                      />
                      <Label htmlFor="twoFactor" className="text-sm font-medium text-gray-80 cursor-pointer">
                        Enabled
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="mt-8">
            <div className="bg-white rounded-xl border border-gray-20 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-80 mb-2">Notification Settings</h3>
                <p className="text-sm text-gray-60">Choose how you want to be notified about important updates</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: "email", title: "Email Notifications", description: "Receive notifications via email", enabled: true },
                  { id: "push", title: "Push Notifications", description: "Receive push notifications in browser", enabled: true },
                  { id: "sms", title: "SMS Notifications", description: "Receive notifications via SMS", enabled: false },
                  { id: "operators", title: "Operator Updates", description: "Get notified about operator changes", enabled: true },
                  { id: "revenue", title: "Revenue Alerts", description: "Get alerts for revenue milestones", enabled: true },
                  { id: "maintenance", title: "System Maintenance", description: "Notifications about system maintenance", enabled: true }
                ].map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-4 bg-gray-5 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-80">{notification.title}</h4>
                      <p className="text-xs text-gray-60">{notification.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Checkbox
                        id={notification.id}
                        defaultChecked={notification.enabled}
                        className="w-4 h-4 rounded border-gray-30 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
                      />
                      <Label htmlFor={notification.id} className="text-xs font-medium text-gray-80 cursor-pointer">
                        {notification.enabled ? "On" : "Off"}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button className="bg-primary-500 hover:bg-primary-600 text-white h-10 px-6 rounded-lg">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};