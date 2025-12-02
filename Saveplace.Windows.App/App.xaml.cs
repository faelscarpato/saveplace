using Saveplace.Windows.App.Views;

namespace Saveplace.Windows.App;

public partial class App : Application
{
	public App()
	{
		InitializeComponent();

		// Define a página inicial da aplicação.
		// A MainPage será resolvida pela injeção de dependência,
		// que automaticamente injetará o MainViewModel nela.
		MainPage = new AppShell();
	}
}

// AppShell é usado para a estrutura de navegação principal.
// Para uma aplicação de página única, é bem simples.
public class AppShell : Shell
{
    public AppShell()
    {
        Items.Add(new ShellContent
        {
            Title = "Home",
            ContentTemplate = new DataTemplate(typeof(MainPage))
        });
    }
}
