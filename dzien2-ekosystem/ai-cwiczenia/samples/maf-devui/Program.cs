using AiLab.Llm;
using Microsoft.Agents.AI.DevUI;
using Microsoft.Agents.AI.Hosting;
using Microsoft.Agents.AI.Hosting.OpenAI;
using Microsoft.Extensions.AI;

var builder = WebApplication.CreateBuilder(args);

IChatClient chat = AiSettings.CreateChatClient();
builder.Services.AddChatClient(chat);

builder.AddAIAgent("triage", (sp, _) => SupportAgents.Triage(sp.GetRequiredService<IChatClient>()));
builder.AddAIAgent("billing", (sp, _) => SupportAgents.Billing(sp.GetRequiredService<IChatClient>()));
builder.AddWorkflow("support-flow", (sp, _) => SupportAgents.SupportFlow(sp.GetRequiredService<IChatClient>()));

if (builder.Environment.IsDevelopment())
    builder.AddDevUI();
builder.AddOpenAIResponses();
builder.AddOpenAIConversations();

var app = builder.Build();

app.MapOpenAIResponses();
app.MapOpenAIConversations();
if (app.Environment.IsDevelopment())
    app.MapDevUI();

app.MapGet("/demo", async (IChatClient c) =>
{
    var triage = SupportAgents.Triage(c);
    var session = await triage.CreateSessionAsync();
    var turn1 = await triage.RunAsync("Jaki jest status ticketa T-100?", session);
    var turn2 = await triage.RunAsync("A kto się nim zajmuje?", session);   // ta sama sesja → pamięć

    var billing = SupportAgents.Billing(c);
    var billingSession = await billing.CreateSessionAsync();
    var handoff = await billing.RunAsync(
        "Triage przekazuje: klient pyta o fakturę do ticketa T-101. Co dalej?", billingSession);

    return Results.Text(
        $"Tura 1: {turn1}\n\nTura 2: {turn2}\n\n[handoff → billing] {handoff}",
        "text/plain; charset=utf-8");
});

Console.WriteLine("DevUI → http://localhost:5090/devui   ·   demo → http://localhost:5090/demo");
app.Run();
