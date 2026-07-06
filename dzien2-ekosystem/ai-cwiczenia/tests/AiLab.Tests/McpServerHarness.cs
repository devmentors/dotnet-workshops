using AiLab.McpServer.Api;
using AiLab.McpServer.Tools;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using ModelContextProtocol.Client;

namespace AiLab.Tests;

// Harness: serwer MCP (in-memory WAF) + klient MCP; TicketsApiClient dostaje stub API.
internal static class McpServerHarness
{
    public static WebApplicationFactory<TicketTools> Factory(StubHttpMessageHandler stub) =>
        new WebApplicationFactory<TicketTools>().WithWebHostBuilder(b =>
            b.ConfigureTestServices(s =>
                s.AddHttpClient<TicketsApiClient>(c => c.BaseAddress = new Uri("http://tickets.local"))
                 .ConfigurePrimaryHttpMessageHandler(() => stub)));

    public static async Task<McpClient> ConnectAsync<T>(
        WebApplicationFactory<T> factory, string role, string userId) where T : class
    {
        var http = factory.CreateClient();
        http.DefaultRequestHeaders.Add("X-User-Role", role);
        http.DefaultRequestHeaders.Add("X-User-Id", userId);

        var transport = new HttpClientTransport(
            new HttpClientTransportOptions { Endpoint = http.BaseAddress! }, http, ownsHttpClient: true);
        return await McpClient.CreateAsync(transport);
    }
}
