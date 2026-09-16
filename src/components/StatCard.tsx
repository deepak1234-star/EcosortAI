import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  badge?: string;
  accentColor?: 'green' | 'blue' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  badge,
  accentColor = 'green'
}) => {
  const accentStyles = {
    green: 'bg-[#DCFCE7] text-[#15803D] border-[#22C55E]/20',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200'
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-2xl border ${accentStyles[accentColor]} transition-transform group-hover:scale-110 duration-200`}>
          {icon}
        </div>
        {badge && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-4">
        <span className="text-2xl sm:text-3xl font-extrabold text-[#17211B] tracking-tight">
          {value}
        </span>
        <p className="text-xs sm:text-sm font-medium text-[#647067] mt-0.5">
          {label}
        </p>
      </div>
    </div>
  );
};
