using Microsoft.Extensions.AI;

namespace AiLab.Agent.Tools;

public static class DirectHttpTools
{
    public static HttpClient CreateClient() =>
        new() { BaseAddress = new Uri("http://127.0.0.1:5500") };

    // X-User-Id zawsze (domyślnie u-1) — bez niego API zwraca 400.
    public static AIFunction ListTickets(HttpClient http, string userId = "u-1") =>
        AIFunctionFactory.Create(
            async () =>
            {
                using var request = new HttpRequestMessage(HttpMethod.Get, "/tickets");
                request.Headers.Add("X-User-Id", userId);
                var response = await http.SendAsync(request);
                return await response.Content.ReadAsStringAsync();
            },
            new AIFunctionFactoryOptions
            {
                Name = "list_tickets",
                Description = "Zwraca listę ticketów zalogowanego użytkownika (surowy JSON z Tickets API).",
            });
}
