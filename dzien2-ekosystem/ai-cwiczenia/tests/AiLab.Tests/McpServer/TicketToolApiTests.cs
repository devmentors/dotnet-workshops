using System.Net;
using ModelContextProtocol.Protocol;

namespace AiLab.Tests;

// #13: get_ticket_status widoczne na liście, idzie przez API, zwraca SemanticResponse.
public class TicketToolApiTests
{
    [Fact]
    public async Task get_ticket_status_is_exposed_and_fronts_the_api()
    {
        var stub = new StubHttpMessageHandler(_ =>
            (HttpStatusCode.OK,
             """{"ticketId":"T-100","status":"open","title":"Nie dziala logowanie","ownerId":"u-1"}"""));

        await using var factory = McpServerHarness.Factory(stub);
        await using var mcp = await McpServerHarness.ConnectAsync(factory, role: "agent", userId: "u-1");

        // (a) EXPOSE — narzędzie widoczne na liście (atrybuty [McpServerTool] obecne).
        var tools = await mcp.ListToolsAsync();
        Assert.Contains(tools, t => t.Name == "get_ticket_status");

        // (b) FRONTUJE API — wywołanie trafia domenowe API dokładnie raz (nie żaden store).
        var result = await mcp.CallToolAsync(
            "get_ticket_status", new Dictionary<string, object?> { ["ticketId"] = "T-100" });
        Assert.Equal(1, stub.Calls);

        // (c) SemanticResponse — koperta z 'summary', nie surowy DTO.
        var text = string.Concat(result.Content.OfType<TextContentBlock>().Select(c => c.Text));
        Assert.Contains("summary", text);
    }
}
