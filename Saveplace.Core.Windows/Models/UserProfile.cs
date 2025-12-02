namespace Saveplace.Core.Windows.Models;

public enum ProfileType { Child, Elderly, Pet, Friend, Object }
public enum DeviceType { Phone, GpsTag, Smartwatch }
public enum UserStatus { Safe, Danger, Unknown, Offline }

public class UserProfile
{
    public string Id { get; set; }
    public string Name { get; set; }
    public ProfileType Type { get; set; }
    public DeviceType DeviceType { get; set; }
    public int? Age { get; set; }
    public string? MedicalCondition { get; set; }
    public UserStatus Status { get; set; }
    public Location Location { get; set; }
    public int BatteryLevel { get; set; }
    public DateTime LastUpdate { get; set; }
    public double SpeedMph { get; set; }
    public DateTime LastMovement { get; set; }
    public List<LocationHistoryPoint> LocationHistory { get; set; } = new();

    // Bio-Telemetry
    public int HeartRate { get; set; }
    public int BaselineHeartRate { get; set; }
    public StressLevel StressLevel { get; set; }
    public bool IsFallDetected { get; set; }
}

public class Location
{
    public double Lat { get; set; }
    public double Lng { get; set; }
    public string? Address { get; set; }
}

public class LocationHistoryPoint
{
    public double Lat { get; set; }
    public double Lng { get; set; }
    public DateTime Timestamp { get; set; }
}

public enum StressLevel { Low, Medium, High }
