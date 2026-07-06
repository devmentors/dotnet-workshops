// Klient MCP na oficjalnym SDK (tools/list + tools/call), na żywo.
// Odpal po kolei: (1) AiLab.TicketsApi, (2) AiLab.McpServer, (3) ten projekt.

using System.Text.Encodings.Web;
using System.Text.Json;
using ModelContextProtocol.Client;
using ModelContextProtocol.Protocol;

var endpoint = new Uri(args.ElementAtOrDefault(0) ?? "http://127.0.0.1:5050");
var role = args.ElementAtOrDefault(1) ?? "admin";
var userId = args.ElementAtOrDefault(2) ?? "u-1";

var http = new HttpClient { BaseAddress = endpoint };
http.DefaultRequestHeaders.Add("X-User-Role", role);
http.DefaultRequestHeaders.Add("X-User-Id", userId);

var transport = new HttpClientTransport(
    new HttpClientTransportOptions { Endpoint = endpoint }, http, ownsHttpClient: true);

Console.WriteLine($"── Łączę z MCP: {endpoint} (rola={role}, user={userId}) ──");

try
{
    await using var client = await McpClient.CreateAsync(transport);

    var tools = await client.ListToolsAsync();
    Console.WriteLine($"\n── Narzędzia widoczne dla roli '{role}' ({tools.Count}) ──");
    foreach (var tool in tools)
        Console.WriteLine($"  • {tool.Name} — {tool.Description}");

    Console.WriteLine("\n── tools/call: list_tickets ──");
    var result = await client.CallToolAsync("list_tickets", new Dictionary<string, object?>());
    var text = string.Concat(result.Content.OfType<TextContentBlock>().Select(c => c.Text));
    Console.WriteLine(Pretty(text));
}
catch (Exception ex)
{
    Console.WriteLine($"\n✗ Nie udało się: {ex.Message}");
    Console.WriteLine("  Sprawdź, czy działają AiLab.TicketsApi (:5500) i AiLab.McpServer (:5050).");
    return 1;
}

return 0;

static string Pretty(string json)
{
    try
    {
        using var doc = JsonDocument.Parse(json);
        return JsonSerializer.Serialize(doc.RootElement,
            new JsonSerializerOptions { WriteIndented = true, Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping });
    }
    catch { return json; }
}
