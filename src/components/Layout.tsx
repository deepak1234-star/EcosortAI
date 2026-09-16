import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';
import { Header } from './Header';
import { ToastContainer } from './Toast';
import { DemoAdminModal } from './DemoAdminModal';
import { AuthModal } from './AuthModal';
import { getUser, getSubmissions } from '../utils/storage';
import type { User, ToastMessage } from '../types';

export const Layout: React.FC = () => {
  const [user, setUser] = useState<User>(getUser());
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const location = useLocation();

  const refreshState = () => {
    setUser(getUser());
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
          user={user}
          onOpenAdmin={() => setIsAdminOpen(true)}
          pendingCount={pendingCount}
          onUserChanged={refreshState}
          onToggleSidebar={toggleSidebar}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ user, refreshState, addToast, onOpenAuth: handleOpenAuth }} />
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
