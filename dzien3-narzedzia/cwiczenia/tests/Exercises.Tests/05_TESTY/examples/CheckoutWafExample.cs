using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Shop.Payments;
using Xunit;

namespace Exercises.Tests._05_TESTY.examples;

public class CheckoutWafExample : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public CheckoutWafExample(WebApplicationFactory<Program> factory) => _factory = factory;

    private sealed class RecordingGateway : IPaymentGateway
    {
        public decimal? LastAmount { get; private set; }

        public bool Charge(decimal amount)
        {
            LastAmount = amount;
            return true;
        }
    }

    [Fact]
    public async Task checkout_charges_gateway_with_quantity_times_unit_price()
    {
        var gateway = new RecordingGateway();

        var client = _factory
            .WithWebHostBuilder(builder =>
            {
                builder.UseEnvironment("Testing");
                builder.ConfigureTestServices(services =>
                {
                    services.AddSingleton<IPaymentGateway>(gateway);
                });
            })
            .CreateClient();

        var response = await client.PostAsJsonAsync(
            "/checkout",
            new OrderRequest("Book", 2, 50m));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<CheckoutResponse>();
        Assert.NotNull(body);
        Assert.True(body!.Charged);
        Assert.Equal(100m, body.Amount);

        Assert.Equal(100m, gateway.LastAmount);
    }

    private sealed record CheckoutResponse(bool Charged, decimal Amount);
}
