
// Entities
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
  radius: number;
}

export type ProfileType = 'CHILD' | 'ELDERLY' | 'FRIEND' | 'PET' | 'OBJECT';
export type DeviceType = 'PHONE' | 'GPS_TAG' | 'SMARTWATCH';
export type ProfileStatus = 'SAFE' | 'DANGER' | 'UNKNOWN' | 'OFFLINE';

export interface UserProfile {
  id: string;
  name: string;
  type: ProfileType;
  deviceType: DeviceType;
  age?: number;
  medicalCondition?: string;
  status: ProfileStatus;
  location: Location;
  batteryLevel: number;
  lastUpdate: Date;
  speed: number;
  lastMovement: Date;
  locationHistory: LocationHistoryPoint[];
  
  // Bio-Telemetry
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
  nearbyContext: string[];
  actionSteps: string[];
}

// Volunteer Domain
export type VolunteerSkill = 'Médico' | 'Psicólogo' | 'Familiar' | 'Vizinho' | 'Geral';

export interface VolunteerProfile {
  id: string;
  name: string;
  skills: VolunteerSkill[]; 
  isOnline: boolean;
  distance: string;
  rating: number;
  languages?: string[];
}

export interface VolunteerBriefing {
  summary: string;
  suggested_opening: string;
  safety_warning: string;
}

// Analysis Domain
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
