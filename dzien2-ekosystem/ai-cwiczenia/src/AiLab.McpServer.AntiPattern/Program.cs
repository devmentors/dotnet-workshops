// AiLab.McpServer.AntiPattern — serwer MCP zbudowany ŹLE (kontrprzykład).

using AiLab.McpServer.AntiPattern.Store;
using AiLab.McpServer.AntiPattern.Tools;
using AiLab.McpServer.Api;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://127.0.0.1:5060");

builder.Services.AddHttpContextAccessor();

// ⚠️ ANTY-WZORZEC: store dostępny w warstwie MCP (powinien być tylko za API).
builder.Services.AddSingleton<ITicketStore, InMemoryTicketStore>();

// Dobra droga (do użycia w #15): typed client do domenowego API.
builder.Services.AddHttpClient<TicketsApiClient>(c =>
    c.BaseAddress = new Uri(builder.Configuration["TicketsApi:BaseUrl"] ?? "http://127.0.0.1:5500"));

// ⚠️ ANTY-WZORZEC: CORS otwarty na oścież.
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

builder.Services
    .AddMcpServer()
    .WithHttpTransport()
    .WithTools<DirectStoreTicketTools>();   // ⚠️ brak AddRoleGate — zero bramki ról

var app = builder.Build();
app.UseCors();
app.MapMcp();
app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "ailab-mcp-antipattern" }));

app.Run();
