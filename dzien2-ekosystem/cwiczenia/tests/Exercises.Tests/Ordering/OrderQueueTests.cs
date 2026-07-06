using Shop.Core.Ordering;
using Shop.Core.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Exercises.Tests;

public class OrderQueueTests : IClassFixture<TestingWebAppFactory>
{
    private readonly TestingWebAppFactory _factory;

    public OrderQueueTests(TestingWebAppFactory factory) => _factory = factory;

    [Fact]
    public async Task worker_processes_duplicate_delivery_once()
    {
        _factory.CreateClient();
        var queue = _factory.Services.GetRequiredService<OrderQueue>();
        
        await queue.Enqueue(new Order { Id = 100, CustomerId = 1 });
        await queue.Enqueue(new Order { Id = 100, CustomerId = 1 });
        
        await WaitUntil(() => CountProcessed(100) >= 1, timeoutMs: 3000);
        await Task.Delay(300);

        Assert.Equal(1, CountProcessed(100));
    }

    private int CountProcessed(int orderId)
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ShopContext>();
        return db.ProcessedOrders.Count(p => p.OrderId == orderId);
    }

    private static async Task WaitUntil(Func<bool> condition, int timeoutMs)
    {
        var waited = 0;
        while (waited < timeoutMs)
        {
            if (condition()) return;
            await Task.Delay(50);
            waited += 50;
        }
    }
}
