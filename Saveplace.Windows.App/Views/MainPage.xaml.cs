using Saveplace.Windows.App.ViewModels;

namespace Saveplace.Windows.App.Views;

public partial class MainPage : ContentPage
{
	private readonly MainViewModel _viewModel;

	public MainPage(MainViewModel viewModel)
	{
		InitializeComponent();
		BindingContext = viewModel;
		_viewModel = viewModel;
	}

	// Gatilho para carregar os dados quando a página aparece
	protected override async void OnAppearing()
	{
		base.OnAppearing();
		if (_viewModel.LoadDataCommand.CanExecute(null))
		{
			await _viewModel.LoadDataCommand.ExecuteAsync(null);
		}
	}
}
