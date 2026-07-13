using System;
using MySpot.Shared.Abstractions.Events;

namespace MySpot.Modules.Availability.Application.Events;

public record ResourceReservationFailed(Guid ResourceId, DateTimeOffset Date, string Reason, string Code) : IEvent;