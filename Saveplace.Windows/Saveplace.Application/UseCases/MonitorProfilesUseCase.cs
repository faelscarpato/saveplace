using System;
using System.Collections.Generic;
using System.Linq;
using Saveplace.Domain.Entities;

namespace Saveplace.Application.UseCases
{
    public class MonitorProfilesUseCase
    {
        public List<UserProfile> Execute(List<UserProfile> profiles)
        {
            var random = new Random();
            var updatedProfiles = new List<UserProfile>();

            foreach (var p in profiles)
            {
                if (p.IsFallDetected)
                {
                    updatedProfiles.Add(p);
                    continue;
                }

                // Simulate Movement
                double moveLat = (random.NextDouble() - 0.5) * 0.001;
                double moveLng = (random.NextDouble() - 0.5) * 0.001;

                p.Location.Lat += moveLat;
                p.Location.Lng += moveLng;

                // Simulate Heart Rate Fluctuation
                if (p.StressLevel != StressLevel.HIGH)
                {
                    p.HeartRate = p.BaselineHeartRate + random.Next(-2, 3);
                }

                updatedProfiles.Add(p);
            }

            return updatedProfiles;
        }
    }
}
