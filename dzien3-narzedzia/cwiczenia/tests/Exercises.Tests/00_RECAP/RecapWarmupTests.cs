using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Shop.Data;
using Xunit;

namespace Exercises.Tests._00_RECAP;

public class RecapWarmupTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public RecapWarmupTests(WebApplicationFactory<Program> factory) =>
        _factory = factory.WithWebHostBuilder(b => b.UseEnvironment("Testing"));

    [Fact]
    public async Task rozgrzewka_zapisuje_wpis_audytu_z_correlationid_z_middleware()
    {
        var client = _factory.CreateClient();

        var request = new HttpRequestMessage(HttpMethod.Post, "/audit")
        {
            Content = JsonContent.Create(new AuditRequest("login")),
        };
        request.Headers.Add("X-Correlation-Id", "rozgrzewka-1");

        var response = await client.SendAsync(request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var entries = await client.GetFromJsonAsync<List<AuditEntry>>("/audit");
        Assert.NotNull(entries);
        Assert.Contains(entries!, e => e.CorrelationId == "rozgrzewka-1" && e.Action == "login");
    }

    private record AuditRequest(string Action);
}
