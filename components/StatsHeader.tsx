
import React, { useMemo, useRef } from 'react';

interface StatsHeaderProps {
  streak: number;
  completedCount: number;
  total: number;
  aiMantra: string;
  loadingMantra: boolean;
  completedWeeksStatus: boolean[]; 
}

const StatsHeader: React.FC<StatsHeaderProps> = ({ 
  streak, 
  completedCount, 
  total, 
  aiMantra, 
  loadingMantra 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progress = (completedCount / total) * 100;

  return (
    <header className="px-6 pt-10 pb-6 bg-white border-b border-slate-200">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tighter leading-none mb-1 text-slate-900">
            KARAN<span className="text-blue-600">26</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Operations Active</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Streak</span>
             <span className="text-xl font-black text-slate-900">{streak}</span>
           </div>
           
           <div className="relative w-14 h-14">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
               <circle 
                 cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" 
                 strokeDasharray={150.8}
                 strokeDashoffset={150.8 - (150.8 * progress) / 100}
                 className="text-blue-600 transition-all duration-1000 ease-out"
               />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-[8px] font-black text-slate-900">{Math.round(progress)}%</span>
             </div>
           </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto mt-8">
        <div className="bg-slate-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <p className="text-[10px] font-bold text-slate-600 italic leading-relaxed tracking-wide">
            {loadingMantra ? "CALIBRATING SYSTEM..." : aiMantra}
          </p>
        </div>
      </div>
    </header>
  );
};

export default StatsHeader;
