
import React, { useState, useMemo } from 'react';

interface JournalSectionProps {
  dayNotes: Record<number, string>;
  onEdit: (index: number) => void;
}

const JournalSection: React.FC<JournalSectionProps> = ({ dayNotes, onEdit }) => {
  const [query, setQuery] = useState('');

  const entries = useMemo(() => {
    return (Object.entries(dayNotes) as [string, string][])
      .map(([idx, text]) => ({ index: parseInt(idx), text }))
      .sort((a, b) => b.index - a.index); 
  }, [dayNotes]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return entries.filter(e => e.text.toLowerCase().includes(q) || (e.index + 1).toString().includes(q));
  }, [entries, query]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <header className="mb-10 text-center">
        <h2 className="text-4xl font-black tracking-tighter mb-2 text-slate-900">ARCHIVES</h2>
        <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">Intelligence Retrieval</p>
      </header>

      <div className="relative mb-8">
        <input 
          type="text" 
          placeholder="FILTER LOGS..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold tracking-widest placeholder:text-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 transition-all uppercase shadow-sm"
        />
      </div>

      <div className="space-y-4">
        {filtered.map(e => (
          <div key={e.index} onClick={() => onEdit(e.index)} className="p-6 bg-white rounded-3xl border border-slate-200 hover:border-blue-600/30 transition-all cursor-pointer group active:scale-[0.98] shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
               <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Entry D{e.index + 1}</span>
               <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(2026, 0, e.index + 1).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
            </div>
            <p className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors leading-relaxed">{e.text}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">No logs found in archive.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalSection;
