package com.saveplace.core.model

import java.util.Date

enum class ProfileType { CHILD, ELDERLY, PET, FRIEND, OBJECT }
enum class DeviceType { PHONE, GPS_TAG, SMARTWATCH }
enum class UserStatus { SAFE, DANGER, UNKNOWN, OFFLINE }
enum class StressLevel { LOW, MEDIUM, HIGH }

data class UserProfile(
    val id: String,
    val name: String,
    val type: ProfileType,
    val deviceType: DeviceType,
    val age: Int?,
    val medicalCondition: String?,
    var status: UserStatus,
    val location: Location,
    val batteryLevel: Int,
    val lastUpdate: Date,
    val speedMph: Double,
    val lastMovement: Date,
    val locationHistory: List<LocationHistoryPoint> = emptyList(),

    // Bio-Telemetry
    var heartRate: Int,
    val baselineHeartRate: Int,
    var stressLevel: StressLevel,
    var isFallDetected: Boolean
)

data class Location(
    val lat: Double,
    val lng: Double,
    val address: String? = null
)

data class LocationHistoryPoint(
    val lat: Double,
    val lng: Double,
    val timestamp: Date
)
