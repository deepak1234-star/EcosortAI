import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { saveUser, resetStorage, getSubmissions, getRedemptions } from '../utils/storage';
import { logoutSession } from '../utils/authService';
import type { User, CommunitySubmission, RewardRedemption, PointsLedgerItem } from '../types';
import { fetchPointsLedger, updateProfileSupabase } from '../utils/supabaseService';
import { StatusBadge } from '../components/StatusBadge';
import {
  Leaf,
  Award,
  Gift,
  Settings,
  RotateCcw,
  Edit2,
  Save,
  Mail,
  ShieldCheck,
  LogOut,
  LogIn,
  History,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface ContextType {
  user: User;
  refreshState: () => void;
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Profile: React.FC = () => {
  const { user, refreshState, addToast, onOpenAuth } = useOutletContext<ContextType>();
  const [activeTab, setActiveTab] = useState<'activity' | 'rewards' | 'ledger' | 'settings'>('activity');
  const [ledgerItems, setLedgerItems] = useState<PointsLedgerItem[]>([]);
  const [isLoadingLedger, setIsLoadingLedger] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setIsLoadingLedger(true);
      fetchPointsLedger(user.id).then((items) => {
        setLedgerItems(items);
        setIsLoadingLedger(false);
      });
    }
  }, [user?.id, activeTab]);

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);

  useEffect(() => {
    if (user?.name) {
      setNameInput(user.name);
    }
  }, [user?.name]);

  const submissions: CommunitySubmission[] = getSubmissions();
  const redemptions: RewardRedemption[] = getRedemptions();

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const updated = {
      ...user,
      name: nameInput.trim()
    };
    saveUser(updated);
    await updateProfileSupabase(updated);
    refreshState();
    setIsEditingName(false);
    addToast('success', 'Profile Updated', 'Your account name has been updated.');
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all sample data back to default initial state?')) {
      resetStorage();
      refreshState();
      addToast('info', 'Data Reset', 'All storage data has been restored to default state.');
    }
  };

  const handleLogout = () => {
    logoutSession();
    refreshState();
    addToast('info', 'Logged Out', 'You have been logged out.');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative group">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[#22C55E]/40 shadow-md"
            />
            <span className="absolute bottom-1 right-1 p-1.5 rounded-full bg-[#15803D] text-white shadow">
              <Leaf className="w-4 h-4 fill-white" />
            </span>
          </div>

          {/* Details & Name Edit */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                {isEditingName ? (
                  <form onSubmit={handleSaveName} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-xl text-lg font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#15803D]/40"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="p-2 bg-[#15803D] text-white rounded-xl shadow hover:bg-[#15803D]/90"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211B] flex items-center justify-center sm:justify-start gap-2">
                    {user.name}
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1 text-slate-400 hover:text-[#15803D] rounded-lg transition-colors"
                      title="Edit Display Name"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </h1>
                )}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                  <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-[#15803D] font-bold text-xs border border-emerald-200">
                    Role: {user.role}
                  </span>
                  <span className="text-xs text-[#647067] flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Auth Actions */}
              <div className="flex items-center gap-2 self-center sm:self-auto">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#15803D]" />
                  Switch Account
                </button>

                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-rose-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 max-w-lg">
              <div className="bg-[#F7FAF7] p-3 rounded-2xl border border-slate-200/60 text-center sm:text-left">
                <span className="text-xs text-slate-400 font-medium block">Eco Points</span>
                <span className="text-xl font-extrabold text-[#15803D]">{user.ecoPoints}</span>
              </div>

              <div className="bg-[#F7FAF7] p-3 rounded-2xl border border-slate-200/60 text-center sm:text-left">
                <span className="text-xs text-slate-400 font-medium block">Activities</span>
                <span className="text-xl font-extrabold text-slate-800">{user.activitiesCompleted}</span>
              </div>

              <div className="bg-[#F7FAF7] p-3 rounded-2xl border border-slate-200/60 text-center sm:text-left">
                <span className="text-xs text-slate-400 font-medium block">Scans</span>
                <span className="text-xl font-extrabold text-slate-800">{user.scansCompleted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'activity'
              ? 'bg-[#15803D] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          My Activity ({submissions.length})
        </button>

        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'rewards'
              ? 'bg-[#15803D] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Gift className="w-4 h-4" />
          Reward History ({redemptions.length})
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'ledger'
              ? 'bg-[#15803D] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          Points Ledger ({ledgerItems.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-[#15803D] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        {/* Tab 1: My Activity */}
        {activeTab === 'activity' && (
          <div>
            <h3 className="text-base font-bold text-[#17211B] mb-4">
              Community Submissions
            </h3>
            {submissions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No activity submissions logged.</p>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-2xl bg-[#F7FAF7] border border-slate-200/70 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[#17211B]">{sub.activityName}</h4>
                      <StatusBadge status={sub.status} size="sm" />
                    </div>
                    <p className="text-xs text-[#647067]">{sub.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span>Date: {sub.date} • Location: {sub.location}</span>
                      <span className="font-bold text-[#15803D]">+{sub.rewardPoints} Points</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Reward History */}
        {activeTab === 'rewards' && (
          <div>
            <h3 className="text-base font-bold text-[#17211B] mb-4">
              Redeemed Eco Rewards
            </h3>
            {redemptions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No rewards redeemed yet.</p>
            ) : (
              <div className="space-y-3">
                {redemptions.map((red) => (
                  <div
                    key={red.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7FAF7] border border-slate-200/70"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-[#17211B]">{red.rewardName}</h4>
                      <p className="text-xs text-slate-400">{red.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xs text-slate-700">-{red.points} Pts</span>
                      <StatusBadge status="Fulfilled" size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Points Ledger History */}
        {activeTab === 'ledger' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#17211B] flex items-center gap-2">
                <History className="w-4 h-4 text-[#15803D]" />
                Immutable Points Ledger
              </h3>
              <span className="text-xs text-[#15803D] font-extrabold bg-[#DCFCE7] px-3 py-1 rounded-full border border-emerald-200">
                Balance: {user.ecoPoints} Eco Points
              </span>
            </div>

            {isLoadingLedger ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading ledger history...</p>
            ) : ledgerItems.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No transactions recorded in points ledger yet.</p>
            ) : (
              <div className="space-y-2.5">
                {ledgerItems.map((item) => {
                  const isPositive = item.points > 0;
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-[#F7FAF7] border border-slate-200/80 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isPositive
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-[#17211B]">
                            {item.description}
                          </h4>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mt-0.5">
                            {item.actionType} • {new Date(item.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`font-extrabold text-xs sm:text-sm px-3 py-1 rounded-full ${
                          isPositive
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {isPositive ? `+${item.points}` : item.points} Pts
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-lg">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Account Display Name
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-[#15803D]/40 outline-none"
                />
                <button
                  onClick={handleSaveName}
                  className="px-4 py-2.5 bg-[#15803D] hover:bg-[#15803D]/90 text-white font-bold text-sm rounded-xl shadow transition-colors"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FAF7] border border-slate-200/60 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                Account Security & Role
              </div>
              <p className="text-xs text-slate-600">
                Logged in as <strong>{user.email}</strong> ({user.role})
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Reset Controls
              </h4>
              <button
                onClick={handleResetDemoData}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Application Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
