using Microsoft.Extensions.Options;

namespace Shop.Options;

public class ShopOptions
{
    public decimal FreeShippingThreshold { get; set; }
}

public sealed class ShippingService
{
    private readonly ShopOptions _options;

    public ShippingService(IOptions<ShopOptions> options) => _options = options.Value;

    public bool IsFree(decimal cartTotal) => cartTotal >= _options.FreeShippingThreshold;
}
