
import { SafePlace, UserProfile, EmergencyPlan, VolunteerBriefing, Location, BioAnalysisResult } from "../entities/types";

export interface IGeminiService {
    generateAlertAudio(name: string, type: string, instruction: string): Promise<AudioBuffer | null>;
    findSafePlaces(lat: number, lng: number): Promise<SafePlace[]>;
    generateEmergencyPlan(profile: UserProfile): Promise<EmergencyPlan>;
    analyzeImage(base64Data: string, mimeType: string): Promise<string>;
    generateVolunteerBriefing(profile: UserProfile, location: Location, nearbyPOIs: string[]): Promise<VolunteerBriefing>;
    analyzeBioTelemetry(profile: UserProfile, locationType: string): Promise<BioAnalysisResult>;
}
