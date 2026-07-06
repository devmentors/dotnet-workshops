using Shop.Core.Ordering;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Exercises.Tests;

public class OrderPricingTests
{
    private static OrderPricing Resolve()
    {
        var services = new ServiceCollection();
        services.AddPricing();
        var provider = services.BuildServiceProvider();
        return provider.GetRequiredService<OrderPricing>();
    }

    [Fact]
    public void container_resolves_order_pricing_with_injected_dependency()
    {
        var pricing = Resolve();

        Assert.NotNull(pricing);
    }

    [Fact]
    public void injected_discount_is_applied_at_threshold()
    {
        var pricing = Resolve();
        Assert.Equal(90.00m, pricing.NetTotal(10.00m, 10));
    }

    [Fact]
    public void below_threshold_keeps_full_price()
    {
        var pricing = Resolve();
        Assert.Equal(90.00m, pricing.NetTotal(10.00m, 9));
    }
    
    private sealed class FakeDiscountPolicy : IDiscountPolicy
    {
        public int CallCount { get; private set; }
        public decimal ReturnValue { get; init; }

        public decimal NetAfterDiscount(decimal price, int quantity)
        {
            CallCount++;
            return ReturnValue;
        }
    }

    [Fact]
    public void net_total_delegates_to_injected_policy()
    {
        var fake = new FakeDiscountPolicy { ReturnValue = 42.42m };

        var pricing = new OrderPricing(fake);
        var result = pricing.NetTotal(999.00m, 3);

        Assert.Equal(42.42m, result);
        Assert.Equal(1, fake.CallCount);
    }

    [Fact]
    public void injected_policy_is_used_even_when_swapped_in_the_container()
    {
        var fake = new FakeDiscountPolicy { ReturnValue = 7.00m };

        var services = new ServiceCollection();
        services.AddPricing();
        services.AddScoped<IDiscountPolicy>(_ => fake);
        var provider = services.BuildServiceProvider();

        var pricing = provider.GetRequiredService<OrderPricing>();

        Assert.Equal(7.00m, pricing.NetTotal(123.45m, 50));
    }
}
