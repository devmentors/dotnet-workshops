using Microsoft.Extensions.AI;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace AiLab.Llm;

public static class AiLlmExtensions
{
    public static IConfigurationBuilder AddAiSettings(this IConfigurationBuilder configuration) =>
        configuration.AddJsonFile(AiSettings.Locate(), optional: false, reloadOnChange: true);

    public static IServiceCollection AddSharedLlm(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<AiOptions>(configuration.GetSection("Ai"));
        services.AddSingleton<IChatClient>(sp =>
            LlmClientFactory.Create(sp.GetRequiredService<IOptions<AiOptions>>().Value));
        return services;
    }
}
