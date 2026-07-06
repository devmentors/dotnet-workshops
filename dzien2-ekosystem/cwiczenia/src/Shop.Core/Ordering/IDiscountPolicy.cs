namespace Shop.Core.Ordering;

public interface IDiscountPolicy
{
    decimal NetAfterDiscount(decimal price, int quantity);
}
