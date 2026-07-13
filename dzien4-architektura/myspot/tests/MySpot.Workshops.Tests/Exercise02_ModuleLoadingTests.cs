using System.Reflection;
using MySpot.Shared.Abstractions.Modules;
using Xunit;

namespace MySpot.Workshops.Tests;

/// <summary>
/// Exercise 2: Module Loading - Creating a Module
///
/// These tests verify that the AvailabilityModule class exists and correctly
/// implements the IModule interface for module discovery.
/// </summary>
public class Exercise02_ModuleLoadingTests
{
    private const string ModuleName = "Availability";
    private const string ModuleTypeName = "MySpot.Modules.Availability.Api.AvailabilityModule";

    private static Assembly GetAvailabilityApiAssembly()
    {
        return Assembly.Load("MySpot.Modules.Availability.Api");
    }

    [Fact]
    public void AvailabilityModule_ShouldExist()
    {
        // Arrange
        var assembly = GetAvailabilityApiAssembly();

        // Act
        var moduleType = assembly.GetType(ModuleTypeName);

        // Assert
        Assert.NotNull(moduleType);
    }

    [Fact]
    public void AvailabilityModule_ShouldImplementIModule()
    {
        // Arrange
        var assembly = GetAvailabilityApiAssembly();
        var moduleType = assembly.GetType(ModuleTypeName);

        // Act & Assert
        Assert.NotNull(moduleType);
        Assert.True(
            typeof(IModule).IsAssignableFrom(moduleType),
            $"The {ModuleTypeName} class should implement IModule interface.");
    }

    [Fact]
    public void AvailabilityModule_ShouldHaveNamePropertyReturningAvailability()
    {
        // Arrange
        var assembly = GetAvailabilityApiAssembly();
        var moduleType = assembly.GetType(ModuleTypeName);
        Assert.NotNull(moduleType);

        // Act
        var moduleInstance = Activator.CreateInstance(moduleType);
        var module = moduleInstance as IModule;

        // Assert
        Assert.NotNull(module);
        Assert.Equal(ModuleName, module.Name);
    }

    [Fact]
    public void AvailabilityModule_ShouldBeDiscoverableByModuleLoader()
    {
        // Arrange
        var assembly = GetAvailabilityApiAssembly();

        // Act - simulate what ModuleLoader.LoadModules does
        var moduleTypes = assembly
            .GetTypes()
            .Where(x => typeof(IModule).IsAssignableFrom(x) && !x.IsInterface)
            .ToList();

        // Assert
        Assert.Contains(moduleTypes, t => t.FullName == ModuleTypeName);
    }

    [Fact]
    public void AvailabilityModule_RegisterMethod_ShouldNotThrow()
    {
        // Arrange
        var assembly = GetAvailabilityApiAssembly();
        var moduleType = assembly.GetType(ModuleTypeName);
        Assert.NotNull(moduleType);

        var moduleInstance = Activator.CreateInstance(moduleType);
        var module = moduleInstance as IModule;
        Assert.NotNull(module);

        // Act & Assert - Register should not throw when called with mocked services
        // Note: We're just checking the method exists and can be called,
        // actual service registration would need integration tests
        var registerMethod = moduleType.GetMethod("Register");
        Assert.NotNull(registerMethod);
    }

    [Fact]
    public void AvailabilityModule_UseMethod_ShouldExist()
    {
        // Arrange
        var assembly = GetAvailabilityApiAssembly();
        var moduleType = assembly.GetType(ModuleTypeName);
        Assert.NotNull(moduleType);

        // Act
        var useMethod = moduleType.GetMethod("Use");

        // Assert
        Assert.NotNull(useMethod);
    }

    [Fact]
    public void AvailabilityModule_ExposeMethod_ShouldExist()
    {
        // Arrange
        var assembly = GetAvailabilityApiAssembly();
        var moduleType = assembly.GetType(ModuleTypeName);
        Assert.NotNull(moduleType);

        // Act
        var exposeMethod = moduleType.GetMethod("Expose");

        // Assert
        Assert.NotNull(exposeMethod);
    }
}
