import React, { useState } from 'react';
import { Modal } from './Modal';
import { loginUser, registerUser } from '../utils/authService';
import type { RoleType } from '../types';
import {
  LogIn,
  UserPlus,
  ShieldAlert,
  Sparkles,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Leaf,
  Users,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { GoogleOAuthModal } from './GoogleOAuthModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  addToast,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<RoleType>('Community Member');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          setIsLoading(false);
          setError('Please enter your full name.');
          return;
        }
        if (password.length < 6) {
          setIsLoading(false);
          setError('Password must be at least 6 characters long.');
          return;
        }

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
          onSuccess();
          onClose();
        } else {
          setError(res.message);
        }
      } else {
        const res = await loginUser({
          email: email.trim(),
          password: password.trim()
        });

        setIsLoading(false);
        if (res.success) {
          addToast('success', 'Welcome Back ✓', res.message);
          onSuccess();
          onClose();
        } else {
          setError(res.message);
        }
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Authentication failed');
    }
  };

  const handleGoogleSuccess = () => {
    onSuccess();
    onClose();
  };

  const handleQuickPersona = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    try {
      const res = await loginUser({ email: demoEmail, password: demoPass });
      if (res.success) {
        addToast('success', 'Logged In ✓', res.message);
        onSuccess();
        onClose();
      }
    } catch (e) {
      // Ignore persona error
    }
  };

  const roleOptions: { type: RoleType; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      type: 'Community Member',
      title: 'Community Member',
      desc: 'Resident or local citizen taking eco action',
      icon: <Leaf className="w-4 h-4 text-emerald-600" />
    },
    {
      type: 'Volunteer',
      title: 'Eco Volunteer',
      desc: 'Active helper for local cleanup drives',
      icon: <Users className="w-4 h-4 text-[#15803D]" />
    },
    {
      type: 'Educator',
      title: 'Educator / Teacher',
      desc: 'Professor or school Eco Club leader',
      icon: <GraduationCap className="w-4 h-4 text-blue-600" />
    },
    {
      type: 'Community Leader',
      title: 'Community Leader',
      desc: 'Drive organizer & activity reviewer',
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" />
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Welcome to EcoSort AI' : 'Join EcoSort AI Today'}
      subtitle={
        mode === 'login'
          ? 'Sign in to access your Eco Points, activity drives & rewards'
          : 'Create your account to start sorting waste and earning Eco Points'
      }
      maxWidth="lg"
    >
      <div className="space-[#17211B] space-y-5">
        {/* Toggle Mode Segment Control */}
        <div className="flex items-center p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
              mode === 'login'
                ? 'bg-white text-[#15803D] shadow-sm scale-[0.99]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
              mode === 'register'
                ? 'bg-[#15803D] text-white shadow-sm scale-[0.99]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Create Account
          </button>
        </div>

        {/* Welcome Bonus Banner for Registration */}
        {mode === 'register' && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#DCFCE7] to-emerald-100 border border-emerald-300 flex items-center justify-between text-xs text-[#15803D] font-bold">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#15803D]" />
              <span>Sign Up Bonus: Earn +100 Eco Points instantly upon registration!</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Social Quick Login */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
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

        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
            Or With Email
          </span>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="First and last name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-[#15803D]/30 focus:border-[#15803D] outline-none transition-all shadow-inner"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="name@ecosort.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-[#15803D]/30 focus:border-[#15803D] outline-none transition-all shadow-inner"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => addToast('info', 'Password Reset', 'A password reset link has been sent to your email.')}
                  className="text-xs text-[#15803D] hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-[#15803D]/30 focus:border-[#15803D] outline-none transition-all shadow-inner"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator for Registration */}
            {mode === 'register' && password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Password Strength:</span>
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

          {/* Role Selection Grid for Sign Up */}
          {mode === 'register' && (
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Your Role in the Community:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {roleOptions.map((opt) => {
                  const isSelected = role === opt.type;
                  return (
                    <div
                      key={opt.type}
                      onClick={() => setRole(opt.type)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'border-[#15803D] bg-[#DCFCE7]/50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="p-1.5 rounded-xl bg-white shadow-2xs shrink-0 mt-0.5">
                        {opt.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-slate-900 flex items-center justify-between">
                          {opt.title}
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{opt.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Remember Me Checkbox for Login */}
          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#15803D] focus:ring-[#15803D]"
                />
                <span>Remember me on this device</span>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#15803D] hover:bg-[#15803D]/90 text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {mode === 'login' ? 'Sign In to Account' : 'Create Account (+100 Points)'}
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>
      </div>

      <GoogleOAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
        addToast={addToast}
      />
    </Modal>
  );
};
