using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using System.Windows.Threading;
using Saveplace.Application.UseCases;
using Saveplace.Domain.Entities;
using Saveplace.Infrastructure.Services;

namespace Saveplace.WindowsApp.ViewModels
{
    public class MainViewModel : INotifyPropertyChanged
    {
        private readonly MonitorProfilesUseCase _monitorUseCase;
        private readonly GeminiService _geminiService;
        private ObservableCollection<UserProfile> _profiles;

        public ObservableCollection<UserProfile> Profiles
        {
            get => _profiles;
            set { _profiles = value; OnPropertyChanged(); }
        }

        public MainViewModel()
        {
            _monitorUseCase = new MonitorProfilesUseCase();
            _geminiService = new GeminiService();

            Profiles = new ObservableCollection<UserProfile>
            {
                new UserProfile { Id = "1", Name = "Vovô João", Age = 78, HeartRate = 72, BaselineHeartRate = 70, Status = ProfileStatus.SAFE, MedicalCondition = "Alzheimer", Type = ProfileType.ELDERLY },
                new UserProfile { Id = "2", Name = "Sofia", Age = 8, HeartRate = 90, BaselineHeartRate = 85, Status = ProfileStatus.SAFE, MedicalCondition = "Nenhuma", Type = ProfileType.CHILD }
            };

            // Start Simulation Loop
            var timer = new DispatcherTimer { Interval = TimeSpan.FromSeconds(2) };
            timer.Tick += (s, e) => RunSimulation();
            timer.Start();
        }

        private void RunSimulation()
        {
            // Note: In a real app, logic would update existing instances or replace list smartly
            var updatedList = _monitorUseCase.Execute(new System.Collections.Generic.List<UserProfile>(Profiles));
            Profiles = new ObservableCollection<UserProfile>(updatedList);
        }

        public event PropertyChangedEventHandler PropertyChanged;
        protected void OnPropertyChanged([CallerMemberName] string name = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }
    }
}
