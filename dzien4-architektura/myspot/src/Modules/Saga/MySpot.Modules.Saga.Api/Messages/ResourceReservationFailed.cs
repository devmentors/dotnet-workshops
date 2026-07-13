using System;
using MySpot.Shared.Abstractions.Events;

namespace MySpot.Modules.Saga.Api.Messages;

public record ResourceReservationFailed(Guid ResourceId, DateTimeOffset Date, string Reason, string Code) : IEvent;