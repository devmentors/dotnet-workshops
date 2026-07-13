using System;
using MySpot.Shared.Abstractions.Commands;

namespace MySpot.Modules.Saga.Api.Messages;

public record RemoveReservation(Guid ReservationId, Guid UserId) : ICommand;