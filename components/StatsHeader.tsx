
import React, { useRef } from 'react';

interface StatsHeaderProps {
  streak: number;
  completedCount: number;
  total: number;
  aiMantra: string;
  loadingMantra: boolean;
  completedWeeksStatus: boolean[]; 
  onImport: (data: any) => void;
  exportData: () => void;
}

const StatsHeader: React.FC<StatsHeaderProps> = ({ 
  streak, 
  completedCount, 
  total, 
  aiMantra, 
  loadingMantra,
  onImport,
  exportData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progress = (completedCount / total) * 100;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImport(json);
      } catch (err) {
        alert("Invalid Database File");
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="px-6 pt-10 pb-6 bg-white border-b border-slate-200 sticky top-0 z-[60]">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
             <h1 className="text-2xl font-black tracking-tighter leading-none text-slate-900">
              KARAN<span className="text-blue-600">26</span>
            </h1>
            <div className="flex gap-1">
              <button 
                onClick={exportData}
                className="p-1.5 text-slate-300 hover:text-blue-600 transition-colors"
                title="Backup Database"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-slate-300 hover:text-blue-600 transition-colors"
                title="Restore Database"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Database Synced</p>
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
            {loadingMantra ? "CONNECTING TO CORE..." : aiMantra}
          </p>
        </div>
      </div>
    </header>
  );
};

export default StatsHeader;
