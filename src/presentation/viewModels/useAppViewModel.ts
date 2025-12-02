
import { useState, useEffect, useRef } from 'react';
import { UserProfile, Zone, VolunteerProfile, BioAnalysisResult, VolunteerBriefing } from '../../domain/entities/types';
import { MonitorProfilesUseCase } from '../../application/useCases/MonitorProfilesUseCase';
import { geminiService } from '../../infrastructure/services/geminiService';
import { LiveClient } from '../../infrastructure/services/liveClient';

const monitorProfilesUseCase = new MonitorProfilesUseCase();

// Initial MOCK DATA
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

export const useAppViewModel = () => {
    const [profiles, setProfiles] = useState<UserProfile[]>(MOCK_PROFILES);
    const [zones] = useState<Zone[]>(MOCK_ZONES);
    const [volunteers] = useState<VolunteerProfile[]>(MOCK_VOLUNTEERS);
    const [activeProfile, setActiveProfile] = useState<UserProfile | null>(MOCK_PROFILES[0]);
    const [isEmergency, setIsEmergency] = useState(false);

    // Connection State
    const [isListening, setIsListening] = useState(false);
    const [connected, setConnected] = useState(false);
    const liveClientRef = useRef<LiveClient | null>(null);

    // Feature State
    const [bioResult, setBioResult] = useState<BioAnalysisResult | null>(null);
    const [analyzingBio, setAnalyzingBio] = useState(false);
    const [aiBriefing, setAiBriefing] = useState<VolunteerBriefing | null>(null);
    const [showVolunteerModal, setShowVolunteerModal] = useState(false);
    const [visionAnalysis, setVisionAnalysis] = useState<string>('');
    const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

    // Audio Playback
    const playAudioBuffer = async (buffer: AudioBuffer) => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
    };

    // Initialize Connection
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

    const toggleConnection = () => {
        if (connected) {
            liveClientRef.current?.disconnect();
        } else {
            liveClientRef.current?.connect();
        }
    };

    // Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setProfiles(prevProfiles => monitorProfilesUseCase.execute(prevProfiles));
        }, 2000);
        return () => clearInterval(interval);
    }, [isEmergency]);

    // Danger Monitor
    useEffect(() => {
        const dangerProfile = profiles.find(p => p.status === 'DANGER');
        if (dangerProfile && !isEmergency) {
            handleEmergency(dangerProfile);
        }
    }, [profiles, isEmergency]);

    // Actions
    const handleEmergency = async (p: UserProfile, forcedBioResult?: BioAnalysisResult) => {
        if(isEmergency) return;
        setIsEmergency(true);
        setActiveProfile(p);

        try {
            const instruction = forcedBioResult?.recommended_action.voice_message_to_user
                || "Você saiu da zona segura.";

            const audio = await geminiService.generateAlertAudio(p.name, p.type, instruction);
            if (audio) playAudioBuffer(audio);

            const nearbyPOIs = ["Parque da Cidade (Leste)", "Av. Movimentada a 200m"];
            const briefing = await geminiService.generateVolunteerBriefing(p, p.location, nearbyPOIs);
            setAiBriefing(briefing);
            setTimeout(() => setShowVolunteerModal(true), 1500);
        } catch (e) {
            console.error("Error generating emergency assets", e);
        }
    };

    const simulateBioEvent = async (type: 'PANIC' | 'FALL' | 'NORMAL') => {
        if (!activeProfile) return;

        let updatedProfile = { ...activeProfile };

        if (type === 'PANIC') {
            updatedProfile.heartRate = 145;
            updatedProfile.stressLevel = 'HIGH';
            updatedProfile.speed = 0;
            updatedProfile.isFallDetected = false;
        } else if (type === 'FALL') {
            updatedProfile.heartRate = 110;
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

        setProfiles(prev => prev.map(p => p.id === activeProfile.id ? updatedProfile : p));
        setActiveProfile(updatedProfile);

        if (type !== 'NORMAL') {
            setAnalyzingBio(true);
            const result = await geminiService.analyzeBioTelemetry(updatedProfile, "Parque Central (Local Conhecido)");
            setBioResult(result);
            setAnalyzingBio(false);

            if (result.analysis.status === 'ALERTA_VERMELHO') {
                handleEmergency(updatedProfile, result);
            }
        }
    };

    const analyzeImage = async (file: File) => {
        setIsAnalyzingImage(true);
        setVisionAnalysis("");

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = (reader.result as string).split(',')[1];
            const result = await geminiService.analyzeImage(base64String, file.type);
            setVisionAnalysis(result || "Não foi possível analisar.");
            setIsAnalyzingImage(false);
        };
        reader.readAsDataURL(file);
    };

    return {
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
    };
};
