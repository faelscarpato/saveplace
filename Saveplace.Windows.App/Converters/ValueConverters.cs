using Microsoft.Maui.Graphics;
using Saveplace.Core.Windows.Models;
using System.Globalization;
using System;

namespace Saveplace.Windows.App.Converters;

// Converte um UserStatus (enum) em uma cor específica
public class StatusToColorConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        return value is UserStatus status && status == UserStatus.Danger ? Colors.Red : Colors.Green;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}

// Usado para destacar o perfil ativo na lista
public class ActiveProfileToColorConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        // Este conversor é um truque. A lógica real será tratar a seleção no CollectionView
        // e aplicar um VisualState. Para simplicidade aqui, vamos apenas retornar uma cor.
        return Colors.LightGray; // Placeholder
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}

// Converte um objeto nulo em 'false' e não nulo em 'true'. Útil para controlar visibilidade.
public class NullToBoolConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        return value != null;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
