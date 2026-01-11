
import React, { useState } from 'react';

interface MissionCardProps {
  mission: string;
  onSave: (mission: string) => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempMission, setTempMission] = useState(mission);

  const handleSave = () => {
    onSave(tempMission);
    setIsEditing(false);
  };

  return (
    <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="relative p-[1px] rounded-[2rem] bg-gradient-to-br from-blue-600/20 via-slate-200 to-blue-600/20 shadow-lg overflow-hidden">
        <div className="bg-white rounded-[1.95rem] p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
              <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Mission 2026</h3>
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-slate-300 hover:text-blue-600 transition-colors p-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <textarea
                autoFocus
                value={tempMission}
                onChange={(e) => setTempMission(e.target.value)}
                placeholder="Mission parameters..."
                className="w-full h-24 p-0 text-lg font-bold text-slate-900 placeholder:text-slate-300 border-none focus:ring-0 resize-none bg-transparent"
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => { setIsEditing(false); setTempMission(mission); }}
                  className="px-4 py-2 text-[10px] font-black uppercase text-slate-400"
                >
                  Abort
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-200"
                >
                  Upload Params
                </button>
              </div>
            </div>
          ) : (
            <p className={`text-xl font-bold tracking-tight ${mission ? 'text-slate-900' : 'text-slate-300 italic'}`}>
              {mission || "Awaiting mission parameters..."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionCard;
