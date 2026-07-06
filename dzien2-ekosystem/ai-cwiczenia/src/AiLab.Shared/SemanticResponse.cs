using System.Text.Json;
using System.Text.Json.Serialization;

namespace AiLab.Shared;

public abstract record SemanticResponse
{
    public required string Summary { get; init; }
    public string? Suggestion { get; init; }
    public IReadOnlyList<string>? NextSteps { get; init; }

    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        WriteIndented = true,
    };

    public string ToJson() => JsonSerializer.Serialize(this, GetType(), JsonOpts);
}

public sealed record ErrorResponse : SemanticResponse
{
    public required string Error { get; init; }

    public static ErrorResponse Create(string error, string? suggestion = null) =>
        new() { Summary = "Wystąpił błąd", Error = error, Suggestion = suggestion };
}
