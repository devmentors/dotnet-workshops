using Shop.Core.Shipping;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Exercises.Tests;

public class FreeShippingTests : IClassFixture<TestingWebAppFactory>
{
    private readonly TestingWebAppFactory _factory;

    public FreeShippingTests(TestingWebAppFactory factory) => _factory = factory;

    private ShippingService Resolve()
    {
        var scope = _factory.Services.CreateScope();
        return scope.ServiceProvider.GetRequiredService<ShippingService>();
    }

    [Fact]
    public void below_threshold_is_not_free()
    {
        Assert.False(Resolve().IsFree(199m));
    }

    [Fact]
    public void exactly_at_threshold_is_free()
    {
        Assert.True(Resolve().IsFree(200m));
    }

    [Fact]
    public void above_threshold_is_free()
    {
        Assert.True(Resolve().IsFree(250m));
    }
}
