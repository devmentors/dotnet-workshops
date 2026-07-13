namespace MySpot.Modules.ParkingSpots.Core.Clients;

public interface IAvailabilityApiClient
{
    Task AddResourceAsync(Guid resourceId, int capacity, IEnumerable<string> tags);
}