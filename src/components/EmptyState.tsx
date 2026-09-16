import React from 'react';
import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm my-4">
      <div className="w-16 h-16 rounded-2xl bg-[#DCFCE7] flex items-center justify-center text-[#15803D] mb-4 shadow-inner">
        {icon || <Sparkles className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-[#17211B]">{title}</h3>
      <p className="text-sm text-[#647067] max-w-md mt-1 mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-[#15803D] hover:bg-[#15803D]/90 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
