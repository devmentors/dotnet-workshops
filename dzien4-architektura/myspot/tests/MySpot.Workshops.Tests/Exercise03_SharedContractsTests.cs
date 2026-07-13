using System.Reflection;
using Moq;
using MySpot.Modules.Availability.Shared;
using MySpot.Modules.Availability.Shared.DTO;
using MySpot.Modules.ParkingSpots.Core.DAL;
using MySpot.Modules.ParkingSpots.Core.Entities;
using MySpot.Modules.ParkingSpots.Core.Services;
using MySpot.Shared.Abstractions.Messaging;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MySpot.Workshops.Tests;

/// <summary>
/// Exercise 3: Shared Contracts - Synchronous Communication Between Modules
///
/// These tests verify that when a ParkingSpot is created, the ParkingSpotsService
/// correctly calls the Availability module's API to create a corresponding resource.
///
/// Note: This exercise uses IAvailabilityModuleApi (Shared Contracts pattern).
/// Exercise #4 will replace this with IModuleClient (Local Contracts pattern).
/// </summary>
public class Exercise03_SharedContractsTests
{
    private const int ExpectedCapacity = 2;
    private static readonly string[] ExpectedTags = { "parking_spot" };

    [Fact]
    public void ParkingSpotsService_Constructor_ShouldAcceptIAvailabilityModuleApi()
    {
        // Arrange
        var constructors = typeof(ParkingSpotsService).GetConstructors(
            BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);

        // Act & Assert
        var hasAvailabilityApiConstructor = constructors.Any(c =>
            c.GetParameters().Any(p => p.ParameterType == typeof(IAvailabilityModuleApi)));

        Assert.True(hasAvailabilityApiConstructor,
            "ParkingSpotsService should have a constructor that accepts IAvailabilityModuleApi");
    }

    [Fact]
    public async Task AddAsync_ShouldCallAvailabilityModuleApi_WithCorrectDto()
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
        var availabilityApiMock = new Mock<IAvailabilityModuleApi>();

        AddResourceDto? capturedDto = null;
        availabilityApiMock
            .Setup(x => x.AddResourceAsync(It.IsAny<AddResourceDto>()))
            .Callback<AddResourceDto>(dto => capturedDto = dto)
            .Returns(Task.CompletedTask);

        var service = CreateParkingSpotsServiceWithAvailabilityApi(context, messageBrokerMock.Object, availabilityApiMock.Object);

        if (service == null)
        {
            Assert.Fail("ParkingSpotsService should have a constructor that accepts IAvailabilityModuleApi");
            return;
        }

        // Act
        await service.AddAsync(parkingSpot);

        // Assert
        availabilityApiMock.Verify(
            x => x.AddResourceAsync(It.IsAny<AddResourceDto>()),
            Times.Once,
            "The ParkingSpotsService should call IAvailabilityModuleApi.AddResourceAsync() when adding a parking spot.");

        Assert.NotNull(capturedDto);
        Assert.Equal(parkingSpotId, capturedDto.ResourceId);
        Assert.Equal(ExpectedCapacity, capturedDto.Capacity);
        Assert.Equal(ExpectedTags, capturedDto.Tags);
    }

    [Fact]
    public async Task AddAsync_ShouldPassParkingSpotIdAsResourceId()
    {
        // Arrange
        var parkingSpotId = Guid.NewGuid();
        var parkingSpot = new ParkingSpot
        {
            Id = parkingSpotId,
            Name = "Spot B2",
            DisplayOrder = 2
        };

        var options = new DbContextOptionsBuilder<ParkingSpotsDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        using var context = new ParkingSpotsDbContext(options);

        var messageBrokerMock = new Mock<IMessageBroker>();
        var availabilityApiMock = new Mock<IAvailabilityModuleApi>();

        var service = CreateParkingSpotsServiceWithAvailabilityApi(context, messageBrokerMock.Object, availabilityApiMock.Object);

        if (service == null)
        {
            Assert.Fail("ParkingSpotsService should have a constructor that accepts IAvailabilityModuleApi");
            return;
        }

        // Act
        await service.AddAsync(parkingSpot);

        // Assert
        availabilityApiMock.Verify(
            x => x.AddResourceAsync(It.Is<AddResourceDto>(dto => dto.ResourceId == parkingSpotId)),
            Times.Once,
            "The ResourceId in AddResourceDto should match the ParkingSpot's Id.");
    }

    [Fact]
    public async Task AddAsync_ShouldPassCapacityOf2()
    {
        // Arrange
        var parkingSpot = new ParkingSpot
        {
            Id = Guid.NewGuid(),
            Name = "Spot C3",
            DisplayOrder = 3
        };

        var options = new DbContextOptionsBuilder<ParkingSpotsDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        using var context = new ParkingSpotsDbContext(options);

        var messageBrokerMock = new Mock<IMessageBroker>();
        var availabilityApiMock = new Mock<IAvailabilityModuleApi>();

        var service = CreateParkingSpotsServiceWithAvailabilityApi(context, messageBrokerMock.Object, availabilityApiMock.Object);

        if (service == null)
        {
            Assert.Fail("ParkingSpotsService should have a constructor that accepts IAvailabilityModuleApi");
            return;
        }

        // Act
        await service.AddAsync(parkingSpot);

        // Assert
        availabilityApiMock.Verify(
            x => x.AddResourceAsync(It.Is<AddResourceDto>(dto => dto.Capacity == ExpectedCapacity)),
            Times.Once,
            "The Capacity in AddResourceDto should be 2 (ParkingSpotCapacity constant).");
    }

    [Fact]
    public async Task AddAsync_ShouldPassParkingSpotTag()
    {
        // Arrange
        var parkingSpot = new ParkingSpot
        {
            Id = Guid.NewGuid(),
            Name = "Spot D4",
            DisplayOrder = 4
        };

        var options = new DbContextOptionsBuilder<ParkingSpotsDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        using var context = new ParkingSpotsDbContext(options);

        var messageBrokerMock = new Mock<IMessageBroker>();
        var availabilityApiMock = new Mock<IAvailabilityModuleApi>();

        var service = CreateParkingSpotsServiceWithAvailabilityApi(context, messageBrokerMock.Object, availabilityApiMock.Object);

        if (service == null)
        {
            Assert.Fail("ParkingSpotsService should have a constructor that accepts IAvailabilityModuleApi");
            return;
        }

        // Act
        await service.AddAsync(parkingSpot);

        // Assert
        availabilityApiMock.Verify(
            x => x.AddResourceAsync(It.Is<AddResourceDto>(dto =>
                dto.Tags != null && dto.Tags.Contains("parking_spot"))),
            Times.Once,
            "The Tags in AddResourceDto should contain 'parking_spot'.");
    }

    #region Helper Methods

    private static IParkingSpotsService? CreateParkingSpotsServiceWithAvailabilityApi(
        ParkingSpotsDbContext context,
        IMessageBroker messageBroker,
        IAvailabilityModuleApi availabilityApi)
    {
        var constructors = typeof(ParkingSpotsService).GetConstructors(
            BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);

        // Find constructor with IAvailabilityModuleApi
        var constructor = constructors.FirstOrDefault(c =>
            c.GetParameters().Any(p => p.ParameterType == typeof(IAvailabilityModuleApi)));

        if (constructor == null)
        {
            return null;
        }

        // Build parameters based on constructor signature
        var parameters = constructor.GetParameters();
        var args = new object?[parameters.Length];

        for (int i = 0; i < parameters.Length; i++)
        {
            var paramType = parameters[i].ParameterType;
            if (paramType == typeof(ParkingSpotsDbContext))
                args[i] = context;
            else if (paramType == typeof(IMessageBroker))
                args[i] = messageBroker;
            else if (paramType == typeof(IAvailabilityModuleApi))
                args[i] = availabilityApi;
        }

        return constructor.Invoke(args) as IParkingSpotsService;
    }

    #endregion
}
