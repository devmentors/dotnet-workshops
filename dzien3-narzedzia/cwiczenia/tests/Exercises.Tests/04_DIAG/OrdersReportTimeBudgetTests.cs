using System.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Exercises.Tests._04_DIAG;

public class OrdersReportTimeBudgetTests : IClassFixture<WebApplicationFactory<Program>>
{
    private const int BudgetMs = 400;
    private readonly WebApplicationFactory<Program> _factory;

    public OrdersReportTimeBudgetTests(WebApplicationFactory<Program> factory) =>
        _factory = factory.WithWebHostBuilder(b => b.UseEnvironment("Testing"));

    [Fact]
    public async Task orders_report_completes_within_time_budget()
    {
        var client = _factory.CreateClient();

        (await client.GetAsync("/health")).EnsureSuccessStatusCode();

        var sw = Stopwatch.StartNew();
        var response = await client.GetAsync("/orders-report");
        sw.Stop();

        response.EnsureSuccessStatusCode();
        Assert.True(
            sw.ElapsedMilliseconds < BudgetMs,
            $"GET /orders-report zajęło {sw.ElapsedMilliseconds} ms (budżet {BudgetMs} ms).");
    }
}
