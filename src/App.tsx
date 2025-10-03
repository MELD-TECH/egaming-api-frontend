import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './screens/Login/Login';
import { SignUp } from './screens/SignUp/SignUp';
import { ResetPassword } from './screens/ResetPassword/ResetPassword';
import { Dashboard } from './screens/Dashboard/Dashboard';
import { Report } from './screens/Report/Report';
import { Operator } from './screens/Operator/Operator';
import { OperatorDetails } from './screens/OperatorDetails/OperatorDetails';
import { Team } from './screens/Team/Team';
import { LGA } from './screens/LGA/LGA';
import { Settings } from './screens/Settings/Settings';
import { ChangePassword } from './screens/ChangePassword/ChangePassword';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/operators" element={<Operator />} />
        <Route path="/operator-details/:id" element={<OperatorDetails />} />
        <Route path="/team" element={<Team />} />
        <Route path="/lga" element={<LGA />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </Router>
  );
};