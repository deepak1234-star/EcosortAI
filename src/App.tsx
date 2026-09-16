import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Scanner } from './pages/Scanner';
import { DisposalGuide } from './pages/DisposalGuide';
import { Community } from './pages/Community';
import { Rewards } from './pages/Rewards';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { getCurrentSessionUser } from './utils/authService';

// Protected Route: Requires user to be signed in
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = getCurrentSessionUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Public Only Route: For /login and /register. Redirects to /dashboard if already signed in
const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = getCurrentSessionUser();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

// Root Redirector based on session
const RootRedirect: React.FC = () => {
  const user = getCurrentSessionUser();
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RootRedirect />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="scanner"
            element={
              <ProtectedRoute>
                <Scanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="disposal-guide"
            element={
              <ProtectedRoute>
                <DisposalGuide />
              </ProtectedRoute>
            }
          />
          <Route
            path="community"
            element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            }
          />
          <Route
            path="rewards"
            element={
              <ProtectedRoute>
                <Rewards />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route path="*" element={<RootRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
