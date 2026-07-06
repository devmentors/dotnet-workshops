using System.Net;
using AiLab.McpServer.AntiPattern.Store;
using AiLab.McpServer.AntiPattern.Tools;
using AiLab.McpServer.Api;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using ModelContextProtocol.Protocol;

namespace AiLab.Tests;

// #15: narzędzie ma iść przez API (scoping po X-User-Id), nie do store'a.
public class DirectStoreRefactorTests
{
    // Spy: liczy dostępy do store'a i zwraca DWÓCH właścicieli (u-1 oraz cudzy u-2).
    private sealed class SpyTicketStore : ITicketStore
    {
        public int Queries { get; private set; }
        public IReadOnlyList<TicketRow> QueryAll()
        {
            Queries++;
            return
            [
                new("T-100", "open",   "moje",  "u-1"),
                new("T-102", "closed", "cudze", "u-2"),
            ];
        }
    }

    [Fact]
    public async Task query_tickets_goes_through_api_and_does_not_leak_other_users()
    {
        // API zwraca TYLKO tickety u-1 (bo API zawęża po X-User-Id).
        var stub = new StubHttpMessageHandler(_ =>
            (HttpStatusCode.OK, """[{"ticketId":"T-100","status":"open","title":"moje","ownerId":"u-1"}]"""));
        var spy = new SpyTicketStore();

        await using var factory = new WebApplicationFactory<DirectStoreTicketTools>().WithWebHostBuilder(b =>
            b.ConfigureTestServices(s =>
            {
                s.AddHttpClient<TicketsApiClient>(c => c.BaseAddress = new Uri("http://tickets.local"))
                 .ConfigurePrimaryHttpMessageHandler(() => stub);
                s.AddSingleton<ITicketStore>(spy);
            }));

        await using var mcp = await McpServerHarness.ConnectAsync(factory, role: "agent", userId: "u-1");

        var result = await mcp.CallToolAsync("query_tickets", new Dictionary<string, object?>());
        var text = string.Concat(result.Content.OfType<TextContentBlock>().Select(c => c.Text));

        Assert.Equal(1, stub.Calls);           // poszło PRZEZ API
        Assert.Equal(0, spy.Queries);          // store nietknięty
        Assert.DoesNotContain("u-2", text);    // brak przecieku cudzego właściciela
    }
}
