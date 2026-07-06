using AiLab.Agent.Tools;
using Microsoft.Extensions.AI;

namespace AiLab.Agent.Chat;

public sealed class AgentChatService
{
    private readonly IChatClient _chat;
    private readonly ToolsLoader _loader;

    public AgentChatService(IChatClient chat, ToolsLoader loader)
    {
        _chat = chat;
        _loader = loader;
    }

    public async Task<string> AskAsync(string question, CancellationToken ct = default)
    {
        await using var loaded = await _loader.LoadAsync(ct);

        IChatClient chat = _chat.AsBuilder().UseFunctionInvocation().Build();
        var response = await chat.GetResponseAsync(
            question, new ChatOptions { Tools = [.. loaded.Tools] }, cancellationToken: ct);

        return response.Text;
    }
}
