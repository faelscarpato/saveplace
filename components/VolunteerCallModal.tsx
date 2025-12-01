
import React, { useEffect, useState } from 'react';
import { UserProfile, VolunteerBriefing } from '../types';

interface Props {
  caller: UserProfile;
  briefing: VolunteerBriefing;
  onClose: () => void;
}

const VolunteerCallModal: React.FC<Props> = ({ caller, briefing, onClose }) => {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
      <div 
        className={`w-full max-w-md bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 transform transition-all duration-500 flex flex-col max-h-[90vh] ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        {/* Header / StatusBar Mock */}
        <div className="bg-slate-900 px-6 py-3 flex justify-between items-center text-xs text-slate-400 flex-shrink-0 rounded-t-3xl">
          <span>SAVEPLACE ANGEL NETWORK</span>
          <span className="flex items-center gap-1 text-red-500 font-bold animate-pulse">
            🔴 CHAMADA DE EMERGÊNCIA
          </span>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto custom-scrollbar">
            {/* Caller Identity */}
            <div className="p-6 flex flex-col items-center relative overflow-hidden">
              {/* Background Pulse Effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full animate-ping pointer-events-none"></div>
              
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-slate-200 flex items-center justify-center text-4xl relative z-10 mb-4">
                 {caller.type === 'ELDERLY' ? '👴' : caller.type === 'CHILD' ? '👶' : '👤'}
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-1">{caller.name}</h2>
              <p className="text-slate-400 text-sm mb-6 flex items-center gap-2">
                📍 {caller.location.lat.toFixed(4)}, {caller.location.lng.toFixed(4)}
              </p>
            </div>

            {/* THE AI BRAIN: Guardian Briefing Card */}
            <div className="px-4 pb-4 relative z-20">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-0.5 shadow-xl">
                    <div className="bg-slate-900/90 rounded-[10px] p-4 backdrop-blur-md">
                        <div className="flex items-center gap-2 mb-3 border-b border-indigo-500/30 pb-2">
                             <span className="text-xl">🛡️</span>
                             <div className="flex-1">
                                 <h3 className="text-indigo-400 font-bold text-xs tracking-wider uppercase">Briefing do Guardião (IA)</h3>
                                 <p className="text-[10px] text-slate-400">Leia antes de atender</p>
                             </div>
                        </div>

                        {/* 1. Contexto Critico */}
                        <div className="mb-3">
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Cenário</p>
                            <p className="text-white text-sm font-medium leading-relaxed bg-slate-800/50 p-2 rounded border-l-2 border-indigo-500">
                                {briefing.summary}
                            </p>
                        </div>

                        {/* 2. Dica de Abordagem (O Roteiro) */}
                        <div className="mb-3">
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">O que falar (Sugestão)</p>
                            <div className="bg-emerald-900/20 border border-emerald-500/30 p-3 rounded-lg relative">
                                 <span className="absolute -top-2 -right-1 text-4xl text-emerald-500/10">”</span>
                                 <p className="text-emerald-300 italic text-sm font-medium">"{briefing.suggested_opening}"</p>
                            </div>
                        </div>

                        {/* 3. Alerta de Segurança */}
                        {briefing.safety_warning && (
                            <div className="flex items-center gap-2 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                                <span className="text-lg">⚠️</span>
                                <p className="text-amber-200 text-xs">{briefing.safety_warning}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 p-6 pt-2 bg-slate-900 pb-8">
                 <button 
                    onClick={onClose}
                    className="py-4 rounded-xl bg-slate-800 text-slate-400 font-bold hover:bg-slate-700 transition-colors flex flex-col items-center justify-center gap-1"
                 >
                    <span className="text-xl">💬</span>
                    <span>Enviar Mensagem</span>
                 </button>
                 <button 
                    onClick={onClose} // Demo behavior: Close modal
                    className="py-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/50 flex flex-col items-center justify-center gap-1 animate-pulse"
                 >
                    <span className="text-xl">📞</span>
                    <span>ATENDER AGORA</span>
                 </button>
            </div>
            
            <div className="text-center pb-6">
                <button onClick={onClose} className="text-xs text-slate-500 hover:text-white underline">
                    Ignorar Chamada
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerCallModal;
