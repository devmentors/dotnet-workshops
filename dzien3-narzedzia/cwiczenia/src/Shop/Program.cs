using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Shop.Catalog;
using Shop.Correlation;
using Shop.Counter;
using Shop.Data;
using Shop.Loyalty;
using Shop.Middleware;
using Shop.Options;
using Shop.Payments;
using Shop.Pricing;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsEnvironment("Testing"))
{
    var connection = new SqliteConnection("DataSource=:memory:");
    connection.Open();
    builder.Services.AddDbContext<ShopContext>(options => options.UseSqlite(connection));
}
else
{
    builder.Services.AddDbContext<ShopContext>(options =>
        options.UseSqlite("Data Source=shop-demo.db"));
}

builder.Services.AddSingleton<ILoyaltyApi, SimulatedLoyaltyApi>();
builder.Services.AddSingleton<ProductService>();
builder.Services.AddSingleton<IPaymentGateway, AlwaysOkGateway>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddSingleton<DiscountService>();
builder.Services.AddSingleton<InvoiceRounding>();
builder.Services.Configure<ShopOptions>(builder.Configuration.GetSection("Shipping"));
builder.Services.AddSingleton<ShippingService>();
builder.Services.AddSingleton<VisitCounter>();
builder.Services.AddSingleton<AuditLog>();
builder.Services.AddScoped<CorrelationAccessor>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ShopContext>();
    db.Database.EnsureCreated();
    if (!db.Customers.Any())
    {
        db.Customers.AddRange(
            new Customer { Id = 1, Name = "Ada" },
            new Customer { Id = 2, Name = "Bartek" });
        db.Orders.AddRange(
            new Order { Id = 1, CustomerId = 1 },
            new Order { Id = 2, CustomerId = 2 },
            new Order { Id = 3, CustomerId = 1 });
        db.SaveChanges();
    }
}

app.UseRequestId();

app.MapGet("/health", () => "ok");

app.MapGet("/audit", async (ShopContext db) =>
    Results.Ok(await db.AuditEntries.ToListAsync()));

app.MapPost("/audit", (AuditRequest request) =>
{
    return Results.StatusCode(501);
});

app.MapGet("/products/{id:int}", (int id, ProductService products) =>
{
    var product = products.Find(id);
    return product is null ? Results.NotFound() : Results.Ok(product);
});
app.MapPost("/products", (CreateProductRequest request, ProductService products) =>
{
    var product = products.Add(request.Name, request.Price);
    return Results.Created($"/products/{product.Id}", product);
});

app.MapPost("/checkout", (OrderRequest order, OrderService orders) =>
{
    try
    {
        var charged = orders.Place(order);
        return Results.Ok(new { charged, amount = order.Quantity * order.UnitPrice });
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.MapGet("/discount", (decimal price, int quantity, DiscountService discounts) =>
    Results.Ok(new { price, quantity, net = discounts.NetAfterDiscount(price, quantity) }));

app.MapGet("/invoice", (decimal net, int quantity, InvoiceRounding invoice) =>
    Results.Ok(new { net, quantity, amount = invoice.FinalAmount(net, quantity) }));

app.MapGet("/shipping", (decimal total, ShippingService shipping) =>
    Results.Ok(new { total, free = shipping.IsFree(total) }));

app.MapGet("/visit", (VisitCounter counter) =>
{
    var accepted = counter.TryIncrement();
    return Results.Ok(new { visits = counter.Count, accepted });
});

app.MapGet("/audit-log", (AuditLog log) =>
{
    var entries = log.RecordUnsafe("visit");
    return Results.Ok(new { entries });
});

app.MapGet("/orders-report", async (ShopContext db, ILoyaltyApi loyalty) =>
{
    var orders = await db.Orders.Include(o => o.Customer).ToListAsync();
    var report = new List<object>();
    foreach (var order in orders)
    {
        var points = await loyalty.GetPointsAsync(order.CustomerId);
        report.Add(new { orderId = order.Id, customer = order.Customer?.Name, points });
    }
    return Results.Ok(report);
});

app.Run();

public record AuditRequest(string Action);

public partial class Program;
