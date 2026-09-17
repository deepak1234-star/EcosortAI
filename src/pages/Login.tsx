import React from 'react';
import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

export const Login: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md bg-slate-950/95 border border-slate-800/80 shadow-2xl p-6 sm:p-8 rounded-3xl backdrop-blur-2xl space-y-6 flex flex-col items-center relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon & Title */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            Sign in with your Google Account or credentials to access your EcoSort AI dashboard
          </p>
        </div>

        {/* Clerk SignIn Component Container */}
        <div className="w-full flex justify-center relative z-10">
          <SignIn
            path="/login"
            routing="path"
            signUpUrl="/register"
            fallbackRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full flex justify-center",
                card: "w-full max-w-md bg-transparent border-0 shadow-none p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: 
                  "bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 text-sm",
                socialButtonsBlockButtonText: "text-white font-medium text-sm",
                formButtonPrimary:
                  "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-sm",
                footerActionLink: "text-cyan-400 hover:text-cyan-300 font-semibold text-sm",
                formFieldLabel: "text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1",
                formFieldInput: "bg-slate-900 border border-slate-800 text-white rounded-xl py-2.5 px-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm",
                dividerLine: "bg-slate-800",
                dividerText: "text-slate-500 text-xs uppercase font-medium bg-slate-950 px-2",
                identityPreviewText: "text-white font-medium",
                formResendCodeLink: "text-cyan-400 hover:text-cyan-300 text-sm",
              }
            }}
          />
        </div>

        {/* Back Link */}
        <div className="text-center pt-2 relative z-10">
          <Link to="/" className="text-slate-500 hover:text-slate-400 text-xs transition-colors">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
