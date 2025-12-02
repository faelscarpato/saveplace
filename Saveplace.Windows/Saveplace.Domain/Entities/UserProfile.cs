using System;
using System.Collections.Generic;

namespace Saveplace.Domain.Entities
{
    public enum ProfileType { CHILD, ELDERLY, FRIEND, PET, OBJECT }
    public enum DeviceType { PHONE, GPS_TAG, SMARTWATCH }
    public enum ProfileStatus { SAFE, DANGER, UNKNOWN, OFFLINE }
    public enum StressLevel { LOW, MEDIUM, HIGH }

    public class Location
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
        public string Address { get; set; }
    }

    public class UserProfile
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public ProfileType Type { get; set; }
        public DeviceType DeviceType { get; set; }
        public int Age { get; set; }
        public string MedicalCondition { get; set; }
        public ProfileStatus Status { get; set; }
        public Location Location { get; set; }
        public int BatteryLevel { get; set; }
        public DateTime LastUpdate { get; set; }
        public double Speed { get; set; } // km/h
        public DateTime LastMovement { get; set; }

        // Bio-Telemetry
        public int HeartRate { get; set; }
        public int BaselineHeartRate { get; set; }
        public StressLevel StressLevel { get; set; }
        public bool IsFallDetected { get; set; }

        public UserProfile()
        {
            Location = new Location();
        }
    }
}
