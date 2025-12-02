using Microsoft.Extensions.Logging;
using Saveplace.Core.Windows.Persistence;
using Saveplace.Core.Windows.Repositories;
using Saveplace.Core.Windows.Services;
using Saveplace.Windows.App.ViewModels;
using Saveplace.Windows.App.Views;
using System.Net.Http;

namespace Saveplace.Windows.App;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

        // Configurar a Injeção de Dependência (DI)

        // 1. Registrar HttpClient (necessário para o GeminiService)
        builder.Services.AddSingleton<HttpClient>();

        // 2. Registrar nossos serviços da camada Core como Singletons
        // Usamos a implementação MockRepository. Para mudar para SQLite, só trocamos esta linha.
        builder.Services.AddSingleton<IUserProfileRepository, MockRepository>();
        builder.Services.AddSingleton<IZoneRepository, MockRepository>();
        builder.Services.AddSingleton<IVolunteerRepository, MockRepository>();

        // O GeminiService precisa de uma chave de API.
        // Em um projeto real, a chave NUNCA deve ser hardcoded.
        // Ela deve ser carregada a partir de um sistema de configuração seguro, como o .NET User Secrets.
        // Exemplo:
        // var apiKey = builder.Configuration["GeminiApiKey"];
        // builder.Services.AddSingleton(new GeminiService(httpClient, apiKey));

        builder.Services.AddSingleton(provider =>
        {
            var httpClient = provider.GetRequiredService<HttpClient>();
            // Usamos uma string vazia para o propósito desta demonstração.
            // A lógica simulada no serviço não depende da chave.
            var apiKey = string.Empty; // Carregar de uma fonte segura
            return new GeminiService(httpClient, apiKey);
        });

        // 3. Registrar nossos ViewModels e Views
        // Transient: um novo é criado cada vez que uma página é navegada.
        builder.Services.AddTransient<MainViewModel>();
        builder.Services.AddTransient<MainPage>();

#if DEBUG
        builder.Logging.AddDebug();
#endif

        return builder.Build();
    }
}
