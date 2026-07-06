namespace Shop.Core.Ordering;

public class DiscountService : IDiscountPolicy
{
    public decimal NetAfterDiscount(decimal price, int quantity)
    {
        var total = price * quantity;
        if (quantity >= 10)
            total *= 0.9m;
        return Math.Round(total, 2, MidpointRounding.AwayFromZero);
    }
}
