using Microsoft.Extensions.AI;
using Microsoft.Extensions.Configuration;

namespace AiLab.Llm;

// Wspólny ai-settings.json (root: ai-cwiczenia/).
public static class AiSettings
{
    public const string FileName = "ai-settings.json";

    // Szuka pliku w górę drzewa katalogów.
    public static string Locate()
    {
        for (var dir = new DirectoryInfo(AppContext.BaseDirectory); dir is not null; dir = dir.Parent)
        {
            var candidate = Path.Combine(dir.FullName, FileName);
            if (File.Exists(candidate))
                return candidate;
        }

        throw new FileNotFoundException(
            $"Nie znaleziono współdzielonego {FileName} (powinien leżeć w root: ai-cwiczenia/).");
    }

    public static AiOptions Load()
    {
        var config = new ConfigurationBuilder()
            .AddJsonFile(Locate(), optional: false, reloadOnChange: false)
            .AddEnvironmentVariables()
            .Build();

        var options = new AiOptions();
        config.GetSection("Ai").Bind(options);
        return options;
    }

    public static IChatClient CreateChatClient() => LlmClientFactory.Create(Load());
}
