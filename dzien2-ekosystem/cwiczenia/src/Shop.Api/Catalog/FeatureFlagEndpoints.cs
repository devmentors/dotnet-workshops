using Microsoft.Extensions.Options;

namespace Shop.Api.Catalog;

public class FeatureOptions
{
    public bool Enabled { get; set; }
}

public static class FeatureFlagEndpoints
{
    // ZADANIE (FeatureFlagTests): bramkuj endpoint flagą Feature:Enabled (false -> 404, true -> 200). RED: endpoint ignoruje flagę i zawsze zwraca 200.
    public static void MapFeatureFlag(this WebApplication app)
    {
        app.MapGet("/products/experimental", IResult () =>
        {
            // TODO: ukryj za feature flag
            return Results.Ok(new { feature = "experimental-catalog", items = new[] { "beta-1", "beta-2" } });
        });
    }
}
