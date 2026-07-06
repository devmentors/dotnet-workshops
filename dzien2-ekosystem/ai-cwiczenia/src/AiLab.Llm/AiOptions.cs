namespace AiLab.Llm;

// Nowy provider = nowy wpis w Providers.
public sealed class AiOptions
{
    public string Provider { get; set; } = "openrouter";
    public Dictionary<string, ProviderConfig> Providers { get; set; } = new();

    public ProviderConfig Active =>
        Providers.TryGetValue(Provider, out var config)
            ? config
            : throw new InvalidOperationException(
                $"Provider '{Provider}' nie ma wpisu w Ai:Providers (ai-settings.json).");
}

public sealed class ProviderConfig
{
    public string ApiKey { get; set; } = "";
    public string? Endpoint { get; set; }
    public string Model { get; set; } = "";
}
