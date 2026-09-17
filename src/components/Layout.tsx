import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';
import { Header } from './Header';
import { ToastContainer } from './Toast';
import { DemoAdminModal } from './DemoAdminModal';
import { AuthModal } from './AuthModal';
import { getSubmissions } from '../utils/storage';
import { getCurrentSessionUser, subscribeAuthState } from '../utils/authService';
import type { User, ToastMessage } from '../types';
import { REAL_PHOTO_ASSETS } from '../utils/photoAssets';

const GUEST_USER: User = {
  id: 'usr_guest',
  name: 'Guest Member',
  email: 'guest@ecosort.org',
  role: 'Community Member',
  ecoPoints: 0,
  activitiesCompleted: 0,
  scansCompleted: 0,
  avatar: REAL_PHOTO_ASSETS.avatar_deepak
};

interface LayoutProps {
  user: User | null;
  loading: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ user: activeSessionUser, loading }) => {
  const [currentUser, setCurrentUser] = useState<User>(activeSessionUser || GUEST_USER);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (activeSessionUser) {
      setCurrentUser(activeSessionUser);
    } else {
      const live = getCurrentSessionUser();
      setCurrentUser(live || GUEST_USER);
    }
  }, [activeSessionUser]);

  const refreshState = () => {
    const live = getCurrentSessionUser();
    setCurrentUser(live || GUEST_USER);
    const submissions = getSubmissions();
    const pending = submissions.filter((s) => s.status === 'Pending Verification').length;
    setPendingCount(pending);
  };

  useEffect(() => {
    refreshState();
  }, [location.pathname]);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const addToast = (
    type: 'success' | 'error' | 'info' | 'warning',
    title: string,
    message?: string
  ) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex bg-[#F7FAF7] text-[#17211B] selection:bg-[#DCFCE7] selection:text-[#15803D]">
      {/* Sidebar for Desktop & Mobile Overlay */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        pendingCount={pendingCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <Header
          user={currentUser}
          onOpenAdmin={() => setIsAdminOpen(true)}
          pendingCount={pendingCount}
          onUserChanged={refreshState}
          onToggleSidebar={toggleSidebar}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ user: currentUser, refreshState, addToast, onOpenAuth: handleOpenAuth }} />
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* CEP Admin Verification Modal */}
      <DemoAdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataChanged={refreshState}
        addToast={addToast}
      />

      {/* Authentication Login & Registration Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={refreshState}
        addToast={addToast}
        initialMode={authMode}
      />
    </div>
  );
};
