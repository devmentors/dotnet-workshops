using Shop.Core.Shipping;

namespace Shop.Api.Shipping;

public static class ShippingEndpoints
{
    public static void MapShipping(this WebApplication app)
    {
        app.MapGet("/shipping/rate", (ShippingService shipping) => Results.Ok(new { flatRate = shipping.FlatRate() }));

        // ZADANIE (options): darmowa dostawa - odpali Twój stub ShippingService.IsFree.
        app.MapGet("/shipping/free/{cartTotal:decimal}", (decimal cartTotal, ShippingService shipping)
            => Results.Ok(new { free = shipping.IsFree(cartTotal) }));
    }
}
