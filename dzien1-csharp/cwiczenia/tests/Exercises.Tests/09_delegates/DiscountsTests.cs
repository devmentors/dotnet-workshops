using Exercises.Delegates;
using Xunit;

namespace Exercises.Tests.Delegates;

public class DiscountsTests
{
    [Fact]
    public void Apply_runs_the_rule_on_the_price()
    {
        var result = Discounts.Apply(100m, price => price * 0.9m);

        Assert.Equal(90m, result);
    }

    [Fact]
    public void PercentOff_builds_a_rule_that_subtracts_the_percentage()
    {
        var twentyOff = Discounts.PercentOff(20m);

        Assert.Equal(80m, twentyOff(100m));
    }

    [Fact]
    public void PercentOff_captures_its_own_percent()
    {
        var tenOff = Discounts.PercentOff(10m);
        var fiftyOff = Discounts.PercentOff(50m);

        Assert.Equal(90m, tenOff(100m));
        Assert.Equal(50m, fiftyOff(100m));
    }

    [Fact]
    public void BestPrice_returns_the_lowest_discounted_price()
    {
        var rules = new[]
        {
            Discounts.PercentOff(10m),
            Discounts.PercentOff(25m),
            Discounts.PercentOff(5m),
        };

        Assert.Equal(75m, Discounts.BestPrice(100m, rules));
    }

    [Fact]
    public void BestPrice_without_rules_returns_the_original_price()
    {
        Assert.Equal(100m, Discounts.BestPrice(100m, []));
    }
}
