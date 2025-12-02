package com.saveplace.core.model

enum class VolunteerSkill { MEDICO, PSICOLOGO, FAMILIAR, VIZINHO, GERAL }
enum class AnalysisStatus { NORMAL, ALERTA_AMARELO, ALERTA_VERMELHO }

data class Zone(
    val id: String,
    val name: String,
    val lat: Double,
    val lng: Double,
    val radius: Double
)

data class VolunteerProfile(
    val id: String,
    val name: String,
    val skills: List<VolunteerSkill> = emptyList(),
    val isOnline: Boolean,
    val distance: String,
    val rating: Double
)

// --- AI Service Models ---

data class VolunteerBriefing(
    val summary: String,
    val suggestedOpening: String,
    val safetyWarning: String
)

data class BioAnalysisResult(
    val analysis: AnalysisDetails,
    val recommendedAction: RecommendedAction
)

data class AnalysisDetails(
    val status: AnalysisStatus,
    val probabilityScore: Double,
    val reasoning: String
)

data class RecommendedAction(
    val triggerAlarm: Boolean,
    val contactVolunteer: Boolean,
    val voiceMessageToUser: String
)
