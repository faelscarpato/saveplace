package com.saveplace.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Paleta de cores para o tema claro
private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF4F46E5), // Indigo
    onPrimary = Color.White,
    secondary = Color(0xFF64748B), // Slate
    background = Color(0xFFF1F5F9), // Slate 50
    surface = Color.White,
    error = Color(0xFFEF4444), // Red
    onSurface = Color(0xFF1E293B), // Slate 800 for text
)

// (Opcional) Paleta de cores para o tema escuro
private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF818CF8), // Indigo Light
    onPrimary = Color(0xFF1E293B),
    secondary = Color(0xFF94A3B8), // Slate Light
    background = Color(0xFF0F172A), // Slate 950
    surface = Color(0xFF1E293B), // Slate 800
    error = Color(0xFFF87171), // Red Light
    onSurface = Color(0xFFE2E8F0), // Slate 200 for text
)

@Composable
fun SaveplaceTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography(), // Usando a tipografia padrão do Material
        shapes = Shapes(),       // Usando as formas padrão (cantos arredondados)
        content = content
    )
}
