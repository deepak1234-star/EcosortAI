import React from 'react';
import { NavLink } from 'react-router-dom';
import { getCurrentSessionUser } from '../utils/authService';
import {
  LayoutDashboard,
  ScanLine,
  Users,
  Gift,
  User
} from 'lucide-react';

export const MobileNavigation: React.FC = () => {
  const isLoggedIn = !!getCurrentSessionUser();

  if (!isLoggedIn) return null;

  const items = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Scan', path: '/scanner', icon: ScanLine },
    { label: 'Community', path: '/community', icon: Users },
    { label: 'Rewards', path: '/rewards', icon: Gift },
    { label: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-lg">
      <nav className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'text-[#15803D] font-bold scale-105'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
