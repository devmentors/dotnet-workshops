using AiLab.Shared;

namespace AiLab.McpServer.Models;

public sealed record TicketStatusResponse : SemanticResponse
{
    public required string TicketId { get; init; }
    public required string Status { get; init; }
    public required string Title { get; init; }
}

public sealed record TicketListResponse : SemanticResponse
{
    public required IReadOnlyList<TicketItem> Tickets { get; init; }
}

public record TicketItem(string TicketId, string Status, string Title);
