package com.saveplace.core.service

import com.saveplace.core.model.*
import kotlinx.coroutines.delay

/**
 * Encapsula a lógica de negócio para interagir com a API do Google Gemini.
 *
 * NOTA DE ARQUITETURA:
 * Esta biblioteca Core é específica para a plataforma Android (Kotlin). Uma biblioteca
 * espelhada existe no projeto Windows (.NET). Esta duplicação foi uma decisão
 * pragmática para acelerar o desenvolvimento inicial em stacks nativas separadas.
 *
 * Para evoluções futuras, a abordagem ideal seria unificar a lógica de negócio
 * em uma única base de código compartilhada usando Kotlin Multiplatform (KMP).
 * Isso eliminaria a duplicação e garantiria consistência entre as plataformas.
 */
class GeminiService(
    // Em um app real, injetaríamos um cliente Retrofit aqui.
    private val apiKey: String
) {
    // NOTA: Os métodos abaixo são simulações da interação com a API Gemini,
    // retornando dados mockados para fins de demonstração.

    suspend fun analyzeBioTelemetry(profile: UserProfile, locationType: String = "Desconhecido"): BioAnalysisResult {
        delay(1500) // Simula a latência da rede

        if (profile.isFallDetected) {
            return BioAnalysisResult(
                analysis = AnalysisDetails(AnalysisStatus.ALERTA_VERMELHO, 98.0, "Queda detectada pelo acelerômetro. Batimento cardíaco elevado consistente com estresse pós-queda."),
                recommendedAction = RecommendedAction(true, true, "${profile.name}, detectamos uma queda. A ajuda está a caminho. Fique calmo.")
            )
        }

        if (profile.stressLevel == StressLevel.HIGH && profile.heartRate > 130) {
            return BioAnalysisResult(
                analysis = AnalysisDetails(AnalysisStatus.ALERTA_AMARELO, 85.0, "Frequência cardíaca muito elevada enquanto o usuário está parado. Pode indicar um ataque de pânico ou coação."),
                recommendedAction = RecommendedAction(false, true, "${profile.name}, tudo bem? Notei que seu coração está um pouco acelerado. Quer conversar com alguém?")
            )
        }

        return BioAnalysisResult(
            analysis = AnalysisDetails(AnalysisStatus.NORMAL, 10.0, "Sinais vitais estáveis e consistentes com a atividade atual."),
            recommendedAction = RecommendedAction(false, false, "")
        )
    }

    suspend fun generateVolunteerBriefing(profile: UserProfile, location: Location): VolunteerBriefing {
        delay(1000)

        return VolunteerBriefing(
            summary = "PERFIL: ${profile.medicalCondition?.uppercase()} | LOCAL: PRÓXIMO A UM ENDEREÇO | PARADO HÁ 5 MIN",
            suggestedOpening = "Olá ${profile.name}, aqui é da rede de apoio Saveplace. Estou vendo que você está perto de um local. Precisa de alguma ajuda?",
            safetyWarning = "Evite mencionar a condição médica diretamente. Use uma abordagem calma e amigável."
        )
    }

    suspend fun analyzeImage(imageBytes: ByteArray, mimeType: String): String {
        delay(2000)
        return "Análise da imagem concluída. O recibo indica uma compra de R$ 54,30 em um supermercado. Nenhum risco aparente detectado."
    }

    suspend fun generateAlertAudio(name: String, type: ProfileType, instruction: String): ByteArray? {
        delay(800)
        return null // Simula que não há dados de áudio
    }
}
