import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { INITIAL_COMMUNITY_ACTIVITIES } from '../data/mockData';
import { getSubmissions, addSubmission } from '../utils/storage';
import type { CommunityActivity, CommunitySubmission, User } from '../types';
import { Modal } from '../components/Modal';
import { ImageUploader } from '../components/ImageUploader';
import { StatusBadge } from '../components/StatusBadge';
import {
  Users,
  Sparkles,
  TreePine,
  Trash2,
  GraduationCap,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ContextType {
  user: User;
  refreshState: () => void;
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const Community: React.FC = () => {
  const { user, refreshState, addToast } = useOutletContext<ContextType>();
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>(getSubmissions());
  const [selectedActivity, setSelectedActivity] = useState<CommunityActivity | null>(null);

  // Form fields for participation modal
  const [formName, setFormName] = useState(user.name);
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formLocation, setFormLocation] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const iconMap: Record<string, React.ReactNode> = {
    Sparkles: <Sparkles className="w-6 h-6 text-emerald-600" />,
    Trees: <TreePine className="w-6 h-6 text-emerald-600" />,
    Trash2: <Trash2 className="w-6 h-6 text-[#15803D]" />,
    GraduationCap: <GraduationCap className="w-6 h-6 text-emerald-600" />
  };

  const handleOpenParticipate = (act: CommunityActivity) => {
    setSelectedActivity(act);
    setFormName(user.name);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormLocation('');
    setFormDescription('');
    setBeforeImage(null);
    setAfterImage(null);
    setFormError(null);
  };

  const handleSubmitActivity = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formLocation.trim() || !formDescription.trim()) {
      setFormError('Please fill in the Location and Short Description fields.');
      return;
    }

    if (!beforeImage || !afterImage) {
      setFormError('Please upload both Before and After photos to verify your activity.');
      return;
    }

    if (!selectedActivity) return;

    addSubmission({
      activityId: selectedActivity.id,
      activityName: selectedActivity.title,
      date: formDate,
      location: formLocation.trim(),
      description: formDescription.trim(),
      beforeImage,
      afterImage,
      rewardPoints: selectedActivity.rewardPoints,
      participantName: formName || user.name
    });

    setSubmissions(getSubmissions());
    refreshState();
    setSelectedActivity(null);

    addToast(
      'success',
      'Activity Submitted ✓',
      'Your submission is now Pending Verification. Points will be awarded upon approval.'
    );
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-bold">
          <Users className="w-3.5 h-3.5" />
          <span>CEP Action Hub</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211B] tracking-tight">
          Community Activities
        </h1>
        <p className="text-sm text-[#647067] leading-relaxed max-w-xl">
          Take action in your community. Earn Eco Points for verified participation in real-world environmental drives.
        </p>
      </div>

      {/* Activities Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#17211B]">
          Available Community Drives
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {INITIAL_COMMUNITY_ACTIVITIES.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-2xl bg-[#DCFCE7] border border-emerald-200">
                    {iconMap[act.iconName] || <Sparkles className="w-6 h-6 text-[#15803D]" />}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#15803D] font-extrabold text-xs border border-emerald-200">
                    +{act.rewardPoints} Eco Points
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {act.categoryTag}
                  </span>
                  <h3 className="text-lg font-bold text-[#17211B] mt-0.5">
                    {act.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#647067] mt-1 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleOpenParticipate(act)}
                className="w-full py-3 bg-[#15803D] hover:bg-[#15803D]/90 text-white font-bold text-sm rounded-2xl shadow hover:shadow-md transition-all transform active:scale-98 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Participate
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* User Submissions History Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-[#17211B]">
          My Submissions & Status
        </h2>

        {submissions.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No community submissions yet. Join your first activity above!
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-2xl bg-[#F7FAF7] border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#15803D] border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    +{sub.rewardPoints}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#17211B]">
                      {sub.activityName}
                    </h4>
                    <p className="text-xs text-[#647067] mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {sub.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {sub.location}
                      </span>
                    </p>
                  </div>
                </div>

                <StatusBadge status={sub.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Participation Form Modal */}
      {selectedActivity && (
        <Modal
          isOpen={!!selectedActivity}
          onClose={() => setSelectedActivity(null)}
          title={`Participate in ${selectedActivity.title}`}
          subtitle="Submit proof of your community participation to earn Eco Points"
          maxWidth="lg"
        >
          <form onSubmit={handleSubmitActivity} className="space-y-4">
            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Participant Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-[#15803D]/30 focus:border-[#15803D] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Date of Activity
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-[#15803D]/30 focus:border-[#15803D] outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location / Area
              </label>
              <input
                type="text"
                placeholder="e.g. North Campus Pathway, Green Park"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-[#15803D]/30 focus:border-[#15803D] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Short Description
              </label>
              <textarea
                rows={2}
                placeholder="Briefly describe what was done..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-[#15803D]/30 focus:border-[#15803D] outline-none"
                required
              />
            </div>

            {/* Before & After Photo Uploaders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <ImageUploader
                label="Before Photo"
                description="Upload photo before starting action"
                selectedImage={beforeImage}
                onImageSelected={(url) => setBeforeImage(url)}
                onClear={() => setBeforeImage(null)}
                aspectRatio="square"
              />

              <ImageUploader
                label="After Photo"
                description="Upload photo after completing action"
                selectedImage={afterImage}
                onImageSelected={(url) => setAfterImage(url)}
                onClear={() => setAfterImage(null)}
                aspectRatio="square"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedActivity(null)}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#15803D] hover:bg-[#15803D]/90 text-white font-bold text-sm rounded-xl shadow-md transition-all transform active:scale-95"
              >
                Submit Activity
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
