import React from 'react';
import DayCircle from './DayCircle';

interface MonthSectionProps {
  id?: string;
  name: string;
  days: number[];
  completedIndices: number[];
  dayNotes: Record<number, string>;
  onToggle: (index: number) => void;
  onSaveNote: (index: number, note: string) => void;
}

const MonthSection: React.FC<MonthSectionProps> = ({ id, name, days, completedIndices, dayNotes, onToggle, onSaveNote }) => {
  const completed = days.filter(d => completedIndices.includes(d)).length;
  const total = days.length;
  const isDone = completed === total;

  return (
    <section id={id} className="scroll-mt-40 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-5 px-1">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">{name}</h3>
        <div className="flex items-center gap-3">
          <div className="text-[9px] font-black text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
            {completed} / {total}
          </div>
          {isDone && <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-tighter shadow-lg shadow-blue-200/50">MASTERED</span>}
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 p-6 rounded-[2rem] bg-white border border-slate-200 relative overflow-hidden group hover:border-blue-600/30 transition-colors shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.03),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        {days.map((dayIdx) => (
          <DayCircle 
            key={dayIdx} 
            index={dayIdx} 
            isCompleted={completedIndices.includes(dayIdx)}
            note={dayNotes[dayIdx]}
            onToggle={onToggle}
            onSaveNote={onSaveNote}
          />
        ))}
      </div>
    </section>
  );
};

export default MonthSection;