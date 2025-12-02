package com.saveplace.data.persistence

import com.saveplace.core.model.*
import com.saveplace.core.repository.IUserProfileRepository
import com.saveplace.core.repository.IVolunteerRepository
import com.saveplace.core.repository.IZoneRepository
import kotlinx.coroutines.delay
import java.util.Date

// Implementação de repositório em memória para desenvolvimento e testes.
class MockRepository : IUserProfileRepository, IZoneRepository, IVolunteerRepository {

    companion object {
        private val profiles = mutableListOf(
            UserProfile(
                id = "1", name = "Vovô João", type = ProfileType.ELDERLY, deviceType = DeviceType.SMARTWATCH, age = 78,
                medicalCondition = "Alzheimer Inicial", status = UserStatus.SAFE,
                location = Location(lat = 45.0, lng = 45.0), batteryLevel = 85, lastUpdate = Date(), speedMph = 1.0,
                lastMovement = Date(), heartRate = 72, baselineHeartRate = 70, stressLevel = StressLevel.LOW, isFallDetected = false
            ),
            UserProfile(
                id = "2", name = "Rex", type = ProfileType.PET, deviceType = DeviceType.GPS_TAG, age = 4, medicalCondition = null,
                status = UserStatus.SAFE, location = Location(lat = 55.0, lng = 55.0), batteryLevel = 90,
                lastUpdate = Date(), speedMph = 0.0, lastMovement = Date(), heartRate = 80,
                baselineHeartRate = 80, stressLevel = StressLevel.LOW, isFallDetected = false
            ),
            UserProfile(
                id = "3", name = "Sofia", type = ProfileType.CHILD, deviceType = DeviceType.SMARTWATCH, age = 8, medicalCondition = null,
                status = UserStatus.SAFE, location = Location(lat = 50.0, lng = 50.0), batteryLevel = 72,
                lastUpdate = Date(), speedMph = 2.0, lastMovement = Date(), heartRate = 90,
                baselineHeartRate = 85, stressLevel = StressLevel.LOW, isFallDetected = false
            )
        )

        private val zones = listOf(
            Zone(id = "z1", name = "Casa", lat = 50.0, lng = 50.0, radius = 15.0),
            Zone(id = "z2", name = "Escola", lat = 20.0, lng = 80.0, radius = 10.0)
        )

        private val volunteers = listOf(
            VolunteerProfile(id = "v1", name = "Dr. Silva", skills = listOf(VolunteerSkill.MEDICO), isOnline = true, distance = "0.5km", rating = 4.8),
            VolunteerProfile(id = "v2", name = "Ana Vizinha", skills = listOf(VolunteerSkill.VIZINHO, VolunteerSkill.FAMILIAR), isOnline = true, distance = "0.1km", rating = 5.0),
            VolunteerProfile(id = "v3", name = "Sgt. Souza", skills = listOf(VolunteerSkill.GERAL), isOnline = false, distance = "1.2km", rating = 4.5)
        )
    }

    override suspend fun getProfileById(id: String): UserProfile? {
        delay(10)
        return profiles.find { it.id == id }
    }

    override suspend fun getAllProfiles(): List<UserProfile> {
        delay(10)
        return profiles
    }

    override suspend fun saveProfile(profile: UserProfile) {
        delay(10)
        val index = profiles.indexOfFirst { it.id == profile.id }
        if (index != -1) {
            profiles[index] = profile
        } else {
            profiles.add(profile)
        }
    }

    override suspend fun getAllZones(): List<Zone> {
        delay(10)
        return zones
    }

    override suspend fun getAllVolunteers(): List<VolunteerProfile> {
        delay(10)
        return volunteers
    }
}
