using Microsoft.Extensions.Options;

namespace Shop.Core.Shipping;

public class ShippingOptions
{
    public decimal FreeShippingThreshold { get; set; }
    public decimal FlatRate { get; set; }
}

public class ShippingService
{
    private readonly ShippingOptions _options;

    public ShippingService(IOptions<ShippingOptions> options)
    {
        _options = options.Value;
    }

    public decimal FlatRate() => _options.FlatRate;

    public bool IsFree(decimal cartTotal)
    {
        // TODO: czy koszyk osiągnął próg darmowej dostawy.
        throw new NotImplementedException("Zaimplementuj IsFree: czy koszyk osiągnął próg darmowej dostawy (włącznie).");
    }
}
