using Saveplace.Core.Windows.Models;
using Saveplace.Core.Windows.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Saveplace.Core.Windows.Persistence;

/// <summary>
/// Implementação de repositório em memória que usa dados mockados.
/// Perfeito para desenvolvimento inicial e testes.
/// Pode ser substituído por um 'SQLiteRepository' sem alterar o resto da aplicação.
/// </summary>
public class MockRepository : IUserProfileRepository, IZoneRepository, IVolunteerRepository
{
    private static readonly List<UserProfile> _profiles = new()
    {
        new UserProfile
        {
            Id = "1", Name = "Vovô João", Type = ProfileType.Elderly, DeviceType = DeviceType.Smartwatch, Age = 78,
            MedicalCondition = "Alzheimer Inicial", Status = UserStatus.Safe,
            Location = new Location { Lat = 45, Lng = 45 }, BatteryLevel = 85, LastUpdate = DateTime.Now, SpeedMph = 1,
            LastMovement = DateTime.Now, HeartRate = 72, BaselineHeartRate = 70, StressLevel = StressLevel.Low, IsFallDetected = false
        },
        new UserProfile
        {
            Id = "2", Name = "Rex", Type = ProfileType.Pet, DeviceType = DeviceType.GpsTag, Age = 4,
            Status = UserStatus.Safe, Location = new Location { Lat = 55, Lng = 55 }, BatteryLevel = 90,
            LastUpdate = DateTime.Now, SpeedMph = 0, LastMovement = DateTime.Now, HeartRate = 80,
            BaselineHeartRate = 80, StressLevel = StressLevel.Low, IsFallDetected = false
        },
        new UserProfile
        {
            Id = "3", Name = "Sofia", Type = ProfileType.Child, DeviceType = DeviceType.Smartwatch, Age = 8,
            Status = UserStatus.Safe, Location = new Location { Lat = 50, Lng = 50 }, BatteryLevel = 72,
            LastUpdate = DateTime.Now, SpeedMph = 2, LastMovement = DateTime.Now, HeartRate = 90,
            BaselineHeartRate = 85, StressLevel = StressLevel.Low, IsFallDetected = false
        }
    };

    private static readonly List<Zone> _zones = new()
    {
        new Zone { Id = "z1", Name = "Casa", Lat = 50, Lng = 50, Radius = 15 },
        new Zone { Id = "z2", Name = "Escola", Lat = 20, Lng = 80, Radius = 10 }
    };

    private static readonly List<VolunteerProfile> _volunteers = new()
    {
        new VolunteerProfile { Id = "v1", Name = "Dr. Silva", Skills = new List<VolunteerSkill> { VolunteerSkill.Medico }, IsOnline = true, Distance = "0.5km", Rating = 4.8 },
        new VolunteerProfile { Id = "v2", Name = "Ana Vizinha", Skills = new List<VolunteerSkill> { VolunteerSkill.Vizinho, VolunteerSkill.Familiar }, IsOnline = true, Distance = "0.1km", Rating = 5.0 },
        new VolunteerProfile { Id = "v3", Name = "Sgt. Souza", Skills = new List<VolunteerSkill> { VolunteerSkill.Geral }, IsOnline = false, Distance = "1.2km", Rating = 4.5 }
    };

    // IUserProfileRepository
    public Task<UserProfile?> GetProfileByIdAsync(string id)
    {
        return Task.FromResult(_profiles.FirstOrDefault(p => p.Id == id));
    }

    public Task<List<UserProfile>> GetAllProfilesAsync()
    {
        return Task.FromResult(_profiles);
    }

    public Task SaveProfileAsync(UserProfile profile)
    {
        var existing = _profiles.FirstOrDefault(p => p.Id == profile.Id);
        if (existing != null)
        {
            _profiles.Remove(existing);
        }
        _profiles.Add(profile);
        return Task.CompletedTask;
    }

    // IZoneRepository
    public Task<List<Zone>> GetAllZonesAsync()
    {
        return Task.FromResult(_zones);
    }

    // IVolunteerRepository
    public Task<List<VolunteerProfile>> GetAllVolunteersAsync()
    {
        return Task.FromResult(_volunteers);
    }
}
