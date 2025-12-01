import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, SafePlace, Zone, EmergencyPlan, VolunteerProfile, VolunteerBriefing, BioAnalysisResult } from './types';
import MapVisualizer from './components/MapVisualizer';
import AssistantPanel from './components/AssistantPanel';
import AngelLinkPanel from './components/AngelLinkPanel';
import VolunteerCallModal from './components/VolunteerCallModal';
import BioMonitorPanel from './components/BioMonitorPanel';
import { LiveClient } from './services/liveClient';
import { findSafePlaces, generateAlertAudio, analyzeImage, generateEmergencyPlan, generateVolunteerBriefing, analyzeBioTelemetry } from './services/geminiService';

const MOCK_PROFILES: UserProfile[] = [
  {
    id: '1',
    name: 'Vovô João',
    type: 'ELDERLY',
    deviceType: 'SMARTWATCH',
    age: 78,
    medicalCondition: 'Alzheimer Inicial',
    status: 'SAFE',
    location: { lat: 45, lng: 45 }, 
    batteryLevel: 85,
    lastUpdate: new Date(),
    speed: 2,
    lastMovement: new Date(),
    locationHistory: [{ lat: 45, lng: 45, timestamp: new Date() }],
    // Bio
    heartRate: 72,
    baselineHeartRate: 70,
    stressLevel: 'LOW',
    isFallDetected: false
  },
  {
    id: '2',
    name: 'Rex',
    type: 'PET',
    deviceType: 'GPS_TAG',
    age: 4,
    status: 'SAFE',
    location: { lat: 55, lng: 55 },
    batteryLevel: 90, 
    lastUpdate: new Date(),
    speed: 0,
    lastMovement: new Date(),
    locationHistory: [{ lat: 55, lng: 55, timestamp: new Date() }],
    // Bio (Mock defaults)
    heartRate: 80,
    baselineHeartRate: 80,
    stressLevel: 'LOW',
    isFallDetected: false
  },
  {
    id: '3',
    name: 'Sofia',
    type: 'CHILD',
    deviceType: 'SMARTWATCH',
    age: 8,
    status: 'SAFE',
    location: { lat: 50, lng: 50 },
    batteryLevel: 72,
    lastUpdate: new Date(),
    speed: 4,
    lastMovement: new Date(),
    locationHistory: [{ lat: 50, lng: 50, timestamp: new Date() }],
    // Bio
    heartRate: 90,
    baselineHeartRate: 85,
    stressLevel: 'LOW',
    isFallDetected: false
  }
];

const MOCK_ZONES: Zone[] = [
  { id: 'z1', name: 'Casa', lat: 50, lng: 50, radius: 15 },
  { id: 'z2', name: 'Escola', lat: 20, lng: 80, radius: 10 }
];

const MOCK_VOLUNTEERS: VolunteerProfile[] = [
  { id: 'v1', name: 'Dr. Silva', skills: ['Médico'], isOnline: true, distance: '0.5km', rating: 4.8 },
  { id: 'v2', name: 'Ana Vizinha', skills: ['Vizinho', 'Familiar'], isOnline: true, distance: '0.1km', rating: 5.0 },
  { id: 'v3', name: 'Sgt. Souza', skills: ['Geral'], isOnline: false, distance: '1.2km', rating: 4.5 }
];

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>(MOCK_PROFILES);
  const [zones] = useState<Zone[]>(MOCK_ZONES);
  const [isListening, setIsListening] = useState(false);
  const [connected, setConnected] = useState(false);
  const [volunteers] = useState<VolunteerProfile[]>(MOCK_VOLUNTEERS);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(MOCK_PROFILES[0]); 
  const [aiBriefing, setAiBriefing] = useState<VolunteerBriefing | null>(null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  
  // Bio Analysis State
  const [bioResult, setBioResult] = useState<BioAnalysisResult | null>(null);
  const [analyzingBio, setAnalyzingBio] = useState(false);
  
  // Vision State
  const [visionAnalysis, setVisionAnalysis] = useState<string>('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  // Mobile Nav State
  const [currentView, setCurrentView] = useState<'map' | 'dashboard'>('map');

  const liveClientRef = useRef<LiveClient | null>(null);

  useEffect(() => {
    liveClientRef.current = new LiveClient({
      onOpen: () => {
        setConnected(true);
        setIsListening(true);
      },
      onClose: () => {
        setConnected(false);
        setIsListening(false);
      },
      onAudioData: (buffer) => {
        playAudioBuffer(buffer);
      },
      onError: (err) => {
          console.error("Live Client Error:", err);
          setConnected(false);
          setIsListening(false);
          alert("Erro de conexão. Verifique permissões de microfone.");
      }
    });

    return () => {
      liveClientRef.current?.disconnect();
    };
  }, []);

  const playAudioBuffer = async (buffer: AudioBuffer) => {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
  };

  const toggleConnection = () => {
    if (connected) {
      liveClientRef.current?.disconnect();
    } else {
      liveClientRef.current?.connect();
    }
  };

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

  // Simulate movement (and minor HR fluctuation)
  useEffect(() => {
    const interval = setInterval(() => {
        setProfiles(prev => prev.map(p => {
            // Only simulate movement if not in a critical bio state for demo purposes
            if (p.isFallDetected) return p; 

            const moveLat = (Math.random() - 0.5) * 2; 
            const moveLng = (Math.random() - 0.5) * 2;
            
            let newLat = Math.max(0, Math.min(100, p.location.lat + moveLat));
            let newLng = Math.max(0, Math.min(100, p.location.lng + moveLng));

            // Logic to trigger danger for demo (if far from center)
            const distFromCenter = Math.sqrt(Math.pow(newLat - 50, 2) + Math.pow(newLng - 50, 2));
            const newStatus = distFromCenter > 40 && !isEmergency ? 'DANGER' : p.status;

            return {
                ...p,
                location: { lat: newLat, lng: newLng },
                status: newStatus,
                locationHistory: [...p.locationHistory, { lat: newLat, lng: newLng, timestamp: new Date() }].slice(-20),
                // Slight HR noise
                heartRate: p.stressLevel === 'HIGH' ? p.heartRate : p.baselineHeartRate + Math.floor(Math.random() * 5 - 2)
            };
        }));
    }, 2000);
    return () => clearInterval(interval);
  }, [isEmergency]);

  // Monitor for danger changes to trigger alerts
  useEffect(() => {
      const dangerProfile = profiles.find(p => p.status === 'DANGER');
      if (dangerProfile && !isEmergency) {
          handleEmergency(dangerProfile);
      } else if (!dangerProfile && isEmergency) {
          // Reset logic handled elsewhere
      }
  }, [profiles, isEmergency]);

  const handleEmergency = async (p: UserProfile, forcedBioResult?: BioAnalysisResult) => {
      if(isEmergency) return; // Prevent double trigger
      setIsEmergency(true);
      setActiveProfile(p);
      
      try {
        const instruction = forcedBioResult?.recommended_action.voice_message_to_user 
            || "Você saiu da zona segura.";

        const audio = await generateAlertAudio(p.name, p.type, instruction);
        if (audio) playAudioBuffer(audio);

        const nearbyPOIs = ["Parque da Cidade (Leste)", "Av. Movimentada a 200m"];
        const briefing = await generateVolunteerBriefing(p, p.location, nearbyPOIs);
        setAiBriefing(briefing);
        setTimeout(() => setShowVolunteerModal(true), 1500);
      } catch (e) {
          console.error("Error generating emergency assets", e);
      }
  };

  // Logic to simulate bio-events
  const simulateBioEvent = async (type: 'PANIC' | 'FALL' | 'NORMAL') => {
      if (!activeProfile) return;

      let updatedProfile = { ...activeProfile };

      if (type === 'PANIC') {
          updatedProfile.heartRate = 145;
          updatedProfile.stressLevel = 'HIGH';
          updatedProfile.speed = 0; // Frozen
          updatedProfile.isFallDetected = false;
      } else if (type === 'FALL') {
          updatedProfile.heartRate = 110; // Stress from fall
          updatedProfile.stressLevel = 'HIGH';
          updatedProfile.speed = 0;
          updatedProfile.isFallDetected = true;
      } else {
          updatedProfile.heartRate = updatedProfile.baselineHeartRate;
          updatedProfile.stressLevel = 'LOW';
          updatedProfile.isFallDetected = false;
          setBioResult(null);
          setIsEmergency(false);
          setShowVolunteerModal(false);
          setAiBriefing(null);
      }

      // Update state
      setProfiles(prev => prev.map(p => p.id === activeProfile.id ? updatedProfile : p));
      setActiveProfile(updatedProfile);

      if (type !== 'NORMAL') {
          setAnalyzingBio(true);
          const result = await analyzeBioTelemetry(updatedProfile, "Parque Central (Local Conhecido)");
          setBioResult(result);
          setAnalyzingBio(false);

          if (result.analysis.status === 'ALERTA_VERMELHO') {
              handleEmergency(updatedProfile, result);
          }
      }
  };

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsAnalyzingImage(true);
      setVisionAnalysis("");
      
      const reader = new FileReader();
      reader.onloadend = async () => {
          const base64String = (reader.result as string).split(',')[1];
          const result = await analyzeImage(base64String, file.type);
          setVisionAnalysis(result || "Não foi possível analisar.");
          setIsAnalyzingImage(false);
      };
      reader.readAsDataURL(file);
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