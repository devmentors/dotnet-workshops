// Odpal po TicketsApi (5500). Klucz LLM w ai-settings.json.

using AiLab.Agent.Chat;
using AiLab.Agent.Configuration;
using AiLab.Agent.ManualLoop;
using AiLab.Agent.Tools;
using AiLab.Llm;
using Microsoft.Extensions.AI;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://127.0.0.1:5080");

builder.Services.AddHttpContextAccessor();
builder.Services.Configure<AgentOptions>(builder.Configuration.GetSection("Agent"));
builder.Configuration.AddAiSettings();
builder.Services.AddSharedLlm(builder.Configuration);
builder.Services.AddScoped<ToolsLoader>();
builder.Services.AddScoped<AgentChatService>();

var app = builder.Build();

app.MapPost("/", async (ChatRequest req, AgentChatService svc, CancellationToken ct) =>
    Results.Ok(new { answer = await svc.AskAsync(req.Question, ct) }));

app.MapGet("/demo/list-tickets", async () =>
{
    using var http = DirectHttpTools.CreateClient();
    var tool = DirectHttpTools.ListTickets(http);
    var result = await tool.InvokeAsync(new AIFunctionArguments());
    return Results.Content(result?.ToString() ?? "null", "application/json");
});

app.MapGet("/demo/ask", async (IChatClient chat) =>
{
    using var http = DirectHttpTools.CreateClient();
    var tool = DirectHttpTools.ListTickets(http);
    var answer = await ManualToolLoop.ExampleAsync(chat, tool, "Wypisz moje tickety.");
    return Results.Ok(new { answer });
});

// #12 na żywo — trace TURA 1/2 na konsolę.
app.MapGet("/demo/manual", async (IChatClient chat) =>
{
    using var http = DirectHttpTools.CreateClient();
    var tool = DirectHttpTools.ListTickets(http);
    var answer = await ManualToolLoop.RunAsync(chat, tool, "Wypisz moje tickety.");
    return Results.Ok(new { answer });
});

app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "ailab-agent" }));

app.Run();

internal record ChatRequest(string Question);
