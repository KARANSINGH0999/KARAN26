
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import MonthSection from './components/MonthSection.tsx';
import StatsHeader from './components/StatsHeader.tsx';
import JournalSection from './components/JournalSection.tsx';
import MissionCard from './components/MissionCard.tsx';

const TOTAL_DAYS = 365;
const TARGET_YEAR = 2026;
const STORAGE_KEY = 'karan26_progress';
const NOTES_KEY = 'karan26_notes';
const MISSION_KEY = 'karan26_mission';
const LOG_KEY = 'karan26_activity_log';

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

type ViewMode = 'protocol' | 'mission' | 'archives';

export default function App() {
  const [activeView, setActiveView] = useState<ViewMode>('protocol');
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);
  const [dayNotes, setDayNotes] = useState<Record<number, string>>({});
  const [yearlyMission, setYearlyMission] = useState<string>('');
  const [aiMantra, setAiMantra] = useState<string>("SYSTEM READY. STANDING BY.");
  const [loadingMantra, setLoadingMantra] = useState<boolean>(false);
  const [activityLogs, setActivityLogs] = useState<string[]>([]);
  
  const todayIndex = useMemo(() => {
    const now = new Date();
    const start = new Date(TARGET_YEAR, 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay) - 1;
  }, []);

  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    const savedNotes = localStorage.getItem(NOTES_KEY);
    const savedMission = localStorage.getItem(MISSION_KEY);
    const savedLogs = localStorage.getItem(LOG_KEY);
    
    if (savedProgress) try { setCompletedIndices(JSON.parse(savedProgress)); } catch (e) {}
    if (savedNotes) try { setDayNotes(JSON.parse(savedNotes)); } catch (e) {}
    if (savedMission) setYearlyMission(savedMission);
    if (savedLogs) try { setActivityLogs(JSON.parse(savedLogs)); } catch (e) {}

    if (activeView === 'protocol') {
      setTimeout(() => {
        const currentMonth = MONTH_NAMES[new Date().getMonth()];
        document.getElementById(`month-${currentMonth}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [activeView]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIndices));
    localStorage.setItem(NOTES_KEY, JSON.stringify(dayNotes));
    localStorage.setItem(MISSION_KEY, yearlyMission);
    localStorage.setItem(LOG_KEY, JSON.stringify(activityLogs.slice(0, 10)));
  }, [completedIndices, dayNotes, yearlyMission, activityLogs]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setActivityLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 10));
  };

  const fetchMantra = useCallback(async (currentStreak: number, totalDone: number) => {
    setLoadingMantra(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Karan26 AI core. User streak: ${currentStreak}, total: ${totalDone}/365. Mission: "${yearlyMission}". Generate a 6-word aggressive high-end motivational directive. Use: APEX, ELITE, COMMAND, SYNC.`,
      });
      if (response.text) setAiMantra(response.text.replace(/"/g, '').trim().toUpperCase());
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMantra(false);
    }
  }, [yearlyMission]);

  useEffect(() => {
    fetchMantra(streak, completedIndices.length);
  }, [completedIndices.length % 5 === 0]);

  const streak = useMemo(() => {
    if (completedIndices.length === 0) return 0;
    const sorted = [...completedIndices].sort((a, b) => a - b);
    let currentStreak = 0;
    const todayIdx = todayIndex;
    
    if (sorted.includes(todayIdx) || sorted.includes(todayIdx - 1)) {
       let checkIdx = sorted.includes(todayIdx) ? todayIdx : todayIdx - 1;
       while (sorted.includes(checkIdx)) {
         currentStreak++;
         checkIdx--;
       }
    }
    return currentStreak;
  }, [completedIndices, todayIndex]);

  const completedWeeksStatus = useMemo(() => {
    const weeks = [];
    for (let i = 0; i < 364; i += 7) {
      weeks.push([0,1,2,3,4,5,6].every(o => completedIndices.includes(i + o)));
    }
    return weeks; 
  }, [completedIndices]);

  const handleToggle = useCallback((index: number) => {
    setCompletedIndices(prev => {
      const exists = prev.includes(index);
      addLog(exists ? `INDEX ${index + 1} DE-SYNCHRONIZED` : `INDEX ${index + 1} EXECUTED SUCCESS`);
      const newState = exists ? prev.filter(i => i !== index) : [...prev, index];
      return newState.sort((a, b) => a - b);
    });
  }, []);

  const handleSaveNote = useCallback((index: number, note: string) => {
    setDayNotes(prev => {
      const newNotes = { ...prev };
      if (note.trim() === '') delete newNotes[index];
      else newNotes[index] = note;
      return newNotes;
    });
    if (note.trim() !== '' && !completedIndices.includes(index)) handleToggle(index);
  }, [completedIndices, handleToggle]);

  const monthsData = useMemo(() => {
    let currentIdx = 0;
    return MONTH_NAMES.map((name, i) => {
      const length = MONTH_LENGTHS[i];
      const days = Array.from({ length }, (_, j) => currentIdx + j);
      currentIdx += length;
      return { name, days };
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600/20">
      <StatsHeader 
        streak={streak} 
        completedCount={completedIndices.length} 
        total={TOTAL_DAYS}
        aiMantra={aiMantra}
        loadingMantra={loadingMantra}
        completedWeeksStatus={completedWeeksStatus}
      />

      <main className="max-w-xl mx-auto px-6 pt-8 pb-40">
        {activeView === 'protocol' && (
          <div className="space-y-12">
            <div className="bg-gradient-to-br from-blue-600/5 to-white p-8 rounded-[2.5rem] border border-blue-200/50 shadow-xl">
               <div className="flex flex-col items-center text-center">
                  <p className="text-[10px] font-black tracking-[0.4em] text-blue-600 mb-2 uppercase">Current Objective</p>
                  <h2 className="text-3xl font-black mb-6 tracking-tighter text-slate-900">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </h2>
                  <button 
                    onClick={() => handleToggle(todayIndex)}
                    className={`
                      group relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500
                      ${completedIndices.includes(todayIndex)
                        ? 'bg-slate-100 border-4 border-slate-200 text-slate-400'
                        : 'bg-blue-600 border-4 border-blue-400 shadow-[0_15px_30px_rgba(37,99,235,0.4)] text-white scale-110'}
                    `}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      {completedIndices.includes(todayIndex) ? <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/> : <path d="M12 2v20M2 12h20"/>}
                    </svg>
                    {!completedIndices.includes(todayIndex) && <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20" />}
                  </button>
                  <p className="mt-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {completedIndices.includes(todayIndex) ? 'Operation Confirmed' : 'Awaiting Execution'}
                  </p>
               </div>
            </div>

            <div className="flex flex-col space-y-8">
              {monthsData.map((month) => (
                <MonthSection 
                  key={month.name}
                  id={`month-${month.name}`}
                  name={month.name}
                  days={month.days}
                  completedIndices={completedIndices}
                  dayNotes={dayNotes}
                  onToggle={handleToggle}
                  onSaveNote={handleSaveNote}
                />
              ))}
            </div>
          </div>
        )}

        {activeView === 'mission' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
             <header className="mb-10 text-center">
                <h2 className="text-4xl font-black tracking-tighter mb-2 text-slate-900">DIRECTIVE</h2>
                <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">Core Program Parameters</p>
             </header>
             <MissionCard mission={yearlyMission} onSave={setYearlyMission} />
             <div className="mt-12 bg-white p-6 rounded-3xl border border-blue-100 shadow-sm">
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Tactical Log</h3>
                <div className="space-y-2 font-mono text-[10px]">
                   {activityLogs.map((log, i) => (
                     <div key={i} className="text-slate-500 border-l border-blue-200 pl-3 py-1">
                        <span className="text-blue-900 font-bold">{log.split(']')[0]}]</span> {log.split(']')[1]}
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeView === 'archives' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <JournalSection dayNotes={dayNotes} onEdit={(idx) => { setActiveView('protocol'); setTimeout(() => document.getElementById(`month-${MONTH_NAMES[new Date(TARGET_YEAR, 0, idx+1).getMonth()]}`)?.scrollIntoView({behavior: 'smooth', block: 'center'}), 100); }} />
          </div>
        )}
      </main>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
        <div className="bg-white/80 backdrop-blur-2xl border border-blue-100 rounded-[2.5rem] p-2 shadow-2xl flex items-center justify-between">
          <button 
            onClick={() => setActiveView('protocol')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all rounded-[2rem] ${activeView === 'protocol' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-blue-600'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            <span className="text-[8px] font-black uppercase tracking-widest">Protocol</span>
          </button>
          
          <button 
            onClick={() => setActiveView('mission')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all rounded-[2rem] ${activeView === 'mission' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-blue-600'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
            <span className="text-[8px] font-black uppercase tracking-widest">Mission</span>
          </button>

          <button 
            onClick={() => setActiveView('archives')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all rounded-[2rem] ${activeView === 'archives' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-blue-600'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span className="text-[8px] font-black uppercase tracking-widest">Archive</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
