import React, { useState } from 'react';
import { useNavigate, useLocation, useOutletContext, NavLink } from 'react-router-dom';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { loginUser, registerUser, triggerGoogleOAuth } from '../utils/authService';
import type { RoleType, User } from '../types';
import { GoogleOAuthModal } from '../components/GoogleOAuthModal';
import {
  ShieldAlert,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContextType {
  user: User;
  refreshState: () => void;
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const Login: React.FC = () => {
  const { refreshState, addToast } = useOutletContext<ContextType>();
  const navigate = useNavigate();
  const location = useLocation();

  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const isRegisterRoute = location.pathname === '/register';
  const mode = isRegisterRoute ? 'register' : 'login';

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<RoleType>('Community Member');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    if (pass.length < 6) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (pass.length < 10 || !/\d/.test(pass)) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter your password.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await registerUser({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          role
        });

        setIsLoading(false);
        if (res.success) {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          addToast('success', 'Account Created ✓', res.message);
          refreshState();
          navigate('/dashboard');
        } else {
          setError(res.message);
        }
      } catch (err: any) {
        setIsLoading(false);
        setError(err?.message || 'Registration failed. Please try again.');
      }
    } else {
      setIsLoading(true);
      try {
        const res = await loginUser({
          email: email.trim(),
          password: password.trim()
        });

        setIsLoading(false);
        if (res.success) {
          addToast('success', 'Welcome Back ✓', res.message);
          refreshState();
          navigate('/dashboard');
        } else {
          setError(res.message);
        }
      } catch (err: any) {
        setIsLoading(false);
        setError(err?.message || 'Login failed. Please check your credentials.');
      }
    }
  };

  const handleGoogleSuccess = () => {
    refreshState();
    navigate('/dashboard');
  };

  const handleGoogleAuthClick = async () => {
    setIsLoading(true);
    try {
      if (signIn) {
        await signIn.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: '/dashboard',
          redirectUrlComplete: '/dashboard'
        });
        return;
      }
      if (signUp) {
        await signUp.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: '/dashboard',
          redirectUrlComplete: '/dashboard'
        });
        return;
      }
    } catch (err) {
      console.warn('Clerk OAuth warning, falling back to Supabase:', err);
    }

    const res = await triggerGoogleOAuth();
    setIsLoading(false);
    if (!res.success) {
      setIsGoogleModalOpen(true);
    }
  };

  return (
    <div className="min-h-[82vh] flex flex-col items-center justify-center py-6 sm:py-10 animate-fadeIn">
      {/* Centered Amazon-Style Logo */}
      <NavLink to="/dashboard" className="flex items-center gap-2.5 mb-6 group">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#15803D] to-[#22C55E] flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform duration-200">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11z" />
          </svg>
        </div>
        <span className="font-extrabold text-2xl tracking-tight text-[#17211B]">
          EcoSort <span className="text-[#15803D]">AI</span>
        </span>
      </NavLink>

      {/* Main Clean Auth Card (Max-width 420px) */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <h1 className="text-2xl font-extrabold text-[#17211B]">
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </h1>

        {/* Welcome Bonus Notice for Sign Up */}
        {mode === 'register' && (
          <div className="p-3 rounded-xl bg-[#DCFCE7] border border-emerald-300 text-xs text-[#15803D] font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-[#15803D]" />
            <span>Bonus: Earn +100 Eco Points instantly on registration!</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Your name
              </label>
              <input
                type="text"
                placeholder="First and last name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-[#15803D]/40 focus:border-[#15803D] outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Email address
            </label>
            <input
              type="email"
              placeholder="name@ecosort.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-[#15803D]/40 focus:border-[#15803D] outline-none"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-800">
                Password
              </label>
              {mode === 'login' && (
                <NavLink
                  to="/forgot-password"
                  className="text-xs text-[#15803D] hover:underline font-semibold"
                >
                  Forgot password?
                </NavLink>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-[#15803D]/40 focus:border-[#15803D] outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength */}
            {mode === 'register' && password && (
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Strength:</span>
                  <span className="font-bold text-slate-700">{strength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                  <div className={`h-full flex-1 rounded-full transition-all ${strength.score >= 1 ? strength.color : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 rounded-full transition-all ${strength.score >= 2 ? strength.color : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 rounded-full transition-all ${strength.score >= 3 ? strength.color : 'bg-slate-200'}`} />
                </div>
              </div>
            )}
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Re-enter password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-[#15803D]/40 focus:border-[#15803D] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Community Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as RoleType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 font-semibold focus:ring-2 focus:ring-[#15803D]/40 outline-none"
                >
                  <option value="Community Member">Community Member</option>
                  <option value="Volunteer">Eco Volunteer</option>
                  <option value="Educator">Educator / Teacher</option>
                  <option value="Community Leader">Community Leader (Admin)</option>
                </select>
              </div>
            </>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-[#15803D] hover:bg-[#15803D]/90 text-white font-bold text-sm rounded-xl shadow transition-all active:scale-98 disabled:opacity-50 mt-1"
          >
            {isLoading
              ? 'Authenticating...'
              : mode === 'login'
              ? 'Sign in'
              : 'Create your EcoSort AI account'}
          </button>
        </form>

        {/* Working Google OAuth Button */}
        <div className="pt-2 space-y-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleGoogleAuthClick}
            className="w-full py-2 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 shadow-2xs transition-colors flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Terms Notice */}
        <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
          By continuing, you agree to EcoSort AI's Terms of Use and Privacy Notice.
        </p>
      </div>

      {/* Amazon-Style Below Card Separator & Switcher Button */}
      <div className="w-full max-w-[420px] mt-6 text-center space-y-3">
        {mode === 'login' ? (
          <>
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-[#F7FAF7] px-3 text-xs font-semibold text-slate-500 absolute">
                New to EcoSort AI?
              </span>
            </div>

            <NavLink
              to="/register"
              className="block w-full py-2 px-4 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs transition-colors"
            >
              Create your EcoSort AI account
            </NavLink>
          </>
        ) : (
          <p className="text-xs text-slate-600 font-medium">
            Already have an account?{' '}
            <NavLink to="/login" className="text-[#15803D] hover:underline font-bold">
              Sign in →
            </NavLink>
          </p>
        )}
      </div>

      {/* Interactive Google OAuth Account Selector Modal */}
      <GoogleOAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
        addToast={addToast}
      />
    </div>
  );
};
