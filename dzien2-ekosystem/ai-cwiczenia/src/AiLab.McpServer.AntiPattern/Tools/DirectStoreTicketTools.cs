using System.ComponentModel;
using System.Text.Json;
using AiLab.McpServer.AntiPattern.Store;
using AiLab.McpServer.Api;
using ModelContextProtocol.Server;

namespace AiLab.McpServer.AntiPattern.Tools;

// Narzędzie MCP zbudowane ŹLE (kontrprzykład).
public class DirectStoreTicketTools
{
    private readonly ITicketStore _store;
    private readonly TicketsApiClient _api;

    public DirectStoreTicketTools(ITicketStore store, TicketsApiClient api)
    {
        _store = store;
        _api = api;
    }

    // ZADANIE (#15): przełącz ze store'a na _api.ListTicketsAsync(), zwróć SemanticResponse. Wzór: TicketTools.ListTickets.
    [McpServerTool(Name = "query_tickets")]
    [Description("Zwraca tickety użytkownika.")]
    public Task<string> QueryTickets()
    {
        // ⚠️ ANTY-WZORZEC: bezpośredni odczyt store'a — omija API i nie zawęża do właściciela.
        var rows = _store.QueryAll();
        var json = JsonSerializer.Serialize(
            rows.Select(r => new { r.TicketId, r.Status, r.Title, r.OwnerId }));
        return Task.FromResult(json);
    }
}
