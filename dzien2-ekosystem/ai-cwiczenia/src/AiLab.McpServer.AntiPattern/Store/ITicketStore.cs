namespace AiLab.McpServer.AntiPattern.Store;

// ⚠️ ANTY-WZORZEC: warstwa MCP sięga wprost do "bazy" (store), zamiast wołać domenowe API.
public interface ITicketStore
{
    IReadOnlyList<TicketRow> QueryAll();
}

public record TicketRow(string TicketId, string Status, string Title, string OwnerId);

public sealed class InMemoryTicketStore : ITicketStore
{
    private static readonly List<TicketRow> Rows =
    [
        new("T-100", "open",    "Nie działa logowanie do panelu", "u-1"),
        new("T-101", "waiting", "Prośba o fakturę",               "u-1"),
        new("T-102", "closed",  "Literówka na stronie głównej",   "u-2"),   // cudzy właściciel!
    ];

    public IReadOnlyList<TicketRow> QueryAll() => Rows;
}
