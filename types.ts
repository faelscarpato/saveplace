
export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface LocationHistoryPoint {
  lat: number;
  lng: number;
  timestamp: Date;
}

export interface Zone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // percentage of map width for simulation
}

export type ProfileType = 'CHILD' | 'ELDERLY' | 'FRIEND' | 'PET' | 'OBJECT';
export type DeviceType = 'PHONE' | 'GPS_TAG' | 'SMARTWATCH';

export interface UserProfile {
  id: string;
  name: string;
  type: ProfileType;
  deviceType: DeviceType;
  age?: number;
  medicalCondition?: string; // e.g., "Alzheimer", "Diabetic", "Autism"
  status: 'SAFE' | 'DANGER' | 'UNKNOWN' | 'OFFLINE';
  location: Location;
  batteryLevel: number;
  lastUpdate: Date;
  speed: number; // mph
  lastMovement: Date;
  locationHistory: LocationHistoryPoint[];
  
  // Bio-Telemetry (New)
  heartRate: number;
  baselineHeartRate: number;
  stressLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  isFallDetected: boolean;
}

export interface SafePlace {
  name: string;
  address: string;
  type: string;
  distance: string;
}

export interface EmergencyPlan {
  summary: string;
  nearbyContext: string[]; // "Bank with cameras nearby", "Bus stop 50m away"
  actionSteps: string[];
}

// --- Angel Link / Volunteer System ---

export type VolunteerSkill = 'Médico' | 'Psicólogo' | 'Familiar' | 'Vizinho' | 'Geral';

export interface VolunteerProfile {
  id: string;
  name: string;
  skills: VolunteerSkill[]; 
  isOnline: boolean;
  distance: string; // Simulated distance for UI
  rating: number;
  languages?: string[];
}

export interface VolunteerBriefing {
  summary: string;
  suggested_opening: string;
  safety_warning: string;
}

export interface HelpRequest {
  id: string;
  requesterId: string;
  location: Location;
  timestamp: Date;
  urgencyLevel: 'Informativo' | 'Baixo' | 'Alto';
  aiBriefing?: VolunteerBriefing; 
}

// --- Bio Analyst ---

export interface BioAnalysisResult {
  analysis: {
    status: 'NORMAL' | 'ALERTA_AMARELO' | 'ALERTA_VERMELHO';
    probability_score: number;
    reasoning: string;
  };
  recommended_action: {
    trigger_alarm: boolean;
    contact_volunteer: boolean;
    voice_message_to_user: string;
  };
}
