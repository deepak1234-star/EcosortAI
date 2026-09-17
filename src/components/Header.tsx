import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import type { User } from '../types';
import { Leaf, ShieldCheck, LogIn, UserPlus, LogOut, User as UserIcon, ChevronDown, Menu } from 'lucide-react';
import { getCurrentSessionUser, logoutSession } from '../utils/authService';

interface HeaderProps {
  user: User;
  onOpenAdmin: () => void;
  pendingCount: number;
  onUserChanged: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenAdmin,
  pendingCount,
  onUserChanged,
  onToggleSidebar
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const isLoggedIn = !!(user && user.id && user.id !== 'usr_guest');

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutSession();
    setIsDropdownOpen(false);
    onUserChanged();
    navigate('/login');
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* 3-Line Hamburger Menu & Brand Title */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-700 hover:text-[#15803D] hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all flex items-center justify-center cursor-pointer"
            title="Toggle Navigation Menu (3 Lines)"
          >
            <Menu className="w-5 h-5 text-[#15803D]" />
          </button>
        )}

        <div className="flex items-center gap-2 lg:hidden">
          <NavLink to={isLoggedIn ? '/dashboard' : '/login'} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#15803D] to-[#22C55E] flex items-center justify-center text-white shadow-sm">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11z" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-base text-[#17211B]">
                EcoSort <span className="text-[#15803D]">AI</span>
              </span>
            </div>
          </NavLink>
        </div>

        {/* Desktop Platform Title */}
        <div className="hidden lg:block">
          <p className="text-xs font-semibold text-[#647067]">
            Community Sustainability & CEP Platform
          </p>
        </div>
      </div>

      {/* Right Tools: Show ONLY logged-in user profile OR logged-out auth buttons */}
      <div className="flex items-center gap-3 ml-auto">
        {/* CEP Admin Portal Trigger */}
        <button
          onClick={onOpenAdmin}
          className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#DCFCE7] text-[#15803D] border border-emerald-300"
          title="CEP Admin Verification Portal"
        >
          <ShieldCheck className="w-4 h-4 text-[#15803D]" />
          <span className="hidden sm:inline">Admin Portal</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#15803D] text-white font-black">
              {pendingCount}
            </span>
          )}
        </button>

        {isLoggedIn ? (
          /* LOGGED IN STATE */
          <div className="flex items-center gap-3">
            {/* Eco Points Pill */}
            <NavLink
              to="/rewards"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#22C55E]/30 hover:bg-[#DCFCE7]/80 transition-all font-bold text-xs sm:text-sm shadow-sm"
            >
              <Leaf className="w-4 h-4 fill-[#15803D] shrink-0" />
              <span>{user.ecoPoints}</span>
              <span className="hidden sm:inline font-semibold text-xs text-[#15803D]/90">
                Eco Points
              </span>
            </NavLink>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200/80 shadow-2xs"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#22C55E]/40"
                />
                <span className="hidden md:inline font-bold text-xs text-slate-800 max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-fadeIn space-y-1">
                  <div className="px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-1">
                    <p className="font-bold text-xs text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-emerald-100 text-[#15803D] font-extrabold text-[10px]">
                      {user.role}
                    </span>
                  </div>

                  <NavLink
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-[#15803D]" />
                    My Profile & Activity
                  </NavLink>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                    CEP Admin Verification Portal
                  </button>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* LOGGED OUT (GUEST) STATE - Amazon / Standard Clean Header Buttons */
          <div className="flex items-center gap-2">
            <NavLink
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#15803D] hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-[#15803D]" />
              Sign In
            </NavLink>

            <NavLink
              to="/register"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#15803D] hover:bg-[#15803D]/90 shadow-md transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Create Account
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
};
