namespace Shop.Payments;

public interface IPaymentGateway
{
    bool Charge(decimal amount);
}

public sealed class AlwaysOkGateway : IPaymentGateway
{
    public bool Charge(decimal amount) => true;
}

public record OrderRequest(string Product, int Quantity, decimal UnitPrice);

public sealed class OrderService
{
    private readonly IPaymentGateway _gateway;

    public OrderService(IPaymentGateway gateway) => _gateway = gateway;

    public bool Place(OrderRequest order)
    {
        if (order.Quantity <= 0)
        {
            throw new ArgumentException("Ilość musi być dodatnia.", nameof(order));
        }

        var amount = order.Quantity * order.UnitPrice;
        return _gateway.Charge(amount);
    }
}
