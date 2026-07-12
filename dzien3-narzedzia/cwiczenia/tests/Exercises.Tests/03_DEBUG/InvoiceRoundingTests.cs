using Shop.Pricing;
using Xunit;

namespace Exercises.Tests._03_DEBUG;

public class InvoiceRoundingTests
{
    [Theory]
    [InlineData(199.99, 10, 199.99)]
    [InlineData(199.99, 100, 199.99)]
    [InlineData(1000.00, 250, 1000.00)]
    public void final_amount_matches_expected(decimal net, int quantity, decimal expected)
        => Assert.Equal(expected, new InvoiceRounding().FinalAmount(net, quantity));
}
