
import React from 'react';
import DayCircle from './DayCircle';
import { WeekProps } from '../types';

const WeekSection: React.FC<WeekProps> = ({ weekIndex, days, completedIndices, onToggle }) => {
  const isWeekComplete = days.every(dayIdx => completedIndices.includes(dayIdx));

  return (
    <div className={`
      relative mb-8 px-4 py-6 rounded-3xl transition-all duration-500
      ${isWeekComplete ? 'bg-emerald-50 ring-2 ring-emerald-200 shadow-lg' : 'bg-transparent'}
    `}>
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className={`text-sm font-bold tracking-wider uppercase ${isWeekComplete ? 'text-emerald-600' : 'text-slate-400'}`}>
          Week {weekIndex + 1}
        </h3>
        {isWeekComplete && (
          <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
            PERFECT WEEK
          </span>
        )}
      </div>
      
      <div className="flex flex-col gap-1 items-center">
        {days.map((dayIdx) => (
          <DayCircle 
            key={dayIdx} 
            index={dayIdx} 
            isCompleted={completedIndices.includes(dayIdx)}
            onToggle={onToggle}
          />
        ))}
      </div>

      {!isWeekComplete && (
        <div className="absolute left-1/2 -bottom-4 -translate-x-1/2 w-1/3 h-px bg-slate-200" />
      )}
    </div>
  );
};

export default WeekSection;
