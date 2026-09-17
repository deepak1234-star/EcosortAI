import React, { useState } from 'react';
import { Modal } from './Modal';
import { setCurrentSessionUser } from '../utils/authService';
import { REAL_PHOTO_ASSETS } from '../utils/photoAssets';

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const GoogleOAuthModal: React.FC<GoogleOAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  addToast
}) => {
  const [googleEmail, setGoogleEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim() || !googleEmail.includes('@')) {
      addToast('warning', 'Invalid Email', 'Please enter a valid Google email address.');
      return;
    }

    setIsSubmitting(true);
    const emailClean = googleEmail.trim().toLowerCase();
    const displayName = emailClean.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    setTimeout(() => {
      setCurrentSessionUser({
        id: `google_${Date.now()}`,
        name: displayName,
        email: emailClean,
        role: 'Community Member',
        ecoPoints: 100,
        activitiesCompleted: 0,
        scansCompleted: 0,
        avatar: REAL_PHOTO_ASSETS.avatar_deepak
      });

      setIsSubmitting(false);
      onClose();
      addToast('success', 'Google Sign-In Successful ✓', `Signed in as ${displayName} (${emailClean})`);
      onSuccess();
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="sm">
      <div className="space-y-4 pt-1">
        {/* Google Header */}
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
            <h3 className="font-extrabold text-lg text-slate-900">Sign in with Google</h3>
            <p className="text-xs text-slate-500 font-medium">
              Enter your Google email address to continue to EcoSort AI
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGoogleSignInSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Google Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. user@gmail.com"
              value={googleEmail}
              onChange={(e) => setGoogleEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-[#15803D]/40 outline-none"
              required
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#15803D] hover:bg-[#15803D]/90 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign in with Google'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
