
import React from 'react';
import { VolunteerProfile, UserProfile, VolunteerBriefing } from '../src/domain/entities/types';

interface Props {
  volunteers: VolunteerProfile[];
  activeProfile: UserProfile | null;
  isEmergency: boolean;
  aiBriefing: VolunteerBriefing | null;
}

const AngelLinkPanel: React.FC<Props> = ({ volunteers, activeProfile, isEmergency, aiBriefing }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border ${isEmergency ? 'border-indigo-500 ring-1 ring-indigo-200' : 'border-slate-200'} p-4 transition-all duration-500`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-600 p-1 rounded">🛡️</span>
          Angel Link (Rede de Apoio)
        </h3>
        {isEmergency && <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded animate-pulse">ACIOANDO...</span>}
      </div>

      {/* Volunteer Grid */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-2">
        {volunteers.map(v => (
          <div key={v.id} className="flex flex-col items-center min-w-[60px]">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-slate-50 relative
              ${v.isOnline ? 'border-emerald-400' : 'border-slate-300 grayscale opacity-60'}
            `}>
              <span className="text-xs">
                {v.skills.includes('Médico') ? '🩺' : v.skills.includes('Familiar') ? '❤️' : '🤝'}
              </span>
              {v.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>}
            </div>
            <span className="text-[9px] font-bold text-slate-600 mt-1 truncate w-full text-center">{v.name}</span>
            <span className="text-[8px] text-slate-400">{v.distance}</span>
          </div>
        ))}
      </div>

      {/* The AI Dispatcher Briefing Card */}
      {isEmergency && activeProfile && (
        <div className="mt-3 bg-slate-900 text-slate-100 rounded-lg overflow-hidden animate-slide-up shadow-xl">
           <div className="bg-indigo-600 px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                 <span className="font-bold text-xs uppercase tracking-wide">Saveplace Guardian</span>
              </div>
              <span className="text-[9px] bg-indigo-500 px-1.5 py-0.5 rounded border border-indigo-400">AI BRIEFING</span>
           </div>
           
           {aiBriefing ? (
             <div className="p-3 text-sm">
               
               {/* Summary Section */}
               <div className="mb-3">
                 <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Diagnóstico Situacional</p>
                 <p className="font-medium text-white leading-tight font-mono text-xs">{aiBriefing.summary}</p>
               </div>

               {/* Script Section */}
               <div className="mb-3 bg-slate-800 p-2 rounded border border-slate-700">
                 <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Roteiro de Acolhimento</p>
                 <p className="italic text-slate-300 text-sm">"{aiBriefing.suggested_opening}"</p>
               </div>

               {/* Warning Section */}
               {aiBriefing.safety_warning && (
                  <div className="flex items-start gap-2 bg-amber-900/30 p-2 rounded border border-amber-800/50 mb-3">
                      <span className="text-amber-400 text-xs mt-0.5">⚠️</span>
                      <p className="text-xs text-amber-200">{aiBriefing.safety_warning}</p>
                  </div>
               )}

               <div className="flex gap-2 mt-2">
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded flex-1 font-bold transition-colors flex items-center justify-center gap-1">
                    <span>📞</span> Conectar Agora
                  </button>
                  <button className="bg-slate-700 hover:bg-slate-600 text-xs px-3 py-2 rounded flex-1 transition-colors">
                    Ignorar
                  </button>
               </div>
             </div>
           ) : (
             <div className="p-6 flex flex-col items-center justify-center gap-3">
               <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
               <span className="text-xs text-slate-400 text-center">Guardian analisando telemetria e perfil médico...</span>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default AngelLinkPanel;
