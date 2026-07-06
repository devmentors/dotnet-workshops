using ModelContextProtocol.Protocol;
using ModelContextProtocol.Server;

namespace AiLab.McpServer.Security;

public static class RoleToolFilter
{
    // Tego nie ruszasz.
    public static readonly Dictionary<string, string[]> ToolRoleMap = new()
    {
        ["get_ticket_status"] = ["agent", "supervisor", "admin"],
        ["list_tickets"]      = ["agent", "supervisor", "admin"],
        ["close_ticket"]      = ["supervisor", "admin"],   // uprzywilejowane
    };

    public static string ResolveRole(IServiceProvider? services)
    {
        var http = services?.GetService<IHttpContextAccessor>()?.HttpContext;
        var role = http?.Request.Headers["X-User-Role"].FirstOrDefault()?.ToLowerInvariant();
        return string.IsNullOrWhiteSpace(role) ? "agent" : role;
    }

    public static bool RoleCanUse(string tool, string role) =>
        ToolRoleMap.TryGetValue(tool, out var allowed) && allowed.Contains(role);

    // ZADANIE (#14): podłącz AddListToolsFilter + AddCallToolFilter (widoczność + wywołanie wg roli).
    public static IMcpServerBuilder AddRoleGate(this IMcpServerBuilder builder)
    {
        // Wzór delegata filtra (middleware): dostajesz `next`, zwracasz (context, ct) => wynik.
        // Ten przepuszcza WSZYSTKO — Twoje zadanie to odfiltrować narzędzia wg roli.
        builder.AddListToolsFilter(next => async (context, ct) =>
        {
            var result = await next(context, ct);
            // TODO (krok 1): zostaw w result.Tools tylko dozwolone dla roli.
            //   rola: ResolveRole(context.Services)   dozwolone: RoleCanUse(nazwa, rola)
            return result;
        });

        // TODO (krok 2): dołóż drugi filtr — AddCallToolFilter (skopiuj kształt powyżej).
        //   Ukrycie z listy ≠ autoryzacja: gdy rola nie ma dostępu do context.Params?.Name,
        //   zwróć CallToolResult { IsError = true, ... } PRZED wywołaniem next(...).

        return builder;   // RED: filtr listy przepuszcza wszystko, brak filtra wywołań
    }
}
