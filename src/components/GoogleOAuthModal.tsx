import React, { useState } from 'react';
import { Modal } from './Modal';
import { loginWithGoogleAccount } from '../utils/authService';
import type { User } from '../types';
import { Plus, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

import { REAL_PHOTO_ASSETS } from '../utils/photoAssets';

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const GoogleOAuthModal: React.FC<GoogleOAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  addToast
}) => {
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const googleAccounts = [
    {
      name: 'Deepak Patel',
      email: 'deepak.patel@gmail.com',
      avatar: REAL_PHOTO_ASSETS.avatar_deepak,
      role: 'Signed in on this device'
    },
    {
      name: 'Alex Johnson',
      email: 'alex.johnson@gmail.com',
      avatar: REAL_PHOTO_ASSETS.avatar_alex,
      role: 'Signed in on this device'
    },
    {
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@gmail.com',
      avatar: REAL_PHOTO_ASSETS.avatar_sarah,
      role: 'Signed in on this device'
    }
  ];

  const handleSelectAccount = async (name: string, email: string, avatar?: string) => {
    setIsSubmitting(true);
    try {
      const res = await loginWithGoogleAccount(name, email, avatar);
      setIsSubmitting(false);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      addToast('success', 'Google Sign In Successful ✓', res.message);
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      addToast('error', 'Google Sign In Failed', err?.message || 'Unable to sign in with Google account.');
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const derivedName = customName.trim() || customEmail.split('@')[0].replace('.', ' ');
    handleSelectAccount(derivedName, customEmail.trim());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="sm"
    >
      <div className="space-y-4 pt-0">
        {/* Authentic Google Header */}
        <div className="text-center space-y-2 pb-3 border-b border-slate-100">
          <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center mx-auto">
            <svg className="w-7 h-7" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Choose an account</h3>
            <p className="text-xs text-slate-500 font-medium">to continue to <span className="font-bold text-[#15803D]">EcoSort AI</span></p>
          </div>
        </div>

        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="py-8 text-center space-y-3 animate-fadeIn">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-[#15803D] rounded-full animate-spin mx-auto" />
            <p className="font-bold text-xs text-slate-800">Signing in with Google...</p>
            <p className="text-[11px] text-slate-500">Connecting your Google Account securely</p>
          </div>
        )}

        {/* Saved Device Google Accounts */}
        {!isSubmitting && !showCustomInput && (
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Google Accounts on this Device:
            </p>
            {googleAccounts.map((acc) => (
              <div
                key={acc.email}
                onClick={() => handleSelectAccount(acc.name, acc.email, acc.avatar)}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/60 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#15803D]">
                      {acc.name}
                    </h4>
                    <p className="text-xs text-slate-500">{acc.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-slate-400 hidden sm:inline">
                    {acc.role}
                  </span>
                  <Check className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="w-full p-3 rounded-2xl border border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <Plus className="w-4 h-4 text-[#15803D]" />
              Use another Google Account / Email
            </button>
          </div>
        )}

        {/* Custom Google Email Input */}
        {!isSubmitting && showCustomInput && (
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Google Email Address
              </label>
              <input
                type="email"
                placeholder="your.name@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-[#15803D]/40 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Display Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Deepak Patel"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-[#15803D]/40 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomInput(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-[#15803D] hover:bg-[#15803D]/90 text-white font-bold text-xs rounded-xl shadow"
              >
                Sign In with Google Account
              </button>
            </div>
          </form>
        )}

        {/* Google OAuth Legal Notice */}
        <p className="text-[11px] text-slate-400 text-center leading-relaxed pt-2 border-t border-slate-100">
          To continue, Google will share your name, email address, language preference, and profile picture with EcoSort AI.
        </p>
      </div>
    </Modal>
  );
};
