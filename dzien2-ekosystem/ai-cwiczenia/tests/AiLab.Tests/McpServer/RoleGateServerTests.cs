using System.Net;

namespace AiLab.Tests;

// #14: filtr serwera MCP — agent nie widzi/nie wywoła close_ticket, admin tak.
public class RoleGateServerTests
{
    private static StubHttpMessageHandler OkStub() => new(_ =>
        (HttpStatusCode.OK, """{"ticketId":"T-100","status":"closed","title":"x","ownerId":"u-1"}"""));

    [Fact]
    public async Task agent_cannot_see_or_call_close_ticket()
    {
        await using var factory = McpServerHarness.Factory(OkStub());
        await using var agent = await McpServerHarness.ConnectAsync(factory, role: "agent", userId: "u-1");

        var tools = await agent.ListToolsAsync();
        Assert.DoesNotContain(tools, t => t.Name == "close_ticket");   // ukryte z listy

        var call = await agent.CallToolAsync(
            "close_ticket", new Dictionary<string, object?> { ["ticketId"] = "T-100" });
        Assert.True(call.IsError);   // ukrycie ≠ autoryzacja: wywołanie też odrzucone
    }

    [Fact]
    public async Task admin_can_see_and_call_close_ticket()
    {
        await using var factory = McpServerHarness.Factory(OkStub());
        await using var admin = await McpServerHarness.ConnectAsync(factory, role: "admin", userId: "u-1");

        var tools = await admin.ListToolsAsync();
        Assert.Contains(tools, t => t.Name == "close_ticket");

        var call = await admin.CallToolAsync(
            "close_ticket", new Dictionary<string, object?> { ["ticketId"] = "T-100" });
        Assert.NotEqual(true, call.IsError);   // sukces: IsError null/false
    }
}
