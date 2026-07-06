using Microsoft.EntityFrameworkCore;
using Shop.Core.Ordering;
using Shop.Core.Persistence;

namespace Shop.Api.Ordering;

public static class OrderingEndpoints
{
    public static void MapOrdering(this WebApplication app)
    {
        app.MapPost("/orders", async (CreateOrderRequest req, ShopContext db, OrderQueue queue) =>
        {
            var errors = new Dictionary<string, string[]>();
            if (req.CustomerId <= 0)
                errors["customerId"] = ["Wymagany klient."];
            if (req.Quantity <= 0)
                errors["quantity"] = ["Ilość musi być dodatnia."];

            if (errors.Count > 0)
                return Results.ValidationProblem(errors);

            if (req.Quantity > 100)
                return Results.Problem("Zbyt duża ilość w jednej pozycji.", statusCode: 422);

            var order = new Order
            {
                CustomerId = req.CustomerId,
                Lines = { new OrderLine { ProductId = req.ProductId, Quantity = req.Quantity } }
            };
            db.Orders.Add(order);
            await db.SaveChangesAsync();
            await queue.Enqueue(order);   // producent: na kolejkę (po zapisie, więc order.Id już jest) → worker w tle
            return TypedResults.Created($"/orders/{order.Id}", order);
        });

        // ⚠️ NOTE: N+1 pitfall
        app.MapGet("/orders-report", async (ShopContext db) =>
        {
            var orders = await db.Orders.ToListAsync();
            var report = new List<object>();
            foreach (var order in orders)
            {
                var customer = await db.Customers.FirstOrDefaultAsync(c => c.Id == order.CustomerId);
                report.Add(new { orderId = order.Id, customer = customer?.Name });
            }
            return Results.Ok(report);
        });

        app.MapGet("/orders/lazy", async Task<IResult> (ShopContext db) =>
        {
            var order = await db.Orders.FirstOrDefaultAsync();
            if (order is null) return Results.NotFound();
            return Results.Ok(new { orderId = order.Id, customerId = order.CustomerId, customer = order.Customer?.Name });
        });
        
        app.MapGet("/orders/summaries", (ShopContext db) => OrderQueries.All(db));

        // ZADANIE (OrderQueriesTests): zamówienia klienta — odpali Twój stub ByCustomer.
        app.MapGet("/orders/by-customer", (string name, ShopContext db) => OrderQueries.ByCustomer(db, name));
    }
}

public record CreateOrderRequest(int CustomerId, int ProductId, int Quantity);
