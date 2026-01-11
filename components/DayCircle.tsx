
import React, { useState } from 'react';
import { DayProps } from '../types.ts';

const DayCircle: React.FC<DayProps> = ({ index, isCompleted, note, onToggle, onSaveNote }) => {
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [tempNote, setTempNote] = useState(note || '');

  const handleCircleClick = (e: React.MouseEvent) => {
    if (e.shiftKey || (isCompleted && note)) {
      setIsNoteOpen(true);
    } else {
      onToggle(index);
    }
  };

  const saveReflection = () => {
    onSaveNote(index, tempNote);
    setIsNoteOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-0.5 relative group/day">
      <button
        onClick={handleCircleClick}
        aria-label={`Toggle day ${index + 1}`}
        className={`
          relative w-10 h-10 rounded-xl transition-all duration-300 ease-in-out
          flex items-center justify-center outline-none overflow-hidden
          ${isCompleted 
            ? 'bg-blue-600 text-white shadow-[0_5px_15px_rgba(37,99,235,0.3)] border border-blue-400' 
            : 'bg-slate-50 border border-slate-200 text-slate-300 hover:border-blue-600/40 hover:text-blue-600 hover:bg-white'}
          active:scale-90
        `}
      >
        {isCompleted && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        )}
        
        {isCompleted && (
          <div className="absolute inset-0 w-full h-1 bg-white/30 animate-[scanline_2s_linear_infinite] pointer-events-none opacity-50" />
        )}

        {isCompleted && note && (
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full z-10 shadow-[0_0_5px_white]" />
        )}

        <span className={`text-[10px] font-black transition-all ${isCompleted ? 'scale-110' : 'opacity-40 group-hover/day:opacity-100'}`}>
          {isCompleted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (index % 31) + 1}
        </span>
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanline {
          0% { transform: translateY(-40px); }
          100% { transform: translateY(40px); }
        }
      `}} />

      {isNoteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                  <h3 className="font-black text-slate-900 tracking-tighter text-lg uppercase">Log Terminal</h3>
                  <span className="text-[9px] font-mono text-blue-600/60 uppercase tracking-widest">Entry ID: 2026-D{index + 1}</span>
                </div>
                <button onClick={() => setIsNoteOpen(false)} className="text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 p-2 rounded-xl">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <textarea
                autoFocus
                className="w-full h-40 p-5 bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-sm font-medium text-slate-700 placeholder:text-slate-300 transition-all font-mono"
                placeholder="Transmitting observations..."
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
              />
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => { onToggle(index); setIsNoteOpen(false); }}
                  className="flex-1 px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-100 hover:text-red-600 transition-colors"
                >
                  Purge
                </button>
                <button
                  onClick={saveReflection}
                  className="flex-[2] px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white bg-blue-600 shadow-xl shadow-blue-200 active:scale-95"
                >
                  Commit Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayCircle;
