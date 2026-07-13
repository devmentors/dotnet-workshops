using MySpot.Shared.Abstractions.Commands;

namespace MySpot.Modules.Mapping.Api.ParkingSpotAvailabilityMappings.Commands;

public record DeleteResource(Guid ResourceId) : ICommand;