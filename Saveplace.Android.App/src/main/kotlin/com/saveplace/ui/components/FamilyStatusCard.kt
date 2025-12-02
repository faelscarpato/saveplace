package com.saveplace.ui.components

import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.saveplace.core.model.UserProfile
import com.saveplace.core.model.UserStatus

@Composable
fun FamilyStatusCard(
    profiles: List<UserProfile>,
    activeProfile: UserProfile?,
    onProfileSelected: (UserProfile) -> Unit
) {
    Card {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Status da Família", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))

            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(profiles) { profile ->
                    ProfileListItem(
                        profile = profile,
                        isSelected = profile.id == activeProfile?.id,
                        onClick = { onProfileSelected(profile) }
                    )
                }
            }
        }
    }
}

@Composable
fun ProfileListItem(
    profile: UserProfile,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val backgroundColor = if (isSelected) MaterialTheme.colorScheme.primary.copy(alpha = 0.1f) else Color.Transparent
    val borderColor = if (isSelected) MaterialTheme.colorScheme.primary else Color.LightGray

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, borderColor, MaterialTheme.shapes.medium)
            .clickable(onClick = onClick)
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(10.dp)
                .padding(end = 8.dp)
                //.background(if (profile.status == UserStatus.SAFE) Color.Green else Color.Red, CircleShape)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(profile.name, fontWeight = FontWeight.Bold)
            Text("${profile.type} • BPM: ${profile.heartRate}", fontSize = 12.sp, color = Color.Gray)
        }
        Text(
            profile.status.name,
            fontSize = 10.sp,
            color = if (profile.status == UserStatus.SAFE) Color(0xFF16A34A) else MaterialTheme.colorScheme.error,
            fontWeight = FontWeight.Bold
        )
    }
}
