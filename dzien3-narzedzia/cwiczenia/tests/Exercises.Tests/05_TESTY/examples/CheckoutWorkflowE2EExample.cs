using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Shop.Catalog;
using Shop.Payments;
using Xunit;

namespace Exercises.Tests._05_TESTY.examples;

public class CheckoutWorkflowE2EExample : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public CheckoutWorkflowE2EExample(WebApplicationFactory<Program> factory) => _factory = factory;

    private sealed record ProductResponse(int Id, string Name, decimal Price);
    private sealed record CheckoutResponse(bool Charged, decimal Amount);

    [Fact]
    public async Task several_posts_build_state_then_checkout_and_report_honour_the_pipeline()
    {
        var client = _factory
            .WithWebHostBuilder(builder => builder.UseEnvironment("Testing"))
            .CreateClient();

        var created = await client.PostAsJsonAsync("/products", new CreateProductRequest("Book", 50m));
        await client.PostAsJsonAsync("/products", new CreateProductRequest("Pen", 5m));

        var product = await created.Content.ReadFromJsonAsync<ProductResponse>();
        var lookup = await client.GetAsync($"/products/{product!.Id}");
        Assert.Equal(HttpStatusCode.OK, lookup.StatusCode);

        var checkout = await client.PostAsJsonAsync(
            "/checkout", new OrderRequest("Book", 3, 50m));

        Assert.Equal(HttpStatusCode.OK, checkout.StatusCode);
        var body = await checkout.Content.ReadFromJsonAsync<CheckoutResponse>();
        Assert.Equal(150m, body!.Amount);

        var report = await client.GetAsync("/orders-report");
        Assert.Equal(HttpStatusCode.OK, report.StatusCode);
    }
}
