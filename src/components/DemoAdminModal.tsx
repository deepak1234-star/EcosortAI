import React, { useState } from 'react';
import { Modal } from './Modal';
import { getSubmissions, verifySubmission, getUser } from '../utils/storage';
import type { CommunitySubmission } from '../types';
import { StatusBadge } from './StatusBadge';
import { ShieldAlert, Check, X, MapPin, Calendar, User as UserIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DemoAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const DemoAdminModal: React.FC<DemoAdminModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
  addToast
}) => {
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>(getSubmissions());
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('pending');

  const refreshSubmissions = () => {
    setSubmissions(getSubmissions());
    onDataChanged();
  };

  const handleVerify = (id: string, action: 'Approved' | 'Rejected') => {
    const res = verifySubmission(id, action);
    if (res.submission) {
      if (action === 'Approved') {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
        const currentUser = getUser();
        addToast(
          'success',
          'Activity Verified!',
          `+${res.pointsAwarded} Eco Points awarded. Total: ${currentUser.ecoPoints} points.`
        );
      } else {
        addToast('warning', 'Submission Rejected', 'The submission status was set to rejected.');
      }
      refreshSubmissions();
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (activeTab === 'pending') return s.status === 'Pending Verification';
    return true;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CEP Activity Verification Portal"
      subtitle="Review & verify student community environmental submissions for Eco Points award"
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Verification Rules Banner */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm">
          <ShieldAlert className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[#15803D]">CEP Community Verification System</p>
            <p className="text-[#647067] text-xs mt-0.5">
              Verified activity submissions automatically award Eco Points to student profiles upon review.
            </p>
          </div>
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'pending'
                ? 'bg-[#15803D] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending Review ({submissions.filter((s) => s.status === 'Pending Verification').length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'all'
                ? 'bg-[#15803D] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Submissions ({submissions.length})
          </button>
        </div>

        {/* Submission list */}
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No {activeTab === 'pending' ? 'pending' : ''} submissions to display.
          </div>
        ) : (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {filteredSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      {sub.activityName}
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        +{sub.rewardPoints} Points
                      </span>
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <UserIcon className="w-3.5 h-3.5" />
                        {sub.participantName}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {sub.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {sub.date}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={sub.status} size="sm" />
                </div>

                <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                  "{sub.description}"
                </p>

                {/* Before & After Images */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Before Photo
                    </span>
                    <div className="h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      <img
                        src={sub.beforeImage}
                        alt="Before activity"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      After Photo
                    </span>
                    <div className="h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      <img
                        src={sub.afterImage}
                        alt="After activity"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons for Pending */}
                {sub.status === 'Pending Verification' && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleVerify(sub.id, 'Rejected')}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleVerify(sub.id, 'Approved')}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-[#15803D] hover:bg-[#15803D]/90 rounded-lg shadow transition-all flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve (+{sub.rewardPoints} pts)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
