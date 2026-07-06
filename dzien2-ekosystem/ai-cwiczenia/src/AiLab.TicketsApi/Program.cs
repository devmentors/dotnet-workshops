using AiLab.Shared;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://127.0.0.1:5500");

var app = builder.Build();

var store = new List<TicketDto>
{
    new("T-100", "open",    "Nie działa logowanie do panelu", "u-1"),
    new("T-101", "waiting", "Prośba o fakturę",               "u-1"),
    new("T-102", "closed",  "Literówka na stronie głównej",   "u-2"),
};

static string? Owner(HttpContext ctx) =>
    ctx.Request.Headers["X-User-Id"].FirstOrDefault();

app.MapGet("/tickets", (HttpContext ctx) =>
{
    var owner = Owner(ctx);
    if (string.IsNullOrWhiteSpace(owner))
        return Results.BadRequest(new { error = "Brak nagłówka X-User-Id." });

    return Results.Ok(store.Where(t => t.OwnerId == owner));
});

app.MapGet("/tickets/{id}", (string id, HttpContext ctx) =>
{
    var owner = Owner(ctx);
    if (string.IsNullOrWhiteSpace(owner))
        return Results.BadRequest(new { error = "Brak nagłówka X-User-Id." });

    var ticket = store.FirstOrDefault(t => t.TicketId == id && t.OwnerId == owner);
    return ticket is null ? Results.NotFound() : Results.Ok(ticket);
});

app.MapPost("/tickets/{id}/close", (string id, HttpContext ctx) =>
{
    var owner = Owner(ctx);
    if (string.IsNullOrWhiteSpace(owner))
        return Results.BadRequest(new { error = "Brak nagłówka X-User-Id." });

    var idx = store.FindIndex(t => t.TicketId == id && t.OwnerId == owner);
    if (idx < 0) return Results.NotFound();

    store[idx] = store[idx] with { Status = "closed" };
    return Results.Ok(store[idx]);
});

app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "ailab-tickets-api" }));

app.Run();
