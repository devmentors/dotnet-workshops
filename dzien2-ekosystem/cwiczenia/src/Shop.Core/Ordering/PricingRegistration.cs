using Microsoft.Extensions.DependencyInjection;

namespace Shop.Core.Ordering;

// ZADANIE (OrderPricingTests): AddPricing — powiąż IDiscountPolicy -> DiscountService i zarejestruj OrderPricing (Scoped);
public static class PricingRegistration
{
    public static IServiceCollection AddPricing(this IServiceCollection services)
    {
        // TODO: zarejestruj IDiscountPolicy i OrderPricing.
        throw new NotImplementedException("Zarejestruj IDiscountPolicy -> DiscountService oraz OrderPricing (Scoped) i zwróć services.");
    }
}
