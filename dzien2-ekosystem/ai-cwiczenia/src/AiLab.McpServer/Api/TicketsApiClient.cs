using System.Net.Http.Json;
using AiLab.Shared;

namespace AiLab.McpServer.Api;

public class TicketsApiClient
{
    private readonly HttpClient _http;
    private readonly IHttpContextAccessor _ctx;

    public TicketsApiClient(HttpClient http, IHttpContextAccessor ctx)
    {
        _http = http;
        _ctx = ctx;
    }

    private void ForwardUser(HttpRequestMessage req)
    {
        var userId = _ctx.HttpContext?.Request.Headers["X-User-Id"].FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(userId))
            req.Headers.TryAddWithoutValidation("X-User-Id", userId);
    }

    public async Task<TicketDto?> GetTicketAsync(string ticketId, CancellationToken ct = default)
    {
        using var req = new HttpRequestMessage(HttpMethod.Get, $"/tickets/{ticketId}");
        ForwardUser(req);
        using var resp = await _http.SendAsync(req, ct);
        return resp.IsSuccessStatusCode ? await resp.Content.ReadFromJsonAsync<TicketDto>(ct) : null;
    }

    public async Task<IReadOnlyList<TicketDto>> ListTicketsAsync(CancellationToken ct = default)
    {
        using var req = new HttpRequestMessage(HttpMethod.Get, "/tickets");
        ForwardUser(req);
        using var resp = await _http.SendAsync(req, ct);
        return resp.IsSuccessStatusCode
            ? await resp.Content.ReadFromJsonAsync<List<TicketDto>>(ct) ?? []
            : [];
    }

    public async Task<TicketDto?> CloseTicketAsync(string ticketId, CancellationToken ct = default)
    {
        using var req = new HttpRequestMessage(HttpMethod.Post, $"/tickets/{ticketId}/close");
        ForwardUser(req);
        using var resp = await _http.SendAsync(req, ct);
        return resp.IsSuccessStatusCode ? await resp.Content.ReadFromJsonAsync<TicketDto>(ct) : null;
    }
}
