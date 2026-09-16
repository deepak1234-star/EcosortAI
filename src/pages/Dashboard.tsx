import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { getSubmissions } from '../utils/storage';
import type { User } from '../types';
import { ECO_TIPS } from '../data/mockData';
import {
  ScanLine,
  Users,
  Leaf,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Lightbulb,
  TreePine,
  ShieldCheck
} from 'lucide-react';

interface ContextType {
  user: User;
  refreshState: () => void;
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const Dashboard: React.FC = () => {
  const { user } = useOutletContext<ContextType>();
  const navigate = useNavigate();

  const submissions = getSubmissions();

  // Get current greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! 👋';
    if (hour < 17) return 'Good afternoon! 👋';
    return 'Good evening! 👋';
  };

  // Recent approved community activities
  const verifiedActivities = submissions.filter((s) => s.status === 'Approved').slice(0, 4);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#15803D] via-[#166534] to-[#14532D] text-white p-6 sm:p-8 lg:p-10 shadow-xl">
        {/* Ambient Leaf Illustrations Background */}
        <div className="absolute -right-8 -bottom-10 opacity-15 pointer-events-none">
          <svg className="w-80 h-80 text-white" viewBox="0 0 200 200" fill="currentColor">
            <path d="M45,100 C45,60 75,30 115,30 C155,30 185,60 185,100 C185,140 155,170 115,170 C75,170 45,140 45,100 Z" />
            <path d="M10,130 C10,90 40,60 80,60 C120,60 150,90 150,130 Z" />
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 border border-white/15 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EcoSort AI Community Sustainability Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {getGreeting()}
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base mt-2 font-normal leading-relaxed">
            Let's make a positive impact today. Sort waste accurately and earn Eco Points through verified community actions.
          </p>

          {/* Primary & Secondary Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 mt-6 sm:mt-8">
            <button
              onClick={() => navigate('/scanner')}
              className="px-6 py-3 bg-[#22C55E] hover:bg-[#16a34a] text-[#17211B] font-bold rounded-2xl text-sm sm:text-base shadow-lg shadow-emerald-900/30 hover:shadow-xl transition-all transform active:scale-95 flex items-center gap-2.5"
            >
              <ScanLine className="w-5 h-5" />
              Scan Waste
            </button>

            <button
              onClick={() => navigate('/community')}
              className="px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-2xl text-sm sm:text-base backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Explore Community Activities
            </button>
          </div>
        </div>
      </div>

      {/* 3 Core Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          label="Eco Points Balance"
          value={user.ecoPoints}
          icon={<Leaf className="w-6 h-6" />}
          badge="Verified"
          accentColor="green"
        />
        <StatCard
          label="Activities Completed"
          value={user.activitiesCompleted}
          icon={<TreePine className="w-6 h-6" />}
          accentColor="blue"
        />
        <StatCard
          label="Waste Items Checked"
          value={user.scansCompleted}
          icon={<ScanLine className="w-6 h-6" />}
          accentColor="amber"
        />
      </div>

      {/* Main Content Grid: Recent Activity & Eco Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#17211B] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
                Recent Activity
              </h2>
              <p className="text-xs text-[#647067]">
                Your verified community contributions
              </p>
            </div>
            <button
              onClick={() => navigate('/community')}
              className="text-xs font-semibold text-[#15803D] hover:text-[#15803D]/80 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {verifiedActivities.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-sm">
                No verified community activities yet. Join a community action to earn Eco Points!
              </div>
            ) : (
              verifiedActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-[#F7FAF7] border border-slate-200/60 hover:border-emerald-200 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center font-bold text-sm shrink-0">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#17211B]">
                        {act.activityName}
                      </h4>
                      <p className="text-xs text-[#647067] flex items-center gap-2 mt-0.5">
                        <span>{act.date}</span>
                        <span>•</span>
                        <span>{act.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="font-extrabold text-sm text-[#15803D]">
                      +{act.rewardPoints} Eco Points
                    </span>
                    <StatusBadge status="Approved ✓" size="sm" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Eco Tip Card & Quick Guide Card */}
        <div className="space-y-6">
          {/* Environmental Tip Card */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-[#DCFCE7]/40 rounded-3xl p-6 border border-emerald-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-[#15803D]">
              <div className="p-2 rounded-xl bg-white shadow-sm">
                <Lightbulb className="w-5 h-5 text-[#15803D]" />
              </div>
              <span className="font-extrabold text-sm uppercase tracking-wider">
                Eco Tip
              </span>
            </div>
            <p className="text-sm font-medium text-[#17211B] leading-relaxed italic">
              "{ECO_TIPS[0]}"
            </p>
          </div>

          {/* Quick CEP Verification Rule Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-800">
              <ShieldCheck className="w-5 h-5 text-[#15803D]" />
              <h3 className="font-bold text-sm">Eco Points Guarantee</h3>
            </div>
            <p className="text-xs text-[#647067] leading-relaxed">
              Eco Points are awarded only for verified community environmental actions. Scanning items provides educational guidance to help you sort properly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
