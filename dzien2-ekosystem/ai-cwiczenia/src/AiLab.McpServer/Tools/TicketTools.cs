using System.ComponentModel;
using AiLab.McpServer.Api;
using AiLab.McpServer.Models;
using AiLab.Shared;
using ModelContextProtocol.Server;

namespace AiLab.McpServer.Tools;

public class TicketTools
{
    private readonly TicketsApiClient _api;

    public TicketTools(TicketsApiClient api) => _api = api;

    // ZADANIE (#13): wystaw get_ticket_status jak ListTickets (atrybuty + _api.GetTicketAsync + SemanticResponse).
    public Task<string> GetTicketStatus(string ticketId)
    {
        throw new NotImplementedException(
            "ZADANIE (#13): wystaw get_ticket_status jako narzędzie MCP (atrybuty [McpServerTool]+[Description]), " +
            "zawołaj _api.GetTicketAsync i zwróć SemanticResponse. Wzór obok: ListTickets.");
    }

    [McpServerTool(Name = "list_tickets")]
    [Description("Zwraca listę ticketów zalogowanego użytkownika wraz ze statusami.")]
    public async Task<string> ListTickets()
    {
        var tickets = await _api.ListTicketsAsync();
        return new TicketListResponse
        {
            Summary = $"Masz {tickets.Count} ticket(ów).",
            NextSteps = ["Podaj ID ticketa, aby sprawdzić szczegóły (get_ticket_status)."],
            Tickets = tickets.Select(t => new TicketItem(t.TicketId, t.Status, t.Title)).ToList(),
        }.ToJson();
    }

    // Uprzywilejowane — bramkowane rolą (#14).
    [McpServerTool(Name = "close_ticket")]
    [Description("Zamyka ticket o podanym identyfikatorze. Operacja uprzywilejowana.")]
    public async Task<string> CloseTicket(
        [Description("Identyfikator ticketa do zamknięcia, np. T-100")] string ticketId)
    {
        var closed = await _api.CloseTicketAsync(ticketId);
        return closed is null
            ? ErrorResponse.Create($"Nie znaleziono ticketa {ticketId} (albo nie jest Twój).").ToJson()
            : new TicketStatusResponse
            {
                Summary = $"Ticket {closed.TicketId} został zamknięty.",
                TicketId = closed.TicketId,
                Status = closed.Status,
                Title = closed.Title,
            }.ToJson();
    }
}
