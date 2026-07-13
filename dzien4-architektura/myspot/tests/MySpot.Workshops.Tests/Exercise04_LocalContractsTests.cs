using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Moq;
using MySpot.Modules.ParkingSpots.Core.DAL;
using MySpot.Modules.ParkingSpots.Core.Entities;
using MySpot.Modules.ParkingSpots.Core.Services;
using MySpot.Shared.Abstractions.Messaging;
using MySpot.Shared.Abstractions.Modules;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MySpot.Workshops.Tests;

/// <summary>
/// Exercise 4: Local Contracts - HTTP-like Module Communication
///
/// These tests verify that:
/// 1. AvailabilityModule subscribes to module requests in the Use method
/// 2. ParkingSpotsService uses IModuleClient instead of IAvailabilityModuleApi
/// </summary>
public class Exercise04_LocalContractsTests
{
    private const string AvailabilityModuleTypeName = "MySpot.Modules.Availability.Api.AvailabilityModule";
    private const string ExpectedPath = "availability/resources/add";
    private const int ExpectedCapacity = 2;

    private static Assembly GetAvailabilityApiAssembly()
    {
        return Assembly.Load("MySpot.Modules.Availability.Api");
    }

    #region Part 1: AvailabilityModule Tests

    [Fact]
    public void AvailabilityModule_UseMethod_ShouldCallUseModuleRequests()
    {
        // Arrange
        var assembly = GetAvailabilityApiAssembly();
        var moduleType = assembly.GetType(AvailabilityModuleTypeName);
        Assert.NotNull(moduleType);

        var moduleInstance = Activator.CreateInstance(moduleType);
        var module = moduleInstance as IModule;
        Assert.NotNull(module);

        // Get the Use method body to check if it contains UseModuleRequests
        var useMethod = moduleType.GetMethod("Use");
        Assert.NotNull(useMethod);

        // Check the method body for the UseModuleRequests call
        var methodBody = useMethod.GetMethodBody();
        Assert.NotNull(methodBody);

        // If the method body has IL code (not empty), it should be using UseModuleRequests
        var ilBytes = methodBody.GetILAsByteArray();
        Assert.True(ilBytes != null && ilBytes.Length > 2,
            "The Use method should contain code that calls UseModuleRequests().Subscribe<AddResource>()");
    }

    [Fact]
    public void AvailabilityModule_UseMethod_ShouldNotBeEmpty()
    {
        // Arrange
        var assembly = GetAvailabilityApiAssembly();
        var moduleType = assembly.GetType(AvailabilityModuleTypeName);
        Assert.NotNull(moduleType);

        var useMethod = moduleType.GetMethod("Use");
        Assert.NotNull(useMethod);

        var methodBody = useMethod.GetMethodBody();
        Assert.NotNull(methodBody);

        // An empty method typically has just a 'ret' instruction (1 byte)
        // A method with actual code will have more bytes
        var ilBytes = methodBody.GetILAsByteArray();
        Assert.True(ilBytes != null && ilBytes.Length > 1,
            "The Use method should not be empty - it should subscribe to module requests for 'availability/resources/add'");
    }

    #endregion

    #region Part 2: ParkingSpotsService Tests

    [Fact]
    public void ParkingSpotsService_Constructor_ShouldAcceptIModuleClient()
    {
        // Arrange
        var constructors = typeof(ParkingSpotsService).GetConstructors(
            BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);

        // Act & Assert
        var hasModuleClientConstructor = constructors.Any(c =>
            c.GetParameters().Any(p => p.ParameterType == typeof(IModuleClient)));

        Assert.True(hasModuleClientConstructor,
            "ParkingSpotsService should have a constructor that accepts IModuleClient");
    }

    [Fact]
    public void ParkingSpotsService_Constructor_ShouldNotAcceptIAvailabilityModuleApi()
    {
        // Arrange
        var constructors = typeof(ParkingSpotsService).GetConstructors(
            BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);

        var availabilityApiType = Type.GetType(
            "MySpot.Modules.Availability.Shared.IAvailabilityModuleApi, MySpot.Modules.Availability.Shared");

        // Act & Assert
        if (availabilityApiType != null)
        {
            var hasAvailabilityApiConstructor = constructors.Any(c =>
                c.GetParameters().Any(p => p.ParameterType == availabilityApiType));

            Assert.False(hasAvailabilityApiConstructor,
                "ParkingSpotsService should NOT have a constructor that accepts IAvailabilityModuleApi - use IModuleClient instead");
        }
    }

    [Fact]
    public async Task AddAsync_ShouldCallModuleClientSendAsync()
    {
        // Arrange - use reflection to create service with IModuleClient
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
        var moduleClientMock = new Mock<IModuleClient>();

        string? capturedPath = null;
        object? capturedRequest = null;

        moduleClientMock
            .Setup(x => x.SendAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<CancellationToken>()))
            .Callback<string, object, CancellationToken>((path, request, ct) =>
            {
                capturedPath = path;
                capturedRequest = request;
            })
            .Returns(Task.CompletedTask);

        // Try to create service using reflection to find the right constructor
        var service = CreateParkingSpotsServiceWithModuleClient(context, messageBrokerMock.Object, moduleClientMock.Object);

        if (service == null)
        {
            Assert.Fail("ParkingSpotsService should have a constructor that accepts IModuleClient");
            return;
        }

        // Act
        await service.AddAsync(parkingSpot);

        // Assert
        moduleClientMock.Verify(
            x => x.SendAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<CancellationToken>()),
            Times.Once,
            "ParkingSpotsService should call IModuleClient.SendAsync() when adding a parking spot");

        Assert.NotNull(capturedPath);
        Assert.Equal(ExpectedPath, capturedPath);
    }

    [Fact]
    public async Task AddAsync_ShouldSendCorrectResourceId()
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
        var moduleClientMock = new Mock<IModuleClient>();

        object? capturedRequest = null;

        moduleClientMock
            .Setup(x => x.SendAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<CancellationToken>()))
            .Callback<string, object, CancellationToken>((path, request, ct) => capturedRequest = request)
            .Returns(Task.CompletedTask);

        var service = CreateParkingSpotsServiceWithModuleClient(context, messageBrokerMock.Object, moduleClientMock.Object);

        if (service == null)
        {
            Assert.Fail("ParkingSpotsService should have a constructor that accepts IModuleClient");
            return;
        }

        // Act
        await service.AddAsync(parkingSpot);

        // Assert
        Assert.NotNull(capturedRequest);

        var resourceIdProperty = capturedRequest.GetType().GetProperty("ResourceId");
        Assert.NotNull(resourceIdProperty);

        var resourceId = resourceIdProperty.GetValue(capturedRequest);
        Assert.Equal(parkingSpotId, resourceId);
    }

    [Fact]
    public async Task AddAsync_ShouldSendCorrectCapacity()
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
        var moduleClientMock = new Mock<IModuleClient>();

        object? capturedRequest = null;

        moduleClientMock
            .Setup(x => x.SendAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<CancellationToken>()))
            .Callback<string, object, CancellationToken>((path, request, ct) => capturedRequest = request)
            .Returns(Task.CompletedTask);

        var service = CreateParkingSpotsServiceWithModuleClient(context, messageBrokerMock.Object, moduleClientMock.Object);

        if (service == null)
        {
            Assert.Fail("ParkingSpotsService should have a constructor that accepts IModuleClient");
            return;
        }

        // Act
        await service.AddAsync(parkingSpot);

        // Assert
        Assert.NotNull(capturedRequest);

        var capacityProperty = capturedRequest.GetType().GetProperty("Capacity");
        Assert.NotNull(capacityProperty);

        var capacity = capacityProperty.GetValue(capturedRequest);
        Assert.Equal(ExpectedCapacity, capacity);
    }

    [Fact]
    public async Task AddAsync_ShouldSendParkingSpotTag()
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
        var moduleClientMock = new Mock<IModuleClient>();

        object? capturedRequest = null;

        moduleClientMock
            .Setup(x => x.SendAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<CancellationToken>()))
            .Callback<string, object, CancellationToken>((path, request, ct) => capturedRequest = request)
            .Returns(Task.CompletedTask);

        var service = CreateParkingSpotsServiceWithModuleClient(context, messageBrokerMock.Object, moduleClientMock.Object);

        if (service == null)
        {
            Assert.Fail("ParkingSpotsService should have a constructor that accepts IModuleClient");
            return;
        }

        // Act
        await service.AddAsync(parkingSpot);

        // Assert
        Assert.NotNull(capturedRequest);

        var tagsProperty = capturedRequest.GetType().GetProperty("Tags");
        Assert.NotNull(tagsProperty);

        var tags = tagsProperty.GetValue(capturedRequest) as IEnumerable<string>;
        Assert.NotNull(tags);
        Assert.Contains("parking_spot", tags);
    }

    #endregion

    #region Helper Methods

    private static IParkingSpotsService? CreateParkingSpotsServiceWithModuleClient(
        ParkingSpotsDbContext context,
        IMessageBroker messageBroker,
        IModuleClient moduleClient)
    {
        var constructors = typeof(ParkingSpotsService).GetConstructors(
            BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);

        // Find constructor with IModuleClient
        var constructor = constructors.FirstOrDefault(c =>
            c.GetParameters().Any(p => p.ParameterType == typeof(IModuleClient)));

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
            else if (paramType == typeof(IModuleClient))
                args[i] = moduleClient;
        }

        return constructor.Invoke(args) as IParkingSpotsService;
    }

    #endregion
}
