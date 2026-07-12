using System.Collections;
using Microsoft.Extensions.Options;
using Shop.Options;
using Xunit;

namespace Exercises.Tests._05_TESTY.examples;

public class ShippingTheoryExample
{
    private static ShippingService BuildService() =>
        new ShippingService(Options.Create(new ShopOptions { FreeShippingThreshold = 200m }));

    [Theory]
    [InlineData(199.99, false)]
    [InlineData(200.00, true)]
    [InlineData(250.00, true)]
    [InlineData(0.00, false)]
    public void free_shipping_follows_threshold_inline(decimal cartTotal, bool expected)
    {
        Assert.Equal(expected, BuildService().IsFree(cartTotal));
    }

    public static IEnumerable<object[]> ThresholdCases()
    {
        yield return new object[] { 199.99m, false };
        yield return new object[] { 200m, true };
        yield return new object[] { 500m, true };
    }

    [Theory]
    [MemberData(nameof(ThresholdCases))]
    public void free_shipping_follows_threshold_member(decimal cartTotal, bool expected)
    {
        Assert.Equal(expected, BuildService().IsFree(cartTotal));
    }

    private sealed class ThresholdData : IEnumerable<object[]>
    {
        public IEnumerator<object[]> GetEnumerator()
        {
            yield return new object[] { 199.99m, false };
            yield return new object[] { 200m, true };
            yield return new object[] { 1000m, true };
        }

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
    }

    [Theory]
    [ClassData(typeof(ThresholdData))]
    public void free_shipping_follows_threshold_class(decimal cartTotal, bool expected)
    {
        Assert.Equal(expected, BuildService().IsFree(cartTotal));
    }
}
