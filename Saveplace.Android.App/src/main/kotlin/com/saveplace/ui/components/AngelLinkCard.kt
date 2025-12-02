package com.saveplace.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.saveplace.core.model.VolunteerBriefing
import com.saveplace.core.model.VolunteerProfile

@Composable
fun AngelLinkCard(
    volunteers: List<VolunteerProfile>,
    briefing: VolunteerBriefing?,
    isEmergency: Boolean
) {
    Card {
        Column(modifier = Modifier.padding(16.dp).fillMaxWidth()) {
            Text("Angel Link (Rede de Apoio)", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))

            LazyRow(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                items(volunteers) { volunteer ->
                    VolunteerItem(volunteer)
                }
            }

            AnimatedVisibility(visible = isEmergency && briefing != null) {
                briefing?.let {
                    Divider(modifier = Modifier.padding(vertical = 12.dp))
                    Text("Briefing da IA:", fontWeight = FontWeight.SemiBold)
                    Text("\"${it.suggestedOpening}\"", style = MaterialTheme.typography.bodySmall)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Aviso: ${it.safetyWarning}", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.error)
                }
            }
        }
    }
}

@Composable
fun VolunteerItem(volunteer: VolunteerProfile) {
    Column(horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally) {
        Text(if (volunteer.isOnline) "🟢" else "⚪️", fontSize = androidx.compose.ui.unit.sp.Companion.sp(24))
        Text(volunteer.name, style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.SemiBold)
        Text(volunteer.distance, style = MaterialTheme.typography.labelSmall)
    }
}
