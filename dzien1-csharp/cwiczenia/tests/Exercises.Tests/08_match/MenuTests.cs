using Exercises.Match;
using Xunit;

namespace Exercises.Tests.Match;

public class MenuTests
{
    [Fact]
    public void Espresso_price_depends_on_the_number_of_shots()
    {
        Assert.Equal(9m, Menu.Price(new Espresso()));
        Assert.Equal(12m, Menu.Price(new Espresso { Shots = 2 }));
        Assert.Equal(12m, Menu.Price(new Espresso { Shots = 3 }));
    }

    [Fact]
    public void Latte_price_depends_on_the_size()
    {
        Assert.Equal(13m, Menu.Price(new Latte()));
        Assert.Equal(13m, Menu.Price(new Latte { SizeMl = 399 }));
        Assert.Equal(16m, Menu.Price(new Latte { SizeMl = 400 }));
        Assert.Equal(16m, Menu.Price(new Latte { SizeMl = 450 }));
    }

    [Fact]
    public void Tea_has_one_price()
    {
        Assert.Equal(8m, Menu.Price(new Tea()));
        Assert.Equal(8m, Menu.Price(new Tea { Herbal = true }));
    }

    [Fact]
    public void An_unknown_drink_throws()
    {
        Assert.Throws<ArgumentException>(() => Menu.Price(new Smoothie()));
    }

    [Fact]
    public void Only_herbal_tea_has_no_caffeine()
    {
        Assert.True(Menu.HasCaffeine(new Espresso()));
        Assert.True(Menu.HasCaffeine(new Latte()));
        Assert.True(Menu.HasCaffeine(new Tea()));
        Assert.False(Menu.HasCaffeine(new Tea { Herbal = true }));
    }

    // Napój spoza cennika - do testu odrzutnika `_`.
    private sealed class Smoothie : Drink;
}
