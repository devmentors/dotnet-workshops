using Microsoft.Extensions.DependencyInjection;
using Moq;
using MySpot.Modules.Availability.Application.Commands;
using MySpot.Modules.Availability.Application.Commands.Handlers;
using MySpot.Modules.Availability.Application.Events;
using MySpot.Modules.Availability.Core.Entities;
using MySpot.Modules.Availability.Core.Exceptions;
using MySpot.Modules.Availability.Core.Repositories;
using MySpot.Modules.Availability.Core.ValueObjects;
using MySpot.Shared.Abstractions.Messaging;
using Xunit;

namespace MySpot.Workshops.Tests;

/// <summary>
/// Exercise 8: Saga Pattern - Compensation Flow
///
/// These tests verify that the ReserveResourceHandler correctly publishes
/// the ResourceReservationFailed event when a reservation fails.
/// This is essential for the saga compensation flow to work!
///
/// Your task: Modify ReserveResourceHandler to catch exceptions and
/// publish ResourceReservationFailed event.
/// </summary>
public class Exercise08_SagaPatternCompensationTests
{
    #region Test 1: ResourceReservationFailed should be published when AddReservation throws

    [Fact]
    public async Task HandleAsync_WhenReservationFails_ShouldPublishResourceReservationFailed()
    {
        // Arrange
        var resourceId = Guid.NewGuid();
        var reservationId = Guid.NewGuid();
        var date = DateTimeOffset.Now.AddDays(1);
        var capacity = 5; // Too high capacity will cause failure

        var publishedMessages = new List<object>();
        var messageBrokerMock = new Mock<IMessageBroker>();
        messageBrokerMock
            .Setup(x => x.PublishAsync(It.IsAny<IMessage>(), It.IsAny<CancellationToken>()))
            .Callback<IMessage, CancellationToken>((msg, ct) => publishedMessages.Add(msg))
            .Returns(Task.CompletedTask);

        // Create a resource with capacity of 2 (reserving 5 will fail)
        var resource = Resource.Create(resourceId, 2, new[] { new Tag("parking_spot") });

        var repositoryMock = new Mock<IResourcesRepository>();
        repositoryMock
            .Setup(x => x.GetAsync(resourceId))
            .ReturnsAsync(resource);

        var handler = new ReserveResourceHandler(repositoryMock.Object, messageBrokerMock.Object);
        var command = new ReserveResource(resourceId, reservationId, capacity, date, 1);

        // Act
        await handler.HandleAsync(command);

        // Assert - ResourceReservationFailed should be published
        var failedEvent = publishedMessages.OfType<ResourceReservationFailed>().FirstOrDefault();

        Assert.NotNull(failedEvent);
        Assert.Equal(resourceId, failedEvent!.ResourceId);
        Assert.Equal(date, failedEvent.Date);
    }

    #endregion

    #region Test 2: ResourceReserved should still be published on success

    [Fact]
    public async Task HandleAsync_WhenReservationSucceeds_ShouldPublishResourceReserved()
    {
        // Arrange
        var resourceId = Guid.NewGuid();
        var reservationId = Guid.NewGuid();
        var date = DateTimeOffset.Now.AddDays(1);
        var capacity = 1; // Within capacity

        var publishedMessages = new List<object>();
        var messageBrokerMock = new Mock<IMessageBroker>();
        messageBrokerMock
            .Setup(x => x.PublishAsync(It.IsAny<IMessage>(), It.IsAny<CancellationToken>()))
            .Callback<IMessage, CancellationToken>((msg, ct) => publishedMessages.Add(msg))
            .Returns(Task.CompletedTask);

        // Create a resource with capacity of 2
        var resource = Resource.Create(resourceId, 2, new[] { new Tag("parking_spot") });

        var repositoryMock = new Mock<IResourcesRepository>();
        repositoryMock
            .Setup(x => x.GetAsync(resourceId))
            .ReturnsAsync(resource);

        var handler = new ReserveResourceHandler(repositoryMock.Object, messageBrokerMock.Object);
        var command = new ReserveResource(resourceId, reservationId, capacity, date, 1);

        // Act
        await handler.HandleAsync(command);

        // Assert - ResourceReserved should be published (not ResourceReservationFailed)
        var successEvent = publishedMessages.OfType<ResourceReserved>().FirstOrDefault();
        var failedEvent = publishedMessages.OfType<ResourceReservationFailed>().FirstOrDefault();

        Assert.NotNull(successEvent);
        Assert.Null(failedEvent);
        Assert.Equal(resourceId, successEvent!.ResourceId);
    }

    #endregion

    #region Test 3: Collision with lower priority should publish failure

    [Fact]
    public async Task HandleAsync_WhenCannotExpropriate_ShouldPublishResourceReservationFailed()
    {
        // Arrange
        var resourceId = Guid.NewGuid();
        var existingReservationId = Guid.NewGuid();
        var newReservationId = Guid.NewGuid();
        var date = DateTimeOffset.Now.AddDays(1);

        var publishedMessages = new List<object>();
        var messageBrokerMock = new Mock<IMessageBroker>();
        messageBrokerMock
            .Setup(x => x.PublishAsync(It.IsAny<IMessage>(), It.IsAny<CancellationToken>()))
            .Callback<IMessage, CancellationToken>((msg, ct) => publishedMessages.Add(msg))
            .Returns(Task.CompletedTask);

        // Create a resource with an existing high-priority reservation
        var resource = Resource.Create(resourceId, 2, new[] { new Tag("parking_spot") });
        var existingReservation = new Reservation(existingReservationId, 1, new Date(date), priority: 10); // High priority
        resource.AddReservation(existingReservation);

        var repositoryMock = new Mock<IResourcesRepository>();
        repositoryMock
            .Setup(x => x.GetAsync(resourceId))
            .ReturnsAsync(resource);

        var handler = new ReserveResourceHandler(repositoryMock.Object, messageBrokerMock.Object);

        // Try to reserve with lower priority - should fail
        var command = new ReserveResource(resourceId, newReservationId, 1, date, 1); // Lower priority

        // Act
        await handler.HandleAsync(command);

        // Assert - ResourceReservationFailed should be published
        var failedEvent = publishedMessages.OfType<ResourceReservationFailed>().FirstOrDefault();

        Assert.NotNull(failedEvent);
        Assert.Equal(resourceId, failedEvent!.ResourceId);
    }

    #endregion
}
