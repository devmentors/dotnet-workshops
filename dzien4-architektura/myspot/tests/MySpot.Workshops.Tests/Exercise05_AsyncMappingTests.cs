using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Moq;
using MySpot.Modules.Mapping.Api.ParkingSpotAvailabilityMappings.Commands;
using MySpot.Modules.Mapping.Api.ParkingSpotAvailabilityMappings.Events;
using MySpot.Modules.ParkingSpots.Core.DAL;
using MySpot.Modules.ParkingSpots.Core.Entities;
using MySpot.Modules.ParkingSpots.Core.Services;
using MySpot.Shared.Abstractions.Events;
using MySpot.Shared.Abstractions.Messaging;
using MySpot.Shared.Abstractions.Modules;
using Xunit;

namespace MySpot.Workshops.Tests;

/// <summary>
/// Exercise 5: Asynchronous Communication - Event-Driven Mapping
///
/// These tests verify the complete event-driven flow:
/// 1. ParkingSpotsService publishes events (not using IModuleClient)
/// 2. Mapper handles events and publishes commands to Availability
/// </summary>
public class Exercise05_AsyncMappingTests
{
    private const string MapperTypeName = "MySpot.Modules.Mapping.Api.ParkingSpotAvailabilityMappings.Mapper";
    private const int ExpectedCapacity = 2;

    private static Assembly GetMappingApiAssembly()
    {
        return Assembly.Load("MySpot.Modules.Mapping.Api");
    }

    #region Part 1: ParkingSpotsService should publish events (not use IModuleClient)

    [Fact]
    public async Task ParkingSpotsService_AddAsync_ShouldPublishParkingSpotCreatedEvent()
    {
        // Arrange
        var parkingSpotId = Guid.NewGuid();
        var parkingSpot = new ParkingSpot
        {
            Id = parkingSpotId,
            Name = "Spot A1",
            DisplayOrder = 1
        };

        var options = new DbContextOptionsBuilder<ParkingSpotsDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        using var context = new ParkingSpotsDbContext(options);

        var messageBrokerMock = new Mock<IMessageBroker>();
        IMessage? capturedMessage = null;

        messageBrokerMock
            .Setup(x => x.PublishAsync(It.IsAny<IMessage>(), It.IsAny<CancellationToken>()))
            .Callback<IMessage, CancellationToken>((msg, ct) => capturedMessage = msg)
            .Returns(Task.CompletedTask);

        var service = CreateParkingSpotsService(context, messageBrokerMock.Object);
        if (service == null)
        {
            Assert.Fail("ParkingSpotsService should have constructor with (DbContext, IMessageBroker) - remove IModuleClient dependency");
            return;
        }

        // Act
        await service.AddAsync(parkingSpot);

        // Assert - Should publish ParkingSpotCreated event
        messageBrokerMock.Verify(
            x => x.PublishAsync(It.IsAny<IMessage>(), It.IsAny<CancellationToken>()),
            Times.Once,
            "ParkingSpotsService.AddAsync should call IMessageBroker.PublishAsync()");

        Assert.NotNull(capturedMessage);
        Assert.Equal("ParkingSpotCreated", capturedMessage.GetType().Name);
    }

    [Fact]
    public async Task ParkingSpotsService_DeleteAsync_ShouldPublishParkingSpotDeletedEvent()
    {
        // Arrange
        var parkingSpotId = Guid.NewGuid();
        var parkingSpot = new ParkingSpot
        {
            Id = parkingSpotId,
            Name = "Spot A1",
            DisplayOrder = 1
        };

        var options = new DbContextOptionsBuilder<ParkingSpotsDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        using var context = new ParkingSpotsDbContext(options);
        context.ParkingSpots.Add(parkingSpot);
        await context.SaveChangesAsync();

        var messageBrokerMock = new Mock<IMessageBroker>();
        IMessage? capturedMessage = null;

        messageBrokerMock
            .Setup(x => x.PublishAsync(It.IsAny<IMessage>(), It.IsAny<CancellationToken>()))
            .Callback<IMessage, CancellationToken>((msg, ct) => capturedMessage = msg)
            .Returns(Task.CompletedTask);

        var service = CreateParkingSpotsService(context, messageBrokerMock.Object);
        if (service == null)
        {
            Assert.Fail("ParkingSpotsService should have constructor with (DbContext, IMessageBroker) - remove IModuleClient dependency");
            return;
        }

        // Act
        await service.DeleteAsync(parkingSpotId);

        // Assert - Should publish ParkingSpotDeleted event
        messageBrokerMock.Verify(
            x => x.PublishAsync(It.IsAny<IMessage>(), It.IsAny<CancellationToken>()),
            Times.Once,
            "ParkingSpotsService.DeleteAsync should call IMessageBroker.PublishAsync()");

        Assert.NotNull(capturedMessage);
        Assert.Equal("ParkingSpotDeleted", capturedMessage.GetType().Name);
    }

    #endregion

    #region Part 2: Mapper should handle ParkingSpotCreated and publish AddResource

    [Fact]
    public async Task Mapper_WhenParkingSpotCreated_ShouldPublishAddResourceCommand()
    {
        // Arrange
        var parkingSpotId = Guid.NewGuid();
        var @event = new ParkingSpotCreated(parkingSpotId);

        var messageBrokerMock = new Mock<IMessageBroker>();
        AddResource? capturedCommand = null;

        messageBrokerMock
            .Setup(x => x.PublishAsync(It.IsAny<IMessage>(), It.IsAny<CancellationToken>()))
            .Callback<IMessage, CancellationToken>((msg, ct) =>
            {
                if (msg is AddResource cmd) capturedCommand = cmd;
            })
            .Returns(Task.CompletedTask);

        var handler = CreateMapperAsEventHandler<ParkingSpotCreated>(messageBrokerMock.Object);
        if (handler == null)
        {
            Assert.Fail("Mapper class should exist and implement IEventHandler<ParkingSpotCreated>");
            return;
        }

        // Act
        await handler.HandleAsync(@event);

        // Assert - Should publish AddResource command with correct data
        Assert.NotNull(capturedCommand);
        Assert.Equal(parkingSpotId, capturedCommand.ResourceId);
        Assert.Equal(ExpectedCapacity, capturedCommand.Capacity);
        Assert.Contains("parking_spot", capturedCommand.Tags);
    }

    [Fact]
    public async Task Mapper_WhenParkingSpotDeleted_ShouldPublishDeleteResourceCommand()
    {
        // Arrange
        var parkingSpotId = Guid.NewGuid();
        var @event = new ParkingSpotDeleted(parkingSpotId);

        var messageBrokerMock = new Mock<IMessageBroker>();
        DeleteResource? capturedCommand = null;

        messageBrokerMock
            .Setup(x => x.PublishAsync(It.IsAny<IMessage>(), It.IsAny<CancellationToken>()))
            .Callback<IMessage, CancellationToken>((msg, ct) =>
            {
                if (msg is DeleteResource cmd) capturedCommand = cmd;
            })
            .Returns(Task.CompletedTask);

        var handler = CreateMapperAsEventHandler<ParkingSpotDeleted>(messageBrokerMock.Object);
        if (handler == null)
        {
            Assert.Fail("Mapper class should exist and implement IEventHandler<ParkingSpotDeleted>");
            return;
        }

        // Act
        await handler.HandleAsync(@event);

        // Assert - Should publish DeleteResource command with correct ResourceId
        Assert.NotNull(capturedCommand);
        Assert.Equal(parkingSpotId, capturedCommand.ResourceId);
    }

    #endregion

    #region Helper Methods

    private static IParkingSpotsService? CreateParkingSpotsService(
        ParkingSpotsDbContext context,
        IMessageBroker messageBroker)
    {
        var constructors = typeof(ParkingSpotsService).GetConstructors(
            BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);

        // Find constructor that takes IMessageBroker but NOT IModuleClient
        // (Exercise requires removing IModuleClient dependency)
        var constructor = constructors.FirstOrDefault(c =>
        {
            var parameters = c.GetParameters();
            var hasMessageBroker = parameters.Any(p => p.ParameterType == typeof(IMessageBroker));
            var hasModuleClient = parameters.Any(p => p.ParameterType == typeof(IModuleClient));
            return hasMessageBroker && !hasModuleClient;
        });

        if (constructor == null)
            return null;

        var parameters = constructor.GetParameters();
        var args = new object?[parameters.Length];

        for (int i = 0; i < parameters.Length; i++)
        {
            var paramType = parameters[i].ParameterType;
            if (paramType == typeof(ParkingSpotsDbContext))
                args[i] = context;
            else if (paramType == typeof(IMessageBroker))
                args[i] = messageBroker;
        }

        return constructor.Invoke(args) as IParkingSpotsService;
    }

    private static IEventHandler<TEvent>? CreateMapperAsEventHandler<TEvent>(IMessageBroker messageBroker)
        where TEvent : class, IEvent
    {
        var assembly = GetMappingApiAssembly();
        var mapperType = assembly.GetType(MapperTypeName);

        if (mapperType == null)
            return null;

        // Check if Mapper implements IEventHandler<TEvent>
        var eventHandlerInterface = typeof(IEventHandler<TEvent>);
        if (!eventHandlerInterface.IsAssignableFrom(mapperType))
            return null;

        // Find constructor with IMessageBroker
        var constructors = mapperType.GetConstructors(
            BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);

        var constructor = constructors.FirstOrDefault(c =>
            c.GetParameters().Any(p => p.ParameterType == typeof(IMessageBroker)));

        if (constructor == null)
            return null;

        // Build parameters
        var parameters = constructor.GetParameters();
        var args = new object?[parameters.Length];

        for (int i = 0; i < parameters.Length; i++)
        {
            var paramType = parameters[i].ParameterType;
            if (paramType == typeof(IMessageBroker))
                args[i] = messageBroker;
        }

        return constructor.Invoke(args) as IEventHandler<TEvent>;
    }

    #endregion
}
