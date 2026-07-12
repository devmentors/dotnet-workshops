using Contoso.Legacy;

namespace Shop.Pricing;

public sealed class InvoiceRounding
{
    private readonly LegacyMoney _money = new();
    
    public decimal FinalAmount(decimal net, int quantity)
    {
        var tier = quantity >= 100 ? 7 : 1;
        return _money.RoundToTier(net, tier);
    }
}
