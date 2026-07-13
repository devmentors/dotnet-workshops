using MySpot.Modules.Reservations.Application.Events;
using MySpot.Modules.Reservations.Core.DomainServices;
using MySpot.Modules.Reservations.Core.Factories;
using MySpot.Modules.Reservations.Core.Repositories;
using MySpot.Modules.Reservations.Core.ValueObjects;
using MySpot.Shared.Abstractions.Commands;
using MySpot.Shared.Abstractions.Messaging;
using MySpot.Shared.Abstractions.Time;

namespace MySpot.Modules.Reservations.Application.Commands.Handlers;

internal sealed class MakeReservationHandler : ICommandHandler<MakeReservation>
{
    private readonly IWeeklyReservationsRepository _weeklyReservationsRepository;
    private readonly IWeeklyReservationsService _weeklyReservationsService;
    private readonly IWeeklyReservationsFactory _weeklyReservationsFactory;
    private readonly IMessageBroker _messageBroker;
    private readonly IClock _clock;

    public MakeReservationHandler(IWeeklyReservationsRepository weeklyReservationsRepository,
        IWeeklyReservationsService weeklyReservationsService, IWeeklyReservationsFactory weeklyReservationsFactory,
        IMessageBroker messageBroker, IClock clock)
    {
        _weeklyReservationsRepository = weeklyReservationsRepository;
        _weeklyReservationsService = weeklyReservationsService;
        _weeklyReservationsFactory = weeklyReservationsFactory;
        _messageBroker = messageBroker;
        _clock = clock;
    }

    public async Task HandleAsync(MakeReservation command, CancellationToken cancellationToken = default)
    {
        var (userId, parkingSpotId, capacity, licensePlate, date, note) = command;
        _ = new LicensePlate(licensePlate);
        _ = new Capacity(capacity);
        _ = new Date(date);

        var lastWeekReservations = await _weeklyReservationsRepository.GetForLastWeekAsync(userId, cancellationToken);
        var currentReservations = await _weeklyReservationsRepository.GetForCurrentWeekAsync(userId, cancellationToken);
        if (currentReservations is null)
        {
            currentReservations = await _weeklyReservationsFactory.CreateAsync(userId, new Week(_clock.CurrentDate()), cancellationToken);
            await _weeklyReservationsRepository.AddAsync(currentReservations, cancellationToken);
        }

        var reservation = _weeklyReservationsService.Reserve(currentReservations, lastWeekReservations, parkingSpotId,
            capacity, licensePlate, date, note);
        await _weeklyReservationsRepository.UpdateAsync(currentReservations, cancellationToken);
        await _messageBroker.PublishAsync(new ParkingSpotReserved(reservation.Id, reservation.ParkingSpotId,
            userId, reservation.Date), cancellationToken);
    }
}