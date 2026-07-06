using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.DependencyInjection;
using Shop.Core.Catalog;
using Shop.Core.Persistence;
using Xunit;

namespace Exercises.Tests;

public class ProductExampleEndpointTests : IClassFixture<TestingWebAppFactory>
{
    private readonly TestingWebAppFactory _factory;

    public ProductExampleEndpointTests(TestingWebAppFactory factory) => _factory = factory;
    
    [Fact]
    public async Task order_post_returns_400_problem_details_on_invalid_body()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/orders", new { customerId = 0, productId = 1, quantity = 0 });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var errors = doc.RootElement.GetProperty("errors");
        Assert.True(errors.TryGetProperty("customerId", out _));
        Assert.True(errors.TryGetProperty("quantity", out _));
    }
    
    [Fact]
    public async Task order_post_returns_201_on_valid_body()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/orders", new { customerId = 1, productId = 1, quantity = 2 });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }
    
    [Fact]
    public async Task search_binds_query_params_and_di_service()
    {
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ShopContext>();
            db.Products.AddRange(
                new Product { Id = 101, Name = "Lampka biurkowa", Price = 60m, Available = true },
                new Product { Id = 102, Name = "Lampa sufitowa", Price = 200m, Available = true });
            db.SaveChanges();
        }
        var client = _factory.CreateClient();

        var result = await client.GetFromJsonAsync<List<Product>>("/products/search?name=Lamp&max=100");

        Assert.NotNull(result);
        Assert.Single(result!);
        Assert.Equal("Lampka biurkowa", result![0].Name);
    }
}
