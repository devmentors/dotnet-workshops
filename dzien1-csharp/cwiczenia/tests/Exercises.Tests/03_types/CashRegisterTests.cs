using Exercises.Types;
using Xunit;

namespace Exercises.Tests.Types;

public class CashRegisterTests
{
    // Wywołania przez dynamic, żeby projekt kompilował się także zanim
    // zadeklarujesz operatory i metody Scan. Gdy czegoś brakuje, komunikat
    // testu mówi, którego wariantu nie ma.
    private static Money Add(Money a, Money b) => (Money)((dynamic)a + (dynamic)b);
    private static Money Times(Money price, int quantity) => (Money)((dynamic)price * quantity);

    [Fact]
    public void Plus_operator_sums_Money_of_the_same_currency()
    {
        var sum = Add(new Money(10.50m, "PLN"), new Money(4.50m, "PLN"));

        Assert.Equal(15.00m, sum.Amount);
        Assert.Equal("PLN", sum.Currency);
    }

    [Fact]
    public void Plus_operator_throws_for_different_currencies()
    {
        Assert.Throws<InvalidOperationException>(
            () => Add(new Money(10m, "PLN"), new Money(10m, "EUR")));
    }

    [Fact]
    public void Star_operator_multiplies_the_amount_by_the_quantity()
    {
        var total = Times(new Money(4.50m, "PLN"), 3);

        Assert.Equal(13.50m, total.Amount);
        Assert.Equal("PLN", total.Currency);
    }

    [Fact]
    public void Scan_adds_a_single_price_to_the_total()
    {
        var register = new CashRegister("PLN");

        ((dynamic)register).Scan(new Money(19.99m, "PLN"));

        Assert.Equal(19.99m, register.Total.Amount);
    }

    [Fact]
    public void Scan_with_quantity_adds_price_times_quantity()
    {
        var register = new CashRegister("PLN");

        ((dynamic)register).Scan(new Money(9.00m, "PLN"), 3);
        ((dynamic)register).Scan(new Money(12.50m, "PLN"));

        Assert.Equal(39.50m, register.Total.Amount);
    }
}
