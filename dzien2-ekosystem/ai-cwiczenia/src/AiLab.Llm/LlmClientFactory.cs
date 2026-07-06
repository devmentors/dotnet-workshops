using System.ClientModel;
using Microsoft.Extensions.AI;
using OpenAI;

namespace AiLab.Llm;

public static class LlmClientFactory
{
    public static IChatClient Create(AiOptions options)
    {
        var provider = options.Active;

        var apiKey = !string.IsNullOrWhiteSpace(provider.ApiKey)
            ? provider.ApiKey
            : Environment.GetEnvironmentVariable("OPENROUTER_API_KEY") is { Length: > 0 } env
                ? env
                : throw new InvalidOperationException(
                    $"Brak klucza dla providera '{options.Provider}'. Wpisz go w ai-settings.json " +
                    $"(Ai:Providers:{options.Provider}:ApiKey) albo ustaw zmienną OPENROUTER_API_KEY. " +
                    $"Offline: ustaw Ai:Provider na \"ollama\".");

        var clientOptions = new OpenAIClientOptions();
        if (!string.IsNullOrWhiteSpace(provider.Endpoint))
            clientOptions.Endpoint = new Uri(provider.Endpoint);

        return new OpenAIClient(new ApiKeyCredential(apiKey), clientOptions)
            .GetChatClient(provider.Model)
            .AsIChatClient();
    }
}
