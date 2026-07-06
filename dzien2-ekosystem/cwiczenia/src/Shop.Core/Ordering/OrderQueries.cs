using Microsoft.EntityFrameworkCore;
using Shop.Core.Persistence;

namespace Shop.Core.Ordering;

public record OrderSummary(int OrderId, string Customer, int Items);

public static class OrderQueries
{
    public static Task<List<OrderSummary>> All(ShopContext db)
        => db.Orders
            .Select(o => new OrderSummary(o.Id, o.Customer!.Name, o.Lines.Count))
            .ToListAsync();

    // ZADANIE (OrderQueriesTests): ByCustomer — zamówienia klienta o danej nazwie
    public static Task<List<OrderSummary>> ByCustomer(ShopContext db, string customer)
    {
        throw new NotImplementedException("Zaimplementuj ByCustomer: zamówienia klienta o nazwie 'customer' jako OrderSummary (jak All, z filtrem po Customer.Name).");
    }
}
