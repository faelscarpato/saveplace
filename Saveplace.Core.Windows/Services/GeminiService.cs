using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Saveplace.Core.Windows.Models;

namespace Saveplace.Core.Windows.Services;

/// <summary>
/// Encapsula a lógica de negócio para interagir com a API do Google Gemini.
///
/// NOTA DE ARQUITETURA:
/// Esta biblioteca Core é específica para a plataforma Windows (.NET). Uma biblioteca
/// espelhada existe no projeto Android (em Kotlin). Esta duplicação foi uma decisão
/// pragmática para acelerar o desenvolvimento inicial em stacks nativas separadas.
///
/// Para evoluções futuras, a abordagem ideal seria unificar a lógica de negócio
/// em uma única base de código compartilhada usando Kotlin Multiplatform (KMP),
/// que pode compilar tanto para a JVM (Android) quanto para o .NET (via Native ou WASM).
/// Isso eliminaria a duplicação e garantiria consistência entre as plataformas.
/// </summary>
public class GeminiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    // Em uma aplicação real, a chave da API viria de uma configuração segura.
    public GeminiService(HttpClient httpClient, string apiKey)
    {
        _httpClient = httpClient;
        _apiKey = apiKey;
    }

    // NOTA: Os métodos abaixo são simulações da interação com a API Gemini.
    // Eles replicam a lógica e os prompts do geminiService.ts original,
    // mas retornam dados mockados para fins de demonstração, pois não
    // podemos executar chamadas HTTP reais sem uma chave de API.
    // A estrutura do código (prompts, modelos de entrada/saída) está pronta
    // para ser conectada a um endpoint real.

    public async Task<BioAnalysisResult> AnalyzeBioTelemetryAsync(UserProfile profile, string locationType = "Desconhecido")
    {
        // Lógica de prompt aqui seria idêntica à do TypeScript.
        // Por brevidade, vamos retornar um resultado mockado.

        await Task.Delay(1500); // Simula a latência da rede

        if (profile.IsFallDetected)
        {
            return new BioAnalysisResult
            {
                Analysis = new AnalysisDetails { Status = AnalysisStatus.AlertaVermelho, ProbabilityScore = 98, Reasoning = "Queda detectada pelo acelerômetro. Batimento cardíaco elevado consistente com estresse pós-queda." },
                RecommendedAction = new RecommendedAction { TriggerAlarm = true, ContactVolunteer = true, VoiceMessageToUser = $"{profile.Name}, detectamos uma queda. A ajuda está a caminho. Fique calmo." }
            };
        }

        if (profile.StressLevel == StressLevel.High && profile.HeartRate > 130)
        {
            return new BioAnalysisResult
            {
                Analysis = new AnalysisDetails { Status = AnalysisStatus.AlertaAmarelo, ProbabilityScore = 85, Reasoning = "Frequência cardíaca muito elevada enquanto o usuário está parado. Pode indicar um ataque de pânico ou coação." },
                RecommendedAction = new RecommendedAction { TriggerAlarm = false, ContactVolunteer = true, VoiceMessageToUser = $"{profile.Name}, tudo bem? Notei que seu coração está um pouco acelerado. Quer conversar com alguém?" }
            };
        }

        return new BioAnalysisResult
        {
            Analysis = new AnalysisDetails { Status = AnalysisStatus.Normal, ProbabilityScore = 10, Reasoning = "Sinais vitais estáveis e consistentes com a atividade atual." },
            RecommendedAction = new RecommendedAction { TriggerAlarm = false, ContactVolunteer = false, VoiceMessageToUser = "" }
        };
    }

    public async Task<VolunteerBriefing> GenerateVolunteerBriefingAsync(UserProfile profile, Location location)
    {
        // Lógica de prompt aqui seria idêntica à do TypeScript.
        await Task.Delay(1000); // Simula a latência da rede

        return new VolunteerBriefing
        {
            Summary = $"PERFIL: {profile.MedicalCondition?.ToUpper()} | LOCAL: PRÓXIMO A {location.Address} | PARADO HÁ 5 MIN",
            SuggestedOpening = $"Olá {profile.Name}, aqui é da rede de apoio Saveplace. Estou vendo que você está perto de {location.Address}. Precisa de alguma ajuda?",
            SafetyWarning = "Evite mencionar a condição médica diretamente. Use uma abordagem calma e amigável."
        };
    }

    public async Task<string> AnalyzeImageAsync(byte[] imageBytes, string mimeType)
    {
        // Lógica de conversão para Base64 e prompt aqui.
        await Task.Delay(2000);
        return "Análise da imagem concluída. O recibo indica uma compra de R$ 54,30 em um supermercado. Nenhum risco aparente detectado.";
    }

    // O método de geração de áudio seria mais complexo, envolvendo
    // o processamento de uma resposta de áudio da API.
    // Aqui, vamos apenas simular que ele existe.
    public async Task<byte[]?> GenerateAlertAudioAsync(string name, ProfileType type, string instruction)
    {
        await Task.Delay(800);
        // Em um app real, isso retornaria os bytes de um arquivo de áudio (MP3/WAV)
        return null;
    }
}
