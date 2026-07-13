using MySpot.Shared.Abstractions.Events;

namespace MySpot.Modules.Mapping.Api.ParkingSpotAvailabilityMappings.Events;

public record ParkingSpotCreated(Guid ParkingSpotId) : IEvent;