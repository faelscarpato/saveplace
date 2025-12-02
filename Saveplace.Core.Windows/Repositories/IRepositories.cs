using Saveplace.Core.Windows.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Saveplace.Core.Windows.Repositories;

public interface IUserProfileRepository
{
    Task<UserProfile?> GetProfileByIdAsync(string id);
    Task<List<UserProfile>> GetAllProfilesAsync();
    Task SaveProfileAsync(UserProfile profile);
}

public interface IZoneRepository
{
    Task<List<Zone>> GetAllZonesAsync();
}

public interface IVolunteerRepository
{
    Task<List<VolunteerProfile>> GetAllVolunteersAsync();
}
