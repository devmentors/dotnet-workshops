namespace Shop.Core.Ordering;

// ZADANIE (OrderPricingTests): wstrzyknij IDiscountPolicy konstruktorem i deleguj do niej z NetTotal (zależ od abstrakcji, nie od DiscountService).
public class OrderPricing
{
    public OrderPricing(IDiscountPolicy discounts)
    {
    }

    public decimal NetTotal(decimal price, int quantity)
    {
        throw new NotImplementedException("Zaimplementuj NetTotal: policz wynik delegując do wstrzykniętej IDiscountPolicy.");
    }
}
