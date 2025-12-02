using System.Threading.Tasks;
using Saveplace.Domain.Entities;

namespace Saveplace.Domain.Interfaces
{
    public interface IGeminiService
    {
        Task<string> GenerateAlertAudioAsync(string name, string type, string instruction);
        Task<string> AnalyzeBioTelemetryAsync(UserProfile profile);
    }
}
