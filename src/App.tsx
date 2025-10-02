import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './screens/Public/Login/Login';
import { SignUp } from './screens/Public/SignUp/SignUp';
import { ResetPassword } from './screens/Public/ResetPassword/ResetPassword';
import { Dashboard } from './screens/Dashboard/Dashboard';
import { Report } from './screens/Report/Report';
import { Operator } from './screens/Operator/Operator';
import { OperatorDetails } from './screens/OperatorDetails/OperatorDetails';
import { Team } from './screens/Team';
import { LGA } from './screens/LGA';
import { Settings } from './screens/Settings';
import { ChangePassword } from './screens/ChangePassword';
import { Home } from './screens/Home/Home';
import {LoginRedirect} from "./screens/Auth/LoginRedirect";
import {ProcessLogin} from "./screens/Auth/ProcessLogin";
import {LoadAuthorities} from "./screens/Auth/LoadAuthorities";
import {Profile} from "./screens/Auth/Profile";
import {SignOut} from "./screens/Public/SignOut";
import {ToastProvider} from "./components/feedback/Toast.tsx";
import {OtpVerify} from "./screens/Auth/OtpVerify/OtpVerify.tsx";
import {ChangeUserPassword} from "./screens/Public/ChangeUserPassword";
import {EmailActivate} from "./screens/Auth/EmailActivate/EmailActivate.tsx";

export const App: React.FC = () => {
    return (
        <ToastProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home"  element={<Home />} />
                <Route path="/auth/login" element={<LoginRedirect />} />
                <Route path="/process/auth/login" element={<ProcessLogin />} />
                <Route path="/logout" element={<SignOut />} />
                <Route path="/complete/login/profile" element={<Profile />} />
                <Route path="/authorizing/login" element={<LoadAuthorities />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-otp" element={<OtpVerify />} />
                <Route path="/verify/email" element={<EmailActivate />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reports" element={<Report />} />
                <Route path="/operators" element={<Operator />} />
                <Route path="/operator-details/:id" element={<OperatorDetails />} />
                <Route path="/team" element={<Team />} />
                <Route path="/lga" element={<LGA />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/change/password" element={<ChangeUserPassword />} />
              </Routes>
            </Router>
        </ToastProvider>
  );
};