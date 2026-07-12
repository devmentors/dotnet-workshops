using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Exercises.Tests._04_DIAG;

public class OrdersReportCorrectnessTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public OrdersReportCorrectnessTests(WebApplicationFactory<Program> factory) =>
        _factory = factory.WithWebHostBuilder(b => b.UseEnvironment("Testing"));

    private sealed record ReportRow(int OrderId, string? Customer);

    [Fact]
    public async Task orders_report_maps_each_order_to_its_seeded_customer()
    {
        var client = _factory.CreateClient();

        var rows = await client.GetFromJsonAsync<List<ReportRow>>("/orders-report");

        Assert.NotNull(rows);
        Assert.Equal(3, rows!.Count);

        var byOrder = rows.ToDictionary(r => r.OrderId, r => r.Customer);
        Assert.Equal("Ada", byOrder[1]);
        Assert.Equal("Bartek", byOrder[2]);
        Assert.Equal("Ada", byOrder[3]);
    }
}
