import React from 'react';
import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

export const Register: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 flex flex-col items-center">
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Create Your Account
          </h1>
          <p className="text-slate-400 text-sm">
            Sign up using Google OAuth or your email address to get started
          </p>
        </div>

        {/* Clerk SignUp Component Container */}
        <div className="w-full flex justify-center">
          <SignUp
            path="/register"
            routing="path"
            signInUrl="/login"
            fallbackRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full flex justify-center",
                card: "w-full max-w-md bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-8 rounded-2xl backdrop-blur-xl",
                headerTitle: "text-white text-xl font-bold text-center",
                headerSubtitle: "text-slate-400 text-sm text-center",
                socialButtonsBlockButton:
                  "bg-slate-800 border-slate-700 hover:bg-slate-700/80 text-white font-medium py-3 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 text-sm",
                socialButtonsBlockButtonText: "text-white font-medium text-sm",
                formButtonPrimary:
                  "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20 text-sm",
                footerActionLink: "text-cyan-400 hover:text-cyan-300 font-semibold text-sm",
                formFieldLabel: "text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1",
                formFieldInput: "bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm",
                dividerLine: "bg-slate-800",
                dividerText: "text-slate-500 text-xs uppercase font-medium bg-slate-900 px-2",
                identityPreviewText: "text-white font-medium",
              }
            }}
          />
        </div>

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link to="/" className="text-slate-500 hover:text-slate-400 text-xs transition-colors">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
