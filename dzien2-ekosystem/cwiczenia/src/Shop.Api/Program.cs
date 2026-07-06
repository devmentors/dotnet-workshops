using Microsoft.EntityFrameworkCore;
using Shop.Api.Catalog;
using Shop.Api.Infrastructure;
using Shop.Api.Ordering;
using Shop.Api.Shipping;
using Shop.Api.Utils;
using Shop.Core;
using Shop.Core.Catalog;
using Shop.Core.Ordering;
using Shop.Core.Persistence;
using Shop.Core.Shipping;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseDefaultServiceProvider(o => o.ValidateScopes = false);

var connectionString = builder.Configuration.GetValue<string>("Postgres:ConnectionString");
var inMemoryDbName = $"shop-{Guid.NewGuid():n}";
builder.Services.AddDbContext<ShopContext>(options =>
{
    if (builder.Environment.IsEnvironment("Testing"))
        options.UseInMemoryDatabase(inMemoryDbName);
    else
    {
        options.UseNpgsql(connectionString);
        options.EnableSensitiveDataLogging();
        // options.UseLazyLoadingProxies();
    }
});

builder.Services.AddSingleton<SingletonProbe>();
builder.Services.AddScoped<ScopedProbe>();
builder.Services.AddTransient<TransientProbe>();
builder.Services.AddSingleton<CaptiveConsumer>();
builder.Services.AddSingleton<ScopeSafeConsumer>();

builder.Services.AddSingleton<IProductSource, DefaultProductSource>();
builder.Services.AddDistributedMemoryCache();
// builder.Services.AddStackExchangeRedisCache(options =>
// {
//     //fix me :)
// });
builder.Services.AddSingleton<CachedProductService>();

builder.Services.AddControllers();

builder.Services.Configure<ShippingOptions>(builder.Configuration.GetSection("Shipping"));
builder.Services.AddSingleton<ShippingService>();

builder.Services.Configure<FeatureOptions>(builder.Configuration.GetSection("Feature"));

builder.Services.AddSingleton<OrderQueue>();
// builder.Services.AddHostedService<QueueWorker>();

// builder.Services.AddHostedService<GenerateReportWorker>();
builder.Services.AddTransient<TimedMiddleware>();
builder.Services.AddTransient<ExceptionHandlingMiddleware>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<RequestAuditor>();

var app = builder.Build();

if (!app.Environment.IsEnvironment("Testing"))
    Console.WriteLine($"🐘 Postgres: {connectionString}");

DemoData.Seed(app);

app.UseDomainExceptionHandling();
app.UseRouting();
app.UseTimed();

app.MapGet("/timed", () => "ok");
app.MapGet("/health", () => "ok");
app.MapGet("/demo/domain-error", string () => throw new DomainException("Reguła domenowa złamana (demo)."));
app.MapGet("/request-info", (RequestAuditor auditor) => auditor.Describe());
app.MapGet("/ping", () => "pong");

app.MapLifetimeDemo();
app.MapConcurrencyDemo();

app.MapCatalog();
app.MapOrdering();
app.MapShipping();

app.MapProductSearch();
app.MapFeatureFlag();

app.MapControllers();

app.Run();

public partial class Program;
