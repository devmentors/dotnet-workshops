using System;
using MySpot.Shared.Abstractions.Events;

namespace MySpot.Modules.Saga.Api.Messages;

public record ParkingSpotReservationRemoved(Guid ReservationId, Guid ParkingSpotId, DateTimeOffset Date) : IEvent;