namespace Saveplace.Core.Windows.Models;

public class Zone
{
    public string Id { get; set; }
    public string Name { get; set; }
    public double Lat { get; set; }
    public double Lng { get; set; }
    public double Radius { get; set; }
}

public enum VolunteerSkill { Medico, Psicologo, Familiar, Vizinho, Geral }

public class VolunteerProfile
{
    public string Id { get; set; }
    public string Name { get; set; }
    public List<VolunteerSkill> Skills { get; set; } = new();
    public bool IsOnline { get; set; }
    public string Distance { get; set; }
    public double Rating { get; set; }
}

// --- AI Service Models ---

public class VolunteerBriefing
{
    public string Summary { get; set; }
    public string SuggestedOpening { get; set; }
    public string SafetyWarning { get; set; }
}

public class BioAnalysisResult
{
    public AnalysisDetails Analysis { get; set; }
    public RecommendedAction RecommendedAction { get; set; }
}

public class AnalysisDetails
{
    public AnalysisStatus Status { get; set; }
    public double ProbabilityScore { get; set; }
    public string Reasoning { get; set; }
}

public enum AnalysisStatus { Normal, AlertaAmarelo, AlertaVermelho }

public class RecommendedAction
{
    public bool TriggerAlarm { get; set; }
    public bool ContactVolunteer { get; set; }
    public string VoiceMessageToUser { get; set; }
}
