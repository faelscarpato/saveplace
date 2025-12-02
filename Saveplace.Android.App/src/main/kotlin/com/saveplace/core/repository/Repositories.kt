package com.saveplace.core.repository

import com.saveplace.core.model.UserProfile
import com.saveplace.core.model.VolunteerProfile
import com.saveplace.core.model.Zone

interface IUserProfileRepository {
    suspend fun getProfileById(id: String): UserProfile?
    suspend fun getAllProfiles(): List<UserProfile>
    suspend fun saveProfile(profile: UserProfile)
}

interface IZoneRepository {
    suspend fun getAllZones(): List<Zone>
}

interface IVolunteerRepository {
    suspend fun getAllVolunteers(): List<VolunteerProfile>
}
