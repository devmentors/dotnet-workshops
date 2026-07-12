using Microsoft.Extensions.Options;
using Shop.Options;
using Xunit;

namespace Exercises.Tests._03_DEBUG;

public class ThresholdExampleTests
{
    private static ShippingService BuildService(decimal threshold) =>
        new ShippingService(Options.Create(new ShopOptions { FreeShippingThreshold = threshold }));
    
    [Fact]
    public void free_shipping_is_inclusive_exactly_at_threshold()
    {
        Assert.True(BuildService(200m).IsFree(200m));
    }

    [Fact]
    public void free_shipping_is_not_granted_just_below_threshold()
    {
        Assert.False(BuildService(200m).IsFree(199.99m));
    }
}
