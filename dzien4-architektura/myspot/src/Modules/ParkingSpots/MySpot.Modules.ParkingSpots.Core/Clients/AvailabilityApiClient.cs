using Microsoft.Extensions.Logging;
using MySpot.Modules.ParkingSpots.Core.Exceptions;
using MySpot.Shared.Abstractions.Modules;

namespace MySpot.Modules.ParkingSpots.Core.Clients;

internal sealed class AvailabilityApiClient : IAvailabilityApiClient
{
    private readonly IModuleClient _moduleClient;
    private readonly ILogger<AvailabilityApiClient> _logger;

    public AvailabilityApiClient(IModuleClient moduleClient, ILogger<AvailabilityApiClient> logger)
    {
        _moduleClient = moduleClient;
        _logger = logger;
    }

    public async Task AddResourceAsync(Guid resourceId, int capacity, IEnumerable<string> tags)
    {
        try
        {
            await _moduleClient.SendAsync("availability/resources/add", new {resourceId, capacity, tags});
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, exception.Message);
            throw new CannotAddResourceException(resourceId);
        }
    }
}