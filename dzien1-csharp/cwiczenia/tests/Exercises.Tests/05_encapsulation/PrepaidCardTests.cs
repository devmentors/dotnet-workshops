using Exercises.Encapsulation;
using Xunit;

namespace Exercises.Tests.Encapsulation;

public class PrepaidCardTests
{
    // Wywołania przez dynamic, żeby projekt kompilował się także zanim
    // napiszesz właściwości i metody. Gdy czegoś brakuje, komunikat testu
    // mówi, którego składnika nie ma.

    [Fact]
    public void Owner_is_trimmed_on_set()
    {
        dynamic card = new PrepaidCard();

        card.Owner = "  Darek  ";

        Assert.Equal("Darek", (string)card.Owner);
    }

    [Fact]
    public void Owner_rejects_a_blank_value()
    {
        dynamic card = new PrepaidCard();

        Assert.Throws<ArgumentException>(() => card.Owner = "   ");
    }

    [Fact]
    public void TopUp_increases_the_balance()
    {
        dynamic card = new PrepaidCard();

        card.TopUp(50m);

        Assert.Equal(50m, (decimal)card.Balance);
    }

    [Fact]
    public void TopUp_rejects_a_non_positive_amount()
    {
        dynamic card = new PrepaidCard();

        Assert.Throws<ArgumentOutOfRangeException>(() => { card.TopUp(0m); });
        Assert.Throws<ArgumentOutOfRangeException>(() => { card.TopUp(-10m); });
    }

    [Fact]
    public void Pay_decreases_the_balance()
    {
        dynamic card = new PrepaidCard();
        card.TopUp(50m);

        card.Pay(12.50m);

        Assert.Equal(37.50m, (decimal)card.Balance);
    }

    [Fact]
    public void Pay_above_the_balance_throws()
    {
        dynamic card = new PrepaidCard();
        card.TopUp(10m);

        Assert.Throws<InvalidOperationException>(() => { card.Pay(10.01m); });
    }

    [Fact]
    public void Balance_cannot_be_set_from_outside()
    {
        dynamic card = new PrepaidCard();

        // Prywatny set: przypisanie z zewnątrz ma się nie udać.
        Assert.ThrowsAny<Exception>(() => card.Balance = 1000m);
    }
}
