import React from 'react';
import { Modal } from './Modal';
import { triggerGoogleOAuth } from '../utils/authService';
import { ShieldAlert, ExternalLink } from 'lucide-react';

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const GoogleOAuthModal: React.FC<GoogleOAuthModalProps> = ({
  isOpen,
  onClose
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleRetryGoogleOAuth = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await triggerGoogleOAuth();
      setIsSubmitting(false);
      if (!res.success) {
        setErrorMessage(
          res.message ||
            'Google OAuth provider is not enabled in your Supabase project settings. Please configure Google provider in Supabase Dashboard.'
        );
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'Failed to initiate Google OAuth redirection.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="sm">
      <div className="space-y-4 pt-0">
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
              Redirecting to Google OAuth authentication
            </p>
          </div>
        </div>

        {/* Status / Error Message */}
        <div className="space-y-3 py-2">
          {errorMessage ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-800">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Google OAuth Configuration Required</span>
              </div>
              <p className="text-xs leading-relaxed text-amber-800 font-medium">
                {errorMessage}
              </p>
              <div className="pt-2 text-[11px] text-amber-700 leading-snug border-t border-amber-200/60">
                To enable Google sign-in for your project:
                <br />
                1. Open <span className="font-bold">Supabase Dashboard → Authentication → Providers</span>.
                <br />
                2. Enable <span className="font-bold">Google Provider</span> and paste your Google OAuth Client ID & Secret.
              </div>
            </div>
          ) : (
            <div className="py-6 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-emerald-200 border-t-[#15803D] rounded-full animate-spin mx-auto" />
              <p className="font-bold text-xs text-slate-800">Connecting to Google OAuth...</p>
              <p className="text-[11px] text-slate-500">Redirecting to accounts.google.com</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Close
          </button>
          {errorMessage && (
            <button
              type="button"
              onClick={handleRetryGoogleOAuth}
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#15803D] hover:bg-[#15803D]/90 text-white font-bold text-xs rounded-xl shadow"
            >
              Retry Google OAuth Redirect
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
