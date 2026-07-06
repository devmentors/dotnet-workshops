using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Exercises.Tests;

public class ProductEndpointTests : IClassFixture<TestingWebAppFactory>
{
    private readonly TestingWebAppFactory _factory;

    public ProductEndpointTests(TestingWebAppFactory factory) => _factory = factory;

    [Fact]
    public async Task post_product_returns_201_with_created_product()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/products", new { name = "Klawiatura", price = 199.99m });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var created = await response.Content.ReadFromJsonAsync<ProductResponse>();
        Assert.NotNull(created);
        Assert.Equal("Klawiatura", created!.Name);
        Assert.Equal(199.99m, created.Price);
        Assert.True(created.Id > 0);
    }

    [Fact]
    public async Task created_product_can_be_fetched_back()
    {
        var client = _factory.CreateClient();

        var post = await client.PostAsJsonAsync("/products", new { name = "Mysz", price = 89m });
        var created = await post.Content.ReadFromJsonAsync<ProductResponse>();

        var get = await client.GetAsync($"/products/{created!.Id}");

        Assert.Equal(HttpStatusCode.OK, get.StatusCode);
        var fetched = await get.Content.ReadFromJsonAsync<ProductResponse>();
        Assert.NotNull(fetched);
        Assert.Equal("Mysz", fetched!.Name);
    }

    [Fact]
    public async Task post_product_with_blank_name_returns_400()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/products", new { name = "   ", price = 199.99m });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task post_product_with_nonpositive_price_returns_400()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/products", new { name = "Klawiatura", price = 0m });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private sealed record ProductResponse(int Id, string Name, decimal Price, bool Available);
}
