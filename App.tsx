import React, { useState, useRef } from 'react';
import MapVisualizer from './components/MapVisualizer';
import AssistantPanel from './components/AssistantPanel';
import AngelLinkPanel from './components/AngelLinkPanel';
import VolunteerCallModal from './components/VolunteerCallModal';
import BioMonitorPanel from './components/BioMonitorPanel';
import { useAppViewModel } from './src/presentation/viewModels/useAppViewModel';

const App: React.FC = () => {
  const {
      profiles,
      zones,
      volunteers,
      activeProfile,
      setActiveProfile,
      isEmergency,
      connected,
      isListening,
      toggleConnection,
      simulateBioEvent,
      analyzeImage,
      isAnalyzingImage,
      visionAnalysis,
      bioResult,
      analyzingBio,
      aiBriefing,
      showVolunteerModal,
      setShowVolunteerModal
  } = useAppViewModel();

  // Mobile Nav State
  const [currentView, setCurrentView] = useState<'map' | 'dashboard'>('map');

  // Swipe Logic
  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
      touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
      touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
      if (!touchStart.current || !touchEnd.current) return;
      const distance = touchStart.current - touchEnd.current;
      const isLeftSwipe = distance > 50;
      const isRightSwipe = distance < -50;

      if (isLeftSwipe && currentView === 'map') {
          setCurrentView('dashboard');
      }
      if (isRightSwipe && currentView === 'dashboard') {
          setCurrentView('map');
      }
      // Reset
      touchStart.current = 0;
      touchEnd.current = 0;
  };

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      analyzeImage(file);
  };

  return (
    <div 
        className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 lg:p-6 flex flex-col overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
    >
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-6 gap-4 flex-shrink-0">
            <div>
                <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tighter">SAVEPLACE <span className="text-indigo-600">AI</span></h1>
                <p className="text-[10px] lg:text-xs text-slate-500 font-medium">SISTEMA DE MONITORAMENTO INTELIGENTE</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <button 
                    onClick={() => setShowVolunteerModal(true)}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs font-bold text-slate-500 border border-slate-300 hover:bg-slate-100 whitespace-nowrap"
                    disabled={!activeProfile || !aiBriefing}
                >
                    DEMO: Voluntário
                </button>
                <button 
                    onClick={toggleConnection}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${connected ? 'bg-red-100 text-red-600' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'}`}
                >
                    {connected ? 'DESCONECTAR' : 'ATIVAR'}
                </button>
            </div>
        </header>

        {/* Responsive Grid: Auto height on mobile, fixed calc height on desktop for dashboard feel */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:overflow-hidden relative">
            
            {/* Left Col: Map */}
            <div className={`
                ${currentView === 'map' ? 'block' : 'hidden'} lg:block
                lg:col-span-2 bg-white rounded-2xl shadow-sm p-1 border border-slate-200 h-full relative overflow-hidden flex flex-col
            `}>
                <div className="flex-1 relative rounded-xl overflow-hidden">
                    <MapVisualizer profiles={profiles} zones={zones} isAlert={isEmergency} />
                    
                    {isEmergency && (
                    <div className="absolute top-2 right-2 lg:top-4 lg:right-4 bg-red-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg shadow-lg animate-pulse flex items-center gap-2 z-20">
                        <span className="font-bold text-xs lg:text-sm">⚠️ ALERTA DE SEGURANÇA</span>
                    </div>
                    )}
                </div>
            </div>

            {/* Right Col: Panels */}
            <div className={`
                ${currentView === 'dashboard' ? 'flex' : 'hidden'} lg:flex
                flex-col gap-4 h-full lg:overflow-y-auto pr-1 pb-16 lg:pb-0
            `}>
                <AssistantPanel isActive={connected} isListening={isListening} />

                {activeProfile && activeProfile.deviceType === 'SMARTWATCH' && (
                    <BioMonitorPanel 
                        profile={activeProfile} 
                        bioResult={bioResult} 
                        loading={analyzingBio}
                        onSimulate={simulateBioEvent}
                    />
                )}
                
                {/* Vision / Document Analysis Section */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
                        <span className="bg-indigo-100 text-indigo-600 p-1 rounded">👁️</span>
                        Olhos do Guardian (Vision)
                    </h3>
                    <div className="flex gap-2 mb-2">
                         <label className="flex-1 cursor-pointer bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold py-2 px-3 rounded text-center transition-colors">
                             📸 Analisar Foto/Recibo
                             <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                         </label>
                    </div>
                    {isAnalyzingImage && <p className="text-[10px] text-indigo-500 animate-pulse">Processando imagem com Gemini...</p>}
                    {visionAnalysis && (
                        <div className="bg-slate-50 p-2 rounded border border-slate-100 text-[10px] text-slate-600 max-h-20 overflow-y-auto">
                            {visionAnalysis}
                        </div>
                    )}
                </div>

                {/* List Container */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col flex-shrink-0">
                    <h2 className="text-sm font-bold text-slate-500 uppercase mb-4">Status da Família</h2>
                    
                    <div className="space-y-3 mb-4">
                        {profiles.map(p => (
                            <div 
                                key={p.id} 
                                onClick={() => setActiveProfile(p)}
                                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors
                                    ${activeProfile?.id === p.id ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${p.status === 'SAFE' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></div>
                                    <div>
                                        <p className="font-bold text-sm">{p.name}</p>
                                        <p className="text-[10px] text-slate-400">{p.type} • BPM: {p.heartRate}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded ${p.status === 'SAFE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    {p.status}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <AngelLinkPanel 
                            volunteers={volunteers} 
                            activeProfile={activeProfile} 
                            isEmergency={isEmergency} 
                            aiBriefing={aiBriefing} 
                        />
                    </div>
                </div>
            </div>
        </div>
        
        {/* Mobile Bottom Nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <button 
                onClick={() => setCurrentView('map')}
                className={`flex flex-col items-center gap-1 ${currentView === 'map' ? 'text-indigo-600' : 'text-slate-400'}`}
            >
                <span className="text-xl">🗺️</span>
                <span className="text-[10px] font-bold uppercase">Mapa</span>
            </button>
            <button 
                 onClick={() => setCurrentView('dashboard')}
                 className={`flex flex-col items-center gap-1 ${currentView === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}
            >
                <span className="text-xl">📊</span>
                <span className="text-[10px] font-bold uppercase">Painel</span>
            </button>
        </div>

        {/* Volunteer UX Simulation Modal */}
        {showVolunteerModal && activeProfile && aiBriefing && (
            <VolunteerCallModal 
                caller={activeProfile} 
                briefing={aiBriefing} 
                onClose={() => setShowVolunteerModal(false)} 
            />
        )}
    </div>
  );
};

export default App;