import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getCurrentSessionUser } from '../utils/authService';
import {
  LayoutDashboard,
  ScanLine,
  BookOpen,
  Users,
  Gift,
  User,
  ShieldCheck,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin: () => void;
  pendingCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
  pendingCount
}) => {
  const isLoggedIn = !!getCurrentSessionUser();
  const location = useLocation();

  // Exactly 6 unique navigation items
  const navItems = [
    { label: 'Dashboard', path: isLoggedIn ? '/dashboard' : '/login', icon: LayoutDashboard },
    { label: 'AI Scanner', path: isLoggedIn ? '/scanner' : '/login', icon: ScanLine },
    { label: 'Disposal Guide', path: isLoggedIn ? '/disposal-guide' : '/login', icon: BookOpen },
    { label: 'Community', path: isLoggedIn ? '/community' : '/login', icon: Users },
    { label: 'Rewards', path: isLoggedIn ? '/rewards' : '/login', icon: Gift },
    { label: 'Profile', path: isLoggedIn ? '/profile' : '/login', icon: User }
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 animate-fadeIn"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-slate-200/80 z-50 lg:z-30 transition-all duration-300 flex flex-col select-none ${
          isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        {/* Brand Logo & Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between min-h-[73px]">
          <NavLink
            to={isLoggedIn ? '/dashboard' : '/login'}
            className="flex items-center gap-3 group overflow-hidden"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#15803D] to-[#22C55E] flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            {isOpen && (
              <div className="animate-fadeIn truncate">
                <h1 className="text-lg font-extrabold text-[#17211B] tracking-tight flex items-center gap-1">
                  EcoSort <span className="text-[#15803D]">AI</span>
                </h1>
                <p className="text-[10px] font-medium text-[#647067] leading-tight truncate">
                  Sort Today. Build a Greener Tomorrow.
                </p>
              </div>
            )}
          </NavLink>

          {/* Close Mobile Drawer Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items (Single List of 6 Unique Items) */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {isOpen && (
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Navigation
            </p>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                title={!isOpen ? item.label : undefined}
                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-[#DCFCE7] text-[#15803D] shadow-2xs font-bold'
                    : 'text-[#647067] hover:text-[#17211B] hover:bg-slate-50'
                } ${!isOpen ? 'justify-center px-0' : ''}`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {isOpen && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* CEP Admin Portal Quick Action */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={onOpenAdmin}
            title={!isOpen ? 'CEP Admin Portal' : undefined}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-[#15803D] bg-[#DCFCE7] hover:bg-[#DCFCE7]/80 border border-emerald-300 transition-colors ${
              !isOpen ? 'justify-center px-0' : ''
            }`}
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0" />
              {isOpen && <span>CEP Admin Portal</span>}
            </span>
            {isOpen && pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#15803D] text-white">
                {pendingCount}
              </span>
            )}
          </button>

          {/* Footer Quote */}
          {isOpen && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-center animate-fadeIn">
              <p className="text-[11px] font-semibold text-[#15803D]/90 italic">
                "Small actions. Big impact."
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
