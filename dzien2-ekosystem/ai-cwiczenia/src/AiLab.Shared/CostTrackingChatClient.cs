using Microsoft.Extensions.AI;

namespace AiLab.Shared;

public class CostTrackingChatClient : IChatClient
{
    private readonly IChatClient _wrappedClient;

    public CostTrackingChatClient(IChatClient wrappedClient)
    {
        _wrappedClient = wrappedClient;
    }
    
    public void Dispose()
    {
        _wrappedClient.Dispose();
    }

    public async Task<ChatResponse> GetResponseAsync(IEnumerable<ChatMessage> messages, ChatOptions? options = null,
        CancellationToken cancellationToken = new CancellationToken())
    {
        var response = await _wrappedClient.GetResponseAsync(messages, options, cancellationToken);
        
        if (response.Usage != null)
        {
            var inputTokens = response.Usage.InputTokenCount ?? 0;
            var outputTokens = response.Usage.OutputTokenCount ?? 0;
            var totalTokens = response.Usage.TotalTokenCount ?? (inputTokens + outputTokens);
                
            Console.WriteLine($"ai.tokens.input: {inputTokens}");
            Console.WriteLine($"ai.tokens.output: {outputTokens}");
            Console.WriteLine($"ai.tokens.total: {totalTokens}");
        }

        return response;
    }

    public IAsyncEnumerable<ChatResponseUpdate> GetStreamingResponseAsync(IEnumerable<ChatMessage> messages, ChatOptions? options = null,
        CancellationToken cancellationToken = new CancellationToken())
    {
        // Nie wspieramy dla streamingu :)
        return _wrappedClient.GetStreamingResponseAsync(messages, options, cancellationToken);
    }

    public object? GetService(Type serviceType, object? serviceKey = null)
    {
        return _wrappedClient.GetService(serviceType, serviceKey);
    }
}

public static class CostTrackingChatClientExtensions
{
    public static ChatClientBuilder UseCostTracking(
        this ChatClientBuilder builder,
        Action<CostTrackingChatClient>? configure = null)
    {
        return builder.Use((innerClient, services) =>
        {
            var chatClient = new CostTrackingChatClient(innerClient);
            configure?.Invoke(chatClient);
            return chatClient;
        });
    }
}