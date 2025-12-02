package com.saveplace.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.Map
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.saveplace.ui.theme.SaveplaceTheme
import com.saveplace.ui.viewmodel.MainViewModel
import com.saveplace.core.model.UserProfile
import com.saveplace.ui.components.BioMonitorCard
import com.saveplace.ui.components.FamilyStatusCard
import com.saveplace.ui.components.AngelLinkCard

@Composable
fun MainScreen(viewModel: MainViewModel) {
    // Coleta o estado do ViewModel. O 'collectAsState' garante que a UI
    // se recomponha automaticamente sempre que o estado mudar.
    val uiState by viewModel.uiState.collectAsState()
    var selectedTab by remember { mutableStateOf("Mapa") }

    SaveplaceTheme {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = { Text("Saveplace AI", fontWeight = FontWeight.Bold) },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = MaterialTheme.colorScheme.surface
                    )
                )
            },
            bottomBar = {
                NavigationBar {
                    NavigationBarItem(
                        icon = { Icon(Icons.Default.Map, contentDescription = "Mapa") },
                        label = { Text("Mapa") },
                        selected = selectedTab == "Mapa",
                        onClick = { selectedTab = "Mapa" }
                    )
                    NavigationBarItem(
                        icon = { Icon(Icons.Default.Dashboard, contentDescription = "Painel") },
                        label = { Text("Painel") },
                        selected = selectedTab == "Painel",
                        onClick = { selectedTab = "Painel" }
                    )
                }
            }
        ) { paddingValues ->
            Box(modifier = Modifier.padding(paddingValues)) {
                if (uiState.isLoading) {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
                } else {
                    when (selectedTab) {
                        "Mapa" -> MapContent(isEmergency = uiState.isEmergency)
                        "Painel" -> DashboardContent(
                            profiles = uiState.profiles,
                            activeProfile = uiState.activeProfile,
                            viewModel = viewModel
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun MapContent(isEmergency: Boolean) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("[SIMULAÇÃO DE MAPA]", color = Color.Gray)
        if (isEmergency) {
            Card(
                modifier = Modifier.align(Alignment.TopCenter).padding(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.error)
            ) {
                Text(
                    text = "⚠️ ALERTA DE SEGURANÇA ATIVO",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                )
            }
        }
    }
}

@Composable
fun DashboardContent(
    profiles: List<UserProfile>,
    activeProfile: UserProfile?,
    viewModel: MainViewModel
) {
    val uiState by viewModel.uiState.collectAsState()

    Column(modifier = Modifier.padding(16.dp).fillMaxSize()) {
        FamilyStatusCard(
            profiles = profiles,
            activeProfile = activeProfile,
            onProfileSelected = { viewModel.selectProfile(it) }
        )
        Spacer(modifier = Modifier.height(16.dp))

        activeProfile?.let { profile ->
            if (profile.deviceType == com.saveplace.core.model.DeviceType.SMARTWATCH) {
                BioMonitorCard(
                    profile = profile,
                    bioAnalysis = uiState.bioAnalysis,
                    onSimulateEmergency = { viewModel.simulateEmergency() },
                    onNormalize = { viewModel.normalizeSituation() }
                )
                Spacer(modifier = Modifier.height(16.dp))
            }

            AngelLinkCard(
                volunteers = uiState.volunteers,
                briefing = uiState.volunteerBriefing,
                isEmergency = uiState.isEmergency
            )
        }
    }
}
