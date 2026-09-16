import React from 'react';
import { CheckCircle2, Clock, XCircle, Tag } from 'lucide-react';

interface StatusBadgeProps {
  status: 'Pending Verification' | 'Approved' | 'Rejected' | 'Pending' | 'Fulfilled' | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const isSm = size === 'sm';
  const sizeClasses = isSm ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs sm:text-sm';

  switch (status) {
    case 'Pending Verification':
    case 'Pending':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-100/80 text-amber-800 border border-amber-300/60 ${sizeClasses}`}
        >
          <Clock className={isSm ? 'w-3 h-3 text-amber-600' : 'w-3.5 h-3.5 text-amber-600'} />
          Pending Verification
        </span>
      );
    case 'Approved':
    case 'Approved ✓':
    case 'Fulfilled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300/60 ${sizeClasses}`}
        >
          <CheckCircle2 className={isSm ? 'w-3 h-3 text-emerald-600' : 'w-3.5 h-3.5 text-emerald-600'} />
          Approved ✓
        </span>
      );
    case 'Rejected':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-100/80 text-rose-800 border border-rose-300/60 ${sizeClasses}`}
        >
          <XCircle className={isSm ? 'w-3 h-3 text-rose-600' : 'w-3.5 h-3.5 text-rose-600'} />
          Rejected
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}
        >
          <Tag className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {status}
        </span>
      );
  }
};
