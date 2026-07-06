using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace Exercises.Tests;

public class FeatureFlagTests
{
    private static HttpClient ClientWithFeature(bool enabled)
    {
        var factory = new TestingWebAppFactory().WithWebHostBuilder(b =>
            b.ConfigureAppConfiguration((_, cfg) =>
                cfg.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["Feature:Enabled"] = enabled ? "true" : "false",
                })));
        return factory.CreateClient();
    }

    [Fact]
    public async Task experimental_endpoint_is_404_when_disabled()
    {
        var response = await ClientWithFeature(enabled: false).GetAsync("/products/experimental");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task experimental_endpoint_is_200_when_enabled()
    {
        var response = await ClientWithFeature(enabled: true).GetAsync("/products/experimental");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
