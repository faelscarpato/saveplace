package com.saveplace.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.saveplace.core.model.*
import com.saveplace.core.repository.IUserProfileRepository
import com.saveplace.core.repository.IVolunteerRepository
import com.saveplace.core.service.GeminiService
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

// Data class para conter todo o estado da nossa UI
data class MainUiState(
    val profiles: List<UserProfile> = emptyList(),
    val volunteers: List<VolunteerProfile> = emptyList(),
    val activeProfile: UserProfile? = null,
    val isEmergency: Boolean = false,
    val bioAnalysis: BioAnalysisResult? = null,
    val volunteerBriefing: VolunteerBriefing? = null,
    val isAnalyzing: Boolean = false,
    val isLoading: Boolean = true
)

class MainViewModel(
    private val profileRepository: IUserProfileRepository,
    private val volunteerRepository: IVolunteerRepository,
    private val geminiService: GeminiService
) : ViewModel() {

    // _uiState é privado e mutável, apenas o ViewModel pode alterá-lo.
    private val _uiState = MutableStateFlow(MainUiState())
    // uiState é público e imutável, a UI apenas o observa.
    val uiState: StateFlow<MainUiState> = _uiState.asStateFlow()

    init {
        loadInitialData()
    }

    private fun loadInitialData() {
        viewModelScope.launch {
            val profiles = profileRepository.getAllProfiles()
            val volunteers = volunteerRepository.getAllVolunteers()
            _uiState.update {
                it.copy(
                    profiles = profiles,
                    volunteers = volunteers,
                    activeProfile = profiles.firstOrNull(),
                    isLoading = false
                )
            }
        }
    }

    fun selectProfile(profile: UserProfile) {
        _uiState.update {
            it.copy(
                activeProfile = profile,
                isEmergency = false,
                bioAnalysis = null,
                volunteerBriefing = null
            )
        }
    }

    fun simulateEmergency() {
        val activeProfile = _uiState.value.activeProfile ?: return

        viewModelScope.launch {
            _uiState.update { it.copy(isAnalyzing = true, isEmergency = true) }

            // Simula uma alteração nos dados do perfil
            activeProfile.status = UserStatus.DANGER
            activeProfile.heartRate = 140
            activeProfile.stressLevel = StressLevel.HIGH

            val analysis = geminiService.analyzeBioTelemetry(activeProfile)
            val briefing = geminiService.generateVolunteerBriefing(activeProfile, activeProfile.location)

            _uiState.update {
                it.copy(
                    bioAnalysis = analysis,
                    volunteerBriefing = briefing,
                    isAnalyzing = false
                )
            }
        }
    }

    fun normalizeSituation() {
        val activeProfile = _uiState.value.activeProfile ?: return

        activeProfile.status = UserStatus.SAFE
        activeProfile.heartRate = activeProfile.baselineHeartRate
        activeProfile.stressLevel = StressLevel.LOW

        _uiState.update {
            it.copy(
                isEmergency = false,
                bioAnalysis = null,
                volunteerBriefing = null
            )
        }
    }
}
