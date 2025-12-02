
import React from 'react';
import { UserProfile, BioAnalysisResult } from '../src/domain/entities/types';

interface Props {
  profile: UserProfile;
  bioResult: BioAnalysisResult | null;
  loading: boolean;
  onSimulate: (type: 'PANIC' | 'FALL' | 'NORMAL') => void;
}

const BioMonitorPanel: React.FC<Props> = ({ profile, bioResult, loading, onSimulate }) => {
  const getHeartRateColor = (bpm: number) => {
    if (bpm > 120) return 'text-red-500';
    if (bpm > 100) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const statusColor = bioResult?.analysis.status === 'ALERTA_VERMELHO' ? 'bg-red-500' 
                   : bioResult?.analysis.status === 'ALERTA_AMARELO' ? 'bg-amber-500' 
                   : 'bg-emerald-500';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-600 p-1 rounded">⌚</span>
          Saveplace Bio-Link
        </h3>
        <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
            {profile.deviceType} CONNECTED
        </span>
      </div>

      <div className="flex gap-4 mb-4">
          {/* Heart Rate Visualization */}
          <div className="flex-1 bg-slate-50 rounded-lg p-3 border border-slate-100 relative overflow-hidden">
             <div className="flex items-end gap-1 mb-1">
                <span className={`text-3xl font-black ${getHeartRateColor(profile.heartRate)}`}>
                    {profile.heartRate}
                </span>
                <span className="text-xs text-slate-400 font-bold mb-1">BPM</span>
             </div>
             <p className="text-[9px] text-slate-400">Baseline: {profile.baselineHeartRate}</p>
             
             {/* EKG Animation Line */}
             <div className="absolute bottom-0 left-0 w-full h-8 opacity-20">
                 <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
                     <path d="M0 10 L10 10 L15 5 L20 15 L25 10 L35 10 L40 0 L45 20 L50 10 L60 10 L65 5 L70 15 L75 10 L100 10" 
                           fill="none" 
                           stroke={profile.heartRate > 100 ? "red" : "green"} 
                           strokeWidth="2"
                           className="animate-pulse"
                     />
                 </svg>
             </div>
          </div>

          {/* Stress & Fall */}
          <div className="flex-1 flex flex-col gap-2">
             <div className="flex-1 bg-slate-50 rounded px-2 py-1 border border-slate-100 flex items-center justify-between">
                 <span className="text-[9px] font-bold text-slate-500">ESTRESSE</span>
                 <span className={`text-[10px] font-bold px-1.5 rounded 
                    ${profile.stressLevel === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {profile.stressLevel}
                 </span>
             </div>
             <div className={`flex-1 rounded px-2 py-1 border flex items-center justify-between transition-colors
                 ${profile.isFallDetected ? 'bg-red-500 border-red-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-400'}
             `}>
                 <span className="text-[9px] font-bold">QUEDA</span>
                 <span className="text-xs font-bold">{profile.isFallDetected ? 'DETECTADA!' : 'NÃO'}</span>
             </div>
          </div>
      </div>

      {/* AI Analysis Result */}
      <div className="bg-slate-900 rounded-lg p-3 text-white relative overflow-hidden">
          {loading ? (
             <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                <div className="w-3 h-3 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                Analisando biometria...
             </div>
          ) : bioResult ? (
             <div className="animate-fade-in">
                 <div className="flex items-center justify-between mb-2 border-b border-slate-700 pb-2">
                     <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${statusColor} animate-pulse`}></div>
                        <span className="font-bold text-xs uppercase tracking-wide">Bio-Analyst Status</span>
                     </div>
                     <span className="text-[10px] bg-slate-700 px-1.5 rounded">{bioResult.analysis.probability_score}% Prob.</span>
                 </div>
                 
                 <p className="text-[11px] text-slate-300 leading-snug mb-3">
                    {bioResult.analysis.reasoning}
                 </p>

                 {bioResult.recommended_action.voice_message_to_user && (
                    <div className="bg-indigo-900/50 p-2 rounded border border-indigo-500/30">
                        <p className="text-[9px] text-indigo-300 font-bold uppercase mb-0.5">Ação Recomendada (Voz)</p>
                        <p className="text-[10px] italic">"{bioResult.recommended_action.voice_message_to_user}"</p>
                    </div>
                 )}
             </div>
          ) : (
             <p className="text-[10px] text-slate-500 text-center py-2">Nenhuma anomalia detectada.</p>
          )}
      </div>

      {/* Simulation Controls */}
      <div className="mt-3 grid grid-cols-3 gap-2">
         <button onClick={() => onSimulate('PANIC')} className="text-[9px] font-bold bg-amber-100 text-amber-700 py-1.5 rounded hover:bg-amber-200">
            SIMULAR PÂNICO
         </button>
         <button onClick={() => onSimulate('FALL')} className="text-[9px] font-bold bg-red-100 text-red-700 py-1.5 rounded hover:bg-red-200">
            SIMULAR QUEDA
         </button>
         <button onClick={() => onSimulate('NORMAL')} className="text-[9px] font-bold bg-emerald-100 text-emerald-700 py-1.5 rounded hover:bg-emerald-200">
            NORMALIZAR
         </button>
      </div>
    </div>
  );
};

export default BioMonitorPanel;
