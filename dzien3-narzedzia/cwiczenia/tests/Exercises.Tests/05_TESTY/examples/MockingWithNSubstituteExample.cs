using NSubstitute;
using NSubstitute.ExceptionExtensions;
using Xunit;

namespace Exercises.Tests._05_TESTY.examples;

public interface IPricingApi
{
    decimal GetRate(string currency);
    Task<decimal> GetRateAsync(string currency);
}

public class MockingWithNSubstituteExample
{
    [Fact]
    public void configured_returns_matchers_sequences_and_callbacks()
    {
        var api = Substitute.For<IPricingApi>();

        api.GetRate(Arg.Any<string>()).Returns(1m);
        api.GetRate("EUR").Returns(4.30m);
        api.GetRate("GBP").Returns(ci => ci.Arg<string>().Length);
        api.GetRate("PLN").Returns(1m, 2m, 3m);

        Assert.Equal(4.30m, api.GetRate("EUR"));
        Assert.Equal(1m, api.GetRate("CHF"));
        Assert.Equal(3m, api.GetRate("GBP"));
        Assert.Equal(1m, api.GetRate("PLN"));
        Assert.Equal(2m, api.GetRate("PLN"));
        Assert.Equal(3m, api.GetRate("PLN"));
    }

    [Fact]
    public async Task throwing_and_async_configuration()
    {
        var api = Substitute.For<IPricingApi>();

        api.GetRate("XXX").Throws(new KeyNotFoundException());
        api.GetRateAsync("EUR").Returns(Task.FromResult(4.30m));

        Assert.Throws<KeyNotFoundException>(() => api.GetRate("XXX"));
        Assert.Equal(4.30m, await api.GetRateAsync("EUR"));
    }

    [Fact]
    public async Task verify_how_the_dependency_was_called()
    {
        var api = Substitute.For<IPricingApi>();
        api.GetRateAsync(Arg.Any<string>()).Returns(Task.FromResult(4m));

        await api.GetRateAsync("EUR");
        await api.GetRateAsync("USD");

        await api.Received(2).GetRateAsync(Arg.Any<string>());
        await api.Received(1).GetRateAsync(Arg.Is<string>(c => c == "EUR"));
        await api.DidNotReceive().GetRateAsync("JPY");
    }
}
