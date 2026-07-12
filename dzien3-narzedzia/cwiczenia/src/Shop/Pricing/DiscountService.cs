namespace Shop.Pricing;

public sealed class DiscountService
{
    public decimal NetAfterDiscount(decimal price, int quantity)
    {
        var total = price * quantity;
        var rate = 0m;

        if (quantity >= 10)
        {
            rate = 0.05m;
        }

        if (quantity >= 20)
        {
            rate = 0.10m;
        }

        total *= 1m - rate;

        return Math.Round(total, 2, MidpointRounding.AwayFromZero);
    }
}
