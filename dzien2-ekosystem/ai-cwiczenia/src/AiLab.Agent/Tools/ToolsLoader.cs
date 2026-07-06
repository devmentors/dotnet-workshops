using AiLab.Agent.Configuration;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Options;
using ModelContextProtocol.Client;

namespace AiLab.Agent.Tools;

// ToolsLoader (scaffold, nie ćwiczenie).
public sealed class ToolsLoader
{
    private readonly AgentOptions _options;
    private readonly IHttpContextAccessor _ctx;

    public ToolsLoader(IOptions<AgentOptions> options, IHttpContextAccessor ctx)
    {
        _options = options.Value;
        _ctx = ctx;
    }

    public async Task<ToolsLoadResult> LoadAsync(CancellationToken ct = default)
    {
        var clients = new List<McpClient>();
        var tools = new List<AITool>();

        foreach (var (_, url) in _options.McpServers)
        {
            var http = new HttpClient();
            ForwardIdentity(http);

            var transport = new HttpClientTransport(
                new HttpClientTransportOptions { Endpoint = new Uri(url) }, http, ownsHttpClient: true);

            var client = await McpClient.CreateAsync(transport, cancellationToken: ct);
            clients.Add(client);
            tools.AddRange(await client.ListToolsAsync(cancellationToken: ct));
        }

        return new ToolsLoadResult(clients, tools);
    }

    private void ForwardIdentity(HttpClient http)
    {
        var headers = _ctx.HttpContext?.Request.Headers;
        foreach (var name in (string[])["X-User-Id", "X-User-Role", "X-User-Email"])
        {
            var value = headers?[name].FirstOrDefault();
            if (!string.IsNullOrEmpty(value))
                http.DefaultRequestHeaders.Add(name, value);
        }
    }
}

public sealed record ToolsLoadResult(IReadOnlyList<McpClient> Clients, IReadOnlyList<AITool> Tools) : IAsyncDisposable
{
    public async ValueTask DisposeAsync()
    {
        foreach (var client in Clients)
            await client.DisposeAsync();
    }
}
