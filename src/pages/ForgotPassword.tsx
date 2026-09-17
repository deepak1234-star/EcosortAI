import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../utils/authService';
import { ShieldAlert, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestPasswordReset(email.trim());
      setIsLoading(false);

      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Failed to request password reset.');
    }
  };

  return (
    <div className="min-h-[82vh] flex flex-col items-center justify-center py-6 sm:py-10 animate-fadeIn px-4">
      {/* Centered Logo */}
      <NavLink to="/login" className="flex items-center gap-2.5 mb-6 group">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#15803D] to-[#22C55E] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11z" />
          </svg>
        </div>
        <span className="font-extrabold text-2xl tracking-tight text-[#17211B]">
          EcoSort <span className="text-[#15803D]">AI</span>
        </span>
      </NavLink>

      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17211B]">Forgot Password</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Enter your email address and we will send you a link to reset your password.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {!successMessage ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="name@ecosort.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-[#15803D]/40 focus:border-[#15803D] outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#15803D] hover:bg-[#15803D]/90 text-white font-bold text-sm rounded-xl shadow transition-all active:scale-98 disabled:opacity-50"
            >
              {isLoading ? 'Sending instructions...' : 'Send Password Reset Email'}
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
          >
            Return to Login
          </button>
        )}

        <div className="pt-3 border-t border-slate-100 text-center">
          <NavLink to="/login" className="inline-flex items-center gap-1.5 text-xs text-[#15803D] hover:underline font-bold">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </NavLink>
        </div>
      </div>
    </div>
  );
};
