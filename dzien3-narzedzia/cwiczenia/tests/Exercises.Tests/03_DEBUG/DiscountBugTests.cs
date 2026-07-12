using Shop.Pricing;
using Xunit;

namespace Exercises.Tests._03_DEBUG;

public class DiscountBugTests
{
    [Theory]
    [InlineData(9, 900)]
    [InlineData(10, 950)]
    [InlineData(15, 1425)]
    [InlineData(19, 1805)]
    [InlineData(20, 1800)]
    public void net_after_discount_matches_expected(int quantity, decimal expectedNet)
    {
        Assert.Equal(expectedNet, new DiscountService().NetAfterDiscount(100m, quantity));
    }
}
