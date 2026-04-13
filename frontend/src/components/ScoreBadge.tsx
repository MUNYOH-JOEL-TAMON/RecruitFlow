import React from 'react';

interface ScoreBadgeProps {
  score: number | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, className = '', size = 'md' }) => {
  if (score === null) {
    return (
      <div className={`inline-flex items-center gap-1.5 rounded-full border border-slate-300 dark:border-slate-600/50 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'} ${className}`}>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse-subtle"></div>
        Processing
      </div>
    );
  }

  // Determine colors based on score
  let colors = 'border-slate-500/30 text-slate-400 bg-slate-500/10';
  if (score >= 85) {
    colors = 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10';
  } else if (score >= 70) {
    colors = 'border-blue-500/30 text-blue-400 bg-blue-500/10';
  } else if (score >= 50) {
    colors = 'border-amber-500/30 text-amber-400 bg-amber-500/10';
  } else {
    colors = 'border-red-500/30 text-red-400 bg-red-500/10';
  }

  return (
    <div className={`inline-flex items-center justify-center rounded-full font-bold border ${colors} ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'} ${className}`}>
      {score}% Match
    </div>
  );
};

export default ScoreBadge;
