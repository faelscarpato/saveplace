
import { UserProfile } from "../../domain/entities/types";

// Business Logic for Profile Monitoring (Simulation)
export class MonitorProfilesUseCase {
    execute(profiles: UserProfile[]): UserProfile[] {
        return profiles.map(p => {
             // Only simulate movement if not in a critical bio state
             if (p.isFallDetected) return p;

             const moveLat = (Math.random() - 0.5) * 2;
             const moveLng = (Math.random() - 0.5) * 2;

             let newLat = Math.max(0, Math.min(100, p.location.lat + moveLat));
             let newLng = Math.max(0, Math.min(100, p.location.lng + moveLng));

             // Check danger (simplistic mock logic preserved from original App.tsx)
             const distFromCenter = Math.sqrt(Math.pow(newLat - 50, 2) + Math.pow(newLng - 50, 2));
             // Note: In real app, we would use SafetyRules.ts here, but we are preserving behavior.
             const newStatus = distFromCenter > 40 && p.status !== 'DANGER' ? 'DANGER' : p.status;

             return {
                 ...p,
                 location: { lat: newLat, lng: newLng },
                 status: newStatus as any, // Cast to avoid TS error with string vs enum
                 locationHistory: [...p.locationHistory, { lat: newLat, lng: newLng, timestamp: new Date() }].slice(-20),
                 heartRate: p.stressLevel === 'HIGH' ? p.heartRate : p.baselineHeartRate + Math.floor(Math.random() * 5 - 2)
             };
        });
    }
}
