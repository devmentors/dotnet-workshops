using Microsoft.EntityFrameworkCore;
using Shop.Core.Ordering;
using Shop.Core.Persistence;
using Xunit;

namespace Exercises.Tests;

public class OrderQueriesTests
{
    private static ShopContext NewContext()
        => new(new DbContextOptionsBuilder<ShopContext>()
            .UseInMemoryDatabase($"orders-{Guid.NewGuid():n}").Options);

    [Fact]
    public async Task by_customer_returns_only_that_customers_orders_with_item_count()
    {
        await using var db = NewContext();
        var ada = new Customer { Name = "Ada" };
        var bob = new Customer { Name = "Bob" };
        db.Customers.AddRange(ada, bob);
        db.Orders.AddRange(
            new Order { Customer = ada, Lines = { new OrderLine { ProductId = 1, Quantity = 2 }, new OrderLine { ProductId = 2, Quantity = 1 } } },
            new Order { Customer = ada, Lines = { new OrderLine { ProductId = 1, Quantity = 1 } } },
            new Order { Customer = bob, Lines = { new OrderLine { ProductId = 3, Quantity = 5 } } });
        await db.SaveChangesAsync();

        var result = await OrderQueries.ByCustomer(db, "Ada");

        Assert.Equal(2, result.Count);
        Assert.All(result, r => Assert.Equal("Ada", r.Customer));
        Assert.Contains(result, r => r.Items == 2);
    }
}
