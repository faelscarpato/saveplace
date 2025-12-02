using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Saveplace.Core.Windows.Models;
using Saveplace.Core.Windows.Repositories;
using Saveplace.Core.Windows.Services;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace Saveplace.Windows.App.ViewModels;

// [ObservableObject] transforma esta classe em um objeto que notifica a UI sobre mudanças de propriedade.
public partial class MainViewModel : ObservableObject
{
    private readonly IUserProfileRepository _profileRepository;
    private readonly IVolunteerRepository _volunteerRepository;
    private readonly GeminiService _geminiService;

    // Propriedades observáveis que a UI irá 'bindar' (conectar).
    // O atributo [ObservableProperty] gera automaticamente todo o código boilerplate.
    [ObservableProperty]
    private ObservableCollection<UserProfile> _profiles = new();

    [ObservableProperty]
    private ObservableCollection<VolunteerProfile> _volunteers = new();

    [ObservableProperty]
    private UserProfile? _activeProfile;

    [ObservableProperty]
    private bool _isEmergency;

    [ObservableProperty]
    private BioAnalysisResult? _bioAnalysis;

    [ObservableProperty]
    private VolunteerBriefing? _volunteerBriefing;

    [ObservableProperty]
    private bool _isAnalyzing;

    public MainViewModel(IUserProfileRepository profileRepository, IVolunteerRepository volunteerRepository, GeminiService geminiService)
    {
        _profileRepository = profileRepository;
        _volunteerRepository = volunteerRepository;
        _geminiService = geminiService;
    }

    // Um comando que pode ser executado a partir da UI (ex: um botão).
    // Este comando será executado quando a página carregar.
    [RelayCommand]
    private async Task LoadDataAsync()
    {
        var profilesData = await _profileRepository.GetAllProfilesAsync();
        Profiles = new ObservableCollection<UserProfile>(profilesData);

        var volunteersData = await _volunteerRepository.GetAllVolunteersAsync();
        Volunteers = new ObservableCollection<VolunteerProfile>(volunteersData);

        // Define o primeiro perfil como ativo por padrão.
        ActiveProfile = Profiles.FirstOrDefault();
    }

    // Comando para mudar o perfil ativo, chamado ao clicar na lista de perfis.
    [RelayCommand]
    private void SelectProfile(UserProfile profile)
    {
        ActiveProfile = profile;
        // Limpa as análises anteriores ao trocar de perfil
        BioAnalysis = null;
        VolunteerBriefing = null;
        IsEmergency = false;
    }

    // Comando para simular um evento de emergência
    [RelayCommand]
    private async Task SimulateEmergencyAsync()
    {
        if (ActiveProfile == null) return;

        IsAnalyzing = true;
        IsEmergency = true;

        // Simula uma alteração nos dados do perfil para refletir uma emergência
        ActiveProfile.Status = UserStatus.Danger;
        ActiveProfile.HeartRate = 140;
        ActiveProfile.StressLevel = StressLevel.High;

        // Força uma atualização na UI para o perfil modificado
        var index = Profiles.IndexOf(ActiveProfile);
        if(index != -1) Profiles[index] = ActiveProfile;

        // Chama a IA para analisar a situação e gerar um briefing
        BioAnalysis = await _geminiService.AnalyzeBioTelemetryAsync(ActiveProfile);
        VolunteerBriefing = await _geminiService.GenerateVolunteerBriefingAsync(ActiveProfile, ActiveProfile.Location);

        IsAnalyzing = false;
    }

    // Comando para normalizar a situação
    [RelayCommand]
    private void NormalizeSituation()
    {
        if (ActiveProfile == null) return;

        IsEmergency = false;
        BioAnalysis = null;
        VolunteerBriefing = null;

        ActiveProfile.Status = UserStatus.Safe;
        ActiveProfile.HeartRate = ActiveProfile.BaselineHeartRate;
        ActiveProfile.StressLevel = StressLevel.Low;

        var index = Profiles.IndexOf(ActiveProfile);
        if(index != -1) Profiles[index] = ActiveProfile;
    }
}
