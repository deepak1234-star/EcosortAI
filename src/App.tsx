import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Scanner } from './pages/Scanner';
import { DisposalGuide } from './pages/DisposalGuide';
import { Community } from './pages/Community';
import { Rewards } from './pages/Rewards';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { syncClerkUserToSupabase } from './utils/supabaseService';
import { setCurrentSessionUser } from './utils/authService';
import type { User } from './types';

// Protected Route: Requires authenticated Clerk session
const ProtectedRoute: React.FC<{ user: User | null; loading: boolean; children: React.ReactNode }> = ({
  user,
  loading,
  children
}) => {
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-[#15803D] rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-700">Verifying session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Public Only Route: Redirects to /dashboard if authenticated
const PublicOnlyRoute: React.FC<{ user: User | null; loading: boolean; children: React.ReactNode }> = ({
  user,
  loading,
  children
}) => {
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-[#15803D] rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-700">Checking session...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

// Root Redirector
const RootRedirect: React.FC<{ user: User | null; loading: boolean }> = ({ user, loading }) => {
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-[#15803D] rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-700">Loading EcoSort AI...</p>
      </div>
    );
  }
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
};

export const App: React.FC = () => {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const [syncedUser, setSyncedUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(true);

  useEffect(() => {
    let isCancelled = false;

    if (!isLoaded) {
      setIsSyncing(true);
      return;
    }

    if (isSignedIn && clerkUser) {
      setIsSyncing(true);
      syncClerkUserToSupabase(clerkUser)
        .then((userObj) => {
          if (!isCancelled) {
            setCurrentSessionUser(userObj);
            setSyncedUser(userObj);
            setIsSyncing(false);
          }
        })
        .catch(() => {
          if (!isCancelled) {
            setIsSyncing(false);
          }
        });
    } else {
      setCurrentSessionUser(null);
      setSyncedUser(null);
      setIsSyncing(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [isLoaded, isSignedIn, clerkUser?.id]);

  const loading = !isLoaded || isSyncing;
  const user = syncedUser;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} loading={loading} />}>
          <Route index element={<RootRedirect user={user} loading={loading} />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="scanner"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Scanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="disposal-guide"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <DisposalGuide />
              </ProtectedRoute>
            }
          />
          <Route
            path="community"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Community />
              </ProtectedRoute>
            }
          />
          <Route
            path="rewards"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Rewards />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="login/*"
            element={
              <PublicOnlyRoute user={user} loading={loading}>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="register/*"
            element={
              <PublicOnlyRoute user={user} loading={loading}>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="signup/*"
            element={
              <PublicOnlyRoute user={user} loading={loading}>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="forgot-password"
            element={
              <PublicOnlyRoute user={user} loading={loading}>
                <ForgotPassword />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="reset-password"
            element={<ResetPassword />}
          />
          <Route path="*" element={<RootRedirect user={user} loading={loading} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
