package com.saveplace.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.saveplace.core.model.BioAnalysisResult
import com.saveplace.core.model.UserProfile

@Composable
fun BioMonitorCard(
    profile: UserProfile,
    bioAnalysis: BioAnalysisResult?,
    onSimulateEmergency: () -> Unit,
    onNormalize: () -> Unit
) {
    Card {
        Column(modifier = Modifier.padding(16.dp).fillMaxWidth()) {
            Text("Saveplace Bio-Link", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(16.dp))

            Row(horizontalArrangement = Arrangement.SpaceAround, modifier = Modifier.fillMaxWidth()) {
                MetricDisplay("BPM", profile.heartRate.toString())
                MetricDisplay("Estresse", profile.stressLevel.name)
                MetricDisplay("Queda", if (profile.isFallDetected) "SIM" else "NÃO")
            }

            AnimatedVisibility(visible = bioAnalysis != null) {
                bioAnalysis?.let {
                    Divider(modifier = Modifier.padding(vertical = 12.dp))
                    Text("Análise da IA:", fontWeight = FontWeight.SemiBold)
                    Text(it.analysis.reasoning, style = MaterialTheme.typography.bodySmall)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(onClick = onSimulateEmergency, modifier = Modifier.weight(1f)) {
                    Text("Simular Emergência")
                }
                OutlinedButton(onClick = onNormalize, modifier = Modifier.weight(1f)) {
                    Text("Normalizar")
                }
            }
        }
    }
}

@Composable
fun MetricDisplay(label: String, value: String) {
    Column(horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally) {
        Text(label, style = MaterialTheme.typography.labelSmall)
        Text(value, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
    }
}
