using AiLab.McpServer.Api;
using AiLab.McpServer.Security;
using AiLab.McpServer.Tools;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://127.0.0.1:5050");

builder.Services.AddHttpContextAccessor();

builder.Services.AddHttpClient<TicketsApiClient>(c =>
    c.BaseAddress = new Uri(builder.Configuration["TicketsApi:BaseUrl"] ?? "http://127.0.0.1:5500"));

builder.Services
    .AddMcpServer()
    .WithHttpTransport()
    .WithTools<TicketTools>()
    .AddRoleGate();   // #14: bramka ról (RED dopóki AddRoleGate nic nie podpina)

var app = builder.Build();

app.MapMcp();
app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "ailab-mcp-server" }));

app.Run();
