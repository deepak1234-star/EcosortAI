import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { INITIAL_REWARDS } from '../data/mockData';
import { getRedemptions, redeemReward } from '../utils/storage';
import type { Reward, RewardRedemption, User } from '../types';
import { SmartImage } from '../components/SmartImage';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusBadge } from '../components/StatusBadge';
import { saveRedemptionSupabase } from '../utils/supabaseService';
import { Leaf, Gift, CheckCircle2, History, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContextType {
  user: User;
  refreshState: () => void;
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const Rewards: React.FC = () => {
  const { user, refreshState, addToast } = useOutletContext<ContextType>();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redemptionsHistory, setRedemptionsHistory] = useState<RewardRedemption[]>(getRedemptions());

  const handleOpenRedeem = (reward: Reward) => {
    if (user.ecoPoints < reward.points) {
      addToast(
        'warning',
        'Not Enough Eco Points',
        `You need ${reward.points - user.ecoPoints} more points to redeem ${reward.name}.`
      );
      return;
    }
    setSelectedReward(reward);
    setIsConfirming(true);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward || isRedeeming) return;

    setIsRedeeming(true);

    const newRedemption: RewardRedemption = {
      id: `red_${Date.now()}`,
      rewardId: selectedReward.id,
      rewardName: selectedReward.name,
      points: selectedReward.points,
      date: new Date().toISOString().split('T')[0],
      status: 'Fulfilled',
      image: selectedReward.image
    };

    if (user?.id) {
      const supRes = await saveRedemptionSupabase(newRedemption, user.id);
      if (!supRes.success) {
        addToast('error', 'Redemption Failed', supRes.message);
        setIsRedeeming(false);
        setIsConfirming(false);
        setSelectedReward(null);
        return;
      }
    }

    const res = redeemReward(selectedReward);
    if (res.success) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      refreshState();
      setRedemptionsHistory(getRedemptions());
      addToast('success', 'Redemption Submitted ✓', res.message);
    } else {
      addToast('error', 'Redemption Failed', res.message);
    }

    setIsRedeeming(false);
    setIsConfirming(false);
    setSelectedReward(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Header Banner with Prominent Balance */}
      <div className="bg-[#15803D] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold border border-white/20">
            <Gift className="w-3.5 h-3.5" />
            <span>Eco Points Redemption Store</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Eco Rewards
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Earn points through verified community participation and redeem eco-friendly rewards.
          </p>
        </div>

        {/* Prominent Balance Display */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center shrink-0 min-w-[180px] shadow-inner text-center">
          <span className="text-xs font-extrabold text-emerald-200 uppercase tracking-wider flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 fill-emerald-200" />
            Available Balance
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            {user.ecoPoints}
          </span>
          <span className="text-xs font-semibold text-emerald-100 mt-0.5">Eco Points</span>
        </div>
      </div>

      {/* Reward Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#17211B] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#15803D]" />
          Available Eco Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {INITIAL_REWARDS.map((reward) => {
            const canAfford = user.ecoPoints >= reward.points;
            return (
              <div
                key={reward.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <SmartImage
                    src={reward.image}
                    alt={reward.name}
                    fallbackText={reward.name}
                    fallbackCategory="Eco Product"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full font-extrabold text-xs text-[#15803D] shadow border border-emerald-200 flex items-center gap-1 z-10">
                    <Leaf className="w-3.5 h-3.5 fill-[#15803D]" />
                    {reward.points} Pts
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-[#17211B] text-base leading-snug">
                      {reward.name}
                    </h3>
                    <p className="text-xs text-[#647067] mt-1 line-clamp-2">
                      {reward.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenRedeem(reward)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm shadow transition-all flex items-center justify-center gap-1.5 ${
                      canAfford
                        ? 'bg-[#15803D] hover:bg-[#15803D]/90 text-white active:scale-95'
                        : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Redeem Product
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        Need {reward.points - user.ecoPoints} More Points
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Redemption History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#17211B] flex items-center gap-2">
          <History className="w-4 h-4 text-[#15803D]" />
          Redemption History
        </h2>

        {redemptionsHistory.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No rewards redeemed yet.</p>
        ) : (
          <div className="space-y-3">
            {redemptionsHistory.map((red) => (
              <div
                key={red.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7FAF7] border border-slate-200/80"
              >
                <div className="flex items-center gap-3">
                  {red.image ? (
                    <img
                      src={red.image}
                      alt={red.rewardName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                      Eco
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#17211B]">{red.rewardName}</h4>
                    <p className="text-xs text-[#647067] mt-0.5">{red.date}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="font-extrabold text-xs sm:text-sm text-slate-700">
                    -{red.points} Points
                  </span>
                  <StatusBadge status="Fulfilled" size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Dialog Modal */}
      {selectedReward && (
        <ConfirmDialog
          isOpen={isConfirming}
          onClose={() => setIsConfirming(false)}
          onConfirm={handleConfirmRedeem}
          title={`Redeem ${selectedReward.name}?`}
          message={`${selectedReward.points} Eco Points will be deducted from your account. Redemption details will be saved to your profile.`}
          confirmText="Confirm Redemption"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};
