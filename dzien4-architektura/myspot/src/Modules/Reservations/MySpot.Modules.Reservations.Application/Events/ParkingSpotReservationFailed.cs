using MySpot.Shared.Abstractions.Events;

namespace MySpot.Modules.Reservations.Application.Events;

public record ParkingSpotReservationFailed(Guid ParkingSpotId, Guid UserId, DateTimeOffset Date, string Reason, string Code) : IEvent;