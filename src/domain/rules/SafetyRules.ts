
import { UserProfile, Zone } from "../entities/types";

export const isProfileInDanger = (profile: UserProfile, zones: Zone[]): boolean => {
    // Logic: If user is far from all zones, they might be in danger.
    // Ideally this would check if inside ANY zone.
    // For simplicity of the original logic: "distFromCenter > 40" was the mock rule.
    // We will implement a proper check here.

    // Default fallback to keep original mock behavior if no zones provided
    if (zones.length === 0) {
        return false;
    }

    // Check if inside at least one zone
    const isSafe = zones.some(zone => {
        const distance = Math.sqrt(
            Math.pow(profile.location.lat - zone.lat, 2) +
            Math.pow(profile.location.lng - zone.lng, 2)
        );
        return distance <= zone.radius;
    });

    return !isSafe;
};
